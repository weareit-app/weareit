"""Staged runs: the judge panel scores each accepted dream with its linked fixes, and select writes the ranking (#91)."""
import json
import unittest

from test_cards import cards
from test_staged import cli
from test_fix_stages import DREAMS, FixStages, fixes_doc, link, links_doc, plan_doc, reviewed, screen_doc

ACCEPTED = DREAMS[:5]
SHARED = 'burnout-d00-t1'


def shared_three_ways(doc):
    """burnout-d00-t1 also helps burnout-d01 and burnout-d02, shown third under each."""
    doc['links'] += [link(SHARED, 'burnout-d01', 3), link(SHARED, 'burnout-d02', 3)]


class Judging(FixStages):
    def setUp(self):
        super().setUp()
        self.write('plan.json', plan_doc())
        self.write('fixes.json', fixes_doc())
        self.write('screen.json', screen_doc())
        self.write('links.json', links_doc(), shared_three_ways)


class JudgeInput(Judging):
    def test_a_fix_linked_to_three_dreams_appears_under_each(self):
        dreams = cards.judge_input(self.run_dir, self.tmp)['dreams']
        self.assertEqual(sorted(dreams), ACCEPTED)
        for dream in ('burnout-d00', 'burnout-d01', 'burnout-d02'):
            self.assertIn(SHARED, [f['id'] for f in dreams[dream]['fixes']], dream)

    def test_fixes_follow_the_assemblers_order(self):
        def swap(doc):
            for entry in doc['links']:
                if entry['dreamId'] == 'burnout-d01' and entry['fixId'] != SHARED:
                    entry['order'] = {1: 5, 2: 4}[entry['order']]
        self.write('links.json', links_doc(), lambda d: (shared_three_ways(d), swap(d)))
        fixes = cards.judge_input(self.run_dir, self.tmp)['dreams']['burnout-d01']['fixes']
        self.assertEqual([f['id'] for f in fixes], [SHARED, 'burnout-d01-t2', 'burnout-d01-t1'])
        self.assertEqual(fixes[0]['how'], 'Work stops at the door, so the evening starts there.')

    def test_method_fields_writer_notes_and_provenance_stay_out(self):
        self.write('fixes.json', fixes_doc(), lambda d: d['fixes'][SHARED].update(writerNotes='secret writer reasoning'))
        self.write_dreams(self.run_dir, lambda d: (reviewed(d), d['dreams']['burnout-d00'].update(writerNotes='secret dream notes')))
        payload = json.dumps(cards.judge_input(self.run_dir, self.tmp))
        for hidden in ('secret writer reasoning', 'secret dream notes', 'provenance', 'method', 'nextAction', 'draftedFor', 'origin', 'review'):
            self.assertNotIn(hidden, payload)
        self.assertIn('"kind": "task"', payload)

    def test_judging_waits_for_valid_links(self):
        (self.run_dir / 'links.json').unlink()
        with self.assertRaisesRegex(ValueError, 'assemble is not complete'):
            cards.judge_input(self.run_dir, self.tmp)
        self.write('links.json', links_doc(), lambda d: d['links'].pop(0))
        with self.assertRaisesRegex(ValueError, 'dream burnout-d00: 1 linked fix'):
            cards.judge_input(self.run_dir, self.tmp)


def dream_judgments(keys=ACCEPTED, failing=(), order=ACCEPTED):
    """One judge's scores: dreams earlier in order score higher and win their pairs."""
    scores = {}
    for k in keys:
        value = 5 - order.index(k) if k in order else 3
        scores[k] = {c: {'score': max(value, 1), 'reason': 'r'} for c in cards.CRITERIA}
        scores[k]['honestStatus'] = {'pass': k not in failing, 'reason': 'Overstates it.' if k in failing else 'Fits the status.'}
    pairwise = [{'a': a, 'b': b, 'winner': a, 'reason': 'r'} for i, a in enumerate(order) for b in order[i + 1:] if a in keys and b in keys]
    return {'schemaVersion': 2, 'painId': 'burnout', 'judge': {'context': 'isolated', 'at': '2026-10-20'}, 'scores': scores,
            'pairwise': pairwise, 'seed': 7}


