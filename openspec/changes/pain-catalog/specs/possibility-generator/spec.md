# Spec Delta

## MODIFIED Requirements

### Requirement: Runs per pain
The generator SHALL take a pain ID from the pain catalog (`docs/research/pains/catalog.json`), resolving a merged ID to the pain it was merged into, and SHALL write each attempt as a new run under `docs/research/possibilities/runs/<pain>/<runId>/`, without reusing or overwriting an earlier run. Each run SHALL record the pain name and line it used. A repair SHALL be a new run that keeps the source run's card IDs.

#### Scenario: Unknown pain
- **WHEN** a run is started for an ID that isn't in the catalog
- **THEN** the helper refuses with a usage error, and no folder is created

#### Scenario: Merged pain
- **WHEN** a run is started for `homeless` after it was merged into `homelessness`
- **THEN** the run is created for `homelessness`, and the helper says so

## ADDED Requirements

### Requirement: Stale runs
The generator SHALL list as stale every run whose pain was merged or split, or whose recorded name or line differs from the catalog, with the reason and the old and new wording. A run that recorded no wording SHALL be compared with the wording the catalog's history shows at the run's start time.

#### Scenario: Line changed
- **WHEN** `poor-sleep` has runs and its line changes in the catalog
- **THEN** the stale list shows those runs, with the old and new line
