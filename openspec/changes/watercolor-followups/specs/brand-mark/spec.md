# Spec Delta

## MODIFIED Requirements

### Requirement: Loader
While published content loads, pages SHALL show the watercolor loader, but only once loading has taken longer than 300 ms, so quick loads show no flash. It SHALL show no words and no fake progress, and SHALL disappear as soon as content arrives.

#### Scenario: Slow content
- **WHEN** published content has not arrived yet
- **THEN** the watercolor loader is shown

#### Scenario: Quick content
- **WHEN** content arrives within 300 ms
- **THEN** the loader never appears

### Requirement: Reduced motion and fallbacks
The mark SHALL not animate when the device asks for reduced motion. On web it SHALL draw with the browser's WebGL and on iOS with Skia. On every platform, wherever a generated dot is not ready, cannot be drawn or would exceed the web budget, the painted orb SHALL show in the same place and size, and nothing SHALL wait for the mark.

#### Scenario: Reduced motion
- **WHEN** reduced motion is on
- **THEN** the mark is shown still

#### Scenario: Dot not ready
- **WHEN** a screen opens before its generated dot is ready
- **THEN** the painted orb shows in its place and the screen is usable straight away

## ADDED Requirements

### Requirement: Loader failure
If content fails to load, the loader SHALL go away and the existing error message with its retry SHALL show.

#### Scenario: Content request fails
- **WHEN** the content request fails while the loader is showing
- **THEN** the dot disappears and the error with a retry button is shown

### Requirement: Palettes as data
The mark's colours SHALL come from palette data of two to four pigments, mixed like paint (subtractive mixing), and each palette SHALL pass a visibility check against the paper colour. The app SHALL use one default palette and fall back to it if a palette is missing or fails the check. There SHALL be no colour picker for people.

#### Scenario: Missing palette
- **WHEN** the app asks for a palette that does not exist
- **THEN** the default palette is used

#### Scenario: No colour control
- **WHEN** someone looks through every screen
- **THEN** there is no control to change the mark's colours

### Requirement: Mark accessibility
The logo mark SHALL be labelled "We are It" for screen readers. The loader SHALL announce "Loading…" once and SHALL not be focusable.

#### Scenario: Screen reader during loading
- **WHEN** a screen-reader user waits for content
- **THEN** they hear "Loading…" once and focus does not land on the dot

### Requirement: Mark performance
The mark SHALL add at most 1 MB to the web download, loaded after the first screen, and SHALL not make the first screen slower. On iPhone 12 it SHALL hold 60 frames a second with about 30 small dots on screen.

#### Scenario: Web budget
- **WHEN** the web build is measured before and after the mark's code
- **THEN** the added download is at most 1 MB and first-screen time is unchanged

#### Scenario: iPhone 12
- **WHEN** about 30 small dots animate on an iPhone 12
- **THEN** frame times stay within 60 frames a second