class Judgments(Judging):
    def test_scores_keyed_by_dream_are_valid(self):
        self.write('judgments.json', dream_judgments())
        self.assertEqual(self.issues(), '')

    def test_scores_keyed_by_fix_fail(self):
        self.write('judgments.json', dream_judgments(keys=['burnout-d00-t1', 'burnout-d00-t2']))
        found = self.issues()
        self.assertIn('judgments score fixes (burnout-d00-t1, burnout-d00-t2); score each dream with its linked fixes', found)
        self.assertIn('judgments must score every accepted dream exactly once', found)


class Consensus(Judging):
    def test_consensus_is_keyed_by_dream(self):
        late = ['burnout-d04', 'burnout-d03', 'burnout-d02', 'burnout-d01', 'burnout-d00']
        self.write('judgments-1.json', dream_judgments(failing=('burnout-d02',)))
        self.write('judgments-2.json', dream_judgments(failing=('burnout-d02',)))
        self.write('judgments-3.json', dream_judgments(order=late))
        summary = cards.consensus(self.run_dir)
        self.assertEqual(summary['judges'], 3)
        doc = cards.read(self.run_dir / 'judgments.json')
        self.assertEqual((doc['schemaVersion'], doc['painId']), (2, 'burnout'))
        self.assertEqual(sorted(doc['scores']), ACCEPTED)
        self.assertFalse(doc['scores']['burnout-d02']['honestStatus']['pass'])
        self.assertEqual(doc['consensus']['burnout-d00']['ranks'], [1, 1, 5])
        self.assertEqual(self.issues(), '')

    def test_a_judge_that_scored_fixes_is_rerun(self):
        self.write('judgments-1.json', dream_judgments())
        self.write('judgments-2.json', dream_judgments(keys=ACCEPTED[:4] + ['burnout-d04-t1']))
        with self.assertRaisesRegex(cards.CheckError, r'judgments-2.json: .*judgments score fixes \(burnout-d04-t1\)'):
            cards.consensus(self.run_dir)


class Ranking(Judging):
    def test_select_writes_a_ranking_with_no_finalists(self):
        self.write('judgments.json', dream_judgments(failing=('burnout-d00',)))
        result = cards.select(self.run_dir)
        self.assertEqual(cards.read(self.run_dir / 'ranking.json'), result)
        self.assertFalse((self.run_dir / 'selection.json').exists())
        self.assertNotIn('finalists', result)
        self.assertNotIn('auditSample', result)
        # The best-scored dream failed honest status: it stays in the ranking, marked, after the dreams that passed.
        self.assertEqual([r['dreamId'] for r in result['ranking']],
                         ['burnout-d01', 'burnout-d02', 'burnout-d03', 'burnout-d04', 'burnout-d00'])
        self.assertEqual(result['ranking'][-1]['honestStatus'], {'pass': False, 'reason': 'Overstates it.'})
        self.assertTrue(all(r['honestStatus']['pass'] for r in result['ranking'][:-1]))

    def test_the_ranking_orders_each_linked_fix_once_for_the_fix_review(self):
        self.write('judgments.json', dream_judgments(failing=('burnout-d00',)))
        self.assertEqual(cards.select(self.run_dir)['fixOrder'],
                         ['burnout-d01-t1', 'burnout-d01-t2', SHARED, 'burnout-d02-t1', 'burnout-d02-t2', 'burnout-d03-t1',
                          'burnout-d03-t2', 'burnout-d04-t1', 'burnout-d04-t2', 'burnout-d00-t2'])

    def test_select_refuses_judgments_of_fixes(self):
        self.write('judgments.json', dream_judgments(keys=['burnout-d00-t1']))
        with self.assertRaisesRegex(cards.CheckError, 'judgments score fixes'):
            cards.select(self.run_dir)


class Gate(Judging):
    def test_judge_names_its_brief_and_the_ranking_completes_it(self):
        started = cli(self.tmp, 'start', str(self.run_dir), 'judge')
        self.assertEqual(started.returncode, 0, started.stderr)
        self.assertEqual(json.loads(started.stdout)['brief'], 'tools/possibilities/briefs/judge.md')
        self.write('judgments.json', dream_judgments())
        self.assertEqual(self.status(self.run_dir)['next'], 'judge')
        selected = cli(self.tmp, 'select', str(self.run_dir))
        self.assertEqual(selected.returncode, 0, selected.stderr)
        self.assertEqual(self.status(self.run_dir)['next'], 'fix-review')


if __name__ == '__main__':
    unittest.main()
