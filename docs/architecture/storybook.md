# Storybook and component review

Storybook shows the app's components one at a time, on web, in light and dark. Its main job is pull-request review: seeing what a change did to the components without walking through the app.

## Running it

```sh
pnpm storybook                  # browse stories at http://localhost:6006
pnpm storybook:review           # what this branch changed, compared with origin/master
pnpm storybook:review <ref>     # compared with another branch or commit
pnpm storybook:review --no-base # every story, no comparison
```

`storybook:review` builds Storybook for the current checkout and for its merge base with the compared ref (in a temporary Git worktree, installed from the pnpm store). It then screenshots every story in light and dark with Playwright and writes `apps/app/storybook-review/index.html`. The report lists stories that fail to render, stories that changed (before, after, and a difference image with changed pixels in magenta), new stories, and removed ones. To review a pull request, check out its branch and run it. A merge base's build is kept between runs, so later runs only build the branch. Motion is reduced for the screenshots, so animated components hold still. The command exits non-zero when a story fails to render.

If the compared ref has no Storybook yet, every story is listed as new.

## Writing stories

- A story file sits next to its component: `choice-card.tsx` → `choice-card.stories.tsx`.
- A component that renders UI gets stories covering its visible states. Add or update them in the same change as the component. Not covered yet: `PainExplorer`, which fetches published content itself, and `StatusBarBackdrop`, which only matters on iOS.
- Use real copy from `@it/content` through `apps/app/src/stories/content.ts`, so stories show what people will read.
- Pass data as props. Stories don't call the API; the decorator's TanStack Query client never fetches.
- Light and dark come from the toolbar's Theme control, applied as the app's theme switch applies it on web. Stories get 24px padding unless they set `parameters: { padded: false }` (whole pages bring their own).
- Interaction states that need a click (an open dialog, for example) use a `play` function.

## How it renders the app's styling

Storybook builds with Vite (`@storybook/react-native-web-vite`), while the app builds with Metro. On web NativeWind 5 needs two things, and both run under Vite:

- **NativeWind's Babel preset** (`nativewind/babel`) rewrites `react-native` imports to wrappers that pass `className` through to react-native-web as real CSS classes.
- **Tailwind**: `global.css` is compiled by `@tailwindcss/postcss` through the app's `postcss.config.mjs`, so the tokens and dark-mode values are the app's own.

Fonts are loaded with `@font-face` in `apps/app/.storybook/storybook.css`, under the family names the `font-*` tokens use; the app loads the same files with expo-font. If you add a face to `src/theme/fonts.ts`, add it there too.

Storybook covers web only. Components with a separate `.native.tsx` or iOS-only path, such as the Skia watercolor dot, show their web version; check iOS in the simulator.
