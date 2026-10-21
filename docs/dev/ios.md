# iOS development build notes

Moved here on 2026-10-19 from `specs/007-watercolor-dot/proof/results.md` (iOS build, 2026-10-17).


The iOS dev build did not link: Expo's dev launcher references `RCTPackagerConnection`, which the React Native core in the build didn't provide (`Undefined symbols … _OBJC_CLASS_$_RCTPackagerConnection`). Skia was not involved, and updating Expo to 57.0.30 did not fix it.

Cause: `Pods/React-Core-prebuilt` held the Release build of React Native's prebuilt core, which leaves out the dev-only classes, and had no `.last_build_configuration` marker. React Native's `replace-rncore-version.js` assumes Debug when the marker is missing, so it never swapped in the Debug core. Fix (local; `ios/` is generated and not committed): write `Release` to `apps/app/ios/Pods/React-Core-prebuilt/.last_build_configuration` and build again; the script then swaps in Debug and the build links. If it recurs after `pod install` or prebuild, repeat that step.

Running it on the simulator with Xcode 27 (no Simulator.app; DeviceHub instead): taps and swipes from the simulator panel don't reach the simulator, so the dev launcher can't be used. Everything can be opened by deep link instead:

- Approve the app's URL schemes once so iOS doesn't ask "Open in It?": add `com.apple.CoreSimulator.CoreSimulatorBridge-->weareit` (and `-->exp+weareit`) = `app.weareit` to the device's `data/Library/Preferences/com.apple.launchservices.schemeapproval.plist` while it is shut down.
- Skip the dev menu intro: `xcrun simctl spawn <device> defaults write app.weareit EXDevMenuIsOnboardingFinished -bool YES`.
- Load the bundle: `xcrun simctl openurl <device> "app.weareit://expo-development-client/?url=http%3A%2F%2Flocalhost%3A8081"`, then open a page, for example `app.weareit:///lab/loader` (the gathering loader alone, development only). Also approve `-->app.weareit` = `app.weareit` in the plist above.
- Use the `app.weareit` scheme, not `weareit`. An older build, `It.app` (`com.joshsmith.we-are-it`), also claims `weareit`. On the shared simulator a `weareit://` link can open that app, which then runs the current bundle on its older native code. That's how an SDK 58 bundle in the SDK 57 app failed with `loadUnpackersWithCode` "undefined is not a function" (2026-10-20). Check which app connected with `curl localhost:8081/json/list` (its `appId`).
