# Brand colors

Status: **chosen, 2026-10-18: the tide-led palette (v17).** Josh picked it and Hilary likes it ("pretty"), and its watercolor orb closely matches the logo's. Applied to `apps/app/global.css` on off-white paper, light and dark. Checked on web, not yet on iOS.

## Decision

- **Palette:** 12 colors plus a neutral ink: `tide` (brand and default), `lagoon`, `harbor`, `mint`, `sprout`, `meadow`, `sun`, `ember`, `poppy`, `bloom`, `dusk`, `clay`, and `stone`. Full values and scales are under "Chosen palette: tide-led (v17)" below.
- **Brand color:** `tide` `#087E9F`, the v1 teal-blue. It replaces `sky` as the default for possibility, links, focus and the main call to action.
- **Values:** spots are each ink's nominal screen value (v2 Riso drums style). They paint an orb close to the logo's and work for screen and print briefs. Risotto Studio's listed values are kept as the **print reference** for the same inks, since they match how the inks look on paper.
- **Scales:** every color has a Radix 12-step scale in light and dark, generated with Radix's custom-palette generator, on white or off-white (`#FFFDF7`) paper. Token steps are `wash` (3), `tint` (6), the spot (exact ink) and `deep` (11, darkened in light mode only as needed for 4.5:1). Every contrast check passes.
- **Orb:** the gathering loader's colors use tide, sprout and sun, then poppy, ember and sun, then dusk, harbor and bloom. Tide's wash is its step 8 (see "Watercolor orb comparison").

The sections after "Chosen palette" record the exploration that led here: sources, the Risotto-value set, print photos and the orb tests.

## Files

