"""Staged (schemaVersion 2) runs: dreams drafted from the run's examples before any fix."""
import json
import subprocess
import sys
import unittest

from test_cards import SCRIPT, Base, cards, exemplar


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


class Staged(Base):
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

    def test_dream_examples_must_be_in_the_run(self):
        found = self.issues(lambda d: d['dreams']['burnout-d00'].update(exemplarRefs=['ex-missing']))
        self.assertIn('exemplarRefs must resolve', found)

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


if __name__ == '__main__':
    unittest.main()
