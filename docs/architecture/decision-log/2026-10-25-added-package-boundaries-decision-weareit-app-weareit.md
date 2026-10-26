# 2026-10-25

Added the package boundaries decision (weareit-app/weareit#149): the allowed package graph with a third-party allowlist for the pure packages' `src/`, `@it/domain` module edges, oRPC kept in the server, and no cycles, all enforced by dependency-cruiser with type-only imports included and no baseline, plus knip and sherif in CI.
