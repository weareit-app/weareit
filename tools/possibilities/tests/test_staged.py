"""Staged (schemaVersion 2) runs: dreams as end states, screened, then reviewed before any fix."""

import json
import shutil
import subprocess
import sys
import unittest

from test_cards import ROOT, SCRIPT, Base, cards, exemplar


def cli(root, *args):
    return subprocess.run(
        [sys.executable, str(SCRIPT), *args, "--root", str(root)],
        capture_output=True,
        text=True,
    )


TITLES = (
    "Evenings that end at six",
    "A boss who protects my weekends",
    "Coworkers who cover for each other",
    "A workload I can finish",
    "A union that bargains for staffing",
    "A city that counts overtime",
)


def dreams_doc(pain="burnout", count=len(TITLES)):
    """Drafted dreams: a title, a line, and provenance each. Dreams carry no lens, ambition, or examples (2026-10-20)."""
    dreams = {}
    for i, title in enumerate(TITLES[:count]):
        dreams["%s-d%02d" % (pain, i)] = {
            "title": title,
            "line": "I stop work while there is still light outside.",
            "provenance": {
                "sourceId": "generator-run-x",
                "locator": "dreams.json#%s-d%02d" % (pain, i),
                "evidenceType": "ai_generated_from_exemplars",
                "rights": "CC-BY-SA-4.0",
                "reviewStatus": "unreviewed",
            },
        }
    return {
        "schemaVersion": 2,
        "painId": pain,
        "dreams": dreams,
        "overlaps": [
            {
                "a": pain + "-d00",
                "b": pain + "-d03",
                "reason": "Both are about leaving on time.",
            }
        ],
    }


def dream_screen_doc(failing=None, doc=None, pain="burnout"):
    """The dream screen's verdict on every dream in `doc` (default dreams_doc()): failing maps a dream ID to the check it fails."""
    failing, doc = failing or {}, doc or dreams_doc(pain)
    results = {}
    for key, d in doc["dreams"].items():
        result = {
            "title": d["title"],
            "line": d["line"],
            "pass": key not in failing,
            "reason": "An end state for this pain that fits no other.",
        }
        if key in failing:
            result.update(
                check=failing[key], reason="Wanted so I can rest, so it is a means."
            )
        results[key] = result
    return {
        "schemaVersion": 2,
        "painId": pain,
        "judge": {"context": "isolated", "at": "2026-10-20"},
        "results": results,
    }


class StagedBase(Base):
    def write_examples(self, run, n=12):
        cards.write(
            run / "exemplars.json",
            {
                "schemaVersion": 1,
                "painId": "burnout",
                "exemplars": {"ex-%d" % i: exemplar(i) for i in range(n)},
            },
        )

    def write_dreams(self, run, change=None, screen=True):
        """dreams.json, and (unless screen=False) a passing dream screen of the drafted wording."""
        doc = dreams_doc()
        if change:
            change(doc)
        cards.write(run / "dreams.json", doc)
        if screen:
            drafted = {
                "dreams": {
                    k: dict(d, **(d.get("review") or {}).get("original", {}))
                    for k, d in doc["dreams"].items()
                }
            }
            cards.write(run / "dream-screen.json", dream_screen_doc(doc=drafted))

    def new_staged(self, pain="burnout"):
        result = cli(self.tmp, "new-run", pain, "--staged")
        self.assertEqual(result.returncode, 0, result.stderr)
        return self.tmp / json.loads(result.stdout)["run"]

    def status(self, run):
        result = cli(self.tmp, "status", str(run))
        self.assertEqual(result.returncode, 0, result.stderr)
        return json.loads(result.stdout)


