/** A color token, for props that need a color string (web: the CSS variable). */
export function useTokenColor(name: `--color-${string}`, _fallback: string) {
  return `var(${name})`;
}
