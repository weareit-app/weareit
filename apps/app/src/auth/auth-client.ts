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

export async function getSessionCookie() {
  return null;
}
