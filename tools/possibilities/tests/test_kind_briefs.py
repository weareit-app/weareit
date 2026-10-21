"""One brief and validated method fields for each existing kind (#93)."""
import json
import re
import unittest

from test_cards import cards
from test_fix_stages import FixStages, cli, fixes_doc, plan_doc, shared_pass_only, task_fix

ROOT = cards.Path(cards.__file__).resolve().parents[2]
RESERVED = {'path'}  # a kind the copy guide reserves for later; it has no brief
# Each kind's required method fields (spec, "Method fields per kind"; one brief per kind in briefs/kinds/).
REQUIRED = {
    'feature': ('when', 'want', 'soThat', 'pattern', 'dataOrTools'),
    'schedule': ('what', 'cadence'),
    'habit': ('cue', 'behavior'),
    'practice': ('situation', 'move', 'wentBetterWhen'),
    'learn': ('ableTo', 'useWhen'),
    'project': ('finishedThing', 'doneWhen'),
    'group': ('whatMembersDo', 'howToFind'),
    'new-group': ('whoFor', 'whatMembersDo', 'firstTest', 'existingFirst'),
    'ask': ('decisionMaker', 'request'),
    'resource': ('provider', 'eligibility', 'access', 'bring'),
}


def kind_fix(kind, method):
    """One fix of `kind` for burnout-d00, with the given method fields."""
    fix = task_fix('burnout-d00', 1)
    fix.update(kind=kind, origin='kind:' + kind, method=method,
               status='proposed_it_feature' if kind == 'feature' else 'real_now')
    if kind == 'practice':
        fix['featureIdea'] = 'Helps you plan one request before a hard talk, then checks in afterward.'
    return fix


def one_fix_doc(kind, method):
    return {'schemaVersion': 2, 'painId': 'burnout', 'fixes': {'burnout-d00-k1': kind_fix(kind, method)},
            'pools': {kind: {'shortfalls': {}}}, 'shared': fixes_doc()['shared']}


def one_fix_plan(kind):
    """Task at 0 everywhere and `kind` at 1 for burnout-d00 only."""
    doc = plan_doc(task=0)
    doc['ceilings']['burnout-d00'][kind]['max'] = 1
    return doc


class EveryKindHasABrief(unittest.TestCase):
    def test_brief_files_match_the_validators_kinds(self):
        files = {p.stem for p in (ROOT / 'tools/possibilities/briefs/kinds').glob('*.md') if p.stem != '_shared'}
        self.assertEqual(set(cards.KINDS) - RESERVED, set(cards.KIND_BRIEFS))
        self.assertEqual(files, set(cards.KIND_BRIEFS) | set(cards.TRIAL_KIND_BRIEFS))
        for kind, brief in {**cards.KIND_BRIEFS, **cards.TRIAL_KIND_BRIEFS}.items():
            self.assertEqual(brief, 'tools/possibilities/briefs/kinds/%s.md' % kind)


class EveryKindBriefSetsLensAndAmbition(unittest.TestCase):
    def test_each_good_example_sets_a_lens_and_an_ambition(self):
        # Lens and ambition moved from dreams to fixes (founder, 2026-10-20), so each kind's example shows them.
        for kind, brief in {**cards.KIND_BRIEFS, **cards.TRIAL_KIND_BRIEFS}.items():
            with self.subTest(kind=kind):
                found = re.search(r'\*\*Lens and ambition:\*\* `([a-z-]+)`, `([a-z-]+)`', (ROOT / brief).read_text())
                self.assertTrue(found, brief)
                self.assertIn(found[1], cards.LENSES)
                self.assertIn(found[2], cards.AMBITIONS)


class MethodFields(FixStages):
    def test_a_fix_with_every_method_field_is_valid(self):
        for kind, fields in REQUIRED.items():
            with self.subTest(kind=kind):
                self.write('plan.json', one_fix_plan(kind))
                self.write('fixes.json', one_fix_doc(kind, {field: 'Filled in.' for field in fields}))
                self.assertEqual(self.issues(), '')

    def test_missing_method_fields_fail_for_every_kind(self):
        for kind, fields in REQUIRED.items():
            with self.subTest(kind=kind):
                self.write('plan.json', one_fix_plan(kind))
                self.write('fixes.json', one_fix_doc(kind, {fields[0]: ' '}))
                found = self.issues()
                for field in fields:
                    self.assertIn('fix burnout-d00-k1: method needs ' + field, found)

    def test_practice_needs_a_feature_idea_on_the_fix(self):
        doc = one_fix_doc('practice', {field: 'Filled in.' for field in REQUIRED['practice']})
        doc['fixes']['burnout-d00-k1']['featureIdea'] = ' '
        self.write('plan.json', one_fix_plan('practice'))
        self.write('fixes.json', doc)
        self.assertIn('fix burnout-d00-k1: practice needs featureIdea', self.issues())


class KindPools(FixStages):
    def test_only_kinds_with_a_ceiling_above_zero_get_a_brief(self):
        plan = plan_doc(task=0, habit=1, learn=2)
        for row in list(plan['ceilings'].values())[1:]:
            row['habit']['max'] = 0  # Habit fits one dream only; Learn fits all five
        self.write('plan.json', plan)
        self.write('fixes.json', fixes_doc(), shared_pass_only)
        ready = cli(self.tmp, 'start', str(self.run_dir), 'kind-pools')
        self.assertEqual(ready.returncode, 0, ready.stderr)
        self.assertEqual(json.loads(ready.stdout)['kinds'], {'habit': 'tools/possibilities/briefs/kinds/habit.md',
                                                              'learn': 'tools/possibilities/briefs/kinds/learn.md'})


if __name__ == '__main__':
    unittest.main()
