import { expoClient } from "@better-auth/expo/client";
import { createAuthClient } from "better-auth/react";
import { emailOTPClient } from "better-auth/client/plugins";
import * as SecureStore from "expo-secure-store";

const apiUrl = process.env.EXPO_PUBLIC_API_URL ?? "http://localhost:3001/rpc";
const baseURL = apiUrl.replace(/\/rpc\/?$/, "");

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
