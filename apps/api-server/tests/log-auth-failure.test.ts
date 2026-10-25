import { afterEach, describe, expect, it, vi } from "vitest";
import { createLog } from "@it/log/log";
import { logAuthFailure } from "../src/log-auth-failure";

function captureLines() {
  const lines: Record<string, unknown>[] = [];
  const capture = (line: unknown) => lines.push(JSON.parse(String(line)));
  vi.spyOn(console, "log").mockImplementation(capture);
  vi.spyOn(console, "error").mockImplementation(capture);
  return lines;
}

afterEach(() => {
  vi.restoreAllMocks();
});

describe("logAuthFailure", () => {
  it("records a failed sign-in without the code or the email", () => {
    const lines = captureLines();
    const email = "person@example.com";
    const otp = "12345678";
    const url = new URL(
      `http://localhost:3001/auth/sign-in/email-otp?email=${email}&otp=${otp}`,
    );

    logAuthFailure(createLog({ level: "debug" }), url, 400);

    expect(lines).toEqual([
      expect.objectContaining({
        level: "warn",
        event: "auth_request_failed",
        path: "/auth/sign-in/email-otp",
        status: 400,
      }),
    ]);
    expect(JSON.stringify(lines)).not.toContain(email);
    expect(JSON.stringify(lines)).not.toContain(otp);
  });

  it("writes nothing for a successful auth request", () => {
    const lines = captureLines();

    logAuthFailure(
      createLog({ level: "debug" }),
      new URL("http://localhost:3001/auth/get-session"),
      200,
    );

    expect(lines).toEqual([]);
  });
});
