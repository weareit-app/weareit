import { createAuthClient } from "better-auth/react";
import { emailOTPClient } from "better-auth/client/plugins";

const apiUrl = process.env.EXPO_PUBLIC_API_URL ?? "http://localhost:3001/rpc";
const baseURL = apiUrl.replace(/\/rpc\/?$/, "");

export const authClient = createAuthClient({
  baseURL,
  basePath: "/auth",
  plugins: [emailOTPClient()],
  fetchOptions: { credentials: "include" },
});

export async function getSessionCookie() {
  return null;
}
