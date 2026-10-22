import { describeApiFailure } from "../src/api-client";
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

  it("describes the failure in development builds", () => {
    const error = new TypeError("fetch failed");
    const props = contentQueryStateProps({
      isLoading: false,
      error,
      refetch: () => undefined,
    });

    expect(props.developerDetail).toBe(describeApiFailure(error));
  });

  it("retries by refetching", () => {
    const refetch = jest.fn();
    contentQueryStateProps({ isLoading: false, error: null, refetch }).retry();

    expect(refetch).toHaveBeenCalledTimes(1);
  });
});
