import { useEffect, useState } from "react";
import { Platform, View } from "react-native";
import { Text } from "../../components/text";
import type { BlockProps } from "./types";

// Maths. The pre-rendered page shows the TeX source; on the web, KaTeX
// (loaded only when a formula is on the page) replaces it with typeset maths
// plus MathML, which is what screen readers read. Essays are web-only, so
// iOS keeps the source text.

/** A `::math` block: a formula on its own line. */
export function MathBlock({ block }: BlockProps<"math">) {
  const { tex, description } = block.data;
  const html = useTypeset(tex, true);
  return (
    <View className="my-4 gap-2">
      {html === null ? (
        <Text className="text-center font-mono text-base text-ink" selectable>
          {tex}
        </Text>
      ) : (
        <div className="text-ink" dangerouslySetInnerHTML={{ __html: html }} />
      )}
      {description ? (
        <Text className="text-center font-body text-sm text-ink-soft">
          {description}
        </Text>
      ) : null}
    </View>
  );
}

/** Inline maths (`$…$`) inside a sentence of essay text. */
export function InlineMath({ tex }: { tex: string }) {
  const html = useTypeset(tex, false);
  return html === null ? (
    <Text className="font-mono text-base">{tex}</Text>
  ) : (
    <span dangerouslySetInnerHTML={{ __html: html }} />
  );
}

// Production builds fold Platform.OS, so native bundles never include KaTeX.
const loadKatex = Platform.OS === "web" ? () => import("./katex") : null;

function useTypeset(tex: string, displayMode: boolean) {
  const [html, setHtml] = useState<string | null>(null);
  useEffect(() => {
    if (!loadKatex) return;
    let current = true;
    void loadKatex().then(({ katex }) => {
      if (!current) return;
      setHtml(
        katex.renderToString(tex, {
          displayMode,
          output: "htmlAndMathml",
          throwOnError: false,
        }),
      );
    });
    return () => {
      current = false;
    };
  }, [tex, displayMode]);
  return html;
}
