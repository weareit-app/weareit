import { ORPCError, createRouterClient, os } from "@orpc/server";
import { afterEach, describe, expect, it, vi } from "vitest";
import { z } from "zod";
import { createLog } from "@it/log/log";
import { logUndeclaredErrors } from "./log-undeclared-errors";

function captureLines() {
  const lines: Record<string, unknown>[] = [];
  const capture = (line: unknown) =>
    lines.push(JSON.parse(String(line)) as Record<string, unknown>);
  vi.spyOn(console, "log").mockImplementation(capture);
  vi.spyOn(console, "error").mockImplementation(capture);
  return lines;
}

afterEach(() => {
  vi.restoreAllMocks();
});

const router = {
  content: {
    getPublished: os.handler(() => {
      throw new Error("connection terminated unexpectedly");
    }),
  },
  cms: {
    saveDraft: os
      .errors({ REVISION_CONFLICT: { status: 409 } })
      .handler(({ errors }) => {
        throw errors.REVISION_CONFLICT();
      }),
  },
  account: {
    saveOnboarding: os
      .input(z.object({ draft: z.string() }))
      .handler(() => ({ ok: true })),
  },
};

function client() {
  return createRouterClient(router, {
    interceptors: [logUndeclaredErrors(createLog({ level: "debug" }))],
  });
}

describe("logUndeclaredErrors", () => {
  it("writes one error-level line with the operation and cause", async () => {
    const lines = captureLines();

    await expect(client().content.getPublished()).rejects.toThrow();

    expect(lines).toEqual([
      expect.objectContaining({
        level: "error",
        event: "api_error_undeclared",
        operation: "content.getPublished",
        cause: expect.objectContaining({
          message: "connection terminated unexpectedly",
        }) as unknown,
      }),
    ]);
  });

  it("doesn't log a declared error", async () => {
    const lines = captureLines();

    await expect(client().cms.saveDraft()).rejects.toBeInstanceOf(ORPCError);

    expect(lines).toEqual([]);
  });

  it("logs rejected input at warn level without the input", async () => {
    const lines = captureLines();

    await expect(
      // @ts-expect-error: the draft must be a string.
      client().account.saveOnboarding({ draft: { answer: "private" } }),
    ).rejects.toThrow();

    expect(lines).toEqual([
      expect.objectContaining({
        level: "warn",
        operation: "account.saveOnboarding",
        code: "BAD_REQUEST",
      }),
    ]);
    expect(JSON.stringify(lines)).not.toContain("private");
  });
});
