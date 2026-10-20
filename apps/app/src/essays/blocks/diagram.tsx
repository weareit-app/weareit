import { useEffect, useId, useState } from "react";
import { Platform, View } from "react-native";
import { Text } from "../../components/text";
import { useIsDark } from "../../state/theme-store";
import type { BlockProps } from "./types";

// A diagram written in Mermaid. The written description is always shown
// under it: it is the whole block with scripts off, and the text
// equivalent screen readers get once the drawing (hidden from them) is in.
// Mermaid is loaded only when a diagram is on the page, and only on the web.
export function DiagramBlock({ block }: BlockProps<"diagram">) {
  const { title, mermaid, description } = block.data;
  const svg = useDrawing(mermaid);
  return (
    <View className="my-4 gap-2">
      {title ? (
        <Text className="font-heading text-lg text-ink">{title}</Text>
      ) : null}
      {svg === null ? null : (
        <div
          aria-hidden
          style={{ display: "flex", justifyContent: "center" }}
          dangerouslySetInnerHTML={{ __html: svg }}
        />
      )}
      <Text className="font-body text-ink">{description}</Text>
    </View>
  );
}

// Production builds fold Platform.OS, so native bundles never include Mermaid.
const loadMermaid = Platform.OS === "web" ? () => import("mermaid") : null;

function useDrawing(source: string) {
  const id = `diagram-${useId().replace(/[^a-zA-Z0-9]/g, "")}`;
  const dark = useIsDark();
  const [svg, setSvg] = useState<string | null>(null);
  useEffect(() => {
    if (!loadMermaid) return;
    let current = true;
    void loadMermaid()
      .then(async ({ default: mermaid }) => {
        mermaid.initialize({
          startOnLoad: false,
          securityLevel: "strict",
          suppressErrorRendering: true,
          theme: dark ? "dark" : "neutral",
          // Mermaid 12 defaults to the ELK layout, which is not shipped.
          layout: "dagre",
          state: { layout: "dagre" },
        });
        const drawn = await mermaid.render(id, source);
        if (current) setSvg(drawn.svg);
      })
      // A diagram that fails to draw keeps its description.
      .catch(() => undefined);
    return () => {
      current = false;
    };
  }, [id, source, dark]);
  return svg;
}
