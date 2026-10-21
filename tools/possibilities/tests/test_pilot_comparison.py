"""Pilot comparison: a blind set of card-run and staged-run dreams for each pilot pain, and the report's gate (#99)."""
import datetime
import json
import re
import unittest

from test_cards import ROOT, cards, judgments
from test_staged import cli
from test_judging import SHARED, Judging, dream_judgments

OUT = 'docs/research/possibilities/evaluations/pilot-2026-10'


def drafted_text(fix):
    """Fix text that tells fixes apart without naming an ID, which the blind set must not show."""
    return 'The laptop stays by door %s, so work ends there.' % fix.replace('burnout-d', '').replace('-t', '.')


class Pilot(Judging):
    """burnout has a selected card run and a newer ranked staged run, both before any fix review."""

    def setUp(self):
        super().setUp()
        fixes = cards.read(self.run_dir / 'fixes.json')
        for key, fix in fixes['fixes'].items():
            fix['whatChanges'] = drafted_text(key)
        cards.write(self.run_dir / 'fixes.json', fixes)
        self.write('judgments.json', dream_judgments(failing=('burnout-d00',)))
        cards.select(self.run_dir)
        self.card_run = self.make_run('burnout')
        cards.write(self.card_run / 'judgments.json', judgments(sorted(cards.read(self.card_run / 'cards.json')['cards'])))
        cards.select(self.card_run)
        self.out = self.tmp / OUT

    def built(self):
        cards.compare_build(self.tmp, ['burnout'], seed=1)
        key = cards.read(self.out / 'compare-key.json')
        items = {i['id']: i for i in cards.read(self.out / 'compare-set.json')['items']}
        return key, items

    def item_for_dream(self, dream):
        key, items = self.built()
        return items[next(k for k, v in key.items() if v.get('sourceDreamId') == dream)]


class BlindSet(Pilot):
    def test_the_set_shows_no_sign_of_which_flow_made_an_item(self):
        key, items = self.built()
        self.assertEqual(sorted(key), sorted(items))
        text = json.dumps(cards.read(self.out / 'compare-set.json'))
        for tell in (self.run_dir.name, self.card_run.name, 'burnout-c', 'burnout-d0', 'origin', 'source', 'old', 'new'):
            self.assertNotIn(tell, text)
        shapes = {(tuple(sorted(i)), tuple(sorted({f for fix in i['fixes'] for f in fix}))) for i in items.values()}
        self.assertEqual(len(shapes), 1)

    def test_the_key_pairs_the_card_finalists_with_the_ranked_dreams(self):
        key, _ = self.built()
        finalists = cards.read(self.card_run / 'selection.json')['finalists']
        self.assertEqual(sorted(v['sourceCardId'] for v in key.values() if v['origin'] == 'old'), sorted(finalists))
        self.assertTrue(all(v['runId'] == self.card_run.name for v in key.values() if v['origin'] == 'old'))
        # burnout-d00 failed honest status, so the staged run shows its other four dreams.
        self.assertEqual(sorted(v['sourceDreamId'] for v in key.values() if v['origin'] == 'new'),
                         ['burnout-d01', 'burnout-d02', 'burnout-d03', 'burnout-d04'])
        self.assertTrue(all(v['runId'] == self.run_dir.name for v in key.values() if v['origin'] == 'new'))

    def fix_reviewed(self):
        """The run as fixes-ingest leaves it (#92): on burnout-d02 the founder unlinked t1, edited t2, and added d03-t1."""
        links = cards.read(self.run_dir / 'links.json')
        how = 'Work stops at the door, so the evening starts there.'
        removed = [dict(e, reason='unlinked') for e in links['links'] if (e['fixId'], e['dreamId']) == ('burnout-d02-t1', 'burnout-d02')]
        kept = [e for e in links['links'] if e not in [{k: v for k, v in r.items() if k != 'reason'} for r in removed]]
        for e in kept:
            if e['dreamId'] == 'burnout-d02':
                e['order'] -= 1
        kept.append({'fixId': 'burnout-d03-t1', 'dreamId': 'burnout-d02', 'order': 3, 'how': how, 'by': 'founder'})
        links.update(links=kept, review={'ingestedAt': '2026-10-21T10:00:00Z', 'removed': removed})
        cards.write(self.run_dir / 'links.json', links)
        fixes = cards.read(self.run_dir / 'fixes.json')
        fix = fixes['fixes']['burnout-d02-t2']
        fix['review'] = {'decision': 'edit', 'note': '', 'decidedAt': '2026-10-21T09:59:00Z', 'ingestedAt': '2026-10-21T10:00:00Z',
                         'original': {f: fix[f] for f in ('title', 'whatChanges', 'firstStep')}}
        fix['title'] = 'The founder wording'
        cards.write(self.run_dir / 'fixes.json', fixes)

    def test_staged_items_use_the_assemblers_links_from_before_the_fix_review(self):
        self.fix_reviewed()
        item = self.item_for_dream('burnout-d02')
        self.assertEqual([f['whatChanges'] for f in item['fixes']],
                         [drafted_text(k) for k in ('burnout-d02-t1', 'burnout-d02-t2', SHARED)])
        self.assertEqual(item['fixes'][1]['title'], 'Move the work laptop out of the bedroom')

    def test_a_stale_card_run_is_refused_with_the_reason(self):
        cards.write(self.card_run / 'run.json', {'schemaVersion': 1, 'painId': 'burnout', 'runId': self.card_run.name,
                                                 'startedAt': '2026-10-17T00:00:00+00:00', 'painName': 'Burnout',
                                                 'painLine': 'An older line.'})
        with self.assertRaisesRegex(ValueError, 'stale: wording changed'):
            cards.compare_build(self.tmp, ['burnout'], seed=1)
        self.assertFalse((self.out / 'compare-set.json').exists())



