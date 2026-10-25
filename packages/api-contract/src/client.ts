import { createORPCClient, ORPCError } from "@orpc/client";
import { RPCLink } from "@orpc/client/fetch";
import type {
  AnySchema,
  ContractProcedure,
  ContractRouterClient,
  Meta,
  ORPCErrorFromErrorMap,
} from "@orpc/contract";
import type { apiContract } from "./contract";

// The app narrows a failed call with isDefinedError before reading its code.
export { isDefinedError } from "@orpc/client";

// Typed from the contract alone, so a program that calls the API never
// compiles the router or what it imports (the database and its driver).
export type ApiClient = ContractRouterClient<typeof apiContract>;

// The declared errors of every operation in a group, such as "cms", as one
// union keyed by code, so `switch (error.code)` types each error's data.
type DeclaredErrors<T> =
  T extends ContractProcedure<AnySchema, AnySchema, infer TErrorMap, Meta>
    ? ORPCErrorFromErrorMap<TErrorMap>
    : { [K in keyof T]: DeclaredErrors<T[K]> }[keyof T];
export type DeclaredApiError<TGroup extends keyof typeof apiContract> =
  DeclaredErrors<(typeof apiContract)[TGroup]>;

export interface ApiClientOptions {
  // The RPC endpoint, such as http://localhost:3001/rpc. The caller reads it
  // from its own config; this package reads no environment.
  url: string;
  // Headers for each call, such as the CMS token or a session cookie.
  headers?: () => Promise<Record<string, string>>;
  // Whether the browser sends cookies with each call.
  credentials?: "include" | "omit";
}

export function createApiClient({
  url,
  headers = () => Promise.resolve({}),
  credentials = "omit",
}: ApiClientOptions): ApiClient {
  const link = new RPCLink({
    url,
    headers,
    fetch: (request, init) => fetch(request, { ...init, credentials }),
  });
  return createORPCClient<ApiClient>(link);
}

// For developers only: what went wrong with a call, in a sentence. When a
// call never reaches the API, fetch rejects with a TypeError (checked
// 2026-10-21 against the WHATWG Fetch Standard, fetch() method step 12.3);
// its message varies by platform, for example "fetch failed" in Node 24.
export function describeApiFailure(error: unknown, url: string) {
  if (error instanceof ORPCError)
    return `The API at ${url} answered ${error.status}: ${error.message}`;
  if (error instanceof TypeError)
    return `Couldn't reach the API at ${url}. Start it with \`pnpm dev\`, or check EXPO_PUBLIC_API_URL.`;
  return `The call to the API at ${url} failed: ${error instanceof Error ? error.message : String(error)}`;
}
