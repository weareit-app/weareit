# brand-mark Specification

## Purpose
It's watercolor mark appears on the landing page (living, animated), at the top of other pages, and as the loader while content loads (spec 007 watercolor dot).

## Requirements

### Requirement: Mark placement
The landing page SHALL show the living mark above the headline; the societal page and other pages using the shared page layout SHALL show a small static mark at the top.

#### Scenario: Landing page
- **WHEN** the landing page opens
- **THEN** the living watercolor mark appears above "It can be better."

### Requirement: Loader
While published content loads, pages SHALL show the watercolor loader.

#### Scenario: Slow content
- **WHEN** published content has not arrived yet
- **THEN** the watercolor loader is shown

### Requirement: Reduced motion and fallbacks
The mark SHALL not animate when the device asks for reduced motion. On web it SHALL draw with the browser's WebGL and fall back to the painted orb where WebGL is unavailable; on iOS it SHALL use Skia.

#### Scenario: Reduced motion
- **WHEN** reduced motion is on
- **THEN** the mark is shown still

### Requirement: Development lab
Lab screens (`/lab/loader`, `/lab/watercolor`, `/lab/riso`) SHALL exist for development, and the landing page SHALL link to the loader lab only in development builds.

#### Scenario: Production build
- **WHEN** the app runs as a production build
- **THEN** the landing page shows no lab link
