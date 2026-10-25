import { createServer, type Server } from "node:http";
import type { AddressInfo } from "node:net";
import { afterEach, describe, expect, it, vi } from "vitest";
import { createLog } from "@it/log/log";
import { requestListener } from "./request-listener";

function captureLines() {
  const lines: Record<string, unknown>[] = [];
  const capture = (line: unknown) =>
    lines.push(JSON.parse(String(line)) as Record<string, unknown>);
  vi.spyOn(console, "log").mockImplementation(capture);
  vi.spyOn(console, "error").mockImplementation(capture);
  return lines;
}

let server: Server | undefined;

async function serve(listener: Parameters<typeof createServer>[1]) {
  server = createServer(listener);
  await new Promise<void>((resolve) => server?.listen(0, "127.0.0.1", resolve));
  const { port } = server.address() as AddressInfo;
  return `http://127.0.0.1:${port}`;
}

afterEach(async () => {
  vi.restoreAllMocks();
  await new Promise((resolve) => server?.close(resolve));
  server = undefined;
});

describe("requestListener", () => {
  it("answers 500 and logs when the handler rejects before responding", async () => {
    const lines = captureLines();
    const unhandled = vi.fn();
    process.on("unhandledRejection", unhandled);
    const failure = new Error("body stream aborted");
    const url = await serve(
      requestListener(createLog({ level: "info" }), "request_failed", () =>
        Promise.reject(failure),
      ),
    );

    const response = await fetch(url);

    process.off("unhandledRejection", unhandled);
    expect(response.status).toBe(500);
    expect(unhandled).not.toHaveBeenCalled();
    expect(lines).toEqual([
      expect.objectContaining({
        level: "error",
        event: "request_failed",
        cause: expect.objectContaining({
          message: "body stream aborted",
        }) as unknown,
      }),
    ]);
  });

  it("ends the connection when the handler rejects after the headers went out", async () => {
    captureLines();
    const url = await serve(
      requestListener(
        createLog({ level: "info" }),
        "request_failed",
        async (_incoming, outgoing) => {
          outgoing.writeHead(200);
          outgoing.write("partial");
          await Promise.resolve();
          throw new Error("failed mid-response");
        },
      ),
    );

    const response = await fetch(url);

    expect(response.status).toBe(200);
    await expect(response.text()).rejects.toThrow();
  });

  it("leaves a handler that succeeds alone", async () => {
    const lines = captureLines();
    const url = await serve(
      requestListener(
        createLog({ level: "info" }),
        "request_failed",
        async (_incoming, outgoing) => {
          await Promise.resolve();
          outgoing.writeHead(204).end();
        },
      ),
    );

    const response = await fetch(url);

    expect(response.status).toBe(204);
    expect(lines).toEqual([]);
  });
});
