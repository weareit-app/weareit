import { isDefinedError, type DeclaredApiError } from "@it/api-contract/client";

// What the CMS tells the founder when a call fails, keyed by the error's
// code. The server's message is for developers and never shown. Copy:
// docs/style/copy-style-guide.md, "Error messages".
export const cmsErrorFallback =
  "Something went wrong, so that didn't go through. Reload the page to see the current draft, then try again.";

export function describeCmsError(error: unknown): string {
  if (!isDefinedError(error)) return cmsErrorFallback;
  const declared = error as DeclaredApiError<"cms">;
  switch (declared.code) {
    case "UNAUTHORIZED":
      return "The CMS didn't accept that admin token, so nothing changed. Choose Change admin token and enter it again.";
    case "REVISION_CONFLICT":
      return `The draft was saved as revision ${declared.data.actualRevision} after you opened revision ${declared.data.expectedRevision}, so your changes weren't saved. Copy anything you want to keep, then reload the page to get the latest draft.`;
    case "STATUS_NOTE_REQUIRED":
      return "Each status change needs a new note saying what changed, so the draft wasn't saved. Add the notes and save again.";
    case "ROLLBACK_NOT_PUBLISHABLE": {
      const count = declared.data.issues.length;
      return `That version was restored to the draft as revision ${declared.data.revision}, but it wasn't published because it has ${count} publishing issue${count === 1 ? "" : "s"}. Choose Validate to see them.`;
    }
    default:
      return cmsErrorFallback;
  }
}
