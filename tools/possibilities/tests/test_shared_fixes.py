"""The shared-fixes pass: fixes that serve several dreams, drafted once before the kind pools (#95)."""
import json
import unittest

from test_cards import cards
from test_fix_stages import DREAMS, FixStages, fixes_doc, plan_doc, task_fix
from test_staged import cli


def shared_fix(dreams, n=9):
    """A Task fix from the shared pass, with a proposed link to each dream it helps."""
    fix = task_fix(dreams[0], n)
    del fix['draftedFor']
    fix.update(title='Ask the team to hold email until morning', origin='shared',
               proposedLinks=[{'dreamId': d, 'how': 'Evening messages stop, so the day ends when work does.'} for d in dreams])
    return fix


def shared_doc(*fixes):
    """fixes.json as the shared pass leaves it: its fixes and its record, before any kind pool."""
    return {'schemaVersion': 2, 'painId': 'burnout', 'fixes': {'burnout-s%d' % i: f for i, f in enumerate(fixes, 1)},
            'pools': {}, 'shared': {'draftedAt': '2026-10-20'}}


class SharedFixes(FixStages):
    def setUp(self):
        super().setUp()
        self.write('plan.json', plan_doc())

    def test_one_fix_for_three_dreams_is_stored_once_with_three_proposed_links(self):
        self.write('fixes.json', shared_doc(shared_fix(DREAMS[:3])))
        self.assertEqual(self.issues(), '')
        fixes = cards.read(self.run_dir / 'fixes.json')['fixes']
        self.assertEqual(list(fixes), ['burnout-s1'])
        self.assertEqual([p['dreamId'] for p in fixes['burnout-s1']['proposedLinks']], DREAMS[:3])

    def test_a_shared_fix_proposes_links_to_two_or_more_accepted_dreams(self):
        one = shared_fix(DREAMS[:1])
        mixed = shared_fix(DREAMS[:2])
        mixed['proposedLinks'] += [{'dreamId': 'burnout-d05', 'how': 'r.'}, {'dreamId': DREAMS[0], 'how': 'Twice.'},
                                   {'dreamId': DREAMS[2], 'how': ''}]
        self.write('fixes.json', shared_doc(one, mixed, shared_fix(DREAMS[:2]) | {'proposedLinks': None}))
        found = self.issues()
        self.assertIn('fix burnout-s1: a shared fix proposes links to two or more accepted dreams', found)
        self.assertIn('fix burnout-s2: proposed link to burnout-d05, which is not an accepted dream', found)
        self.assertIn('fix burnout-s2: proposed link to burnout-d00 is listed twice', found)
        self.assertIn('fix burnout-s2: proposed link to burnout-d02 needs one sentence on how the fix helps', found)
        self.assertIn('fix burnout-s3: a shared fix proposes links to two or more accepted dreams', found)

    def test_a_malformed_proposed_link_is_reported(self):
        fix = shared_fix(DREAMS[:2])
        fix['proposedLinks'].append({'dreamId': [DREAMS[2]], 'how': 'r.'})
        self.write('fixes.json', shared_doc(fix))
        self.assertIn("fix burnout-s1: proposed link to ['burnout-d02'], which is not an accepted dream", self.issues())

    def test_only_shared_fixes_propose_links(self):
        self.write('fixes.json', fixes_doc(), lambda d: d['fixes']['burnout-d00-t1'].update(
            proposedLinks=shared_fix(DREAMS[:2])['proposedLinks']))
        self.assertIn('fix burnout-d00-t1: only a shared fix has proposedLinks', self.issues())

    def test_a_shared_fix_is_drafted_for_no_single_dream(self):
        self.write('fixes.json', shared_doc(shared_fix(DREAMS[:2]) | {'draftedFor': DREAMS[0]}))
        self.assertIn('fix burnout-s1: a shared fix has proposedLinks in place of draftedFor', self.issues())

    def test_a_pass_with_no_shared_fix_says_why(self):
        self.write('fixes.json', shared_doc())
        self.assertIn('shared: no fix serves several dreams, so the pass needs an emptyReason', self.issues())
        self.write('fixes.json', shared_doc(), lambda d: d['shared'].update(emptyReason='Each dream needs its own way.'))
        self.assertEqual(self.issues(), '')

    def test_kind_pools_come_after_the_shared_pass(self):
        self.write('fixes.json', fixes_doc(), lambda d: d.pop('shared'))
        self.assertIn('fixes.json pools need the shared pass first', self.issues())

    def test_kind_pools_sit_beside_shared_fixes_without_counting_them(self):
        def add(doc):
            doc['fixes']['burnout-s1'] = shared_fix(DREAMS[:3])
        self.write('fixes.json', fixes_doc(), add)
        self.assertEqual(self.issues(), '')


class Gate(FixStages):
    def setUp(self):
        super().setUp()
        self.write('plan.json', plan_doc())

    def start(self, stage):
        return cli(self.tmp, 'start', str(self.run_dir), stage)

    def test_the_shared_pass_runs_after_the_plan_and_before_the_kind_pools(self):
        self.assertEqual(self.status(self.run_dir)['next'], 'shared-fixes')
        refused = self.start('kind-pools')
        self.assertEqual(refused.returncode, 2)
        self.assertIn('kind-pools cannot start: shared-fixes is not complete', refused.stderr)
        ready = self.start('shared-fixes')
        self.assertEqual(ready.returncode, 0, ready.stderr)
        self.assertEqual(json.loads(ready.stdout)['brief'], 'tools/possibilities/briefs/shared-fixes.md')
        self.write('fixes.json', shared_doc(shared_fix(DREAMS[:3])))
        self.assertEqual(self.status(self.run_dir)['next'], 'kind-pools')

    def test_kind_briefs_receive_the_shared_fixes(self):
        self.write('fixes.json', shared_doc(shared_fix(DREAMS[:3]), shared_fix(DREAMS[2:5])))
        pools = json.loads(self.start('kind-pools').stdout)
        self.assertEqual(pools['shared'], ['burnout-s1', 'burnout-s2'])


if __name__ == '__main__':
    unittest.main()
