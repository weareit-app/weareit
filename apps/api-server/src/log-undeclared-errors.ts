import {
  type AnyProcedure,
  type ErrorMap,
  ORPCError,
  validateORPCError,
} from "@orpc/server";
import type { Log } from "@it/log/log";

// An oRPC client interceptor that logs failures the contract doesn't declare.
// One that would reach the client as a server error (anything that isn't an
// ORPCError, or an undeclared 5xx) is logged at error level with its cause;
// the client sees only "Internal server error". An undeclared 4xx, such as
// input that fails validation, is logged at warn level without its cause,
// because a validation cause holds the input. Declared errors aren't logged:
// the caller acts on them. Client interceptors run before oRPC checks an
// error against the contract (createProcedureClient in the installed
// @orpc/server 1.15.6 dist, checked 2026-10-22), so this runs the same check,
// validateORPCError.
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
  // AnyProcedure types its error map as any.
  const errorMap = procedure["~orpc"].errorMap as ErrorMap;
  const checked = await validateORPCError(errorMap, error);
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
