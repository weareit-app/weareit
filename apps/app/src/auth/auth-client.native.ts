import { expoClient } from "@better-auth/expo/client";
import { createAuthClient } from "better-auth/react";
import { emailOTPClient } from "better-auth/client/plugins";
import { appEnv } from "../env";
import * as SecureStore from "expo-secure-store";

const baseUrl = appEnv.apiUrl.replace(/\/rpc\/?$/, "");

export const authClient = createAuthClient({
  // biome-ignore lint/style/useNamingConvention: better-auth names this option.
  baseURL: baseUrl,
  basePath: "/auth",
  plugins: [
    emailOTPClient(),
    expoClient({
      scheme: "weareit",
      storagePrefix: "weareit",
      storage: SecureStore,
    }),
  ],
});

export async function getSessionCookie() {
  return (await authClient.getCookie()) ?? null;
}
