"""Staged runs: the founder's fix review, one list in ranking order, and fixes-ingest with the final links (#92)."""
import json
import shutil
import unittest

from test_cards import ROOT, cards
from test_fix_stages import fixes_doc, link, links_doc, plan_doc, screen_doc
from test_judging import SHARED, Judging, dream_judgments, shared_three_ways
from test_shared_fixes import shared_fix
from test_staged import cli

UNLINKED = 'burnout-s1'  # passed the screen, but the assembler left it unlinked
SCREENED_OUT = 'burnout-s2'  # failed the screen: never on the review page
FULL = 'burnout-d01'  # the assembler gives it five fixes


def pool(doc):
    doc['fixes'][SHARED].update(writerNotes='private writer note')
    doc['fixes'][UNLINKED] = shared_fix(['burnout-d01', 'burnout-d02'], 9)
    doc['fixes'][UNLINKED]['ambition'] = 'tonight'  # a basic tonight once the founder links it
    doc['fixes'][SCREENED_OUT] = shared_fix(['burnout-d03', 'burnout-d04'], 10)
    doc['fixes'][SCREENED_OUT]['title'] = 'Promise to never check email again'


def screened(doc):
    passed = next(iter(doc['results'].values()))
    doc['results'][UNLINKED] = json.loads(json.dumps(passed))
    doc['results'][SCREENED_OUT] = {c: {'pass': c != 'actionable', 'reason': 'r'} for c in cards.SCREEN_CHECKS}


def assembled(doc):
    """burnout-d00-t1 serves three dreams, and burnout-d01 gets five fixes."""
    shared_three_ways(doc)
    doc['links'] += [link('burnout-d02-t1', FULL, 4), link('burnout-d02-t2', FULL, 5)]


class FixReview(Judging):
    def setUp(self):
        super().setUp()
        template = 'tools/possibilities/config/fix-review-page.template.html'
        shutil.copy(ROOT / template, self.tmp / template)
        self.write('fixes.json', fixes_doc(), pool)
        self.write('screen.json', screen_doc(), screened)
        self.write('links.json', links_doc(), assembled)
        self.write('judgments.json', dream_judgments(failing=('burnout-d00',)))
        cards.select(self.run_dir)

    def build(self):
        result = cli(self.tmp, 'fixes-review-build', str(self.run_dir))
        self.assertEqual(result.returncode, 0, result.stderr)
        return json.loads(result.stdout)

    def export(self, change=None):
        """A decisions export as the page downloads it: every fix accepted with the assembler's links."""
        self.build()
        proposals = cards.read(self.run_dir / 'reviews/fix-proposals.json')['proposals']
        decisions = {p['id']: {'decision': 'accept', 'note': '', 'decidedAt': '2026-10-20T11:00:00Z',
                               'links': [entry['dreamId'] for entry in p['links']]} for p in proposals}
        doc = {'schemaVersion': 1, 'setId': 'burnout-' + self.run_dir.name, 'exportedAt': '2026-10-20T11:30:00Z',
               'decisions': decisions}
        if change:
            change(doc['decisions'])
            if 'setId' in doc['decisions']:
                doc['setId'] = doc['decisions'].pop('setId')
        path = self.tmp / 'fixes-downloaded.json'
        cards.write(path, doc)
        return path

    def ingest(self, path):
        return cli(self.tmp, 'fixes-ingest', str(self.run_dir), str(path))

    def ingested(self, change=None):
        result = self.ingest(self.export(change))
        self.assertEqual(result.returncode, 0, result.stderr)
        return json.loads(result.stdout)

    def final_links(self, fix=None, dream=None):
        return [e for e in cards.read(self.run_dir / 'links.json')['links']
                if (fix is None or e['fixId'] == fix) and (dream is None or e['dreamId'] == dream)]


