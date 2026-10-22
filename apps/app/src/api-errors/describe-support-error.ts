import { isDefinedError, type DeclaredApiError } from "@it/api-contract/client";

// What Support It tells someone when a call fails, keyed by the error's
// code. The server's message is for developers and never shown. Copy:
// docs/style/copy-style-guide.md, "Error messages".
export const supportErrorFallback =
  "Something went wrong, and no payment was taken. Try again in a few minutes.";

export function describeSupportError(error: unknown): string {
  if (!isDefinedError(error)) return supportErrorFallback;
  const declared = error as DeclaredApiError<"support">;
  switch (declared.code) {
    case "UNAUTHORIZED":
      return "You're signed out, so nothing was started. Sign in with the account you use for It, then try again.";
    case "PAYMENTS_NOT_CONFIGURED":
      return "Support isn't available right now, so no payment was started. You can still help in the other ways below.";
    case "NOT_FOUND":
      return "We couldn't find that support on this account. If you supported It with a different account, sign in with that one.";
    case "SUPPORT_NOT_RECURRING":
      return "This support doesn't have a monthly plan to manage.";
    default:
      return supportErrorFallback;
  }
}
