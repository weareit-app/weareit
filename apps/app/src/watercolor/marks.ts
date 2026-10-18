// It's letter marks with the gathering loader as the dot of the i. Letters
// come from the type-only logos on master (apps/app/assets/brand/
// it-type.svg and we-are-it-type.svg, 2026-10-17), in each file's own
// coordinates; the dot is where the full logo draws its painted dot.

const I_PATH =
  "M401 462C401 450 394 443 383 444L182 482C172 484 166 491 166 501L166 522C166 532 172 538 182 539C224 543 249 555 256 582C260 598 261 615 261 640L261 885C261 915 246 935 199 941C187 943 181 950 181 962L181 984C181 996 188 1003 200 1003L462 1003C474 1003 481 996 481 984L481 962C481 950 475 943 463 942C421 936 401 915 401 870Z";
const T_PATH =
  "M650 276L700 276C710 276 716 282 716 292L716 448L862 448C871 448 877 454 877 463L877 512C877 521 871 527 862 527L716 527L716 830C716 888 748 921 793 920C817 919 836 906 850 891C860 880 873 880 882 889L893 902C900 911 899 922 891 931C855 970 815 1002 740 1002C645 1002 577 948 576 845L576 527L494 527C485 527 480 521 480 512L480 485C480 476 486 470 495 467C560 445 610 395 630 300C633 285 640 276 650 276Z";
const E_PATH =
  "M797 925L610 929C612 985 640 1022 690 1024C725 1025 750 1010 770 993C780 985 792 988 797 997C800 1003 799 1010 794 1018C765 1060 725 1086 670 1086C590 1086 532 1025 532 937C532 850 590 785 670 785C745 785 795 835 797 900ZM607 897L722 895C720 848 700 822 666 822C632 822 610 850 607 897Z";

export interface MarkPath {
  d: string;
  // Uniform scale then offset (the SVG's matrix(s 0 0 s x y)), if any.
  place?: { scale: number; x: number; y: number };
  evenOdd?: boolean;
}

export interface Mark {
  name: string;
  paths: readonly MarkPath[];
  // The logo's viewBox.
  box: { x: number; y: number; width: number; height: number };
  dot: { x: number; y: number; r: number };
}

export const IT_MARK: Mark = {
  name: "it",
  paths: [{ d: I_PATH }, { d: T_PATH }],
  box: { x: 89, y: -19, width: 834, height: 1046 },
  dot: { x: 305, y: 193, r: 174 },
};

const IT_IN_LOCKUP = { scale: 1.448, x: 664.6, y: 90.4 };
const DOT_IN_LOCKUP = { scale: 1.195, x: 709.5, y: 218.4 };

export const WE_ARE_IT_MARK: Mark = {
  name: "we are it",
  paths: [
    // w
    {
      d: "M40 798L176 796C182 796 184 800 184 806L184 818C184 823 181 826 176 828L150 838L203 996L262 834L268 806C270 800 274 798 280 798L304 798C310 798 314 801 316 806L386 996L434 846L408 828C401 826 399 822 399 816L399 806C399 800 402 797 408 797L514 795C520 795 523 799 523 805L523 816C523 822 519 826 513 828L491 838L404 1080C402 1085 398 1088 392 1088L356 1088C350 1088 347 1085 345 1080L278 906L216 1080C214 1085 210 1088 204 1088L170 1088C164 1088 161 1085 159 1080L64 852C58 838 48 832 36 828C30 826 29 822 29 816L29 806C29 801 33 798 40 798Z",
    },
    // e
    { d: E_PATH, evenOdd: true },
    // a
    {
      d: "M185 1166C250 1166 289 1200 289 1262L289 1380C289 1388 294 1392 304 1391L324 1390C334 1390 338 1398 333 1408C325 1428 305 1442 280 1442C255 1441 238 1428 228 1410C205 1428 182 1440 148 1440C96 1440 59 1412 59 1372C59 1328 95 1302 160 1288L218 1272L218 1250C218 1222 205 1200 178 1200C160 1200 150 1205 146 1212C148 1228 144 1250 122 1258C100 1266 73 1255 73 1232C73 1195 120 1166 185 1166ZM221 1312C180 1315 135 1330 135 1365C135 1385 150 1396 170 1396C195 1396 214 1380 221 1360Z",
      evenOdd: true,
    },
    // r
    {
      d: "M440 1161C447 1161 451 1166 451 1173L451 1210C466 1178 495 1160 528 1160C555 1160 573 1176 573 1200C573 1228 556 1246 536 1246C518 1246 507 1236 505 1224C490 1222 470 1230 460 1250L460 1375C460 1386 468 1392 480 1393L500 1395C507 1396 510 1401 510 1408L510 1418C510 1424 506 1428 499 1428L364 1428C357 1428 353 1424 353 1417L353 1406C353 1399 357 1395 364 1395L376 1394C386 1393 390 1386 390 1375L390 1250C390 1232 382 1222 368 1218L362 1216C355 1214 352 1209 352 1202L352 1196C352 1190 356 1186 362 1185L432 1163C435 1162 437 1161 440 1161Z",
    },
    // e (of "are", the same e set smaller)
    { d: E_PATH, evenOdd: true, place: { scale: 0.908, x: 101, y: 442 } },
    { d: I_PATH, place: IT_IN_LOCKUP },
    { d: T_PATH, place: IT_IN_LOCKUP },
  ],
  box: { x: 5, y: 208, width: 1985, height: 1359 },
  dot: {
    x: DOT_IN_LOCKUP.x + DOT_IN_LOCKUP.scale * 305,
    y: DOT_IN_LOCKUP.y + DOT_IN_LOCKUP.scale * 193,
    r: DOT_IN_LOCKUP.scale * 174,
  },
};

// Light-mode ink, as --color-ink in global.css. The mark views follow the live
// --color-ink (so letters turn light in dark mode) and use this only as a fallback.
export const INK = "#1F2021";

// How much of its canvas each dot fills: the gathered loader about 60%,
// leaving room for drops drifting in; the settled B dot about 90%.
export const LOADER_DOT_FILL = 0.6;
export const STILL_DOT_FILL = 0.9;

// The area drawn: the logo's box widened to fit the dot's whole canvas, so
// nothing is cut off.
export function drawnBox(mark: Mark, dotFill: number) {
  const half = mark.dot.r / dotFill;
  const x = Math.min(mark.box.x, mark.dot.x - half);
  const y = Math.min(mark.box.y, mark.dot.y - half);
  const right = Math.max(mark.box.x + mark.box.width, mark.dot.x + half);
  const bottom = Math.max(mark.box.y + mark.box.height, mark.dot.y + half);
  return { x, y, width: right - x, height: bottom - y };
}

// Where everything goes, sized to fit within `maxWidth` × `maxHeight` points.
export function markLayout(
  mark: Mark,
  maxWidth: number,
  maxHeight: number,
  dotFill: number,
) {
  const box = drawnBox(mark, dotFill);
  const scale = Math.min(maxWidth / box.width, maxHeight / box.height);
  const half = mark.dot.r / dotFill;
  return {
    box,
    scale,
    width: box.width * scale,
    height: box.height * scale,
    dot: {
      left: (mark.dot.x - half - box.x) * scale,
      top: (mark.dot.y - half - box.y) * scale,
      size: 2 * half * scale,
    },
  };
}
