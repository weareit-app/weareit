import "../../theme-web.css";
import type { ColorScheme } from "../state/theme-store";

// Web: theme-web.css keys the colors off html[data-theme], which wins over the
// prefers-color-scheme block in global.css.
export function applyColorScheme(scheme: ColorScheme | null) {
  const root = document.documentElement;
  if (scheme) root.dataset.theme = scheme;
  else delete root.dataset.theme;
  root.style.colorScheme = scheme ?? "";
}
