import { createContext, useContext } from "react";

// Whether this device has a signed-in session, for the links only signed-in
// (or signed-out) people see. SignedInProvider fills it at the root; anything
// rendered without the provider (stories, component tests) sees a signed-out
// visitor and never calls the auth server.
export const SignedInContext = createContext(false);

export function useSignedIn() {
  return useContext(SignedInContext);
}