- [`palette-preview.html`](palette-preview.html) is the working preview. It defaults to "Tide-led", with white or off-white paper, light or dark mode, the side-by-side family view with WCAG scores, and the Original vs Tide-led orbs in a sticky left rail. The inlined loader makes the page too big to open as a file, so serve it with the `brand-preview` entry in `.claude/launch.json` (http://localhost:4173/palette-preview.html).
- [`riso-radix.html`](riso-radix.html) maps every Radix scale to its nearest riso ink, using older stencil.wiki values.

## Chosen palette: tide-led (v17)

Chosen on 2026-10-18. v2 Riso drums with v1's tide (`#087E9F`) as the brand color, plus the newer inks that add a distinct job. Spots are the inks' nominal screen values, which also paint an orb close to the logo's (see the orb comparison). Risotto's listed values are kept as the print reference. It's the preview's default palette, "Tide-led".

| Token | Spot (screen) | Print reference | wash (3) | tint (6) | deep, light | deep, dark |
| --- | --- | --- | --- | --- | --- | --- |
| `tide` | `#087E9F` | Sea Blue / Teal (Risotto Teal 321U `#214F5F`) | `#E0F2FA` | `#A9D6E9` | `#007697` | `#69C8EB` |
| `lagoon` | `#5EC8E5` | Aqua Blue 312U `#00AEEF` | `#D6F5FE` | `#8BDCF3` | `#057693` | `#60CAE7` |
| `harbor` | `#3D5588` | Fed Blue 294U `#252D59` | `#E8EFFD` | `#C3D3F3` | `#4A6397` | `#9CB8F1` |
| `mint` | `#82D8A7` | Mint 324U `#82D8A7` | `#E1F5E8` | `#9FDEB9` | `#0D7E45` | `#7AD09F` |
| `sprout` | `#00A95C` | Green 354U `#197C22` | `#E3F5E7` | `#A5DDB6` | `#007F3D` | `#4FD585` |
| `meadow` | `#67B346` | Kelly Green 368U (not at Risotto) | `#E2F6DB` | `#ABDD99` | `#3A7B16` | `#83CE65` |
| `sun` | `#FFB511` | Sunflower 116U `#FFB000` | `#FFEEBF` | `#FFCB71` | `#94620B` | `#FFC137` |
| `ember` | `#FF6C2F` | Orange 021U `#FF6627` | `#FFE7DC` | `#FFB595` | `#BD3F03` | `#FF9B72` |
| `poppy` | `#F15060` | Bright Red (Secret Riso Club) | `#FCE8E8` | `#F8BBBB` | `#C82540` | `#FF8E93` |
| `bloom` | `#FF48B0` | Fluro Pink 806U `#F272DD` | `#FEE6F0` | `#F2BAD3` | `#C70082` | `#FF86C9` |
| `dusk` | `#765BA7` | Violet (Secret Riso Club `#7659B1`) | `#F1EEF9` | `#D3C8ED` | `#6D529D` | `#C2A7FA` |
| `clay` | `#925F52` | Brown (Secret Riso Club) | `#F7EAE6` | `#ECC5BA` | `#875548` | `#E6AE9F` |
| `stone` | `#88898A` | Light Gray 424U | `#EDEEEE` | `#D5D6D6` | `#606161` | `#B5B6B6` |

`deep, light` is Radix step 11, darkened only where needed for 4.5:1 on its wash and on paper. Contrast passes in every paper and mode combination, including text on every spot. Closest pairs: `sprout`/`meadow` 6.7, `ember`/`poppy` 8.9, `harbor`/`dusk` 10.3.

Full Radix 12-step scales, off-white paper, light mode (steps 1–12 as generated, before the step-11 adjustment):

| Token | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `tide` | `#F8FBFC` | `#F1F7FA` | `#E0F2FA` | `#D0ECF7` | `#BEE2F1` | `#A9D6E9` | `#8EC6DD` | `#61B0CE` | `#087E9F` | `#007091` | `#007697` | `#1A3C49` |
| `lagoon` | `#F7FBFC` | `#EEF8FB` | `#D6F5FE` | `#BFEFFE` | `#A7E7FA` | `#8BDCF3` | `#63CCEA` | `#00B7DF` | `#00A2C8` | `#0095B8` | `#007B99` | `#003E4D` |
| `harbor` | `#F9FAFD` | `#F3F7FD` | `#E8EFFD` | `#DCE7FB` | `#D1DEF8` | `#C3D3F3` | `#B1C5EC` | `#95AFE3` | `#3D5588` | `#2F4678` | `#4A6397` | `#1F2B45` |
| `mint` | `#F8FCF9` | `#F1F9F4` | `#E1F5E8` | `#CFF0DB` | `#BAE9CC` | `#9FDEB9` | `#7AD09F` | `#33BB7B` | `#00A863` | `#009B57` | `#008045` | `#133E28` |
| `sprout` | `#F8FCF9` | `#F2F9F3` | `#E3F5E7` | `#D2EFDA` | `#BEE8CA` | `#A5DDB6` | `#83CE9B` | `#49BA75` | `#00A95C` | `#009B52` | `#007F3D` | `#193D26` |
| `meadow` | `#F9FCF8` | `#F3F9F1` | `#E2F6DB` | `#D2F1C6` | `#C0E9B0` | `#ABDD99` | `#91CD7B` | `#6CB84C` | `#67B346` | `#5BA739` | `#3B7D18` | `#26401C` |
| `sun` | `#FCFBF9` | `#FFF7E7` | `#FFEEBF` | `#FFE3A2` | `#FFD883` | `#FFCB71` | `#EEB961` | `#DDA12F` | `#FFBC00` | `#FCB307` | `#9E6800` | `#49381C` |
| `ember` | `#FCFAF9` | `#FFF3EE` | `#FFE7DC` | `#FFD3BE` | `#FFC5AB` | `#FFB595` | `#FBA383` | `#EF8B65` | `#FF6C2F` | `#F35E19` | `#D14500` | `#582D1D` |
| `poppy` | `#FDFAFA` | `#FDF5F5` | `#FCE8E8` | `#FFD9D9` | `#FFCBCB` | `#F8BBBB` | `#EFA8A8` | `#E68D8F` | `#F15060` | `#E34154` | `#C82540` | `#651720` |
| `bloom` | `#FDFAFB` | `#FCF4F8` | `#FEE6F0` | `#FDD8E8` | `#F9C9DE` | `#F2BAD3` | `#EAA6C5` | `#E18DB5` | `#FF48B0` | `#F139A4` | `#C70082` | `#660C42` |
| `dusk` | `#FAFAFC` | `#F7F6FB` | `#F1EEF9` | `#E8E3F7` | `#DFD7F4` | `#D3C8ED` | `#C2B4E2` | `#AC99D4` | `#765BA7` | `#684D98` | `#6D529D` | `#372851` |
| `clay` | `#FCFBFA` | `#FCF6F4` | `#F7EAE6` | `#F4DFD9` | `#F0D3CB` | `#ECC5BA` | `#E6B2A4` | `#DA9685` | `#925F52` | `#835245` | `#875548` | `#40322E` |
| `stone` | `#FAFAFB` | `#F6F6F7` | `#EDEEEE` | `#E5E5E6` | `#DEDEDE` | `#D5D6D6` | `#CACBCB` | `#B7B8B8` | `#88898A` | `#7C7D7E` | `#606161` | `#1F2021` |

Dark mode:

| Token | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `tide` | `#091418` | `#0F1B20` | `#062B37` | `#00384A` | `#00455A` | `#02546B` | `#0F6782` | `#0D80A1` | `#087E9F` | `#1C6F8A` | `#69C8EB` | `#BAEBFF` |
| `lagoon` | `#091417` | `#0F1B1F` | `#072C35` | `#003946` | `#004656` | `#065567` | `#12687C` | `#12819A` | `#5EC8E5` | `#56BDD9` | `#60CAE7` | `#BCECFB` |
| `harbor` | `#0E121B` | `#131823` | `#1A2640` | `#213155` | `#2A3D67` | `#344977` | `#3F578B` | `#4B67A4` | `#3D5588` | `#314674` | `#9CB8F1` | `#D9E5FB` |
| `mint` | `#0E1410` | `#131A16` | `#172B20` | `#183927` | `#204732` | `#2A553E` | `#35674B` | `#3E7C5A` | `#82D8A7` | `#6FCF9A` | `#7AD09F` | `#C4F3D6` |
| `sprout` | `#0D140F` | `#131B15` | `#172B1E` | `#163B24` | `#1B492D` | `#215936` | `#276941` | `#2B7C4B` | `#00A95C` | `#009C50` | `#4FD585` | `#B3F3C6` |
| `meadow` | `#0F140D` | `#151A13` | `#1E2A19` | `#23391B` | `#2C4721` | `#365629` | `#3F6630` | `#4A7836` | `#67B346` | `#5BA739` | `#83CE65` | `#C6F0B7` |
| `sun` | `#15110C` | `#1D180F` | `#2E2109` | `#3F2700` | `#4D3100` | `#5A3E07` | `#6E501A` | `#8B6623` | `#FFB511` | `#F4AA00` | `#FFC137` | `#FFE4B8` |
| `ember` | `#17100E` | `#201511` | `#361B11` | `#4C1B07` | `#5A230D` | `#6A311C` | `#824229` | `#A75435` | `#FF6C2F` | `#F2601F` | `#FF9B72` | `#FFDBCC` |
| `poppy` | `#180F0F` | `#201313` | `#3D1115` | `#530B16` | `#64121D` | `#751F29` | `#8F2E37` | `#BB3D49` | `#F15060` | `#E34255` | `#FF8E93` | `#FFD1D0` |
| `bloom` | `#190E13` | `#231119` | `#3C1228` | `#530635` | `#620E40` | `#731D4D` | `#8E2B62` | `#B5387E` | `#FF48B0` | `#F139A4` | `#FF86C9` | `#FFCEE6` |
| `dusk` | `#13101A` | `#1A1624` | `#2A1F3E` | `#362652` | `#402E5F` | `#4B386D` | `#5C4783` | `#755AA6` | `#765BA7` | `#67518F` | `#C2A7FA` | `#E5DCFB` |
| `clay` | `#151110` | `#1D1715` | `#2D1F1B` | `#3C241E` | `#492C25` | `#59382F` | `#6E473D` | `#8D5A4D` | `#925F52` | `#835245` | `#E6AE9F` | `#FDDCD4` |
| `stone` | `#121212` | `#191919` | `#222323` | `#2A2A2A` | `#313132` | `#3B3B3B` | `#49494A` | `#606161` | `#88898A` | `#7C7D7E` | `#B5B6B6` | `#ECECED` |

## Exploration: Risotto-value set (superseded)

### Source of truth for inks (during exploration)

**Risotto Studio's listed values** ([ink pages](https://risottostudio.com/collections/ink-swatches)), which give a Pantone, hex, RGB and CMYK for each ink. Risotto calls these "an on-screen proxy" for physical soy inks. Of the 18 tokens, 14 are Risotto inks. The other 4 (`sky`, `meadow`, `clay`, `stone`) aren't in Risotto's range or have no listed value, and keep their earlier values: Pantone uncoated values from the project owner, Secret Riso Club's swatch sheets, or stencil.wiki.

Risotto's values run darker and duller than Pantone screen values for dark inks. For example, Teal 321U is `#214F5F`, where Secret Riso Club's sheet has `#00838A`. That matches Risotto's photographed prints, so they reflect how the ink looks on paper.

Risotto's downloadable ASE file (`RISOTTO-Ink Swtaches 2026 (RGB).ase`) differs from their web values for three inks: Aqua `#44AFF2` vs `#00AEEF`, Mint `#A0F2E3` vs `#82D8A7`, and Sunflower `#F2BF27` vs `#FFB000`. The web values are used.

## Watercolor orb comparison

The preview's left rail runs the gathering loader twice, side by side: **Original** (its own pigments) and **Tide-led**. Each loader cycles its own palette, then sunrise, then dusk:

| Orb | Its own palette | Sunrise | Dusk |
| --- | --- | --- | --- |
| Original (`packages/watercolor`) | teal-blue, cyan-green, warm yellow | rose, coral, gold | violet, ultramarine, pink |
| Tide-led | tide, sprout, sun | poppy, ember, sun | dusk, harbor, bloom |

Each ink becomes a pigment with the ink as masstone and a lighter step as its wash; granulation comes from the original pigment. Tide's wash is its Radix step 8 (`#61B0CE`). With step 6 (`#A9D6E9`) the wash was so pale that tide barely showed and the orb read green. The other pigments use step 6.

Average orb color at the same moments (original vs tide-led): `#3B95C5` vs `#3EA6AD`, `#099AAE` vs `#0CB593`, `#5192AF` vs `#619F8B`. The tide-led orb is close, but still a little greener: the original's teal-blue masstone (`#006382`) is deeper than tide, and Green (`#00A95C`) is yellower than the orb's jade (`#018164`).

Earlier tests (Risotto-value inks, v2 Riso drums, v2 with v1 tide) are summarized in the version history. The Risotto-value inks mixed muddiest, and v2 stayed closest.

## How the scales are made

Each ink goes through `generateRadixColors` from radix-ui/website (`components/generate-radix-colors.tsx`, MIT), run with `@radix-ui/colors` 3.0.0, `colorjs.io` 0.5.2 and `bezier-easing` 2.1.0. Inputs: `accent` = ink hex, `gray` = Light Gray `#88898A`, `background` = paper (off-white `#FFFDF7` / `#13120F`, or white `#FFFFFF` / `#111111`).

| Token step | Radix step | Use |
| --- | --- | --- |
| `wash` | 3 | Backgrounds, selected states |
| `tint` | 6 | Light fills, subtle borders |
| spot (no suffix) | the exact ink | Illustration fills, solid buttons |
| `deep` | 11, darkened in light mode only as far as needed for 4.5:1 on its wash and on paper | Text, icons |

For dark inks, Radix's step 11 comes out lighter than the ink itself (`tide-deep` `#20718B` against a `#214F5F` spot). That's expected: step 11 is tuned for reading on paper, not for matching the ink.

## Tokens (off-white paper, Risotto values)

Light mode:

| Token | Ink | Pantone | Value source | Role | wash | tint | spot | deep |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `sky` | Blue | 3005 U | Shop sheet / Pantone | Default: possibility, links, focus, main action | `#E5F1FD` | `#AFD3F5` | `#0075BF` | `#0071BA` |
| `lagoon` | Aqua Blue (custom) | 312 U | Risotto | Freshness, bright cyan accents | `#E0F2FE` | `#98D9FF` | `#00AEEF` | `#0E73A9` |
| `tide` | Teal | 321 U | Risotto | Water, the orb, calm | `#DEF4FD` | `#A2D8ED` | `#214F5F` | `#20718B` |
| `forest` | Hunter Green | 342 U | Risotto | Dark forest green | `#E5F3ED` | `#B2D8C7` | `#22382F` | `#4D7263` |
| `mint` | Mint (custom) | 324 U | Risotto | True green mint | `#E1F5E8` | `#9FDEB9` | `#82D8A7` | `#0D7E45` |
| `sprout` | Green | 354 U | Risotto | Growth, success | `#E5F5E4` | `#ACDCAB` | `#197C22` | `#1B7D23` |
| `meadow` | Kelly Green | 368 U | stencil.wiki / Pantone | Community, outdoors | `#E2F6DB` | `#ABDD99` | `#67B346` | `#3A7B16` |
| `lemon` | Yellow | Yellow U | Risotto | Highlight, attention | `#F8F9B8` | `#DCDC6F` | `#FFFC14` | `#75730E` |
| `sun` | Sunflower (custom) | 116 U | Risotto | Warmth, "coming soon" | `#FFEDC0` | `#FFCA70` | `#FFB000` | `#96610B` |
| `gilt` | Metallic Gold (special) | 872 U | Risotto | Gold (metallic on paper only) | `#F4ECE3` | `#E1CBAF` | `#BD935C` | `#806034` |
| `clay` | Brown | — | Shop sheet | Craft, making, grounding | `#F7EAE6` | `#ECC5BA` | `#925F52` | `#875548` |
| `ember` | Orange | 021 U | Risotto | Energy | `#FFE7DC` | `#FFB596` | `#FF6627` | `#C03B02` |
| `flame` | Warm Red | Warm Red U | Risotto | Errors, urgency, vermilion | `#FEE8E3` | `#FFB7A6` | `#F24822` | `#CD2909` |
| `berry` | Burgundy | 235 U | Risotto | Serious emphasis, deep red | `#F7EAEC` | `#EEC7D0` | `#73404E` | `#86515F` |
| `bloom` | Fluro Pink | 806 U | Risotto | Joy, rare accent | `#FFE3FB` | `#FFB0EF` | `#F272DD` | `#A52594` |
| `dusk` | Violet (custom) | 265 U | Risotto | Ideas, the future | `#EDEFFC` | `#C5CBFE` | `#5F5BD9` | `#544FC4` |
| `plum` | Purple | 2685 U | Risotto | Deep purple | `#EEEEFE` | `#CAC9FF` | `#393073` | `#5E54AB` |
| `stone` | Light Gray | 424 U | Shop sheet | Neutral ink, shadows | `#EDEEEE` | `#D5D6D6` | `#88898A` | `#606161` |

Dark mode (same names, values flip):

| Token | wash | tint | spot | deep |
| --- | --- | --- | --- | --- |
| `sky` | `#022947` | `#004F87` | `#0075BF` | `#65BCFF` |
| `lagoon` | `#002B3E` | `#005378` | `#00AEEF` | `#53C4FD` |
| `tide` | `#132A33` | `#245262` | `#214F5F` | `#7AC6E2` |
| `forest` | `#1D2924` | `#345347` | `#22382F` | `#9BC2B1` |
| `mint` | `#172B20` | `#2A553E` | `#82D8A7` | `#7AD09F` |
| `sprout` | `#162C16` | `#1A5B1E` | `#197C22` | `#75D075` |
| `meadow` | `#1E2A19` | `#365629` | `#67B346` | `#83CE65` |
| `lemon` | `#262603` | `#484700` | `#FFFC14` | `#E9E725` |
| `sun` | `#2F2009` | `#5C3E05` | `#FFB000` | `#FFBE36` |
| `gilt` | `#27221B` | `#4C3D29` | `#BD935C` | `#DAB688` |
| `clay` | `#2D1F1B` | `#59382F` | `#925F52` | `#E6AE9F` |
| `ember` | `#361B11` | `#6B301A` | `#FF6627` | `#FF9B73` |
| `flame` | `#3A160E` | `#712617` | `#F24822` | `#FF9276` |
| `berry` | `#311B21` | `#60333F` | `#73404E` | `#EBA1B4` |
| `bloom` | `#391533` | `#69265F` | `#F272DD` | `#FF82ED` |
| `dusk` | `#212248` | `#3D3D82` | `#5F5BD9` | `#A5ACFF` |
| `plum` | `#242048` | `#423A80` | `#393073` | `#AEA8FF` |
| `stone` | `#222323` | `#3B3B3B` | `#88898A` | `#B5B6B6` |

Neutrals from the generated gray (off-white, light): `paper #FFFDF7`, `paper-raised #FFFFFF`, `paper-sunk #EDEDEE`, `rule #D5D6D6`, `ink-faint #7E7F80`, `ink-soft #606162`, `ink #1F2021`.

Contrast: every `deep` reaches at least 4.5:1 on its wash and on paper in both modes and on both papers. Text placed directly on the `flame` spot reaches 4.4:1, so use it for large text only. With the print-photo values, text on the `sprout` spot also drops to about 4.1:1.

## Print photos (comparison)

The preview's "Print photos" mode uses colors sampled from Risotto's photographed 100% print swatches for the 19 inks that have a photo. The photos depend on one studio's camera and editing, so treat them as evidence, not specs. They mostly agree with Risotto's listed values. The biggest gaps are Burgundy (`#73404E` listed vs `#6A161B` photo) and Fluro Green (`#A3F26B` vs `#B4F683`).

## Pantone references

Riso inks aren't Pantone inks. Each Pantone above is the printer's nearest uncoated match, so use these for print conversations, not as exact specs. Sources disagree in places: Secret Riso Club names its Green 347 U, Risotto names its Green 354 U, and they're slightly different greens (`#169B62` vs Risotto's `#197C22`). Constance lists Sunflower as 116 U, which matches Risotto.

