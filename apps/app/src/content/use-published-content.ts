import { useQuery } from "@tanstack/react-query";
import { apiClient, describeApiFailure } from "@it/api/client";

export const publishedContentQueryKey = ["content", "published"] as const;

export function usePublishedContent() {
  return useQuery({
    queryKey: publishedContentQueryKey,
    queryFn: () => apiClient.content.getPublished(),
  });
}

// What actually went wrong, shown under the error in development builds only.
export function developerDetailFor(error: Error | null) {
  return __DEV__ && error ? describeApiFailure(error) : undefined;
}
