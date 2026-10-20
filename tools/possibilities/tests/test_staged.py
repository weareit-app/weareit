"""Staged (schemaVersion 2) runs: dreams drafted from the run's examples before any fix."""
import json
import subprocess
import sys
import unittest

import shutil

from test_cards import ROOT, SCRIPT, Base, cards, exemplar


def cli(root, *args):
    return subprocess.run([sys.executable, str(SCRIPT), *args, '--root', str(root)], capture_output=True, text=True)


TITLES = ('Evenings that end at six', 'A boss who protects my weekends', 'Coworkers who cover for each other',
          'A workload I can finish', 'A union that bargains for staffing', 'A city that counts overtime')
LENS_CYCLE = ('individual', 'relational', 'community', 'market', 'policy', 'technology')
AMBITION_CYCLE = ('tonight', 'this-year', 'together')


def dreams_doc(pain='burnout'):
    dreams = {}
    for i, title in enumerate(TITLES):
        dreams['%s-d%02d' % (pain, i)] = {
            'title': title, 'line': 'I stop work while there is still light outside.',
            'lens': LENS_CYCLE[i], 'ambition': AMBITION_CYCLE[i % 3], 'exemplarRefs': ['ex-%d' % i],
            'provenance': {'sourceId': 'generator-run-x', 'locator': 'dreams.json#%s-d%02d' % (pain, i),
                           'evidenceType': 'ai_generated_from_exemplars', 'rights': 'CC-BY-SA-4.0',
                           'reviewStatus': 'unreviewed'},
        }
    return {'schemaVersion': 2, 'painId': pain, 'dreams': dreams,
            'overlaps': [{'a': pain + '-d00', 'b': pain + '-d03', 'reason': 'Both are about leaving on time.'}]}


class StagedBase(Base):
    def write_examples(self, run, n=12):
        cards.write(run / 'exemplars.json', {'schemaVersion': 1, 'painId': 'burnout',
                                             'exemplars': {'ex-%d' % i: exemplar(i) for i in range(n)}})

    def write_dreams(self, run, change=None):
        doc = dreams_doc()
        if change:
            change(doc)
        cards.write(run / 'dreams.json', doc)

    def new_staged(self, pain='burnout'):
        result = cli(self.tmp, 'new-run', pain, '--staged')
        self.assertEqual(result.returncode, 0, result.stderr)
        return self.tmp / json.loads(result.stdout)['run']

    def status(self, run):
        result = cli(self.tmp, 'status', str(run))
        self.assertEqual(result.returncode, 0, result.stderr)
        return json.loads(result.stdout)


