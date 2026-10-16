import { createORPCClient } from "@orpc/client";
import { RPCLink } from "@orpc/client/fetch";
import type { RouterClient } from "@orpc/server";
import type { ApiRouter } from "./router";

let cmsToken: string | null = null;
let sessionCookieProvider: (() => Promise<string | null>) | null = null;

export function setCmsToken(token: string | null) {
  cmsToken = token?.trim() || null;
}

export function setSessionCookieProvider(
  provider: (() => Promise<string | null>) | null,
) {
  sessionCookieProvider = provider;
}

export function createItApiClient(url: string) {
  const link = new RPCLink({
    url,
    headers: async () => {
      const headers: Record<string, string> = {};
      if (cmsToken) headers.Authorization = `Bearer ${cmsToken}`;
      if (process.env.EXPO_OS !== "web" && sessionCookieProvider) {
        const cookie = await sessionCookieProvider();
        if (cookie) headers.Cookie = cookie;
      }
      return headers;
    },
    fetch: (request, init) =>
      fetch(request, {
        ...init,
        credentials: process.env.EXPO_OS === "web" ? "include" : "omit",
      }),
  });
  return createORPCClient<RouterClient<ApiRouter>>(link);
}

const defaultUrl =
  process.env.EXPO_PUBLIC_API_URL ?? "http://localhost:3001/rpc";
export const apiClient = createItApiClient(defaultUrl);
