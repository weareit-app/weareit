import { createServer } from "node:http";
import { RPCHandler } from "@orpc/server/fetch";
import { createApiRouter } from "./router";
import { createDatabase } from "@it/database/database";
import { createLog } from "@it/log/log";
import { checkDatabaseReadiness } from "@it/database/readiness";
import { createApiDocs } from "./api-docs";
import { createAuth } from "./auth";
import { logAuthFailure } from "./log-auth-failure";
import { logUndeclaredErrors } from "./log-undeclared-errors";
import {
  PaymentsNotConfiguredError,
  WebhookNotConfiguredError,
} from "./payment-errors";
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
import type { ServerEnv } from "./env";

// Starts the API server with an environment its entry point parsed once
// (`index.ts`, or `start-local-mock.ts` for the local Stripe mock).
export async function startApiServer(env: ServerEnv) {
  const log = createLog({ level: env.logLevel });
  const cmsAdminToken = env.cmsAdminToken;

  const readiness = await checkDatabaseReadiness(env.databaseUrl);
  if (!readiness.ready) {
    log.error("database_not_ready", { message: readiness.message });
    process.exit(1);
  }

  const db = createDatabase(env.databaseUrl);
  const auth = createAuth(db, log, env);
  const router = createApiRouter(db);
  const supportPayments = createStripeSupport(db, env);
  const handler = new RPCHandler(router, {
    clientInterceptors: [logUndeclaredErrors(log)],
  });
  const apiDocsEnabled = env.isApiDocsEnabled;
  const apiDocs = createApiDocs({ router, enabled: apiDocsEnabled });
  const port = env.port;
  const allowedOrigins = new Set(env.webOrigins);

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
      if (Array.isArray(value)) {
        for (const item of value) headers.append(name, item);
      } else if (value !== undefined) headers.set(name, value);
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
        event = parseStripeWebhook(rawBody, signature, env.stripe);
      } catch (error) {
        if (
          error instanceof PaymentsNotConfiguredError ||
          error instanceof WebhookNotConfiguredError
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
      let event: ReturnType<typeof parseRevenueCatWebhook>;
      try {
        verifyRevenueCatWebhook(rawBody, signature, env.revenueCat);
        event = parseRevenueCatWebhook(rawBody);
      } catch (error) {
        if (error instanceof WebhookNotConfiguredError) {
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
        if (name.toLowerCase() !== "set-cookie")
          outgoing.setHeader(name, value);
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
}
