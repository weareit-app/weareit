import type { Href } from "expo-router";

// A path or URL that comes from content or the link list, as a link target.
// Expo Router's typed routes can't check these strings. They exist only once
// `expo start` has generated .expo/types (not in CI), and without them `Href`
// is plain `string`, so the value goes through `unknown` to lint the same way
// in both.
export function toHref(path: string): Href {
  const target: unknown = path;
  return target as Href;
}
