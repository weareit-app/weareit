# 2026-10-25

Turned on typescript-eslint's type-aware `recommendedTypeChecked` rules with every finding fixed, including the async `createServer` handlers in the API server and the local Stripe mock, which now go through `requestListener` so an uncaught failure can't stop the process (weareit-app/weareit#148, task 7.3 of `repo-conventions`, third of three PRs).
