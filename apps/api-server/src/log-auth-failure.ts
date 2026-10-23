import type { Log } from "@it/log/log";

// Logs a failed auth request by path and status only. The request body holds
// the email address and the sign-in code, and the response can echo them, so
// neither is read here.
export function logAuthFailure(log: Log, url: URL, status: number) {
  if (status < 400) return;
  log.warn("auth_request_failed", { path: url.pathname, status });
}
