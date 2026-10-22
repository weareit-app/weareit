import { createServer } from "node:http";
import { RPCHandler } from "@orpc/server/fetch";
import { createApiRouter } from "@it/api/router";
import { createDatabase } from "@it/database/database";
import { createLog } from "@it/log";
import { checkDatabaseReadiness } from "@it/database/readiness";
import { createApiDocs } from "./api-docs";
import { createAuth } from "./auth";
import { logAuthFailure, logUndeclaredErrors } from "./server-log";
import {
  createStripeSupport,
  parseStripeWebhook,
  processStripeWebhook,
} from "./stripe-support";
import {
  parseRevenueCatWebhook,
  processRevenueCatWebhook,
  verifyRevenueCatWebhook,
} from "./revenuecat-support";

// The level becomes configurable with the server's env schema (repo-conventions, group 6).
const log = createLog({ level: "info" });
const connectionString = process.env.DATABASE_URL;
const cmsAdminToken = process.env.CMS_ADMIN_TOKEN;
if (!connectionString)
  throw new Error("Set DATABASE_URL to start the API server.");
if (!cmsAdminToken)
  throw new Error("Set CMS_ADMIN_TOKEN to protect CMS operations.");

const readiness = await checkDatabaseReadiness(connectionString);
if (!readiness.ready) {
  log.error("database_not_ready", { message: readiness.message });
  process.exit(1);
}

const db = createDatabase(connectionString);
const auth = createAuth(db, log);
const router = createApiRouter(db);
const supportPayments = createStripeSupport(db);
const handler = new RPCHandler(router, {
  clientInterceptors: [logUndeclaredErrors(log)],
});
// Only the dev script sets API_DOCS (docs/architecture/decisions.md, 2026-10-21).
const apiDocsEnabled = process.env.API_DOCS === "1";
const apiDocs = createApiDocs({ router, enabled: apiDocsEnabled });
const port = Number(process.env.PORT ?? 3001);
const allowedOrigins = new Set(
  (process.env.WEB_ORIGINS ?? "http://localhost:8081,http://127.0.0.1:8081")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean),
);

