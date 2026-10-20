"""Calibration and audit sets from staged runs: each item is a dream with its linked fixes in order (#97)."""
import re
import unittest
from unittest import mock

from test_cards import ROOT, cards, judgments
from test_judging import SHARED, Judging, dream_judgments


class StagedCalibration(Judging):
    """poor-sleep has a selected card run and burnout a ranked staged run; both are treated as known pains."""

    def setUp(self):
        super().setUp()
        patch = mock.patch.object(cards, 'KNOWN_PAINS', ('poor-sleep', 'burnout'))
        patch.start()
        self.addCleanup(patch.stop)
        fixes = cards.read(self.run_dir / 'fixes.json')
        for key, fix in fixes['fixes'].items():
            fix['whatChanges'] = 'The laptop stays by the door for %s, so work ends there.' % key
        cards.write(self.run_dir / 'fixes.json', fixes)
        self.write('judgments.json', dream_judgments(failing=('burnout-d00',)))
        cards.select(self.run_dir)
        cards.write(self.run / 'judgments.json', judgments(sorted(cards.read(self.run / 'cards.json')['cards'])))
        cards.select(self.run)
        baseline = {}
        for pain in cards.KNOWN_PAINS:
            for j in range(2):
                baseline['old-%s-%d' % (pain, j)] = {
                    'painId': pain, 'title': 'Rested', 'line': 'I wake up rested and ready.',
                    'fixes': [{'id': 'fx-%s-a' % pain, 'title': 'Find sleep care', 'whatChanges': 'Get help.'},
                              {'id': 'fx-%s-b' % pain, 'title': 'Share the load', 'whatChanges': 'Agree duties.'}],
                    'provenance': {'sourceId': 'founder-review', 'locator': '#sleep', 'evidenceType': 'prior_packet',
                                   'rights': 'CC-BY-SA-4.0', 'reviewStatus': 'reviewed'}}
        self.cal = self.tmp / 'docs/research/possibilities/calibration'
        self.cal.mkdir(parents=True)
        cards.write(self.cal / 'baseline.json', {'schemaVersion': 1, 'cards': baseline})

    def built(self):
        cards.calibrate_build(self.tmp, seed=1)
        key = cards.read(self.cal / 'key.json')
        items = {i['id']: i for i in cards.read(self.cal / 'set.json')['items']}
        return key, items

    def item_for_dream(self, dream):
        key, items = self.built()
        return items[next(k for k, v in key.items() if v.get('sourceDreamId') == dream)]

    def test_a_staged_item_is_a_dream_with_its_linked_fixes_in_order(self):
        item = self.item_for_dream('burnout-d02')
        self.assertEqual(item['title'], 'Coworkers who cover for each other')
        self.assertEqual(item['line'], 'I stop work while there is still light outside.')
        self.assertEqual([f['whatChanges'] for f in item['fixes']],
                         ['The laptop stays by the door for %s, so work ends there.' % k for k in ('burnout-d02-t1', 'burnout-d02-t2', SHARED)])
        self.assertEqual(item['fixes'][0]['kind'], 'task')
        self.assertEqual(item['fixes'][0]['status'], 'real_now')
        self.assertEqual(item['fixes'][0]['example'], 'Example 1 Cooperative · Preston · 2012 · 10 homes')
        self.assertEqual(item['fixes'][0]['firstStep'], 'Clear a spot on the hall shelf tonight.')

    def test_an_audit_set_takes_ranked_dreams_that_passed_honest_status(self):
        self.assertEqual(cards.audit_build(self.tmp, [str(self.run_dir), str(self.run)]), {'items': 11})  # 5 card finalists and 2 samples, 4 dreams
        out = self.tmp / 'docs/research/possibilities/evaluations/generator-2026-10'
        key = cards.read(out / 'audit-key.json')
        staged = [v for v in key.values() if v['painId'] == 'burnout']
        # No finalists or audit sample in a staged run (founder, 2026-10-20): every ranked dream but burnout-d00, which failed honest status.
        self.assertEqual(sorted(v['sourceDreamId'] for v in staged), ['burnout-d01', 'burnout-d02', 'burnout-d03', 'burnout-d04'])
        self.assertTrue(all(v['origin'] == 'ranked' and v['runId'] == self.run_dir.name for v in staged))
        items = {i['id']: i for i in cards.read(out / 'audit-set.json')['items']}
        self.assertEqual(len(items), 11)
        d02 = next(k for k, v in key.items() if v.get('sourceDreamId') == 'burnout-d02')
        self.assertEqual(len(items[d02]['fixes']), 3)

    def ingest(self, rating_for):
        key, _ = self.built()
        path = self.tmp / 'export.json'
        cards.write(path, {'ratings': {k: {'rating': rating_for(v), 'reason': 'Clear and real.', 'ratedAt': '2026-10-20T10:%02d:00Z' % i}
                                       for i, (k, v) in enumerate(sorted(key.items()))}})
        return key, cards.calibrate_ingest(self.tmp, path)

    def test_ratings_ingest_keyed_by_dream_for_staged_items(self):
        key, _ = self.ingest(lambda v: 'love')
        rows = cards.read(self.cal / 'anchors.json')['anchors'] + cards.read(self.cal / 'heldout.json')['heldOut']
        staged = sorted(r['dreamId'] for r in rows if r['painId'] == 'burnout' and 'dreamId' in r)
        self.assertEqual(staged, ['burnout-d01', 'burnout-d02', 'burnout-d03'])
        cards_rated = [r for r in rows if r['painId'] == 'poor-sleep' and key[r['id']]['origin'] == 'new']
        self.assertTrue(cards_rated and all(r['cardId'].startswith('poor-sleep-c') and 'dreamId' not in r for r in cards_rated))

    def test_report_checks_the_judge_against_held_out_dreams(self):
        self.ingest(lambda v: 'love' if v['origin'] == 'new' else 'kill')
        cards.audit_build(self.tmp, [str(self.run_dir)])
        audit = self.tmp / 'audit.json'
        audit_key = cards.read(self.tmp / 'docs/research/possibilities/evaluations/generator-2026-10/audit-key.json')
        cards.write(audit, {'ratings': {k: {'rating': 'keep'} for k in audit_key}})
        result = cards.report(self.tmp, audit)
        self.assertEqual(result['agreement']['pains'], 2)
        self.assertEqual(result['agreement']['top3HitRate'], 1.0)
        self.assertEqual(result['audit']['freshFinalists'], {'n': 4, 'love': 0.0, 'keep': 1.0, 'kill': 0.0, 'loveKeep': 1.0})


class RatingPage(unittest.TestCase):
    def test_every_kind_a_fix_can_carry_has_a_text_label(self):
        page = (ROOT / 'tools/possibilities/config/calibration-page.template.html').read_text()
        table = page[page.index('const KINDS = {'):page.index('};', page.index('const KINDS = {'))]
        labelled = set(re.findall(r"'?([a-z-]+)'?: \['[a-z-]+', '[A-Z][a-z ]+'\]", table))
        self.assertEqual(labelled, set(cards.KINDS) | set(cards.TRIAL_KIND_BRIEFS))


if __name__ == '__main__':
    unittest.main()
