import type {
  IncomingMessage,
  RequestListener,
  ServerResponse,
} from "node:http";
import type { Log } from "@it/log/log";

// Node's `createServer` ignores the promise an async listener returns, so a
// failure the handler doesn't catch itself (a client that drops mid-upload, a
// write after the headers went out) would be an unhandled rejection, which
// stops the process. This catches it: it logs the failure and answers 500, or
// ends the connection when the response has already started.
export function requestListener(
  log: Log,
  event: string,
  handle: (
    incoming: IncomingMessage,
    outgoing: ServerResponse,
  ) => Promise<void>,
): RequestListener {
  return (incoming, outgoing) => {
    handle(incoming, outgoing).catch((error: unknown) => {
      log.error(event, { cause: error });
      if (outgoing.headersSent) outgoing.destroy();
      else outgoing.writeHead(500).end("Internal server error");
    });
  };
}
