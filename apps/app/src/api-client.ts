import {
  createApiClient,
  describeApiFailure as describeFailureAt,
} from "@it/api-contract/client";
import { Platform } from "react-native";
import { appEnv } from "./env";

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

export const apiUrl = appEnv.apiUrl;

// The web app sends the session cookie itself; native passes it as a header.
export const apiClient = createApiClient({
  url: apiUrl,
  credentials: Platform.OS === "web" ? "include" : "omit",
  headers: async () => {
    const headers: Record<string, string> = {};
    if (cmsToken) headers.Authorization = `Bearer ${cmsToken}`;
    if (Platform.OS !== "web" && sessionCookieProvider) {
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
