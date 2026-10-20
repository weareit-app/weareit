// Component tests don't talk to the auth server: the site navigation sees a
// signed-out visitor unless a test says otherwise.
jest.mock("./src/navigation/use-signed-in", () => ({
  useSignedIn: () => false,
}));
