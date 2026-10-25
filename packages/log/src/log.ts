// Declared here so the package needs no @types/node; every runtime that runs
// It's server code has a console with these two methods.
declare const console: {
  log(line: string): void;
  error(line: string): void;
};

export const logLevels = ["debug", "info", "warn", "error"] as const;
export type LogLevel = (typeof logLevels)[number];

// Values are written as JSON. Callers pass fields, never strings with values
// interpolated into them, so what a line holds can be reviewed at the call
// site (CODING_STANDARDS.md, "Logging").
export type LogFields = Record<string, unknown>;

export interface Log {
  debug(event: string, fields?: LogFields): void;
  info(event: string, fields?: LogFields): void;
  warn(event: string, fields?: LogFields): void;
  error(event: string, fields?: LogFields): void;
}

// Writes one JSON line per event: debug and info to standard output, warn and
// error to standard error. Events below `level` are dropped. The calling
// program chooses the level; this package reads no environment.
export function createLog({ level }: { level: LogLevel }): Log {
  const minimum = logLevels.indexOf(level);
  const write =
    (eventLevel: LogLevel) =>
    (event: string, fields: LogFields = {}) => {
      if (logLevels.indexOf(eventLevel) < minimum) return;
      const base = {
        time: new Date().toISOString(),
        level: eventLevel,
        event,
      };
      // The base keys come first and a field can't overwrite them.
      const line = JSON.stringify(
        { ...base, ...fields, ...base },
        replaceErrors,
      );
      if (eventLevel === "warn" || eventLevel === "error") console.error(line);
      else console.log(line);
    };
  return {
    debug: write("debug"),
    info: write("info"),
    warn: write("warn"),
    error: write("error"),
  };
}

// JSON.stringify writes an Error as {}; keep what a developer needs to find it.
function replaceErrors(_key: string, value: unknown) {
  if (!(value instanceof Error)) return value;
  return {
    name: value.name,
    message: value.message,
    stack: value.stack,
    ...(value.cause === undefined ? {} : { cause: value.cause }),
  };
}