def stamp(seconds):
    return (datetime.datetime(2026, 10, 21, 9, 0, tzinfo=datetime.timezone.utc) + datetime.timedelta(seconds=seconds)).isoformat()


class Report(Pilot):
    """The staged side links fixes of five kinds; the card finalists use Task, Feature, and Habit."""

    def setUp(self):
        super().setUp()
        fixes = cards.read(self.run_dir / 'fixes.json')
        for fix, kind in (('burnout-d01-t1', 'learn'), ('burnout-d02-t1', 'habit'), ('burnout-d03-t1', 'ask'), ('burnout-d04-t1', 'group')):
            fixes['fixes'][fix]['kind'] = kind
        cards.write(self.run_dir / 'fixes.json', fixes)
        self.key, _ = self.built()

    def review(self, gap):
        """The founder's dream and fix reviews, one decision every `gap` seconds on each page."""
        dreams = cards.read(self.run_dir / 'dreams.json')
        for n, d in enumerate(sorted(dreams['dreams'])):
            dreams['dreams'][d]['review']['decidedAt'] = stamp(n * gap)
        cards.write(self.run_dir / 'dreams.json', dreams)
        fixes = cards.read(self.run_dir / 'fixes.json')
        for n, f in enumerate(sorted(fixes['fixes'])):
            fixes['fixes'][f]['review'] = {'decision': 'accept', 'note': '', 'decidedAt': stamp(3600 + n * gap)}
        cards.write(self.run_dir / 'fixes.json', fixes)

    def report(self, rating=lambda v: 'love' if v['origin'] == 'new' else 'keep'):
        """The comparison page export: one rating a minute, in item order."""
        path = self.tmp / 'compare-export.json'
        cards.write(path, {'ratings': {k: {'rating': rating(v), 'reason': '', 'ratedAt': stamp(7200 + 60 * n)}
                                       for n, (k, v) in enumerate(sorted(self.key.items()))}})
        return cards.compare_report(self.tmp, path)

    def test_a_slower_review_gives_iterate_and_names_that_check(self):
        self.review(gap=60)  # 5 minutes on the dreams and 9 on the fixes; the card finalists took 5
        result = self.report()
        self.assertEqual(result['reviewMinutes'], {'old': 5.0, 'new': 14.0})
        self.assertEqual(result['gate']['result'], 'iterate')
        self.assertEqual(result['gate']['failing'], ['newReviewMinutes<=oldReviewMinutes'])

    def test_better_ratings_more_kinds_and_a_faster_review_give_scale_up(self):
        self.review(gap=10)
        result = self.report()
        self.assertEqual(result['meanRating'], {'old': 1.0, 'new': 2.0})
        self.assertEqual(result['kindsPerPain'], {'old': 3.0, 'new': 5.0})
        self.assertEqual(result['gate'], {'result': 'scale-up', 'checks': {
            'newMeanRating>=oldMeanRating': True, 'newKindsPerPain>oldKindsPerPain': True,
            'newReviewMinutes<=oldReviewMinutes': True}, 'failing': []})

    def test_lower_ratings_give_iterate(self):
        self.review(gap=10)
        result = self.report(lambda v: 'kill' if v['origin'] == 'new' else 'keep')
        self.assertEqual(result['gate']['failing'], ['newMeanRating>=oldMeanRating'])

    def test_a_review_without_timestamps_fails_the_review_time_check(self):
        result = self.report()
        self.assertIsNone(result['reviewMinutes']['new'])
        self.assertIn('newReviewMinutes<=oldReviewMinutes', result['gate']['failing'])


    def test_fill_rate_is_measured_against_the_plan_ceilings(self):
        plan = cards.read(self.run_dir / 'plan.json')
        plan['ceilings']['burnout-d00']['task']['max'] = 4  # two of four drafted; every other dream drafted two of two
        cards.write(self.run_dir / 'plan.json', plan)
        self.assertEqual(self.report()['fillRate'], {'old': None, 'new': {'overall': 0.9, 'byKind': {'task': 0.9}}})

    def test_tokens_are_reported_per_stage(self):
        for stage, tokens in (('plan', '1200'), ('judge', '800'), ('plan', '1300')):
            result = cli(self.tmp, 'finish-run', str(self.run_dir), '--stage', stage, '--tokens', tokens)
            self.assertEqual(result.returncode, 0, result.stderr)
        meta = cards.read(self.run_dir / 'run.json')
        self.assertEqual((meta['tokensByStage'], meta['tokens'], meta['finishedAt']), ({'plan': 1300, 'judge': 800}, 2100, None))
        wording = cards.pains(self.tmp)['burnout']
        cards.write(self.card_run / 'run.json', {'schemaVersion': 1, 'painId': 'burnout', 'runId': self.card_run.name,
                                                 'startedAt': '2026-10-17T00:00:00+00:00', 'painName': wording['name'],
                                                 'painLine': wording['line'], 'tokens': 5000})
        self.assertEqual(self.report()['tokens'], {'old': {'total': 5000, 'byStage': None},
                                                   'new': {'total': 2100, 'byStage': {'plan': 1300, 'judge': 800}}})

    def test_a_stage_outside_the_flow_is_refused(self):
        result = cli(self.tmp, 'finish-run', str(self.run_dir), '--stage', 'writer', '--tokens', '10')
        self.assertEqual(result.returncode, 2)
        self.assertIn('unknown stage writer', result.stderr)



