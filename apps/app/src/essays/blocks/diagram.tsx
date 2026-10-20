import { useId } from "react";
import { Platform, View } from "react-native";
import { Text } from "../../components/text";
import { useIsDark } from "../../state/theme-store";
import type { BlockProps } from "./types";
import { useWebDrawing } from "./use-web-drawing";

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
  return useWebDrawing(
    loadMermaid,
    async ({ default: mermaid }) => {
      mermaid.initialize({
        startOnLoad: false,
        securityLevel: "strict",
        suppressErrorRendering: true,
        theme: dark ? "dark" : "neutral",
        // Mermaid 12 defaults to the ELK layout, which is not shipped.
        layout: "dagre",
        state: { layout: "dagre" },
      });
      return (await mermaid.render(id, source)).svg;
    },
    [id, source, dark],
  );
}
