# Typography

Decided 2026-10-18 by the founder, with Hilary's input, after comparing free typefaces against the hand-drawn "we are it" logo on a specimen page.

## Decision

It uses two free typeface families in three roles.

| Role      | Token                                                           | Font                                  | Size        | Use for                                                                                                                        |
| --------- | --------------------------------------------------------------- | ------------------------------------- | ----------- | ------------------------------------------------------------------------------------------------------------------------------ |
| Display   | `font-display`                                                  | Bitter SemiBold                       | 28px and up | Screen titles, the welcome line, milestones                                                                                    |
| Heading   | `font-heading`                                                  | Bitter SemiBold                       | 19–24px     | Section headings over reading text, card titles                                                                                |
| Reading   | `font-body`, `font-body-italic`, `font-body-semibold`           | Bitter Regular, Italic, SemiBold      | 16–18px     | Sentences people read for meaning: the welcome text, futures, first steps, longer writing                                      |
| Interface | `font-ui`, `font-ui-medium`, `font-ui-semibold`, `font-ui-bold` | Inter Regular, Medium, SemiBold, Bold | 12–17px     | Anything people tap or scan: instructions, buttons, choices and their descriptions, group labels, inputs, small print, numbers |

Rules:

- Instructions about using a screen ("Choose whatever fits. You can change your mind later.") are interface text, not reading text. `Page` takes `descriptionStyle="interface"` for these.
- Choice cards are controls, so their titles and descriptions are interface text.
- The hand-drawn logo stays the only place its letters appear. Do not recreate it in a font.
- Keep reading text at Regular or heavier. Lighter weights lose contrast on phones, in dark mode and for low-vision readers.

## Why

- Bitter was drawn for screens. Its low contrast and sturdy slab serifs stay readable at small sizes and on older displays.
- Using one serif family for headlines and reading text avoids two serifs competing. Hierarchy comes from size and weight.
- At heavy weights Bitter overlaps the logo's letter shapes about as closely as Young Serif did (71% versus 72% in the specimen comparison), so it stays related to the logo.
- Inter reads well at interface sizes and pairs with Bitter; both were made for screens.
- Charm comes from the logo, illustrations and copy, so the type can be plain and dependable.

Also considered: Young Serif (closest in feel to the logo), Newsreader and Public Sans (an earlier three-font direction), Source Serif 4, Aleo, Domine, Fraunces, Roboto Slab, Playfair Display and Libre Bodoni.

## License

Bitter and Inter are under the SIL Open Font License 1.1, which allows bundling them in the app and serving them on the web. The `@expo-google-fonts` packages that ship them are MIT for the code and OFL for the font files.

## Implementation

- `@expo-google-fonts/bitter` and `@expo-google-fonts/inter` (pinned at 0.4.2) provide the font files; `expo-font` loads them.
- `apps/app/src/theme/fonts.ts` lists every face the app uses. The root layout loads them with `useFonts` and renders nothing until they are ready. Loading in the root layout lets static web rendering embed the fonts in the page HTML.
- React Native picks a font by family name, not by weight, so each weight is its own family (`Bitter_600SemiBold`, `Inter_400Regular`, …). The role tokens in `apps/app/global.css` point to those names. Do not combine them with `font-bold`, `font-semibold` or other weight utilities; on the web those make the browser fake a heavier weight.
- `apps/app/src/components/text.tsx` wraps React Native's `Text` and applies `font-ui` unless the class names another role. Import `Text` from there, not from `react-native`. Give `TextInput` an explicit `font-ui`.
- `expo-font` is a native module, so iOS needs a new development build after this change.

## Open items

- Keep the native splash screen up while fonts load (`expo-splash-screen`) instead of rendering nothing.
- The `Page` brand mark is still text. Replace it with the vector logo in `apps/app/assets/brand/`.
- Expo SDK 58 can register several weights under one family name. Revisit the per-weight family names after upgrading.
