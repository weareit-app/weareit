# Idea Intake: Watercolor visual language, generated in code

- **Slug**: watercolor
- **Created**: 2026-10-17
- **Source**: founder, in conversation (2026-10-17), with a reference image (`reference-dot.png` in this folder) and a link to https://sudoaquarelle.com/ (host `sudoaquarelle.com`; policy branch: confirmed-by-user, since the founder asked for its JavaScript to be read)
- **Type**: new-capability

## Idea (as captured)

Founder, verbatim:

> I'd like to figure out how to take the little watercolor dot here and make it something that can be generated in code. There's already a potentially interesting case of someone doing real watercolor physics like this: https://sudoaquarelle.com/ There is javascript there we can look at.

> What I'd love is for us to be able to replicate this in a medium that is performant and can work across multiple parts of a UI in React Native. It's possible we can use something like Skia, or Reanimated, or CSS, or React to do so.

> It could be really beautiful inside of It and be used in places where we even dynamically draw a scene instructionally based on choices someone makes, so we don't have to rely on AI image generation, but instead have a standard system for designing elements of a scene, even if the components of the scene are pre-registered.

> I was also thinking it would be nice for instances where we can use the dot like a loading icon.

> It'd be nice for when we let people theme It and change the colors of the dot.

> It'd be nice for animations like a bunch of little dots pooling together to make one dot, to symbolize coming together or coordination, that "We are It".

> It'd be nice for animation to let the dot morph into things, like planet Earth, or a beautiful sky, etc.

> Watercolor can be so evocative as an ethereal, dream-like state, or like remembrances. It's the feeling of a storybook, a picture book.

> I'd like some other thoughts on what is conceptually possible here, too. Don't limit yourself just to this.

The founder then asked to think it through with Spec Kit, documents only, no code yet.

**Reference image** (`reference-dot.png`): a single round watercolor dot, roughly circular with a slightly irregular, bled edge. Color runs from blue-teal on the left, through cyan and green in the middle, to a small warm yellow patch on the right. A darker pooled line of pigment sits inside the dot (a "bloom" or backrun), and the rim is a little darker than the center in places. Transparent background.

**Linked page** (sudoaquarelle.com), title "Sudo Aquarelle — a real watercolor simulator". Its own description: a watercolor simulator built on real physics, with fluid dynamics after Curtis et al. (SIGGRAPH 1997), Kubelka-Munk pigment optics and 52 pigments, in the browser. By @lionel_mora. Its front-end source (`js/main.js`, `sim.js`, `pigments.js`, `ui.js`) was read; findings go in `research.md`.

## Restated

Build It's own watercolor look, starting with the dot, as something rendered by code so it can be themed, animated and composed. Uses named so far: a loading indicator, user-chosen dot colors, many dots gathering into one, the dot changing into other images (Earth, a sky), and pictures assembled from registered scene parts according to a person's choices, in place of AI-generated images.

## Origin & Context

- **Raised by**: the founder (Josh Smith), 2026-10-17.
- **Trigger**: the founder found sudoaquarelle.com as evidence that watercolor can be simulated in a browser. The reference dot is already It's mark: the same image is `apps/app/assets/brand/watercolor-orb.jpg` (1000×740 JPEG, supplied 2026-10-14), used on the welcome screen (`apps/app/app/index.tsx`).
- **Existing brand art** (`apps/app/assets/brand/README.md`): two styles live side by side. Soft watercolor washes (the orb, `clouds.jpg`, and the house, tree and home scenes) and black charcoal/crayon line figures on off-white (the `icon-*.jpg` choice illustrations). All are static JPEGs, 1.7 MB in total; creator and rights provenance are still to be confirmed per that README.
- **Existing related code**: the app is Expo SDK 57 / React Native 0.86 for web and iOS, with Reanimated 4.5 and react-native-worklets installed and NativeWind for styling. Color tokens live in `apps/app/global.css` (`ink`, `paper`, `leaf`, `blue`, `sun`, `coral`). No graphics library (Skia, WebGL, SVG) is installed.
- **Related decisions**: the Thing / Type / Relation layer (2026-10-16) could describe registered scene elements; the privacy invariants limit what a person's choices may show in shared or public images.

## First-Glance Unknowns

- [NEEDS CLARIFICATION: How close to the reference must a generated dot be: indistinguishable, or "same family"?]
- [NEEDS CLARIFICATION: Live physics everywhere, physics only for special moments, or a look-alike without physics?]
- [NEEDS CLARIFICATION: What must run on web and what only on iOS, and how much download size is acceptable on web?]
- [NEEDS CLARIFICATION: Which first use matters most for v0.1, if any: loader, theming, gathering animation, morphs, or scenes?]
- [NEEDS CLARIFICATION: What can people theme: one color, a palette of pigments, paper?]
- [NEEDS CLARIFICATION: Who designs registered scene elements, and are they content in the CMS (database-backed) or code?]
- [NEEDS CLARIFICATION: Can sudoaquarelle's code be reused at all? Its license is unknown.]
- [NEEDS CLARIFICATION: Accessibility: how do animations behave with reduce motion, and how is meaning conveyed without the image?]
- [NEEDS CLARIFICATION: Does this change an agreed stack choice (adding a rendering library), which would need a decision record?]
