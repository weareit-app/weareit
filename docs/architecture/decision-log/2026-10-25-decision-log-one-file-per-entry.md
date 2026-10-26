# 2026-10-25

Moved the change log out of `decisions.md` into `docs/architecture/decision-log/`, one file per entry, and asked OpenSpec task lists to separate checkboxes with a blank line. During the `repo-conventions` rollout, parallel pull requests kept conflicting on the same last change-log line and on neighbouring checkboxes, and GitHub's merge button ignores `.gitattributes` `merge=union`, so a union-merged log file would not have helped there (founder, 2026-10-25, from the rollout retro).