class PilotRuns(StagedBase):
    """--pilot marks a staged run as a pilot run, so the trial kinds join it without editing run.json."""

    def plan_kinds(self, run):
        result = cli(self.tmp, "start", str(run), "plan")
        self.assertEqual(result.returncode, 0, result.stderr)
        return json.loads(result.stdout)["kinds"]

    def reviewed(self, run):
        self.write_examples(run)
        self.write_dreams(
            run,
            lambda d: [
                x.update(review={"decision": "accept"}) for x in d["dreams"].values()
            ],
        )
        return run

    def test_pilot_option_marks_the_run_and_admits_the_trial_kinds(self):
        result = cli(self.tmp, "new-run", "burnout", "--staged", "--pilot")
        self.assertEqual(result.returncode, 0, result.stderr)
        run = self.tmp / json.loads(result.stdout)["run"]
        self.assertIs(cards.read(run / "run.json")["pilot"], True)
        self.assertTrue({"leave", "switch"} <= set(self.plan_kinds(self.reviewed(run))))

    def test_a_run_without_the_option_is_not_a_pilot_run(self):
        run = self.reviewed(self.new_staged())
        self.assertNotIn("pilot", cards.read(run / "run.json"))
        self.assertFalse({"leave", "switch"} & set(self.plan_kinds(run)))

    def test_pilot_needs_a_staged_run(self):
        result = cli(self.tmp, "new-run", "burnout", "--pilot")
        self.assertEqual(result.returncode, 2)
        self.assertIn("--staged", result.stderr)
        self.assertFalse((self.tmp / cards.DATA_ROOT / "runs/burnout").exists())


class Staged(StagedBase):
    def test_new_staged_run_starts_with_examples(self):
        run = self.new_staged()
        self.assertEqual(cards.read(run / "run.json")["schemaVersion"], 2)
        self.assertEqual(self.status(run)["next"], "examples")

    def test_status_follows_the_files_through_dream_review(self):
        run = self.new_staged()
        self.write_examples(run)
        self.assertEqual(self.status(run)["next"], "dreams")
        self.write_dreams(run, screen=False)
        self.assertEqual(self.status(run)["next"], "dream-screen")
        self.write_dreams(run)
        self.assertEqual(self.status(run)["next"], "dream-review")
        self.write_dreams(
            run,
            lambda d: [
                x.update(review={"decision": "accept"}) for x in d["dreams"].values()
            ],
        )
        self.assertEqual(self.status(run)["next"], "plan")

    def test_fix_stage_before_dream_review_is_a_usage_error(self):
        run = self.new_staged()
        self.write_examples(run)
        self.write_dreams(run)
        for stage in ("plan", "kind-pools", "assemble"):
            result = cli(self.tmp, "start", str(run), stage)
            self.assertEqual(result.returncode, 2, stage)
            self.assertIn("dream-review", result.stderr)

    def test_drafted_dreams_pass_validate_and_lint(self):
        run = self.new_staged()
        self.write_examples(run)
        self.write_dreams(run)
        for command in ("validate", "lint"):
            result = cli(self.tmp, command, str(run))
            self.assertEqual(result.returncode, 0, result.stdout + result.stderr)

    def issues(self, change):
        run = self.new_staged()
        self.write_examples(run)
        self.write_dreams(run, change)
        return " | ".join(cards.validate_run(run))

    def test_dream_with_a_lens_an_ambition_or_examples_fails(self):
        found = self.issues(
            lambda d: (
                d["dreams"]["burnout-d00"].update(lens="individual"),
                d["dreams"]["burnout-d01"].update(ambition="tonight"),
                d["dreams"]["burnout-d02"].update(exemplarRefs=["ex-0"]),
            )
        )
        self.assertIn("dream burnout-d00: a dream has no lens", found)
        self.assertIn("dream burnout-d01: a dream has no ambition", found)
        self.assertIn("dream burnout-d02: a dream has no exemplarRefs", found)

    def test_four_dreams_pass_validate_and_lint(self):
        run = self.new_staged()
        self.write_examples(run)
        cards.write(run / "dreams.json", dreams_doc(count=4))
        for command in ("validate", "lint"):
            result = cli(self.tmp, command, str(run))
            self.assertEqual(result.returncode, 0, result.stdout + result.stderr)

    def test_overlap_needs_a_reason_and_two_dreams(self):
        found = self.issues(
            lambda d: d["overlaps"].extend(
                [
                    {"a": "burnout-d01", "b": "burnout-d02", "reason": ""},
                    {"a": "burnout-d01", "b": "burnout-d99", "reason": "r"},
                ]
            )
        )
        self.assertIn("overlap burnout-d01/burnout-d02 needs a reason", found)
        self.assertIn("overlap must name two different dreams in this run", found)

    def test_recorded_review_keeps_the_original_beside_an_edit(self):
        def change(d):
            d["dreams"]["burnout-d00"]["review"] = {"decision": "edit"}
            d["dreams"]["burnout-d01"]["review"] = {"decision": "maybe"}

        found = self.issues(change)
        self.assertIn(
            "dream burnout-d00: an edit keeps the original title and line", found
        )
        self.assertIn("dream burnout-d01: unknown review decision", found)

    def test_dreams_file_belongs_to_the_staged_run(self):
        found = self.issues(lambda d: d.update(schemaVersion=1, painId="poor-sleep"))
        self.assertIn("dreams.json must have schemaVersion 2", found)
        self.assertIn("dreams.json painId must match run.json", found)

    def test_card_runs_have_no_stages(self):
        result = cli(self.tmp, "status", str(self.run))
        self.assertEqual(result.returncode, 2)
        self.assertIn("not a staged run", result.stderr)

    def lint_rules(self, change):
        run = self.new_staged()
        self.write_examples(run)
        self.write_dreams(run, change)
        return {i["rule"] for i in cards.lint_run(run, self.tmp)["issues"]}

    def test_word_level_dream_lint_is_retired(self):
        # A semantic rule needs a semantic check (founder, 2026-10-20): the dream screen judges means.
        title = "Telling my legislators I want limits on addictive app design"
        rules = self.lint_rules(
            lambda d: d["dreams"]["burnout-d00"].update(title=title)
        )
        self.assertNotIn("dream-not-outcome", rules)

    def test_dream_copy_follows_the_copy_guide(self):
        def change(d):
            d["dreams"]["burnout-d00"].update(line="I reach out to my neighbours!")
            d["dreams"]["burnout-d01"].update(
                line="I keep my mornings, evenings and weekends."
            )

        rules = self.lint_rules(change)
        self.assertTrue(
            {"generic-phrase", "regional-word", "exclamation", "serial-comma"} <= rules,
            rules,
        )

    def test_dreams_alone_have_no_coverage_check(self):
        # Coverage is counted on linked fixes (spec, "Coverage per pain"), so there is none before links exist.
        rules = self.lint_rules(None)
        self.assertFalse({"lens-coverage", "ambition-coverage"} & rules, rules)

    def test_dreams_start_only_after_examples_and_point_to_the_brief(self):
        run = self.new_staged()
        early = cli(self.tmp, "start", str(run), "dreams")
        self.assertEqual(early.returncode, 2)
        self.assertIn("examples", early.stderr)
        self.write_examples(run)
        ready = cli(self.tmp, "start", str(run), "dreams")
        self.assertEqual(ready.returncode, 0, ready.stderr)
        self.assertEqual(
            json.loads(ready.stdout)["brief"], "tools/possibilities/briefs/dreams.md"
        )


