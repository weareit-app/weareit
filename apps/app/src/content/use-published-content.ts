import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@it/api/client";

export const publishedContentQueryKey = ["content", "published"] as const;

export function usePublishedContent() {
  return useQuery({
    queryKey: publishedContentQueryKey,
    queryFn: () => apiClient.content.getPublished(),
  });
}
