import type { ReactNode } from "react";
import { authClient } from "../auth/auth-client";
import { SignedInContext } from "./use-signed-in";

// Asks the auth server once whether this device is signed in. False until it
// answers.
export function SignedInProvider({ children }: { children: ReactNode }) {
  const { data } = authClient.useSession();
  return (
    <SignedInContext.Provider value={Boolean(data?.session)}>
      {children}
    </SignedInContext.Provider>
  );
}