class Staged(StagedBase):
    def test_new_staged_run_starts_with_examples(self):
        run = self.new_staged()
        self.assertEqual(cards.read(run / 'run.json')['schemaVersion'], 2)
        self.assertEqual(self.status(run)['next'], 'examples')

    def test_status_follows_the_files_through_dream_review(self):
        run = self.new_staged()
        self.write_examples(run)
        self.assertEqual(self.status(run)['next'], 'dreams')
        self.write_dreams(run)
        self.assertEqual(self.status(run)['next'], 'dream-review')
        self.write_dreams(run, lambda d: [x.update(review={'decision': 'accept'}) for x in d['dreams'].values()])
        self.assertEqual(self.status(run)['next'], 'plan')

    def test_fix_stage_before_dream_review_is_a_usage_error(self):
        run = self.new_staged()
        self.write_examples(run)
        self.write_dreams(run)
        for stage in ('plan', 'kind-pools', 'assemble'):
            result = cli(self.tmp, 'start', str(run), stage)
            self.assertEqual(result.returncode, 2, stage)
            self.assertIn('dream-review', result.stderr)

    def test_drafted_dreams_pass_validate_and_lint(self):
        run = self.new_staged()
        self.write_examples(run)
        self.write_dreams(run)
        for command in ('validate', 'lint'):
            result = cli(self.tmp, command, str(run))
            self.assertEqual(result.returncode, 0, result.stdout + result.stderr)

    def issues(self, change):
        run = self.new_staged()
        self.write_examples(run)
        self.write_dreams(run, change)
        return ' | '.join(cards.validate_run(run))

    def test_dream_needs_lens_and_ambition(self):
        found = self.issues(lambda d: d['dreams']['burnout-d00'].update(lens='vibes', ambition='someday'))
        self.assertIn('dream burnout-d00: unknown lens', found)
        self.assertIn('dream burnout-d00: unknown ambition', found)

    def test_overlap_needs_a_reason_and_two_dreams(self):
        found = self.issues(lambda d: d['overlaps'].extend([{'a': 'burnout-d01', 'b': 'burnout-d02', 'reason': ''},
                                                            {'a': 'burnout-d01', 'b': 'burnout-d99', 'reason': 'r'}]))
        self.assertIn('overlap burnout-d01/burnout-d02 needs a reason', found)
        self.assertIn('overlap must name two different dreams in this run', found)

    def test_recorded_review_keeps_the_original_beside_an_edit(self):
        def change(d):
            d['dreams']['burnout-d00']['review'] = {'decision': 'edit'}
            d['dreams']['burnout-d01']['review'] = {'decision': 'maybe'}
        found = self.issues(change)
        self.assertIn('dream burnout-d00: an edit keeps the original title and line', found)
        self.assertIn('dream burnout-d01: unknown review decision', found)

    def test_dream_examples_must_be_in_the_run(self):
        found = self.issues(lambda d: d['dreams']['burnout-d00'].update(exemplarRefs=['ex-missing']))
        self.assertIn('exemplarRefs must resolve', found)

    def test_dream_is_drafted_from_an_example(self):
        found = self.issues(lambda d: d['dreams']['burnout-d00'].update(exemplarRefs=[]))
        self.assertIn('dream burnout-d00: exemplarRefs must name at least one example', found)

    def test_dreams_file_belongs_to_the_staged_run(self):
        found = self.issues(lambda d: d.update(schemaVersion=1, painId='poor-sleep'))
        self.assertIn('dreams.json must have schemaVersion 2', found)
        self.assertIn('dreams.json painId must match run.json', found)

    def test_card_runs_have_no_stages(self):
        result = cli(self.tmp, 'status', str(self.run))
        self.assertEqual(result.returncode, 2)
        self.assertIn('not a staged run', result.stderr)

    def lint_rules(self, change):
        run = self.new_staged()
        self.write_examples(run)
        self.write_dreams(run, change)
        return {i['rule'] for i in cards.lint_run(run, self.tmp)['issues']}

    def test_dream_written_as_an_action_is_flagged(self):
        title = 'Telling my legislators I want limits on addictive app design'
        rules = self.lint_rules(lambda d: d['dreams']['burnout-d00'].update(title=title))
        self.assertIn('dream-not-outcome', rules)

    def test_dream_copy_follows_the_copy_guide(self):
        def change(d):
            d['dreams']['burnout-d00'].update(line='I reach out to my neighbours!')
            d['dreams']['burnout-d01'].update(line='I keep my mornings, evenings and weekends.')
        rules = self.lint_rules(change)
        self.assertTrue({'generic-phrase', 'regional-word', 'exclamation', 'serial-comma'} <= rules, rules)

    def test_dreams_cover_four_lenses_and_every_ambition(self):
        rules = self.lint_rules(lambda d: [x.update(lens='individual', ambition='tonight') for x in d['dreams'].values()])
        self.assertTrue({'lens-coverage', 'ambition-coverage'} <= rules, rules)

    def test_dreams_start_only_after_examples_and_point_to_the_brief(self):
        run = self.new_staged()
        early = cli(self.tmp, 'start', str(run), 'dreams')
        self.assertEqual(early.returncode, 2)
        self.assertIn('examples', early.stderr)
        self.write_examples(run)
        ready = cli(self.tmp, 'start', str(run), 'dreams')
        self.assertEqual(ready.returncode, 0, ready.stderr)
        self.assertEqual(json.loads(ready.stdout)['brief'], 'tools/possibilities/briefs/dreams.md')


