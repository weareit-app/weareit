import { ORPCError } from "@orpc/client";
import { describe, expect, it } from "vitest";
import { describeApiFailure } from "../src/client";

const url = "http://localhost:3001/rpc";

describe("describing a failed API call for developers", () => {
  it("says when the API can't be reached", () => {
    expect(describeApiFailure(new TypeError("fetch failed"), url)).toBe(
      "Couldn't reach the API at http://localhost:3001/rpc. Start it with `pnpm dev`, or check EXPO_PUBLIC_API_URL.",
    );
  });

  it("passes on what the API answered", () => {
    const error = new ORPCError("NOT_FOUND", {
      status: 404,
      message: "Published onboarding content is not available.",
    });

    expect(describeApiFailure(error, url)).toBe(
      "The API at http://localhost:3001/rpc answered 404: Published onboarding content is not available.",
    );
  });
});