class Page(FixReview):
    def test_each_fix_appears_once_in_ranking_order_with_unlinked_fixes_last(self):
        self.build()
        proposals = cards.read(self.run_dir / 'reviews/fix-proposals.json')['proposals']
        ranked = cards.read(self.run_dir / 'ranking.json')['fixOrder']
        self.assertEqual([p['id'] for p in proposals], ranked + [UNLINKED])
        self.assertNotIn(SCREENED_OUT, [p['id'] for p in proposals])

    def test_a_fix_shows_its_kind_status_example_and_linked_dreams(self):
        self.build()
        shared = {p['id']: p for p in cards.read(self.run_dir / 'reviews/fix-proposals.json')['proposals']}[SHARED]
        self.assertEqual((shared['kind'], shared['kindLabel'], shared['statusLabel']), ('task', 'Task', 'Real now'))
        self.assertEqual(shared['example']['name'], 'Example 1 Cooperative')
        # Chips follow the ranking: burnout-d00 failed honest status, so it comes last.
        self.assertEqual([(e['dreamId'], e['by']) for e in shared['links']],
                         [('burnout-d01', 'assembler'), ('burnout-d02', 'assembler'), ('burnout-d00', 'assembler')])
        self.assertEqual(shared['method']['lever'], 'remove-hassle')

    def test_dreams_to_link_are_the_accepted_ones_in_ranking_order(self):
        self.build()
        dreams = cards.read(self.run_dir / 'reviews/fix-proposals.json')['dreams']
        self.assertEqual([d['id'] for d in dreams], [r['dreamId'] for r in cards.read(self.run_dir / 'ranking.json')['ranking']])
        self.assertNotIn('burnout-d05', [d['id'] for d in dreams])
        self.assertEqual({d['id']: d['honestStatus'] for d in dreams}['burnout-d00'], False)

    def test_page_holds_the_data_and_no_writer_notes(self):
        self.build()
        page = (self.run_dir / 'reviews/fix-review.html').read_text()
        self.assertIn('Move the work laptop out of the bedroom', page)
        self.assertNotIn('/*__DATA__*/', page)
        for text in (page, (self.run_dir / 'reviews/fix-proposals.json').read_text()):
            self.assertNotIn('private writer note', text)
            self.assertNotIn('Promise to never check email again', text)

    def test_page_announces_state_and_uses_no_motion(self):
        template = (ROOT / 'tools/possibilities/config/fix-review-page.template.html').read_text()
        for needed in ('aria-expanded', 'aria-controls', 'aria-live', 'aria-label="Remove link to'):
            self.assertIn(needed, template)
        for motion in ('transition', 'animation', '@keyframes', 'scroll-behavior: smooth'):
            self.assertNotIn(motion, template)

    def test_page_waits_for_the_ranking(self):
        (self.run_dir / 'ranking.json').unlink()
        result = cli(self.tmp, 'fixes-review-build', str(self.run_dir))
        self.assertEqual(result.returncode, 2)
        self.assertIn('next stage is judge', result.stderr)

    def test_page_refuses_a_ranking_older_than_the_links(self):
        ranking = cards.read(self.run_dir / 'ranking.json')
        ranking['fixOrder'].remove('burnout-d04-t2')
        self.write('ranking.json', ranking)
        result = cli(self.tmp, 'fixes-review-build', str(self.run_dir))
        self.assertEqual(result.returncode, 2)
        self.assertIn('ranking.json does not match links.json', result.stderr)


