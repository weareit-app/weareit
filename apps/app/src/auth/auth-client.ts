import { createAuthClient } from "better-auth/react";
import { emailOTPClient } from "better-auth/client/plugins";
import { appEnv } from "../env";

const baseURL = appEnv.apiUrl.replace(/\/rpc\/?$/, "");

export const authClient = createAuthClient({
  baseURL,
  basePath: "/auth",
  plugins: [emailOTPClient()],
  fetchOptions: { credentials: "include" },
});

// Web sends the session cookie itself; only native reads it (auth-client.native.ts).
export function getSessionCookie(): Promise<string | null> {
  return Promise.resolve(null);
}
