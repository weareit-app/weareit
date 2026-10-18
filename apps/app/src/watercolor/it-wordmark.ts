// The "it" letters, from apps/app/assets/brand/it-type.svg (added on master
// 2026-10-17), with the gathering loader as the dot of the i. Coordinates are
// the logo's own (it-logo.svg): its dot is centered at (305, 193), radius 174.
export const IT_TYPE_PATHS = [
  "M401 462C401 450 394 443 383 444L182 482C172 484 166 491 166 501L166 522C166 532 172 538 182 539C224 543 249 555 256 582C260 598 261 615 261 640L261 885C261 915 246 935 199 941C187 943 181 950 181 962L181 984C181 996 188 1003 200 1003L462 1003C474 1003 481 996 481 984L481 962C481 950 475 943 463 942C421 936 401 915 401 870Z",
  "M650 276L700 276C710 276 716 282 716 292L716 448L862 448C871 448 877 454 877 463L877 512C877 521 871 527 862 527L716 527L716 830C716 888 748 921 793 920C817 919 836 906 850 891C860 880 873 880 882 889L893 902C900 911 899 922 891 931C855 970 815 1002 740 1002C645 1002 577 948 576 845L576 527L494 527C485 527 480 521 480 512L480 485C480 476 486 470 495 467C560 445 610 395 630 300C633 285 640 276 650 276Z",
] as const;

const DOT_X = 305;
const DOT_Y = 193;
const DOT_R = 174;
// The gathered dot fills about 60% of the loader's canvas, which leaves room
// around it for drops drifting in.
const DOT_CANVAS = (2 * DOT_R) / 0.6;

// The area drawn: the logo's box (89, -19, 834 × 1046) widened to fit the
// loader's whole canvas, so no drop is cut off.
export const WORDMARK_BOX = {
  x: Math.min(89, DOT_X - DOT_CANVAS / 2),
  y: Math.min(-19, DOT_Y - DOT_CANVAS / 2),
  right: 923,
  bottom: 1027,
};
const BOX_W = WORDMARK_BOX.right - WORDMARK_BOX.x;
const BOX_H = WORDMARK_BOX.bottom - WORDMARK_BOX.y;

// Ink, as --color-ink in global.css (the SVG's currentColor).
export const INK = "#171717";

// Where everything goes for a wordmark `height` points tall.
export function wordmarkLayout(height: number) {
  const scale = height / BOX_H;
  return {
    scale,
    width: BOX_W * scale,
    height,
    dot: {
      left: (DOT_X - DOT_CANVAS / 2 - WORDMARK_BOX.x) * scale,
      top: (DOT_Y - DOT_CANVAS / 2 - WORDMARK_BOX.y) * scale,
      size: DOT_CANVAS * scale,
    },
  };
}
