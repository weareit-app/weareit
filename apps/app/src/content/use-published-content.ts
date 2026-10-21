import { useQuery } from "@tanstack/react-query";
import { apiClient, describeApiFailure } from "@it/api/client";

export const publishedContentQueryKey = ["content", "published"] as const;

export function usePublishedContent() {
  return useQuery({
    queryKey: publishedContentQueryKey,
    queryFn: () => apiClient.content.getPublished(),
  });
}

// A content query's state as ContentQueryState's props. The developer detail
// is filled in only in development builds.
export function contentQueryStateProps(query: {
  isLoading: boolean;
  error: Error | null;
  refetch: () => unknown;
}) {
  return {
    loading: query.isLoading,
    error: query.error,
    retry: () => void query.refetch(),
    developerDetail:
      __DEV__ && query.error ? describeApiFailure(query.error) : undefined,
  };
}
