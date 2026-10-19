import { useNativeVariable as useNativeVariableTyped } from "react-native-css";

// The package's types describe its web build (no arguments); this file runs
// only on native (use-token-color.web.ts covers web), where it takes a name.
const useNativeVariable = useNativeVariableTyped as unknown as (
  name: string,
) => unknown;

/** A color token's current value, for props that need a color string. */
export function useTokenColor(name: `--color-${string}`, fallback: string) {
  const value = useNativeVariable(name);
  return typeof value === "string" ? value : fallback;
}