## Earlier sources, for reference

- Secret Riso Club swatch sheets ([Riso Basics](https://secretrisoclub.com/Riso-Basics)): hex plus Pantone for some inks. These were the source for v10–v11.
- The 2026 RISO Illustrator swatch file: brighter, more saturated values, not used.
- Constance's 2022 ASE: CMYK print recipes, not screen colors.
- stencil.wiki's "Riso inks" category: screen approximations that match Pantone uncoated values for several inks.

## Close pairs to watch

Run `palette-preview.html` with "All inks" to compare side by side. Closest remaining pairs are listed live in the preview's "Side by side" section.

## In the app

`apps/app/global.css` defines, for each ink, `--color-{name}` (the spot, the same in both modes) plus `-wash`, `-tint` and `-deep`, which flip in dark mode. It also defines `--color-on-{name}`, a fixed text color for each spot: white on tide, harbor, dusk and clay, and ink (`#1F2021`) on the rest. Neutrals are `paper`, `paper-raised`, `paper-sunk`, `rule`, `ink-faint`, `ink-soft` and `ink`. Use `bg-tide text-on-tide` for buttons, never `bg-tide-deep text-white`, because `deep` turns light in dark mode. `ink-faint` is darkened to 4.5:1 on paper (`#727374` light, `#818283` dark).

Old tokens were mapped: `muted` → `ink-soft`, `card` → `paper-raised`, `blue`/`leaf` → `tide` (`text-tide-deep` for text), the cream panel `#f2e8d5` → `sun-wash`, grey borders → `rule`, light-blue fills → `tide-wash`. Support It actions use `tide`, like every other action.

## Roles

- Main call to action: `tide` button with white text (4.7:1). `ink` stays the plain "Continue" button.
- Links, focus and selection: `tide-deep` text, `tide` ring, `tide-wash` fill plus a check mark.
- Support It: the same `tide` buttons as every other action (2026-10-28). `ember` stays an illustration color.
- Status: success `sprout`, "coming soon" `sun`, error `poppy` (`poppy-deep` text on `poppy-wash`), ideas `dusk`.
- Illustration and riso spots: any token. Watercolor: the orb palettes above.

## Still open

- Check the dark-mode switch on iOS. NativeWind 5 rc (react-native-css) supports `@media (prefers-color-scheme: dark)` on `:root`, and the app's `userInterfaceStyle` is `automatic`, but it has only been checked on web.
- Image frames (welcome orb, futures art, choice-card icons) stay white because the rasters have white backgrounds. They stand out in dark mode until the art gets transparent backgrounds or dark versions.
- Commit the scale generator as a script so the scales can be rebuilt.
- Decide whether `packages/watercolor` should take the tide-led pigments as a named palette (the loader currently uses `it-orb`, `sunrise` and `dusk`).
- `tide` (`#087E9F`) isn't a stock riso ink. For print, the nearest drums are Sea Blue (3.2 away) and Teal (4.1). Risotto's Teal 321U prints much darker.
- `ink-faint` (gray step 10) is about 3.9:1 on paper. Use `ink-soft` for captions, or darken it like `deep`.
- Dark-mode illustrations: riso ink needs light paper, so dark mode probably needs its own artwork.
