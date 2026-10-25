import {
  Canvas,
  ColorMatrix,
  FractalNoise,
  Group,
  Mask,
  Paint,
  Path,
  Rect,
} from "@shopify/react-native-skia";
import { useMemo, type ReactNode } from "react";
import { useNativeVariable as useNativeVariableTyped } from "react-native-css";
import { groupIcons } from "../../content/group-icons";
import { spotInks, type IconTone } from "../../content/icon-part";
import { toSkPath } from "../../watercolor/sk-path";
import {
  drift,
  grainMatrix,
  grainSeed,
  grainThreshold,
  type RisoLook,
} from "./riso";

// The package's types describe its web build (no arguments); this file runs
// only on native (group-icon.web.tsx covers web), where it takes a variable name.
const useNativeVariable = useNativeVariableTyped as unknown as (
  name: string,
) => unknown;

const isSpot = (tone: IconTone | undefined): tone is keyof typeof spotInks =>
  tone !== undefined && tone in spotInks;
const isPaper = (tone: IconTone | undefined) =>
  tone === "riso-paper" || tone === "paper";

// A theme color by CSS variable name, or the fallback before it resolves.
function useTone(name: string, fallback: string) {
  const value = useNativeVariable(name);
  return typeof value === "string" ? value : fallback;
}

// A personal group's icon (iOS: drawn with Skia). Decorative: the group name
// is always beside it. `riso` adds a print look, as on web: grain in each
// inked layer, spot inks slightly off register, overprinting the ink.
export function GroupIcon({
  id,
  size,
  riso,
}: {
  id: string;
  size: number;
  riso?: RisoLook | undefined;
}) {
  const tones: Record<IconTone, string> = {
    ink: useTone("--color-ink", "#1F2021"),
    paper: useTone("--color-paper-raised", "#FFFFFF"),
    "riso-ink": useTone("--color-riso-ink", "#1F2021"),
    "riso-paper": useTone("--color-riso-paper", "#FFFFFF"),
    "riso-line": useTone("--color-riso-line", "#1F2021"),
    ...spotInks,
  };
  const parts = useMemo(
    () =>
      (groupIcons[id] ?? []).map((part) => {
        return { ...part, path: toSkPath(part.d, part.evenOdd) };
      }),
    [id],
  );
  if (!parts.length) return null;
  // Spots before the ink layer print under it and overprint; spots after it
  // fill solid ink areas and must cover them.
  const inkAt = parts.findIndex(
    (part) => part.fill === "riso-ink" || part.fill === "ink",
  );
  return (
    <Canvas pointerEvents="none" style={{ width: size, height: size }}>
      <Group transform={[{ scale: size / 48 }]}>
        {parts.map((part, i) => {
          let layer: ReactNode = (
            <>
              {part.fill ? (
                <Path path={part.path} color={tones[part.fill]} />
              ) : null}
              {part.stroke ? (
                <Path
                  path={part.path}
                  color={tones[part.stroke]}
                  style="stroke"
                  strokeWidth={part.strokeWidth ?? 2}
                  strokeCap="round"
                  strokeJoin="round"
                />
              ) : null}
            </>
          );
          if (!riso) {
            // biome-ignore lint/suspicious/noArrayIndexKey: an icon's parts are a fixed list from its artwork, never reordered, and their index is their identity.
            return <Group key={i}>{layer}</Group>;
          }
          const { fill } = part;
          const spot = isSpot(fill);
          if (riso.grain > 0 && !isPaper(part.fill)) {
            layer = (
              <Mask
                mode="alpha"
                mask={
                  <Rect x={-4} y={-4} width={56} height={56}>
                    <FractalNoise
                      freqX={riso.frequency}
                      freqY={riso.frequency}
                      octaves={3}
                      seed={grainSeed(i)}
                    />
                    <ColorMatrix
                      matrix={grainMatrix(grainThreshold(riso, spot))}
                    />
                  </Rect>
                }
              >
                {layer}
              </Mask>
            );
          }
          const shift = spot ? drift(fill, riso.offset) : null;
          return (
            <Group
              // biome-ignore lint/suspicious/noArrayIndexKey: an icon's parts are a fixed list from its artwork, never reordered, and their index is their identity.
              key={i}
              {...(shift && {
                transform: [{ translateX: shift.x }, { translateY: shift.y }],
              })}
              {...(spot &&
                i < inkAt &&
                !fill.startsWith("skin-") && {
                  layer: <Paint blendMode="multiply" />,
                })}
            >
              {layer}
            </Group>
          );
        })}
      </Group>
    </Canvas>
  );
}
