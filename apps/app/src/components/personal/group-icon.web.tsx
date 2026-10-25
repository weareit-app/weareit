import { useId } from "react";
import { groupIcons } from "../../content/group-icons";
import { spotInks, type IconTone } from "../../content/icon-part";
import {
  drift,
  grainMatrix,
  grainSeed,
  grainThreshold,
  type RisoLook,
} from "./riso";

const tones: Record<IconTone, string> = {
  ink: "var(--color-ink)",
  paper: "var(--color-paper-raised)",
  "riso-ink": "var(--color-riso-ink)",
  "riso-paper": "var(--color-riso-paper)",
  "riso-line": "var(--color-riso-line)",
  ...spotInks,
};

const isSpot = (tone: IconTone | undefined): tone is keyof typeof spotInks =>
  tone !== undefined && tone in spotInks;

// A personal group's icon (web: an inline SVG). Decorative: the group name is
// always beside it. `riso` adds a print look: grain in each inked layer and
// spot inks slightly off register, overprinting the ink.
export function GroupIcon({
  id,
  size,
  riso,
}: {
  id: string;
  size: number;
  riso?: RisoLook | undefined;
}) {
  const uid = useId().replace(/[^a-zA-Z0-9_-]/g, "");
  const parts = groupIcons[id];
  if (!parts) return null;
  const grain = riso && riso.grain > 0;
  // Spots before the ink layer print under it and overprint; spots after it
  // fill solid ink areas and must cover them.
  const inkAt = parts.findIndex(
    (part) => part.fill === "riso-ink" || part.fill === "ink",
  );
  return (
    <svg aria-hidden viewBox="0 0 48 48" width={size} height={size}>
      {grain ? (
        <defs>
          {parts.map((part, i) =>
            part.fill === "riso-paper" || part.fill === "paper" ? null : (
              <filter
                key={i}
                id={`${uid}-grain-${i}`}
                x="-5%"
                y="-5%"
                width="110%"
                height="110%"
              >
                <feTurbulence
                  type="fractalNoise"
                  baseFrequency={riso.frequency}
                  numOctaves={3}
                  seed={grainSeed(i)}
                  result="noise"
                />
                <feColorMatrix
                  in="noise"
                  type="matrix"
                  values={grainMatrix(
                    grainThreshold(riso, isSpot(part.fill)),
                  ).join(" ")}
                  result="mask"
                />
                <feComposite in="SourceGraphic" in2="mask" operator="in" />
              </filter>
            ),
          )}
        </defs>
      ) : null}
      {parts.map((part, i) => {
        const spot = isSpot(part.fill);
        const shift = riso && spot ? drift(part.fill!, riso.offset) : null;
        const inked = part.fill !== "riso-paper" && part.fill !== "paper";
        const grained = grain && inked;
        const transform = shift
          ? `translate(${shift.x} ${shift.y})`
          : undefined;
        return (
          <g
            key={i}
            style={
              riso && spot && i < inkAt && !part.fill!.startsWith("skin-")
                ? { mixBlendMode: "multiply" }
                : undefined
            }
          >
            <path
              d={part.d}
              fillRule={part.evenOdd ? "evenodd" : undefined}
              fill={part.fill ? tones[part.fill] : "none"}
              stroke={part.stroke ? tones[part.stroke] : undefined}
              strokeWidth={part.strokeWidth}
              strokeLinecap="round"
              strokeLinejoin="round"
              transform={transform}
              filter={grained ? `url(#${uid}-grain-${i})` : undefined}
            />
          </g>
        );
      })}
    </svg>
  );
}