class DreamReview(StagedBase):
    """The founder's dream review: a local page built from the run, and an ingested decisions export."""

    def setUp(self):
        super().setUp()
        template = 'tools/possibilities/config/dream-review-page.template.html'
        shutil.copy(ROOT / template, self.tmp / template)
        self.run_dir = self.new_staged()
        self.write_examples(self.run_dir)
        self.write_dreams(self.run_dir, lambda d: d['dreams']['burnout-d01'].update(writerNotes='private draft note'))

    def build(self):
        result = cli(self.tmp, 'dreams-review-build', str(self.run_dir))
        self.assertEqual(result.returncode, 0, result.stderr)
        return json.loads(result.stdout)

    def test_page_lists_each_dream_once_with_overlaps_beside_both(self):
        self.build()
        reviews = self.run_dir / 'reviews'
        proposals = cards.read(reviews / 'proposals.json')['proposals']
        self.assertEqual([p['id'] for p in proposals], sorted(dreams_doc()['dreams']))
        by_id = {p['id']: p for p in proposals}
        self.assertEqual(by_id['burnout-d00']['overlaps'],
                         [{'with': 'burnout-d03', 'title': 'A workload I can finish', 'reason': 'Both are about leaving on time.'}])
        self.assertEqual(by_id['burnout-d03']['overlaps'],
                         [{'with': 'burnout-d00', 'title': 'Evenings that end at six', 'reason': 'Both are about leaving on time.'}])
        self.assertEqual(by_id['burnout-d02']['overlaps'], [])
        page = (reviews / 'review.html').read_text()
        self.assertIn('Coworkers who cover for each other', page)
        self.assertNotIn('/*__DATA__*/', page)
        for text in (page, (reviews / 'proposals.json').read_text()):
            self.assertNotIn('private draft note', text)

    def export(self, change=None):
        """A decisions export as the page downloads it: d01 edited, d02 rejected, the rest accepted."""
        self.build()
        decisions = {key: {'decision': 'accept', 'note': '', 'decidedAt': '2026-10-20T10:00:00Z'} for key in dreams_doc()['dreams']}
        decisions['burnout-d01'] = {'decision': 'edit', 'note': 'shorter', 'decidedAt': '2026-10-20T10:01:00Z',
                                    'edit': {'title': 'A boss who guards my weekends', 'line': 'My weekends stay mine.'}}
        decisions['burnout-d02'] = {'decision': 'reject', 'note': 'too close to d00', 'decidedAt': '2026-10-20T10:02:00Z'}
        doc = {'schemaVersion': 1, 'setId': 'burnout-' + self.run_dir.name, 'exportedAt': '2026-10-20T10:03:00Z', 'decisions': decisions}
        if change:
            change(doc)
        path = self.tmp / 'downloaded.json'
        cards.write(path, doc)
        return path

    def ingest(self, path):
        return cli(self.tmp, 'dreams-ingest', str(self.run_dir), str(path))

    def test_ingest_records_every_decision_and_keeps_the_original_beside_an_edit(self):
        result = self.ingest(self.export())
        self.assertEqual(result.returncode, 0, result.stderr)
        self.assertEqual(json.loads(result.stdout)['decisions'], {'accept': 4, 'edit': 1, 'reject': 1})
        dreams = cards.read(self.run_dir / 'dreams.json')['dreams']
        edited = dreams['burnout-d01']
        self.assertEqual((edited['title'], edited['line']), ('A boss who guards my weekends', 'My weekends stay mine.'))
        self.assertEqual(edited['review']['original'], {'title': 'A boss who protects my weekends',
                                                        'line': 'I stop work while there is still light outside.'})
        self.assertEqual(edited['review']['note'], 'shorter')
        self.assertEqual(dreams['burnout-d02']['review']['decision'], 'reject')
        self.assertEqual({d['provenance']['reviewStatus'] for d in dreams.values()}, {'reviewed'})
        self.assertEqual(cards.read(self.run_dir / 'reviews/dreams-decisions.json')['decisions']['burnout-d02']['note'],
                         'too close to d00')
        self.assertEqual(self.status(self.run_dir)['next'], 'plan')
        self.assertEqual(cli(self.tmp, 'validate', str(self.run_dir)).returncode, 0)

    def test_later_stages_see_only_accepted_dreams_with_edits_applied(self):
        self.ingest(self.export())
        accepted = cards.accepted_dreams(self.run_dir)
        self.assertNotIn('burnout-d02', accepted)
        self.assertEqual(len(accepted), 5)
        self.assertEqual(accepted['burnout-d01']['line'], 'My weekends stay mine.')

    def test_accepted_dreams_wait_for_the_review(self):
        with self.assertRaisesRegex(ValueError, 'dream-review'):
            cards.accepted_dreams(self.run_dir)

    def refused(self, change, message):
        result = self.ingest(self.export(change))
        self.assertEqual(result.returncode, 2, result.stdout)
        self.assertIn(message, result.stderr)
        self.assertNotIn('review', cards.read(self.run_dir / 'dreams.json')['dreams']['burnout-d00'])
        self.assertEqual(self.status(self.run_dir)['next'], 'dream-review')

    def test_every_dream_needs_a_decision(self):
        self.refused(lambda d: d['decisions'].pop('burnout-d04'), 'undecided: burnout-d04')

    def test_decisions_must_match_this_run(self):
        self.refused(lambda d: d.update(setId='burnout-19990101-000000'), 'decisions are for burnout-19990101-000000')
        self.refused(lambda d: d['decisions'].update({'burnout-d99': {'decision': 'accept'}}), 'unknown dream burnout-d99')

    def test_decision_must_be_known(self):
        self.refused(lambda d: d['decisions']['burnout-d00'].update(decision='later'), 'burnout-d00: unknown decision later')

    def test_edit_needs_a_title_and_line(self):
        self.refused(lambda d: d['decisions']['burnout-d01']['edit'].update(line='  '), 'burnout-d01: an edit needs a title and a line')

    def test_malformed_export_is_a_usage_error(self):
        self.refused(lambda d: d.update(decisions=['burnout-d00']), 'decisions must be keyed by dream ID')
        self.refused(lambda d: d['decisions'].update({'burnout-d00': 'accept'}), 'burnout-d00: unknown decision')

    def test_decisions_on_a_stale_page_are_refused(self):
        path = self.export()
        self.write_dreams(self.run_dir, lambda d: d['dreams']['burnout-d01'].update(line='A redrafted line.'))
        result = self.ingest(path)
        self.assertEqual(result.returncode, 2)
        self.assertIn('dreams.json changed since the review page was built (burnout-d01)', result.stderr)

    def test_review_is_ingested_once(self):
        path = self.export()
        self.assertEqual(self.ingest(path).returncode, 0)
        again = self.ingest(path)
        self.assertEqual(again.returncode, 2)
        self.assertIn('already ingested', again.stderr)

    def test_page_is_built_only_while_the_review_is_pending(self):
        self.ingest(self.export())
        result = cli(self.tmp, 'dreams-review-build', str(self.run_dir))
        self.assertEqual(result.returncode, 2)
        self.assertIn('next stage is plan', result.stderr)


if __name__ == '__main__':
    unittest.main()
