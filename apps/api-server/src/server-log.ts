import { ORPCError, validateORPCError, type AnyProcedure } from "@orpc/server";
import type { Log } from "@it/log";

// An oRPC client interceptor that logs failures the contract doesn't declare.
// One that would reach the client as a server error (anything that isn't an
// ORPCError, or an undeclared 5xx) is logged at error level with its cause;
// the client sees only "Internal server error". An undeclared 4xx, such as
// input that fails validation, is logged at warn level without its cause,
// because a validation cause holds the input. Declared errors aren't logged:
// the caller acts on them. Errors run before oRPC validates them against the
// contract, so this checks them the same way.
export function logUndeclaredErrors(log: Log) {
  return async <T>(options: {
    next(): Promise<T>;
    path: readonly string[];
    procedure: AnyProcedure;
  }): Promise<T> => {
    try {
      return await options.next();
    } catch (error) {
      await logError(log, options.path.join("."), options.procedure, error);
      throw error;
    }
  };
}

async function logError(
  log: Log,
  operation: string,
  procedure: AnyProcedure,
  error: unknown,
) {
  if (!(error instanceof ORPCError)) {
    log.error("api_error_undeclared", { operation, cause: error });
    return;
  }
  const checked = await validateORPCError(procedure["~orpc"].errorMap, error);
  if (checked.defined) return;
  if (checked.status >= 500)
    log.error("api_error_undeclared", {
      operation,
      code: checked.code,
      status: checked.status,
      cause: checked.cause,
    });
  else
    log.warn("api_error_undeclared", {
      operation,
      code: checked.code,
      status: checked.status,
    });
}

// Logs a failed auth request by path and status only. The request body holds
// the email address and the sign-in code, and the response can echo them, so
// neither is read here.
export function logAuthFailure(log: Log, url: URL, status: number) {
  if (status < 400) return;
  log.warn("auth_request_failed", { path: url.pathname, status });
}
