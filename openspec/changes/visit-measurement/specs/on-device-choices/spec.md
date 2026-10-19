# Spec Delta

## MODIFIED Requirements

### Requirement: Nothing sent before signup
The app SHALL NOT send the draft or any part of it (picked dreams, selected fixes, own contributions) to the server before the person signs up or signs in. No third-party analytics, telemetry or trackers SHALL run. The only data sent before signup SHALL be the disclosed measurement: listed stages, page views and pain opens, which name no picked dream or selected fix.

#### Scenario: Browsing without an account
- **WHEN** a person selects pains and picks dreams without signing in
- **THEN** no request carries their picked dreams or selected fixes

#### Scenario: Disclosed measurement only
- **WHEN** a signed-out person opens a pain and picks a dream under it
- **THEN** the only requests are measurement messages for the pain open and the `personal-first-dream-picked` stage, with no dream named
