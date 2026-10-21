import { contentQueryStateProps } from "../src/content/use-published-content";

// Uses the real API client, so this file fails to load if Jest can't run
// the oRPC packages it imports.
describe("contentQueryStateProps", () => {
  it("gives no developer detail while the query is fine", () => {
    const props = contentQueryStateProps({
      isLoading: true,
      error: null,
      refetch: () => undefined,
    });

    expect(props).toMatchObject({ loading: true, error: null });
    expect(props.developerDetail).toBeUndefined();
  });

  it("names the unreachable API in development builds", () => {
    const props = contentQueryStateProps({
      isLoading: false,
      error: new TypeError("fetch failed"),
      refetch: () => undefined,
    });

    expect(props.developerDetail).toBe(
      "Couldn't reach the API at http://localhost:3001/rpc. Start it with `pnpm dev`, or check EXPO_PUBLIC_API_URL.",
    );
  });

  it("retries by refetching", () => {
    const refetch = jest.fn();
    contentQueryStateProps({ isLoading: false, error: null, refetch }).retry();

    expect(refetch).toHaveBeenCalledTimes(1);
  });
});
