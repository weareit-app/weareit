import {
  createApiClient,
  describeApiFailure as describeFailureAt,
} from "@it/api-contract/client";

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

export const apiUrl =
  process.env.EXPO_PUBLIC_API_URL ?? "http://localhost:3001/rpc";

// The web app sends the session cookie itself; native passes it as a header.
export const apiClient = createApiClient({
  url: apiUrl,
  credentials: process.env.EXPO_OS === "web" ? "include" : "omit",
  headers: async () => {
    const headers: Record<string, string> = {};
    if (cmsToken) headers.Authorization = `Bearer ${cmsToken}`;
    if (process.env.EXPO_OS !== "web" && sessionCookieProvider) {
      const cookie = await sessionCookieProvider();
      if (cookie) headers.Cookie = cookie;
    }
    return headers;
  },
});

// For developers only; see describeApiFailure in @it/api-contract/client.
export function describeApiFailure(error: unknown) {
  return describeFailureAt(error, apiUrl);
}
