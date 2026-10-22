import { afterEach, describe, expect, it, vi } from "vitest";
import { createLog } from "./log";

function captureConsole() {
  const out = vi.spyOn(console, "log").mockImplementation(() => {});
  const err = vi.spyOn(console, "error").mockImplementation(() => {});
  const lines = (spy: typeof out) =>
    spy.mock.calls.map(([line]) => JSON.parse(String(line)));
  return { out: () => lines(out), err: () => lines(err) };
}

afterEach(() => {
  vi.restoreAllMocks();
});

describe("createLog", () => {
  it("writes one JSON line with the event, level, time, and fields", () => {
    const console = captureConsole();
    createLog({ level: "info" }).info("server_started", { port: 3001 });

    expect(console.out()).toEqual([
      {
        time: expect.stringMatching(/^\d{4}-\d{2}-\d{2}T/),
        level: "info",
        event: "server_started",
        port: 3001,
      },
    ]);
    expect(console.err()).toEqual([]);
  });

  it("writes warn and error to standard error", () => {
    const console = captureConsole();
    const log = createLog({ level: "debug" });
    log.warn("slow");
    log.error("failed");

    expect(console.err().map((line) => line.level)).toEqual(["warn", "error"]);
    expect(console.out()).toEqual([]);
  });

  it("drops events below the caller's level", () => {
    const console = captureConsole();
    const log = createLog({ level: "warn" });
    log.debug("noise");
    log.info("noise");
    log.warn("kept");

    expect(console.out()).toEqual([]);
    expect(console.err().map((line) => line.event)).toEqual(["kept"]);
  });

  it("keeps an error's name, message, and cause", () => {
    const console = captureConsole();
    const cause = new Error("connection refused");
    createLog({ level: "info" }).error("failed", {
      cause: new TypeError("query failed", { cause }),
    });

    expect(console.err()[0].cause).toMatchObject({
      name: "TypeError",
      message: "query failed",
      cause: { name: "Error", message: "connection refused" },
    });
  });

  it("doesn't let a field overwrite the level or event", () => {
    const console = captureConsole();
    createLog({ level: "info" }).info("real", { level: "error", event: "x" });

    expect(console.out()[0]).toMatchObject({ level: "info", event: "real" });
  });
});