class DreamScreen(StagedBase):
    """An isolated judge applies the why test and the swap test to every dream before the founder's review."""

    def setUp(self):
        super().setUp()
        self.run_dir = self.new_staged()
        self.write_examples(self.run_dir)
        self.write_dreams(self.run_dir, screen=False)

    def screen(self, change=None, failing=None):
        doc = dream_screen_doc(failing)
        if change:
            change(doc)
        cards.write(self.run_dir / "dream-screen.json", doc)
        return " | ".join(cards.validate_run(self.run_dir))

    def test_screen_starts_after_dreams_and_points_to_its_brief(self):
        result = cli(self.tmp, "start", str(self.run_dir), "dream-screen")
        self.assertEqual(result.returncode, 0, result.stderr)
        self.assertEqual(
            json.loads(result.stdout)["brief"],
            "tools/possibilities/briefs/dream-screen.md",
        )

    def test_screen_start_names_the_related_pains_for_the_swap_test(self):
        result = cli(self.tmp, "start", str(self.run_dir), "dream-screen")
        related = {p["id"]: p for p in json.loads(result.stdout)["relatedPains"]}
        catalog = cards.pains(self.tmp)
        self.assertEqual(set(related), {"always-tired", "no-free-time"})
        self.assertEqual(
            related["always-tired"], {**catalog["always-tired"], "relation": "overlaps"}
        )

    def test_dream_review_cannot_start_until_the_screen_has_run(self):
        result = cli(self.tmp, "dreams-review-build", str(self.run_dir))
        self.assertEqual(result.returncode, 2)
        self.assertIn("next stage is dream-screen", result.stderr)

    def test_a_pass_or_a_fail_with_a_reason_for_every_dream_is_valid(self):
        self.assertEqual(
            self.screen(failing={"burnout-d00": "why", "burnout-d01": "swap"}), ""
        )
        self.assertEqual(cards.next_stage(self.run_dir), "dream-review")

    def test_every_verdict_needs_pass_and_a_one_sentence_reason(self):
        def change(doc):
            doc["results"]["burnout-d00"].update(reason="")
            doc["results"]["burnout-d01"].update(
                reason="Too high. It fits Always tired too."
            )
            doc["results"]["burnout-d02"].pop("pass")

        found = self.screen(change)
        for key in ("burnout-d00", "burnout-d01", "burnout-d02"):
            self.assertIn(
                "dream screen %s: needs pass and a one-sentence reason" % key, found
            )

    def test_a_fail_names_the_check_it_failed(self):
        found = self.screen(
            lambda d: d["results"]["burnout-d00"].update({"pass": False})
        )
        self.assertIn(
            "dream screen burnout-d00: a fail names its check (why or swap)", found
        )

    def test_a_pass_names_no_failed_check(self):
        found = self.screen(lambda d: d["results"]["burnout-d00"].update(check="why"))
        self.assertIn("dream screen burnout-d00: a pass names no failed check", found)

    def test_screen_judge_is_isolated(self):
        self.assertIn(
            "dream screen judge context must be isolated",
            self.screen(lambda d: d["judge"].update(context="shared")),
        )

    def test_an_unscreened_or_redrafted_dream_sends_the_run_back_to_the_screen(self):
        self.screen(lambda d: d["results"].pop("burnout-d04"))
        self.assertEqual(self.status(self.run_dir)["next"], "dream-screen")
        self.assertEqual(self.status(self.run_dir)["unscreened"], ["burnout-d04"])
        self.screen()
        self.write_dreams(
            self.run_dir,
            lambda d: d["dreams"]["burnout-d01"].update(line="A redrafted line."),
            screen=False,
        )
        self.assertEqual(self.status(self.run_dir)["unscreened"], ["burnout-d01"])
        # The dreams stage doesn't own the screen, so a stale screen is a pending stage, not a validation issue.
        self.assertEqual(cards.validate_run(self.run_dir), [])


