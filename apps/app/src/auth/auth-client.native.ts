import { expoClient } from "@better-auth/expo/client";
import { createAuthClient } from "better-auth/react";
import { emailOTPClient } from "better-auth/client/plugins";
import { appEnv } from "../env";
import * as SecureStore from "expo-secure-store";

const baseURL = appEnv.apiUrl.replace(/\/rpc\/?$/, "");

export const authClient = createAuthClient({
  baseURL,
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
