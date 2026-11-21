# CI Research: Skipping expensive jobs on docs-only pull requests

- **Slug**: ci-docs-only-gating
- **Created**: 2026-10-22
- **Question**: Is there a better way to skip the expensive GitHub Actions jobs on documentation-only pull requests than the `changes` job and job-level `if:` in `.github/workflows/ci.yml` (pull request #190), given a public repository, free standard runners, SHA-pinned and reviewed actions, and a `master` ruleset with required status checks?
- **Evidence confidence (overall)**: high on how skipped jobs, skipped workflows, and ruleset required checks behave (GitHub's own docs, quoted, plus the docs repository history); high on the rename gap in the diff (reproduced locally and confirmed in the Git docs); medium on the merge commit's parent order (undocumented, confirmed once against pull request #190 through the API); low on what a manual cancel does to jobs that haven't started (undocumented, not tested).
- **Scope**: research only. Every link below was checked on 2026-10-22. Nothing in `.github/`, `tools/`, or the ruleset was changed. The ruleset was read with `gh api repos/weareit-app/weareit/rulesets/25500174`: it requires "Typecheck, lint and unit tests" and "Web end-to-end tests" from integration 15368 (GitHub Actions), with `strict_required_status_checks_policy: false`. "Storybook stories render" is not required.

## Summary

- **Keep the current approach.** GitHub still documents exactly the behavior it relies on: a job skipped by a conditional "will report its status as 'Success'" and won't block a merge, while a workflow skipped by path filtering leaves its checks "Pending" and blocks the merge. Rulesets offer nothing native that changes this for a repository ruleset.
- **Fix one real fail-open: renames.** `git diff --name-only` detects renames by default and lists only the new path. A pull request that moves `apps/…/x.ts` to `docs/x.md` is classified docs-only, so the typecheck and tests are skipped even though a code file was removed. Add `--no-renames` (diff below). Reproduced locally with Git 2.56. This fix landed in #190 (commit f57b7ec).
- **The companion "always passes" workflow is gone from GitHub's docs.** GitHub documented it from 2021 and removed it on 2023-07-11; the page now says only "Avoid requiring workflows that can be skipped." Because required checks match by job name only, the trick still works mechanically, but it is no longer a supported pattern and it can pass a check whose real job never ran.
- **Third-party filter actions aren't worth their pin and review cost here.** `dorny/paths-filter` reads the pull request's files from the REST API, which is no more correct than the current `git diff` for this question. `tj-actions/changed-files` had its tags rewritten to a secret-stealing commit in March 2025 (CVE-2025-30066).
- **An aggregator job is the only alternative with a real advantage**, and only if two things matter: making "Storybook stories render" required, and closing an undocumented gap where a run cancelled while `changes` is running might report the skipped jobs as passing. Write it with `needs.*.result` and `if: always()`, not `re-actors/alls-green`. It needs a ruleset edit that only the founder can make.
- **The Postgres service can be skipped after all**, which the dependency policy says it can't: GitHub documents that an empty `image:` string stops a service from starting, and `needs` is available there. It saves about 17 seconds per docs-only run, and the action-pins check would reject the expression form, so it isn't worth doing now.
- **The diff method is otherwise sound.** The merge commit's first parent was the base tip on #190; a conflicting pull request doesn't run at all (fails closed); a re-run reuses the same merge commit; a push to `master` and any future `merge_group` event always run everything (fails closed).

## 1. How required status checks treat each case

| Case | What GitHub does | Effect on this repo |
| --- | --- | --- |
| Job skipped by a job-level `if:` | "A job that is skipped will report its status as 'Success'. It will not prevent a pull request from merging, even if it is a required check." ([control jobs with conditions](https://docs.github.com/en/actions/how-tos/write-workflows/choose-when-workflows-run/control-jobs-with-conditions); same note in [status checks](https://docs.github.com/en/pull-requests/reference/status-checks)). The troubleshooting page lists "Successful check statuses are `success`, `skipped`, and `neutral`." ([troubleshooting required status checks](https://docs.github.com/en/pull-requests/how-tos/merge-and-close-pull-requests/troubleshooting-required-status-checks)) | `e2e` skipped on a docs-only pull request satisfies "Web end-to-end tests". |
| Workflow never triggered by `paths`, `paths-ignore`, branch filters, or `[skip ci]` | "checks associated with that workflow will remain in a 'Pending' state. A pull request that requires those checks to be successful will be blocked from merging." ([workflow syntax, paths](https://docs.github.com/en/actions/reference/workflows-and-actions/workflow-syntax#onpushpull_requestpull_request_targetpathspaths-ignore); [skipping workflow runs](https://docs.github.com/en/actions/how-tos/manage-workflow-runs/skip-workflow-runs)). The fix column says "Avoid requiring workflows that can be skipped." ([troubleshooting](https://docs.github.com/en/pull-requests/how-tos/merge-and-close-pull-requests/troubleshooting-required-status-checks)) | Why the workflow can't use `paths-ignore`. A `[skip ci]` head commit fails closed (blocked), not open. |
| Job with a matrix | "The `jobs.<job_id>.if` condition is evaluated before `jobs.<job_id>.strategy.matrix` is applied." ([workflow syntax, if](https://docs.github.com/en/actions/reference/workflows-and-actions/workflow-syntax#jobsjob_idif)). "Required status checks do not take workflow, matrix, or event trigger types into account." ([troubleshooting rules](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-rulesets/troubleshooting-rules#troubleshooting-required-status-checks)) | So a matrix job skipped by `if:` produces one skipped check, not one per leg. The docs don't say what name that check gets, so a required per-leg name such as `build (18)` may never be reported. No job here uses a matrix. |
| Skipped job that `needs` a failed job | "If a job fails or is skipped, all jobs that need it are skipped unless the jobs use a conditional expression that causes the job to continue." ([workflow syntax, needs](https://docs.github.com/en/actions/reference/workflows-and-actions/workflow-syntax#jobsjob_idneeds)). Troubleshooting: "The dependent job is skipped and may not block merging … Use `always()` with `needs` for required checks that depend on other jobs." ([troubleshooting](https://docs.github.com/en/pull-requests/how-tos/merge-and-close-pull-requests/troubleshooting-required-status-checks)) | This is the fail-open the current `if: ${{ !cancelled() }}` avoids: if `changes` fails, `check` and `e2e` still run, and the empty output isn't `'true'`, so they run in full. |

Two more rules matter:

- **Names, not workflows.** A ruleset matches a check by its job name ("Workflow: The name format is `<job name>`") and ignores which workflow produced it ([troubleshooting rules](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-rulesets/troubleshooting-rules#troubleshooting-required-status-checks)). The ruleset's `integration_id` 15368 limits the source to GitHub Actions, not to `ci.yml`. Any future workflow with a skipped job named "Typecheck, lint and unit tests" would satisfy the requirement.
- **Latest commit only.** "Required checks must pass on the latest commit SHA. Checks from earlier commits don't satisfy the requirement." ([troubleshooting](https://docs.github.com/en/pull-requests/how-tos/merge-and-close-pull-requests/troubleshooting-required-status-checks)). Runs cancelled by the workflow's `concurrency` group belong to superseded commits, so they don't matter.

## 2. Nothing native in rulesets makes `paths-ignore` safe

- **Required status checks** take only `required_status_checks` (context and optional `integration_id`), `strict_required_status_checks_policy`, and `do_not_enforce_on_create`; there is no per-path or "skip if not run" option ([REST rules](https://docs.github.com/en/rest/repos/rules); [available rules](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-rulesets/available-rules-for-rulesets#require-status-checks-to-pass-before-merging)). The ruleset read on 2026-10-22 has exactly these fields.
- **"Require workflows to pass before merging"** exists but is set "at the organization or enterprise level", and organization rulesets are for "organizations on the GitHub Enterprise plan" ([GHEC available rules](https://docs.github.com/en/enterprise-cloud@latest/repositories/configuring-branches-and-merges-in-your-repository/managing-rulesets/available-rules-for-rulesets#require-workflows-to-pass-before-merging); [about rulesets](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-rulesets/about-rulesets)). It also wouldn't help: "Any filters you specify for the supported events are ignored - for example, `branches`, `branches-ignore`, `paths`, `types` and so on." The workflow "is always triggered".
- **Merge queue** needs the `merge_group` event; without it "status checks will not be triggered … The merge will fail as the required status check will not be reported" ([managing a merge queue](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/configuring-pull-request-merges/managing-a-merge-queue)). It adds a second run per pull request, so it costs more, not less.
- **Push-rule path exceptions** (public preview, 2026-08-25) apply to push rules, not status checks ([changelog](https://github.blog/changelog/2026-08-25-push-rules-in-rulesets-now-support-path-exceptions/)). A search of the GitHub changelog found no entry changing how path-filtered workflows meet required checks.

## 3. Alternatives

### Workflow `paths-ignore` plus a companion "always passes" workflow

- **History.** GitHub added "Add how to troubleshoot skipped but required checks" on 2021-11-29 ([github/docs 4364076](https://github.com/github/docs/commit/4364076e0fb56c2579ae90cd048939eaa2c18954)), which said "You can fix this by creating a generic workflow, with the same name, that will return true in any case", using the opposite path filter. The text was still there on 2023-06-26 ([a8a6e45](https://github.com/github/docs/blob/a8a6e4554a5ac974417dd45dadb9972902a6f35c/content/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches/troubleshooting-required-status-checks.md)) and gone on 2023-07-11 ([bde1cc4](https://github.com/github/docs/commit/bde1cc4f37b0a83cfafb8029cbc4d3cab0907d03)). From then until a restructure on 2026-07-21 the page carried a reusable that says "You should not use path or branch filtering to skip workflow runs if the workflow is required to pass before merging." The current page says "Avoid requiring workflows that can be skipped."
- **Pitfalls.** The two filters must stay exact opposites by hand. A pull request touching both docs and code starts both workflows, so a passing companion check and a failing real check share one name; the troubleshooting page says that when a check and a commit status share a name "both must pass", but it doesn't say how two check runs with one name are resolved. The companion also writes a "Success" for a check whose tests never ran, with no record of why. Not recommended.

### `dorny/paths-filter`

- Latest release v4.0.3 (2026-08-05, tag commit `ceb8a2b8f2d89434be7ff52d3de7ec3738c5cc9d`). For `pull_request` with a token it calls `pulls.listFiles` 100 at a time ([src/main.ts](https://github.com/dorny/paths-filter/blob/v4.0.3/src/main.ts)); for `merge_group` it diffs `base_sha` and `head_sha`. It is a Node 24 action shipped as a bundled `dist/index.js`, so the pin review would have to cover built code.
- It answers the same question the current shell step answers, with the same API data GitHub uses, and the jobs would still need job-level `if:` for the required checks. It adds a reviewed pin for no gain in correctness. Not recommended.

### `tj-actions/changed-files`

- GitHub advisory [GHSA-mrrh-fwg8-r2c3](https://github.com/advisories/GHSA-mrrh-fwg8-r2c3) (CVE-2025-30066, published 2025-03-15): "Attackers retroactively modified multiple version tags to reference a malicious commit, exposing CI/CD secrets in workflow logs", between March 14 and 15, 2025, in public logs. SHA pinning would have protected a repository that pinned a good commit, but the incident is a reason not to add the dependency at all. Not recommended.

### The pull request files API

- `GET /repos/{owner}/{repo}/pulls/{pull_number}/files` returns "a maximum of 3000 files" ([REST pulls](https://docs.github.com/en/rest/pulls/pulls#list-pull-requests-files)). Workflow path filters have a related limit: if the diff has more than 3,000 files and the matching ones aren't in the first 3,000, "the workflow will **not** run" ([workflow syntax](https://docs.github.com/en/actions/reference/workflows-and-actions/workflow-syntax#git-diff-comparisons)). Using `gh api` in the `changes` job would avoid the checkout but needs `pull-requests: read`, pagination, and a fallback for over 3,000 files. The local `git diff` has none of these limits. Not recommended.

### A single aggregator job as the only required check

- **How it works.** One job `needs` every other job, runs with `if: always()`, and fails unless each result is acceptable. The `needs` context gives `needs.<job_id>.result`: "`success`, `failure`, `cancelled`, or `skipped`" ([contexts](https://docs.github.com/en/actions/reference/workflows-and-actions/contexts#needs-context)). It must use `always()`, not the generally recommended `!cancelled()` ([expressions](https://docs.github.com/en/actions/reference/workflows-and-actions/expressions#always)): with `!cancelled()` a cancelled run would skip the aggregator, and a skipped job passes.
- **`re-actors/alls-green`** (v1.3.0, 2026-08-22) is a composite action that runs a Python module over `toJSON(needs)` with `allowed-failures` and `allowed-skips` lists ([action.yml](https://github.com/re-actors/alls-green/blob/v1.3.0/action.yml)). Ten lines of shell over `needs.*.result` do the same with no new pin.
- **Ruleset change.** Replace the two required contexts with one, for example "CI result". GitHub's troubleshooting page says "A required status check must have completed successfully in the chosen repository during the past seven days", so the job has to run once before it can be picked in the settings.
- **What it gains.** "Storybook stories render" becomes required without listing it; the ruleset no longer has to change when jobs are added or renamed; and a cancelled job fails the aggregator instead of possibly reporting a skip. **What it costs.** One more job (a few seconds on a free runner), a founder edit to the ruleset, and three jobs whose individual checks are no longer required on their own.

### Skipping the Postgres service on docs-only runs

- "If `jobs.<job_id>.services.<service_id>.image` is assigned an empty string, the service will not start. You can use this to set up conditional services" ([workflow syntax, services image](https://docs.github.com/en/actions/reference/workflows-and-actions/workflow-syntax#jobsjob_idservicesservice_idimage)), and `jobs.<job_id>.services` can read the `needs` context ([contexts availability](https://docs.github.com/en/actions/reference/workflows-and-actions/contexts#context-availability)). So `image: ${{ needs.changes.outputs.docs-only != 'true' && 'postgres:17.11-alpine@sha256:…' || '' }}` would work.
- On the latest `master` run, "Initialize containers" took 17 seconds. `tools/action-pins/check-action-pins.mjs` requires each `image:` value to match `^name:tag@sha256:<digest>$`, so the expression would fail the pin check until the checker learns that form. The saving doesn't justify the checker change now. `docs/architecture/dependency-policy.md` says "a service can't be skipped by a step condition", which is true, but it can be skipped this way.

## 4. Is the diff method correct?

- **First parent is the base.** For `pull_request`, `GITHUB_SHA` is "the SHA of the merge commit on the merge branch" and `GITHUB_REF` is `refs/pull/N/merge` ([events, how the merge branch affects your workflow](https://docs.github.com/en/actions/reference/workflows-and-actions/events-that-trigger-workflows#how-the-merge-branch-affects-your-workflow)). GitHub's REST docs call it a "test merge commit" but don't state its parent order ([REST pulls, get a pull request](https://docs.github.com/en/rest/pulls/pulls#get-a-pull-request)). On #190 the API returned `merge_commit_sha` `9dd1cec…` with parents `[d95569b…, 1864c54…]`, which are `base.sha` and `head.sha` in that order. So `HEAD^1..HEAD` is "what this pull request changes on top of the current base", the same set GitHub's own path filter targets with its three-dot diff ([workflow syntax](https://docs.github.com/en/actions/reference/workflows-and-actions/workflow-syntax#git-diff-comparisons)).
- **The checkout is pinned to that commit.** `actions/checkout` at the pinned `3d3c42e5…` sets the commit to `github.context.sha` and fetches `+<commit>:refs/remotes/pull/N/merge` ([input-helper.ts](https://github.com/actions/checkout/blob/3d3c42e5aac5ba805825da76410c181273ba90b1/src/input-helper.ts), [ref-helper.ts](https://github.com/actions/checkout/blob/3d3c42e5aac5ba805825da76410c181273ba90b1/src/ref-helper.ts)). `fetch-depth: 2` brings in both parents.
- **Conflicts.** "Workflows will not run on `pull_request` activity if the pull request has a merge conflict" ([events, pull_request](https://docs.github.com/en/actions/reference/workflows-and-actions/events-that-trigger-workflows#pull_request)). The required checks then stay unreported on the new head, so this fails closed.
- **Activity types.** By default a `pull_request` workflow runs only on `opened`, `synchronize`, and `reopened` (same source). A base branch that moves on doesn't start a run, and with the non-strict policy the old classification stands, which is fine because the pull request's own changes haven't changed.
- **Renames (fail-open).** Git's `diff.renames` "Defaults to true" for porcelain commands like `git diff` ([git-config](https://git-scm.com/docs/git-config#Documentation/git-config.txt-diffrenames)), and `--no-renames` turns it off ([git-diff](https://git-scm.com/docs/git-diff#Documentation/git-diff.txt---no-renames)). In a test repository, moving a 50-line `apps/x.ts` to `docs/x.md` gave `docs/x.md` alone by default, and `apps/x.ts` plus `docs/x.md` with `--no-renames`. The runner image has Git 2.55.0 ([Ubuntu 24.04 readme](https://github.com/actions/runner-images/blob/main/images/ubuntu/Ubuntu2404-Readme.md)).
- **Odd file names fail closed.** Git quotes unusual paths, so a quoted name ends in `.md"`, misses the `\.md$` test, and the run goes in full.

## 5. Other risks

- **`changes` fails or times out.** Covered: `!cancelled()` lets the other jobs run, and an empty output isn't `'true'`.
- **Manual cancel while `changes` runs (open question).** GitHub's cancellation steps re-evaluate `if` only "for all currently running jobs" ([workflow cancellation](https://docs.github.com/en/actions/reference/workflows-and-actions/workflow-cancellation)). The docs don't say whether jobs that haven't started yet end as `cancelled` or as `skipped`. If they end as `skipped`, a person with write access who cancels the latest run early would leave both required checks passing with no tests run. Concurrency cancellations only hit superseded commits, so they don't matter. To settle the question, open a throwaway pull request, cancel the run while "Detect docs-only changes" is running, and read the conclusions with `gh api repos/weareit-app/weareit/actions/runs/<id>/jobs`.
- **Re-runs.** A re-run uses "the same `GITHUB_SHA` (commit SHA) and `GITHUB_REF`" ([re-running workflows](https://docs.github.com/en/actions/how-tos/manage-workflow-runs/re-run-workflows-and-jobs)), so it checks out the same merge commit and classifies the same way.
- **Merge queue.** If `merge_group` is ever added, the `changes` job's `github.event_name == 'pull_request'` guard makes every merge group run in full. That fails closed. A docs-only fast path for merge groups would need `git diff` between `github.event.merge_group.base_sha` and `head_sha` ([events, merge_group](https://docs.github.com/en/actions/reference/workflows-and-actions/events-that-trigger-workflows#merge_group)).
- **Name collisions.** Any other workflow job named "Typecheck, lint and unit tests" or "Web end-to-end tests" can satisfy the ruleset (section 1). Keep these names unique.

## Recommendation

Keep the current approach: a `changes` job with no third-party action, and job-level `if:` so skipped required jobs report success. One change was needed, to close the rename gap. It landed in #190 (commit f57b7ec), with a slightly different comment:

```diff
--- a/.github/workflows/ci.yml
+++ b/.github/workflows/ci.yml
@@ jobs.changes.steps (classify)
           docs_only=false
           if [ "$GITHUB_EVENT_NAME" = pull_request ]; then
-            changed=$(git diff --name-only HEAD^1 HEAD)
+            # --no-renames lists both sides of a rename, so moving code into a
+            # Markdown file isn't counted as docs-only.
+            changed=$(git diff --name-only --no-renames HEAD^1 HEAD)
             printf 'Changed files:\n%s\n' "$changed"
```

Then run the cancellation test in section 5. If the not-yet-started jobs end as `skipped`, or if the founder wants "Storybook stories render" to be required, add an aggregator job and point the ruleset at it instead of the two current checks:

```diff
--- a/.github/workflows/ci.yml
+++ b/.github/workflows/ci.yml
@@ end of jobs
+  # The one required check. Runs even when the run is cancelled (`always()`), so a
+  # cancelled or failed job fails it rather than leaving a skipped, passing check.
+  result:
+    name: CI result
+    needs: [changes, check, e2e, stories]
+    if: ${{ always() }}
+    runs-on: ubuntu-latest
+    timeout-minutes: 5
+    steps:
+      - env:
+          DOCS_ONLY: ${{ needs.changes.outputs.docs-only }}
+          CHECK: ${{ needs.check.result }}
+          E2E: ${{ needs.e2e.result }}
+          STORIES: ${{ needs.stories.result }}
+        run: |
+          echo "check=$CHECK e2e=$E2E stories=$STORIES docs-only=$DOCS_ONLY"
+          [ "$CHECK" = success ] || exit 1
+          for r in "$E2E" "$STORIES"; do
+            [ "$r" = success ] && continue
+            [ "$r" = skipped ] && [ "$DOCS_ONLY" = true ] && continue
+            exit 1
+          done
```

The matching ruleset edit, which only the founder can make, replaces both entries in `required_status_checks` with `{"context": "CI result", "integration_id": 15368}`, after the job has run once.

Don't switch to workflow-level `paths-ignore` with a companion workflow, `dorny/paths-filter`, `tj-actions/changed-files`, or `re-actors/alls-green`. Leave the Postgres service as it is unless the pin checker gains support for a conditional image for another reason.

## Gaps & Open Questions

- What conclusion GitHub gives jobs that haven't started when a run is cancelled (section 5). Undocumented; needs one test run.
- The name a matrix job's check gets when the job is skipped by `if:`. Undocumented; doesn't affect this repo.
- How a ruleset resolves two check runs with the same name from two workflows on one commit. Only the check-versus-commit-status case is documented.
- The merge commit's parent order is confirmed on one pull request, not in GitHub's docs.

## Sources

All checked 2026-10-22.

- GitHub Docs, Troubleshooting required status checks: https://docs.github.com/en/pull-requests/how-tos/merge-and-close-pull-requests/troubleshooting-required-status-checks
- GitHub Docs, Status checks: https://docs.github.com/en/pull-requests/reference/status-checks
- GitHub Docs, Using conditions to control job execution: https://docs.github.com/en/actions/how-tos/write-workflows/choose-when-workflows-run/control-jobs-with-conditions
- GitHub Docs, Workflow syntax (paths, Git diff comparisons, `if`, `needs`, services image): https://docs.github.com/en/actions/reference/workflows-and-actions/workflow-syntax
- GitHub Docs, Skipping workflow runs: https://docs.github.com/en/actions/how-tos/manage-workflow-runs/skip-workflow-runs
- GitHub Docs, Events that trigger workflows (`pull_request`, `merge_group`, merge branch): https://docs.github.com/en/actions/reference/workflows-and-actions/events-that-trigger-workflows
- GitHub Docs, Contexts reference (`needs`, context availability): https://docs.github.com/en/actions/reference/workflows-and-actions/contexts
- GitHub Docs, Expressions (`always`, `cancelled`): https://docs.github.com/en/actions/reference/workflows-and-actions/expressions
- GitHub Docs, Workflow cancellation reference: https://docs.github.com/en/actions/reference/workflows-and-actions/workflow-cancellation
- GitHub Docs, Re-running workflows and jobs: https://docs.github.com/en/actions/how-tos/manage-workflow-runs/re-run-workflows-and-jobs
- GitHub Docs, Available rules for rulesets: https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-rulesets/available-rules-for-rulesets ; Enterprise Cloud version (require workflows): https://docs.github.com/en/enterprise-cloud@latest/repositories/configuring-branches-and-merges-in-your-repository/managing-rulesets/available-rules-for-rulesets
- GitHub Docs, Troubleshooting rules: https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-rulesets/troubleshooting-rules
- GitHub Docs, About rulesets: https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-rulesets/about-rulesets
- GitHub Docs, REST API rules for repositories: https://docs.github.com/en/rest/repos/rules
- GitHub Docs, REST API pull requests (get a pull request, list files): https://docs.github.com/en/rest/pulls/pulls
- GitHub Docs, Managing a merge queue: https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/configuring-pull-request-merges/managing-a-merge-queue
- GitHub Changelog, Push rules in rulesets now support path exceptions (2026-08-25): https://github.blog/changelog/2026-08-25-push-rules-in-rulesets-now-support-path-exceptions/
- github/docs history: workaround added in https://github.com/github/docs/commit/4364076e0fb56c2579ae90cd048939eaa2c18954 ; present at https://github.com/github/docs/blob/a8a6e4554a5ac974417dd45dadb9972902a6f35c/content/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches/troubleshooting-required-status-checks.md ; removed in https://github.com/github/docs/commit/bde1cc4f37b0a83cfafb8029cbc4d3cab0907d03
- actions/checkout source at the pinned commit: https://github.com/actions/checkout/blob/3d3c42e5aac5ba805825da76410c181273ba90b1/src/ref-helper.ts and https://github.com/actions/checkout/blob/3d3c42e5aac5ba805825da76410c181273ba90b1/src/input-helper.ts
- dorny/paths-filter v4.0.3 source: https://github.com/dorny/paths-filter/blob/v4.0.3/src/main.ts
- re-actors/alls-green action: https://github.com/re-actors/alls-green/blob/v1.3.0/action.yml
- GitHub Advisory GHSA-mrrh-fwg8-r2c3 (CVE-2025-30066): https://github.com/advisories/GHSA-mrrh-fwg8-r2c3
- Git docs, git-config `diff.renames`: https://git-scm.com/docs/git-config ; git-diff `--no-renames`: https://git-scm.com/docs/git-diff
- actions/runner-images, Ubuntu 24.04 readme (Git version): https://github.com/actions/runner-images/blob/main/images/ubuntu/Ubuntu2404-Readme.md
- Repository data: `gh api repos/weareit-app/weareit/rulesets/25500174`; `gh api repos/weareit-app/weareit/pulls/190` and `commits/9dd1cec24dd52677340e64e820933c587c6f234c` (merge commit parents); job step timings of the latest `master` CI run.
