import { Platform, View } from "react-native";
import { Text } from "../../components/text";
import type { BlockProps } from "./types";
import { useWebDrawing } from "./use-web-drawing";

// Math. The pre-rendered page shows the TeX source; on the web, KaTeX
// (loaded only when a formula is on the page) replaces it with typeset math
// plus MathML, which is what screen readers read. Essays are web-only, so
// iOS keeps the source text.

/** A `::math` block: a formula on its own line. */
export function MathBlock({ block }: BlockProps<"math">) {
  const { tex, description } = block.data;
  const html = useTypeset(tex, { displayMode: true });
  return (
    <View className="my-4 gap-2">
      {html === null ? (
        <Text className="text-center font-mono text-base text-ink" selectable>
          {tex}
        </Text>
      ) : (
        <div
          className="text-ink"
          // biome-ignore lint/security/noDangerouslySetInnerHtml: KaTeX's output for TeX from a committed essay; KaTeX escapes the TeX and runs no trusted commands.
          dangerouslySetInnerHTML={{ __html: html }}
        />
      )}
      {description ? (
        <Text className="text-center font-body text-sm text-ink-soft">
          {description}
        </Text>
      ) : null}
    </View>
  );
}

/** Inline math (`$…$`) inside a sentence of essay text. */
export function InlineMath({ tex }: { tex: string }) {
  const html = useTypeset(tex, { displayMode: false });
  return html === null ? (
    <Text className="font-mono text-base">{tex}</Text>
  ) : (
    <span
      // biome-ignore lint/security/noDangerouslySetInnerHtml: KaTeX's output for TeX from a committed essay; KaTeX escapes the TeX and runs no trusted commands.
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

// Production builds fold Platform.OS, so native bundles never include KaTeX.
// It resolves only once KaTeX's stylesheet has loaded (see katex.ts).
const loadKatex =
  Platform.OS === "web"
    ? () => import("./katex").then(({ ready }) => ready)
    : null;

function useTypeset(tex: string, { displayMode }: { displayMode: boolean }) {
  return useWebDrawing(
    loadKatex,
    (katex) =>
      katex.renderToString(tex, {
        displayMode,
        output: "htmlAndMathml",
        throwOnError: false,
      }),
    [tex, displayMode],
  );
}