class Ingest(FixReview):
    def test_a_shared_fix_is_decided_once_and_keeps_all_its_links(self):
        summary = self.ingested()
        self.assertEqual(summary['decisions'], {'accept': 11, 'edit': 0, 'reject': 0})
        self.assertEqual(cards.read(self.run_dir / 'fixes.json')['fixes'][SHARED]['review']['decision'], 'accept')
        self.assertEqual(sorted(e['dreamId'] for e in self.final_links(SHARED)), ['burnout-d00', 'burnout-d01', 'burnout-d02'])
        self.assertEqual(cards.read(self.run_dir / 'reviews/fixes-decisions.json')['decisions'][SHARED]['decision'], 'accept')
        self.assertEqual(self.status(self.run_dir)['next'], 'done')
        self.assertEqual(cli(self.tmp, 'validate', str(self.run_dir)).returncode, 0)

    def test_a_founder_link_takes_a_dream_past_five(self):
        self.ingested(lambda d: d[UNLINKED]['links'].append(FULL))
        added = self.final_links(UNLINKED, FULL)
        self.assertEqual([(e['by'], e['order']) for e in added], [('founder', 6)])
        self.assertEqual(len(self.final_links(dream=FULL)), 6)
        self.assertEqual(cards.validate_run(self.run_dir), [])

    def test_a_removed_link_is_dropped_and_kept_as_removed(self):
        self.ingested(lambda d: d[SHARED]['links'].remove('burnout-d02'))
        self.assertEqual(sorted(e['dreamId'] for e in self.final_links(SHARED)), ['burnout-d00', 'burnout-d01'])
        self.assertEqual([e['order'] for e in sorted(self.final_links(dream='burnout-d02'), key=lambda e: e['order'])], [1, 2])
        removed = cards.read(self.run_dir / 'links.json')['review']['removed']
        self.assertEqual([(e['fixId'], e['dreamId'], e['by'], e['reason']) for e in removed],
                         [(SHARED, 'burnout-d02', 'assembler', 'unlinked')])

    def test_an_edit_keeps_the_original_text_beside_it(self):
        def edit(d):
            d[SHARED].update(decision='edit', note='plainer', edit={'title': 'Charge the laptop by the door',
                                                                   'whatChanges': 'Work ends at the door.',
                                                                   'firstStep': 'Plug the charger in by the door.'})
        self.ingested(edit)
        fix = cards.read(self.run_dir / 'fixes.json')['fixes'][SHARED]
        self.assertEqual((fix['title'], fix['whatChanges'], fix['firstStep']),
                         ('Charge the laptop by the door', 'Work ends at the door.', 'Plug the charger in by the door.'))
        self.assertEqual(fix['review']['original'], {'title': 'Move the work laptop out of the bedroom',
                                                     'whatChanges': 'The laptop stays by the door, so work ends there.',
                                                     'firstStep': 'Clear a spot on the hall shelf tonight.'})
        self.assertEqual((fix['review']['decision'], fix['review']['note']), ('edit', 'plainer'))
        self.assertEqual(fix['provenance']['reviewStatus'], 'reviewed')

    def test_a_rejected_fix_loses_its_links(self):
        self.ingested(lambda d: d['burnout-d03-t1'].update(decision='reject'))
        self.assertEqual(self.final_links('burnout-d03-t1'), [])
        self.assertIn(('burnout-d03-t1', 'rejected'),
                      [(e['fixId'], e['reason']) for e in cards.read(self.run_dir / 'links.json')['review']['removed']])
        self.assertEqual(cards.validate_run(self.run_dir), [])

    def test_validate_refuses_a_final_link_to_a_rejected_fix(self):
        self.ingested(lambda d: d['burnout-d03-t1'].update(decision='reject'))
        doc = cards.read(self.run_dir / 'links.json')
        doc['links'].append(link('burnout-d03-t1', 'burnout-d03', 9, 'founder'))
        self.write('links.json', doc)
        self.assertIn('burnout-d03-t1 was rejected in the fix review', self.issues())


