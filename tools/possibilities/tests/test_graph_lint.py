"""Lint for a staged run's graph: coverage across accepted dreams and linked fixes, and fix copy rules (#96)."""
import unittest

from test_cards import cards
from test_fix_stages import FixStages, fixes_doc, links_doc, plan_doc, screen_doc
from test_fix_stages import reviewed as reviewed_doc

TASK_TITLES = ('Move the work laptop out of the bedroom', 'Turn off work email on the phone at six',
               'Put a standing end time on the shared calendar', 'Leave the badge in the car on Fridays',
               'Ask for a fixed lunch hour in writing', 'Set the office lights to switch off at seven',
               'Hand off the late shift checklist before leaving', 'Book the weekly team meeting before noon',
               'Write the next day plan before shutting down', 'Return the spare office key to the front desk')


def distinct_titles(doc):
    for key, title in zip(sorted(doc['fixes']), TASK_TITLES):
        doc['fixes'][key]['title'] = title


class GraphLint(FixStages):
    """A full staged run through assembly: five accepted dreams, each linked to two Task fixes, and no Feature."""

    def setUp(self):
        super().setUp()
        self.write('plan.json', plan_doc())
        self.fixes = fixes_doc()
        distinct_titles(self.fixes)

    def lint(self, change=None):
        if change:
            change(self.fixes)
        self.write('fixes.json', self.fixes)
        self.write('screen.json', screen_doc())
        self.write('links.json', links_doc())
        return cards.lint_run(self.run_dir, self.tmp)['issues']

    def rules(self, change=None):
        return {i['rule'] for i in self.lint(change)}


class TemplateCopy(GraphLint):
    def test_job_story_in_a_fix_text_is_template_copy(self):
        text = "When I can't sleep, I want to see my sleep pattern, so I can talk to my doctor."
        issues = self.lint(lambda d: d['fixes']['burnout-d00-t1'].update(whatChanges=text))
        hits = [i for i in issues if i['rule'] == 'template-copy']
        self.assertEqual([i.get('fixId') for i in hits], ['burnout-d00-t1'], issues)

    def test_if_then_plans_in_titles_and_first_steps_are_template_copy(self):
        def change(doc):
            doc['fixes']['burnout-d00-t1']['title'] = 'After I close the laptop, I will walk around the block'
            doc['fixes']['burnout-d01-t1']['firstStep'] = 'If my boss emails after six, then I will answer in the morning.'
        hits = {i.get('fixId') for i in self.lint(change) if i['rule'] == 'template-copy'}
        self.assertEqual(hits, {'burnout-d00-t1', 'burnout-d01-t1'})

    def test_job_story_without_commas_and_once_plans_are_template_copy(self):
        def change(doc):
            doc['fixes']['burnout-d00-t1']['whatChanges'] = 'When I get home I want to rest so I can sleep.'
            doc['fixes']['burnout-d01-t1']['firstStep'] = 'Once I close the laptop, I will walk to the corner.'
        hits = {i.get('fixId') for i in self.lint(change) if i['rule'] == 'template-copy'}
        self.assertEqual(hits, {'burnout-d00-t1', 'burnout-d01-t1'})

    def test_plain_copy_that_opens_with_when_is_not_template_copy(self):
        text = 'When the alarm goes off, the laptop is already in the hall.'
        self.assertNotIn('template-copy', self.rules(lambda d: d['fixes']['burnout-d00-t1'].update(whatChanges=text)))


class NearDuplicateFix(GraphLint):
    def test_fixes_that_differ_only_in_word_order_are_flagged(self):
        def change(doc):
            doc['fixes']['burnout-d00-t1']['title'] = 'Charge the phone in the kitchen'
            doc['fixes']['burnout-d03-t2']['title'] = 'In the kitchen, charge the phone'
        hits = [i for i in self.lint(change) if i['rule'] == 'near-duplicate-fix']
        self.assertEqual(len(hits), 1, hits)
        self.assertEqual(hits[0]['fixId'], 'burnout-d00-t1')
        self.assertIn('burnout-d03-t2', hits[0]['detail'])

    def test_opposite_fixes_are_not_near_duplicates(self):
        def change(doc):
            doc['fixes']['burnout-d00-t1']['title'] = 'Turn on the phone alarm at six'
            doc['fixes']['burnout-d03-t2']['title'] = 'Turn off the phone alarm at six'
        self.assertNotIn('near-duplicate-fix', self.rules(change))

    def test_different_fixes_in_the_pool_are_not_flagged(self):
        self.assertNotIn('near-duplicate-fix', self.rules())


COVERAGE = {'lens-coverage', 'ambition-coverage', 'basics-coverage', 'it-led-coverage'}


def one_feature_three_habits(doc):
    doc['fixes']['burnout-d04-t1'].update(kind='feature', status='proposed_it_feature', origin='kind:feature')
    for key in ('burnout-d01-t1', 'burnout-d02-t1', 'burnout-d03-t1'):
        doc['fixes'][key].update(kind='habit', origin='kind:habit')


class Coverage(GraphLint):
    def test_one_feature_and_three_habits_meeting_every_other_check_has_no_coverage_issue(self):
        self.assertEqual(self.rules(one_feature_three_habits) & COVERAGE, set())

    def test_pain_with_no_feature_linked_to_any_dream_fails_it_led_coverage(self):
        issues = self.lint()
        self.assertIn('it-led-coverage', {i['rule'] for i in issues})
        self.assertFalse(cards.read(self.run_dir / 'lint.json')['passed'])

    def test_an_unlinked_feature_does_not_lead_a_dream(self):
        def unlinked_feature(doc):
            doc['fixes']['burnout-d04-t3'] = dict(doc['fixes']['burnout-d04-t1'], title='Show which evenings ran late',
                                                 kind='feature', status='proposed_it_feature', origin='kind:feature')
        self.assertIn('it-led-coverage', self.rules(unlinked_feature))

    def test_coverage_counts_accepted_dreams_only(self):
        def reject(doc):
            for key in ('burnout-d03', 'burnout-d04'):
                doc['dreams'][key]['review'] = {'decision': 'reject'}
        self.write_dreams(self.run_dir, lambda d: (reviewed_doc(d), reject(d)))
        self.assertIn('lens-coverage', self.rules())

    def test_basics_tonight_are_linked_fixes_on_tonight_dreams(self):
        def proposals(doc):
            for key in ('burnout-d00-t1', 'burnout-d00-t2', 'burnout-d03-t1'):
                doc['fixes'][key]['status'] = 'societal_proposal'
        self.assertIn('basics-coverage', self.rules(proposals))


    def test_links_to_screened_out_fixes_do_not_count(self):
        self.write('fixes.json', self.fixes, one_feature_three_habits)
        self.write('screen.json', screen_doc(failing=('burnout-d04-t1',)))
        self.write('links.json', links_doc())
        self.assertIn('it-led-coverage', {i['rule'] for i in cards.lint_run(self.run_dir, self.tmp)['issues']})

    def test_malformed_fixes_and_links_do_not_crash_lint(self):
        self.fixes['fixes']['burnout-d00-t9'] = 'not a record'
        self.write('fixes.json', self.fixes)
        self.write('screen.json', screen_doc())
        self.write('links.json', links_doc(), lambda d: d['links'].append({'fixId': ['x'], 'dreamId': ['burnout-d00']}))
        self.assertIn('it-led-coverage', {i['rule'] for i in cards.lint_run(self.run_dir, self.tmp)['issues']})


if __name__ == '__main__':
    unittest.main()