class Cli(Pilot):
    def test_compare_build_and_report_from_the_command_line(self):
        built = cli(self.tmp, 'compare-build', 'burnout', '--seed', '1')
        self.assertEqual(built.returncode, 0, built.stderr)
        self.assertEqual(json.loads(built.stdout), {'items': 9, 'old': 5, 'new': 4})
        key = cards.read(self.out / 'compare-key.json')
        path = self.tmp / 'compare-export.json'
        cards.write(path, {'ratings': {k: {'rating': 'keep', 'ratedAt': stamp(60 * n)} for n, k in enumerate(sorted(key))}})
        reported = cli(self.tmp, 'compare-report', str(path))
        self.assertEqual(reported.returncode, 1, reported.stderr)  # no review timestamps yet, so iterate
        self.assertEqual(json.loads(reported.stdout)['gate']['result'], 'iterate')
        self.assertTrue((self.out / 'compare-metrics.json').is_file())

    def test_compare_build_needs_a_pilot_pain(self):
        self.assertEqual(cli(self.tmp, 'compare-build').returncode, 2)
        missing = cli(self.tmp, 'compare-build', 'loneliness')
        self.assertEqual(missing.returncode, 2)
        self.assertIn('no selected card run for loneliness', missing.stderr)



class Statuses(Pilot):
    def test_the_rating_page_labels_each_status_in_the_copy_guides_words(self):
        guide = (ROOT / cards.COPY_GUIDE).read_text()
        rule = next(line for line in guide.splitlines() if line.startswith('- **Status labels carry the formal status.**'))
        words = re.findall(r'\*\*([^*]+)\*\*', rule.split('Every idea shows one of:')[1])
        page = (ROOT / 'tools/possibilities/config/calibration-page.template.html').read_text()
        table = page[page.index('const STATUSES = {'):page.index('};', page.index('const STATUSES = {'))]
        labels = dict(re.findall(r"(\w+): \['[a-z-]+', \"([^\"]+)\"\]", table))
        self.assertEqual(labels, dict(zip(cards.STATUSES, words)))
        self.assertEqual(words, ['Real now', 'Existing resource', 'Something It could build', "A change we'd make together"])
        self.assertIn('STATUSES[f.status]', page)

    def test_generated_fixes_carry_no_roadmap_status(self):
        fixes = cards.read(self.run_dir / 'fixes.json')
        fixes['fixes']['burnout-d00-t1']['featureStatus'] = 'planned'
        cards.write(self.run_dir / 'fixes.json', fixes)
        self.assertIn('fix burnout-d00-t1: the generator never sets a roadmap status (featureStatus)', cards.validate_run(self.run_dir))
        doc = cards.read(self.card_run / 'cards.json')
        doc['cards']['burnout-c00']['fixes'][1]['featureStatus'] = 'idea'
        cards.write(self.card_run / 'cards.json', doc)
        self.assertIn('card burnout-c00 fix burnout-f0-b: the generator never sets a roadmap status (featureStatus)',
                      cards.validate_run(self.card_run))


if __name__ == '__main__':
    unittest.main()