class DreamReview(StagedBase):
    """The founder's dream review: a local page built from the run, and an ingested decisions export."""

    def setUp(self):
        super().setUp()
        template = "tools/possibilities/config/dream-review-page.template.html"
        shutil.copy(ROOT / template, self.tmp / template)
        self.run_dir = self.new_staged()
        self.write_examples(self.run_dir)
        self.write_dreams(
            self.run_dir,
            lambda d: d["dreams"]["burnout-d01"].update(
                writerNotes="private draft note"
            ),
        )

    def fail_screen(self, failing):
        cards.write(self.run_dir / "dream-screen.json", dream_screen_doc(failing))

    def build(self):
        result = cli(self.tmp, "dreams-review-build", str(self.run_dir))
        self.assertEqual(result.returncode, 0, result.stderr)
        return json.loads(result.stdout)

    def test_page_lists_each_dream_once_with_overlaps_beside_both(self):
        self.build()
        reviews = self.run_dir / "reviews"
        proposals = cards.read(reviews / "proposals.json")["proposals"]
        self.assertEqual([p["id"] for p in proposals], sorted(dreams_doc()["dreams"]))
        by_id = {p["id"]: p for p in proposals}
        self.assertEqual(
            by_id["burnout-d00"]["overlaps"],
            [
                {
                    "with": "burnout-d03",
                    "title": "A workload I can finish",
                    "reason": "Both are about leaving on time.",
                }
            ],
        )
        self.assertEqual(
            by_id["burnout-d03"]["overlaps"],
            [
                {
                    "with": "burnout-d00",
                    "title": "Evenings that end at six",
                    "reason": "Both are about leaving on time.",
                }
            ],
        )
        self.assertEqual(by_id["burnout-d02"]["overlaps"], [])
        page = (reviews / "review.html").read_text()
        self.assertIn("Coworkers who cover for each other", page)
        self.assertNotIn("/*__DATA__*/", page)
        for text in (page, (reviews / "proposals.json").read_text()):
            self.assertNotIn("private draft note", text)

    def test_failed_dreams_are_listed_last_with_the_screen_reason(self):
        self.fail_screen({"burnout-d01": "why", "burnout-d04": "swap"})
        self.build()
        proposals = cards.read(self.run_dir / "reviews/proposals.json")["proposals"]
        self.assertEqual(
            [p["id"] for p in proposals],
            [
                "burnout-d00",
                "burnout-d02",
                "burnout-d03",
                "burnout-d05",
                "burnout-d01",
                "burnout-d04",
            ],
        )
        failed = proposals[-1]["screen"]
        self.assertEqual(
            (failed["pass"], failed["check"], failed["reason"]),
            (False, "swap", "Wanted so I can rest, so it is a means."),
        )
        self.assertIs(proposals[0]["screen"]["pass"], True)
        self.assertFalse({"lens", "ambition", "examples"} & set(proposals[0]))

    def test_founder_can_accept_a_failed_dream_and_ingest_keeps_the_reason(self):
        self.fail_screen({"burnout-d04": "why"})
        result = self.ingest(self.export())
        self.assertEqual(result.returncode, 0, result.stderr)
        rescued = cards.read(self.run_dir / "dreams.json")["dreams"]["burnout-d04"]
        self.assertEqual(rescued["review"]["decision"], "accept")
        self.assertEqual(
            rescued["screen"],
            {
                "pass": False,
                "check": "why",
                "reason": "Wanted so I can rest, so it is a means.",
            },
        )
        self.assertIn("burnout-d04", cards.accepted_dreams(self.run_dir))
        self.assertEqual(cards.next_stage(self.run_dir), "plan")
        self.assertEqual(cli(self.tmp, "validate", str(self.run_dir)).returncode, 0)

    def export(self, change=None):
        """A decisions export as the page downloads it: d01 edited, d02 rejected, the rest accepted."""
        self.build()
        decisions = {
            key: {"decision": "accept", "note": "", "decidedAt": "2026-10-20T10:00:00Z"}
            for key in dreams_doc()["dreams"]
        }
        decisions["burnout-d01"] = {
            "decision": "edit",
            "note": "shorter",
            "decidedAt": "2026-10-20T10:01:00Z",
            "edit": {
                "title": "A boss who guards my weekends",
                "line": "My weekends stay mine.",
            },
        }
        decisions["burnout-d02"] = {
            "decision": "reject",
            "note": "too close to d00",
            "decidedAt": "2026-10-20T10:02:00Z",
        }
        doc = {
            "schemaVersion": 1,
            "setId": "burnout-" + self.run_dir.name,
            "exportedAt": "2026-10-20T10:03:00Z",
            "decisions": decisions,
        }
        if change:
            change(doc)
        path = self.tmp / "downloaded.json"
        cards.write(path, doc)
        return path

    def ingest(self, path):
        return cli(self.tmp, "dreams-ingest", str(self.run_dir), str(path))

    def test_ingest_records_every_decision_and_keeps_the_original_beside_an_edit(self):
        result = self.ingest(self.export())
        self.assertEqual(result.returncode, 0, result.stderr)
        self.assertEqual(
            json.loads(result.stdout)["decisions"],
            {"accept": 4, "edit": 1, "reject": 1},
        )
        dreams = cards.read(self.run_dir / "dreams.json")["dreams"]
        edited = dreams["burnout-d01"]
        self.assertEqual(
            (edited["title"], edited["line"]),
            ("A boss who guards my weekends", "My weekends stay mine."),
        )
        self.assertEqual(
            edited["review"]["original"],
            {
                "title": "A boss who protects my weekends",
                "line": "I stop work while there is still light outside.",
            },
        )
        self.assertEqual(edited["review"]["note"], "shorter")
        self.assertEqual(dreams["burnout-d02"]["review"]["decision"], "reject")
        self.assertEqual(
            {d["provenance"]["reviewStatus"] for d in dreams.values()}, {"reviewed"}
        )
        self.assertEqual(
            cards.read(self.run_dir / "reviews/dreams-decisions.json")["decisions"][
                "burnout-d02"
            ]["note"],
            "too close to d00",
        )
        self.assertEqual(self.status(self.run_dir)["next"], "plan")
        self.assertEqual(cli(self.tmp, "validate", str(self.run_dir)).returncode, 0)

    def test_later_stages_see_only_accepted_dreams_with_edits_applied(self):
        self.ingest(self.export())
        accepted = cards.accepted_dreams(self.run_dir)
        self.assertNotIn("burnout-d02", accepted)
        self.assertEqual(len(accepted), 5)
        self.assertEqual(accepted["burnout-d01"]["line"], "My weekends stay mine.")

    def test_accepted_dreams_wait_for_the_review(self):
        with self.assertRaisesRegex(ValueError, "dream-review"):
            cards.accepted_dreams(self.run_dir)

    def refused(self, change, message):
        result = self.ingest(self.export(change))
        self.assertEqual(result.returncode, 2, result.stdout)
        self.assertIn(message, result.stderr)
        self.assertNotIn(
            "review", cards.read(self.run_dir / "dreams.json")["dreams"]["burnout-d00"]
        )
        self.assertEqual(self.status(self.run_dir)["next"], "dream-review")

    def test_every_dream_needs_a_decision(self):
        self.refused(
            lambda d: d["decisions"].pop("burnout-d04"), "undecided: burnout-d04"
        )

    def test_decisions_must_match_this_run(self):
        self.refused(
            lambda d: d.update(setId="burnout-19990101-000000"),
            "decisions are for burnout-19990101-000000",
        )
        self.refused(
            lambda d: d["decisions"].update({"burnout-d99": {"decision": "accept"}}),
            "unknown dream burnout-d99",
        )

    def test_decision_must_be_known(self):
        self.refused(
            lambda d: d["decisions"]["burnout-d00"].update(decision="later"),
            "burnout-d00: unknown decision later",
        )

    def test_edit_needs_a_title_and_line(self):
        self.refused(
            lambda d: d["decisions"]["burnout-d01"]["edit"].update(line="  "),
            "burnout-d01: an edit needs a title and a line",
        )

    def test_malformed_export_is_a_usage_error(self):
        self.refused(
            lambda d: d.update(decisions=["burnout-d00"]),
            "decisions must be keyed by dream ID",
        )
        self.refused(
            lambda d: d["decisions"].update({"burnout-d00": "accept"}),
            "burnout-d00: unknown decision",
        )

    def test_decisions_on_a_stale_page_are_refused(self):
        path = self.export()
        self.write_dreams(
            self.run_dir,
            lambda d: d["dreams"]["burnout-d01"].update(line="A redrafted line."),
        )
        result = self.ingest(path)
        self.assertEqual(result.returncode, 2)
        self.assertIn(
            "dreams.json changed since the review page was built (burnout-d01)",
            result.stderr,
        )

    def test_ingest_refuses_once_the_screen_is_gone_or_stale(self):
        path = self.export()
        (self.run_dir / "dream-screen.json").unlink()
        result = self.ingest(path)
        self.assertEqual(result.returncode, 2, result.stdout)
        self.assertIn(
            "the dream screen of %s is missing or out of date" % self.run_dir.name,
            result.stderr,
        )

    def test_review_is_ingested_once(self):
        path = self.export()
        self.assertEqual(self.ingest(path).returncode, 0)
        again = self.ingest(path)
        self.assertEqual(again.returncode, 2)
        self.assertIn("already ingested", again.stderr)

    def test_page_is_built_only_while_the_review_is_pending(self):
        self.ingest(self.export())
        result = cli(self.tmp, "dreams-review-build", str(self.run_dir))
        self.assertEqual(result.returncode, 2)
        self.assertIn("next stage is plan", result.stderr)


if __name__ == "__main__":
    unittest.main()