const server = createServer(async (incoming, outgoing) => {
  const origin = incoming.headers.origin;
  if (origin && allowedOrigins.has(origin)) {
    outgoing.setHeader("Access-Control-Allow-Origin", origin);
    outgoing.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    outgoing.setHeader(
      "Access-Control-Allow-Headers",
      "Content-Type, Authorization, Cookie",
    );
    outgoing.setHeader("Access-Control-Allow-Credentials", "true");
    outgoing.setHeader("Vary", "Origin");
  }
  if (incoming.method === "OPTIONS") {
    outgoing.writeHead(204).end();
    return;
  }
  const chunks: Buffer[] = [];
  let bodyLength = 0;
  for await (const chunk of incoming) {
    const buffer = Buffer.from(chunk);
    bodyLength += buffer.byteLength;
    if (bodyLength > 1_000_000) {
      outgoing.writeHead(413).end("Request body too large");
      return;
    }
    chunks.push(buffer);
  }
  const rawBody = Buffer.concat(chunks);
  const headers = new Headers();
  for (const [name, value] of Object.entries(incoming.headers)) {
    if (Array.isArray(value))
      value.forEach((item) => headers.append(name, item));
    else if (value !== undefined) headers.set(name, value);
  }
  const method = incoming.method ?? "GET";
  const request = new Request(
    new URL(
      incoming.url ?? "/",
      `http://${headers.get("host") ?? "localhost"}`,
    ),
    {
      method,
      headers,
      ...(method === "GET" || method === "HEAD"
        ? {}
        : { body: rawBody, duplex: "half" as const }),
    },
  );
  if (new URL(request.url).pathname === "/webhooks/stripe") {
    const signature = request.headers.get("stripe-signature");
    if (!signature) {
      outgoing.writeHead(400).end("Missing Stripe signature");
      return;
    }
    let event: ReturnType<typeof parseStripeWebhook>;
    try {
      event = parseStripeWebhook(rawBody, signature);
    } catch (error) {
      if (
        error instanceof Error &&
        (error.message === "STRIPE_NOT_CONFIGURED" ||
          error.message === "STRIPE_WEBHOOK_NOT_CONFIGURED")
      ) {
        outgoing.writeHead(503).end("Stripe webhooks are not configured");
        return;
      }
      log.warn("stripe_webhook_rejected", { cause: error });
      outgoing.writeHead(400).end("Invalid Stripe webhook");
      return;
    }
    try {
      await processStripeWebhook(db, event, rawBody);
      outgoing.writeHead(200).end("ok");
    } catch (error) {
      log.error("stripe_webhook_failed", { cause: error });
      outgoing.writeHead(500).end("Stripe webhook processing failed");
    }
    return;
  }
  if (new URL(request.url).pathname === "/webhooks/revenuecat") {
    const signature = request.headers.get("x-revenuecat-webhook-signature");
    if (!signature) {
      outgoing.writeHead(400).end("Missing RevenueCat signature");
      return;
    }
    let event;
    try {
      verifyRevenueCatWebhook(rawBody, signature);
      event = parseRevenueCatWebhook(rawBody);
    } catch (error) {
      if (
        error instanceof Error &&
        error.message === "REVENUECAT_WEBHOOK_NOT_CONFIGURED"
      ) {
        outgoing.writeHead(503).end("RevenueCat webhook is not configured");
        return;
      }
      log.warn("revenuecat_webhook_rejected", { cause: error });
      outgoing.writeHead(400).end("Invalid RevenueCat webhook");
      return;
    }
    try {
      await processRevenueCatWebhook(db, event);
      outgoing.writeHead(200).end("ok");
    } catch (error) {
      log.error("revenuecat_webhook_failed", { cause: error });
      outgoing.writeHead(500).end("RevenueCat webhook processing failed");
    }
    return;
  }
  const authorization = request.headers.get("authorization");
  const suppliedToken = authorization?.startsWith("Bearer ")
    ? authorization.slice(7)
    : null;
  try {
    if (new URL(request.url).pathname.startsWith("/auth/")) {
      const response = await auth.handler(request);
      logAuthFailure(log, new URL(request.url), response.status);
      for (const [name, value] of response.headers)
        if (name.toLowerCase() !== "set-cookie")
          outgoing.setHeader(name, value);
      const cookies = response.headers.getSetCookie();
      if (cookies.length > 0) outgoing.setHeader("Set-Cookie", cookies);
      outgoing.writeHead(response.status);
      outgoing.end(Buffer.from(await response.arrayBuffer()));
      return;
    }

    const session = await auth.api.getSession({ headers: request.headers });
    const context = {
      db,
      cmsActor: suppliedToken === cmsAdminToken ? "cms-admin" : null,
      userId: session?.user.id ?? null,
      supportPayments,
    };
    const result = await handler.handle(request, { prefix: "/rpc", context });
    const response = result.matched
      ? result.response
      : ((await apiDocs.handle(request, context)) ??
        new Response("Not found", { status: 404 }));
    for (const [name, value] of response.headers)
      if (name.toLowerCase() !== "set-cookie") outgoing.setHeader(name, value);
    const cookies = response.headers.getSetCookie();
    if (cookies.length > 0) outgoing.setHeader("Set-Cookie", cookies);
    outgoing.writeHead(response.status);
    outgoing.end(Buffer.from(await response.arrayBuffer()));
  } catch (error) {
    log.error("request_failed", {
      path: new URL(request.url).pathname,
      cause: error,
    });
    outgoing.writeHead(500, { "Content-Type": "application/json" });
    outgoing.end(JSON.stringify({ error: "Internal server error" }));
  }
});

server.listen(port, "0.0.0.0", () => {
  log.info("api_listening", { url: `http://localhost:${port}/rpc` });
  if (apiDocsEnabled)
    log.info("api_docs_listening", { url: `http://localhost:${port}/docs` });
});

for (const signal of ["SIGINT", "SIGTERM"] as const) {
  process.on(signal, () => server.close(() => void db.destroy()));
}