class Refused(FixReview):
    def refused(self, change, message):
        result = self.ingest(self.export(change))
        self.assertEqual(result.returncode, 2, result.stdout)
        self.assertIn(message, result.stderr)
        self.assertNotIn('review', cards.read(self.run_dir / 'fixes.json')['fixes'][SHARED])
        self.assertNotIn('review', cards.read(self.run_dir / 'links.json'))
        self.assertEqual(self.status(self.run_dir)['next'], 'fix-review')

    def test_every_fix_needs_a_decision(self):
        self.refused(lambda d: d.pop(UNLINKED), 'undecided: ' + UNLINKED)

    def test_decisions_must_match_this_run(self):
        self.refused(lambda d: d.update(setId='burnout-19990101-000000'), 'decisions are for burnout-19990101-000000')
        self.refused(lambda d: d.update({SCREENED_OUT: {'decision': 'accept', 'links': []}}), 'unknown fix ' + SCREENED_OUT)

    def test_decision_must_be_known(self):
        self.refused(lambda d: d[SHARED].update(decision='later'), SHARED + ': unknown decision later')

    def test_edit_needs_a_title_what_changes_and_first_step(self):
        self.refused(lambda d: d[SHARED].update(decision='edit', edit={'title': 'Charge it by the door', 'whatChanges': ' '}),
                     SHARED + ': an edit needs a title, whatChanges, and firstStep')

    def test_links_go_only_to_accepted_dreams(self):
        self.refused(lambda d: d[SHARED]['links'].append('burnout-d05'), SHARED + ': burnout-d05 is not an accepted dream')
        self.refused(lambda d: d[SHARED].update(links='burnout-d00'), SHARED + ': links must be a list of dream IDs')
        self.refused(lambda d: d[SHARED]['links'].append('burnout-d00'), SHARED + ': burnout-d00 is linked twice')

    def test_decisions_on_a_stale_page_are_refused(self):
        path = self.export()
        self.write('fixes.json', cards.read(self.run_dir / 'fixes.json'),
                   lambda d: d['fixes'][SHARED].update(whatChanges='A redrafted change.'))
        result = self.ingest(path)
        self.assertEqual(result.returncode, 2)
        self.assertIn('changed since the fix review page was built (%s)' % SHARED, result.stderr)

    def test_review_is_ingested_once(self):
        path = self.export()
        self.assertEqual(self.ingest(path).returncode, 0)
        again = self.ingest(path)
        self.assertEqual(again.returncode, 2)
        self.assertIn('already ingested', again.stderr)
        rebuilt = cli(self.tmp, 'fixes-review-build', str(self.run_dir))
        self.assertEqual(rebuilt.returncode, 2)
        self.assertIn('next stage is done', rebuilt.stderr)


class Coverage(FixReview):
    def basics(self):
        return cards.lint_run(self.run_dir, self.tmp)['coverage']['basicsTonight']

    def test_coverage_reads_the_founders_final_links(self):
        # Tonight dreams are burnout-d00 and burnout-d03, each with two real-now Task fixes from the assembler.
        self.assertEqual(self.basics(), 4)
        self.ingested(lambda d: (d['burnout-d03-t1'].update(decision='reject'), d['burnout-d03-t2']['links'].clear()))
        self.assertEqual(self.basics(), 2)
        self.assertIn('basics-coverage', {i['rule'] for i in cards.lint_run(self.run_dir, self.tmp)['issues']})

    def test_a_founder_link_counts_toward_coverage(self):
        self.ingested(lambda d: d[UNLINKED]['links'].append('burnout-d03'))
        self.assertEqual(self.basics(), 5)


class Gate(FixReview):
    def test_fix_review_is_a_founder_stop(self):
        self.assertEqual(self.status(self.run_dir)['next'], 'fix-review')
        started = cli(self.tmp, 'start', str(self.run_dir), 'fix-review')
        self.assertEqual(started.returncode, 2)
        self.assertIn('fix-review is a founder stop: run fixes-review-build, then fixes-ingest', started.stderr)

    def test_judging_cannot_rerun_over_the_founders_final_links(self):
        self.ingested()
        started = cli(self.tmp, 'start', str(self.run_dir), 'judge')
        self.assertEqual(started.returncode, 2)
        self.assertIn('the run is done', started.stderr)
        with self.assertRaisesRegex(ValueError, 'the run is done'):
            cards.judge_input(self.run_dir, self.tmp)

    def test_the_built_page_is_not_committed(self):
        rules = (ROOT / '.gitignore').read_text()
        self.assertIn('docs/research/possibilities/runs/**/reviews/fix-review.html', rules)


if __name__ == '__main__':
    unittest.main()
