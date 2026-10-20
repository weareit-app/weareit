import { authClient } from "../auth/auth-client";

// Whether this device has a signed-in session, for the links only signed-in
// (or signed-out) people see. False until the session check answers.
export function useSignedIn() {
  const { data } = authClient.useSession();
  return Boolean(data?.session);
}
