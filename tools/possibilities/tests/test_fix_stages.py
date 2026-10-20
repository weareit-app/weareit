"""Staged runs after dream review: the kind plan, the Task pool, the screen, and the assembler's links (tracer, #90)."""
import json
import unittest

from test_cards import cards
from test_staged import StagedBase, cli, dreams_doc

DREAMS = sorted(dreams_doc()['dreams'])  # burnout-d00 … burnout-d05; d05 is rejected in review


def reviewed(doc):
    for key, d in doc['dreams'].items():
        d['review'] = {'decision': 'reject' if key == 'burnout-d05' else 'accept'}


def plan_doc(task=2):
    return {'schemaVersion': 2, 'painId': 'burnout',
            'ceilings': {key: {'task': {'max': task, 'reason': 'One-time changes fit this dream.'}} for key in DREAMS[:5]}}


def task_fix(dream, n):
    return {'title': 'Move the work laptop out of the bedroom', 'whatChanges': 'The laptop stays by the door, so work ends there.',
            'kind': 'task', 'status': 'real_now', 'origin': 'kind:task', 'draftedFor': dream,
            'method': {'nextAction': 'Carry the laptop charger to the hall shelf.', 'doneWhen': 'The laptop sleeps in the hall.',
                       'keepsWorking': True, 'lever': 'remove-hassle'},
            'exemplarRef': 'ex-%d' % n, 'speculative': False,
            'firstStep': 'Clear a spot on the hall shelf tonight.', 'firstStepMinutes': 5,
            'provenance': {'sourceId': 'generator-run-x', 'locator': 'fixes.json#t', 'evidenceType': 'ai_generated_from_exemplars',
                           'rights': 'CC-BY-SA-4.0', 'reviewStatus': 'unreviewed'}}


def fixes_doc():
    """Two Task fixes for each accepted dream: a full pool against plan_doc()."""
    fixes = {'%s-t%d' % (dream, n): task_fix(dream, n) for dream in DREAMS[:5] for n in (1, 2)}
    return {'schemaVersion': 2, 'painId': 'burnout', 'fixes': fixes, 'pools': {'task': {'shortfalls': {}}}}


def screen_doc(failing=()):
    checks = ('actionable', 'rightKind', 'honestStatus')
    results = {key: {c: {'pass': not (key in failing and c == 'actionable'), 'reason': 'r'} for c in checks}
               for key in fixes_doc()['fixes']}
    return {'schemaVersion': 2, 'painId': 'burnout', 'judge': {'context': 'isolated', 'at': '2026-10-20'}, 'results': results}


def link(fix, dream, order, by='assembler'):
    return {'fixId': fix, 'dreamId': dream, 'order': order, 'how': 'Work stops at the door, so the evening starts there.', 'by': by}


def links_doc():
    """Each accepted dream linked to its own two Task fixes, plus one path candidate."""
    links = [link('%s-t%d' % (dream, n), dream, n) for dream in DREAMS[:5] for n in (1, 2)]
    return {'schemaVersion': 2, 'painId': 'burnout', 'links': links,
            'pathCandidates': [{'fixIds': ['burnout-d00-t1', 'burnout-d00-t2'], 'reason': 'The shelf comes before the habit.'}]}


def six_on_d00(by_sixth):
    def change(doc):
        extra = ['burnout-d01-t1', 'burnout-d01-t2', 'burnout-d02-t1', 'burnout-d02-t2']
        doc['links'] += [link(fix, 'burnout-d00', 3 + i, by_sixth if i == 3 else 'assembler') for i, fix in enumerate(extra)]
    return change


class FixStages(StagedBase):
    def setUp(self):
        super().setUp()
        self.run_dir = self.new_staged()
        self.write_examples(self.run_dir)
        self.write_dreams(self.run_dir, reviewed)

    def write(self, name, doc, change=None):
        if change:
            change(doc)
        cards.write(self.run_dir / name, doc)

    def issues(self):
        return ' | '.join(cards.validate_run(self.run_dir))


class Plan(FixStages):
    def test_plan_with_a_ceiling_and_reason_for_every_accepted_dream_is_valid(self):
        self.write('plan.json', plan_doc())
        self.assertEqual(self.issues(), '')

    def test_zero_ceiling_without_a_reason_fails(self):
        self.write('plan.json', plan_doc(), lambda p: p['ceilings']['burnout-d00'].update(task={'max': 0, 'reason': ''}))
        self.assertIn('plan burnout-d00 task: a ceiling needs a one-line reason', self.issues())


class TaskPool(FixStages):
    def setUp(self):
        super().setUp()
        self.write('plan.json', plan_doc())

    def test_full_pool_is_valid(self):
        self.write('fixes.json', fixes_doc())
        self.assertEqual(self.issues(), '')

    def test_pool_under_its_ceiling_with_a_shortfall_reason_passes(self):
        def short(doc):
            del doc['fixes']['burnout-d00-t2']
            doc['pools']['task']['shortfalls']['burnout-d00'] = 'Only one one-time change fits evenings.'
        self.write('fixes.json', fixes_doc(), short)
        self.assertEqual(self.issues(), '')

    def test_pool_under_its_ceiling_without_a_reason_fails(self):
        self.write('fixes.json', fixes_doc(), lambda d: d['fixes'].pop('burnout-d00-t2'))
        self.assertIn('task pool for burnout-d00: 1 of 2 fixes needs a shortfallReason', self.issues())

    def test_pool_over_its_ceiling_fails(self):
        self.write('fixes.json', fixes_doc(), lambda d: d['fixes'].update({'burnout-d00-t3': task_fix('burnout-d00', 3)}))
        self.assertIn('task pool for burnout-d00: 3 fixes, over the ceiling of 2', self.issues())

    def test_task_needs_its_method_fields(self):
        def change(doc):
            doc['fixes']['burnout-d00-t1']['method'] = {'nextAction': ' ', 'keepsWorking': 'yes', 'lever': 'luck'}
        self.write('fixes.json', fixes_doc(), change)
        found = self.issues()
        for field in ('nextAction', 'doneWhen', 'keepsWorking', 'lever'):
            self.assertIn('fix burnout-d00-t1: method needs ' + field, found)

    def test_fix_follows_the_honest_status_and_sourcing_rules(self):
        def change(doc):
            doc['fixes']['burnout-d00-t1'].update(status='proposed_it_feature', exemplarRef='ex-missing', firstStepMinutes=45)
            doc['fixes']['burnout-d01-t1'].update(draftedFor='burnout-d05')
        self.write('fixes.json', fixes_doc(), change)
        found = self.issues()
        self.assertIn('fix burnout-d00-t1: kind feature goes with status proposed_it_feature', found)
        self.assertIn('fix burnout-d00-t1: exemplarRef must resolve or mark speculative', found)
        self.assertIn('fix burnout-d00-t1: firstStepMinutes must be 1-20', found)
        self.assertIn('fix burnout-d01-t1: draftedFor must be an accepted dream', found)

    def test_kind_without_a_planned_ceiling_has_no_pool(self):
        self.write('plan.json', plan_doc(task=0))
        self.write('fixes.json', fixes_doc())
        self.assertIn('task pool for burnout-d00: 2 fixes, over the ceiling of 0', self.issues())


class Screen(FixStages):
    def setUp(self):
        super().setUp()
        self.write('plan.json', plan_doc())
        self.write('fixes.json', fixes_doc())

    def test_screen_of_every_fix_is_valid_and_failures_stay_in_the_pool(self):
        self.write('screen.json', screen_doc(failing=('burnout-d00-t1',)))
        self.assertEqual(self.issues(), '')
        self.assertIn('burnout-d00-t1', cards.read(self.run_dir / 'fixes.json')['fixes'])

    def test_every_check_needs_a_verdict_and_a_reason(self):
        def change(doc):
            doc['results']['burnout-d00-t1']['rightKind'] = {'pass': 'yes', 'reason': ''}
            del doc['results']['burnout-d00-t2']['honestStatus']
        self.write('screen.json', screen_doc(), change)
        found = self.issues()
        self.assertIn('screen burnout-d00-t1: rightKind needs pass and reason', found)
        self.assertIn('screen burnout-d00-t2: honestStatus needs pass and reason', found)

    def test_screen_covers_the_whole_pool_from_an_isolated_judge(self):
        def change(doc):
            doc['judge']['context'] = 'writer'
            del doc['results']['burnout-d01-t1']
        self.write('screen.json', screen_doc(), change)
        found = self.issues()
        self.assertIn('screen judge context must be isolated', found)
        self.assertIn('screen.json must screen every fix exactly once (missing burnout-d01-t1)', found)

    def test_a_screened_fix_cannot_leave_the_pool(self):
        self.write('screen.json', screen_doc())
        self.write('fixes.json', fixes_doc(), lambda d: d['fixes'].pop('burnout-d01-t1'))
        self.assertIn('screen.json names fixes no longer in fixes.json (burnout-d01-t1)', self.issues())


class Assembly(FixStages):
    def setUp(self):
        super().setUp()
        self.write('plan.json', plan_doc())
        self.write('fixes.json', fixes_doc())
        self.write('screen.json', screen_doc())

    def test_links_from_screened_fixes_to_accepted_dreams_are_valid(self):
        self.write('links.json', links_doc())
        self.assertEqual(self.issues(), '')

    def test_linking_a_screened_out_fix_fails(self):
        self.write('screen.json', screen_doc(failing=('burnout-d00-t1',)))
        self.write('links.json', links_doc())
        self.assertIn('link burnout-d00-t1 → burnout-d00: burnout-d00-t1 was screened out', self.issues())

    def test_six_assembler_links_on_one_dream_fail(self):
        self.write('links.json', links_doc(), six_on_d00('assembler'))
        self.assertIn('dream burnout-d00: 6 assembler links; the assembler links 2-5', self.issues())

    def test_founder_links_may_take_a_dream_past_five(self):
        self.write('links.json', links_doc(), six_on_d00('founder'))
        self.assertEqual(self.issues(), '')

    def test_every_accepted_dream_gets_at_least_two_fixes(self):
        self.write('links.json', links_doc(), lambda d: d['links'].pop(0))
        self.assertIn('dream burnout-d00: 1 linked fix; the assembler links 2-5', self.issues())

    def test_each_link_says_how_it_helps_in_its_place(self):
        def change(doc):
            doc['links'][0].update(how='', by='writer')
            doc['links'][1].update(order=1)
            doc['links'].append(link('burnout-d00-t1', 'burnout-d05', 1))
            doc['links'].append(dict(doc['links'][2]))
        self.write('links.json', links_doc(), change)
        found = self.issues()
        self.assertIn('link burnout-d00-t1 → burnout-d00: how needs one sentence on how the fix helps', found)
        self.assertIn('link burnout-d00-t1 → burnout-d00: by must be assembler or founder', found)
        self.assertIn('dream burnout-d00: each link needs its own order, a positive integer', found)
        self.assertIn('link burnout-d00-t1 → burnout-d05: burnout-d05 is not an accepted dream', found)
        self.assertIn('link burnout-d01-t1 → burnout-d01 is listed twice', found)

    def test_path_candidates_order_two_or_more_screened_fixes(self):
        def change(doc):
            doc['pathCandidates'] = [{'fixIds': ['burnout-d00-t1'], 'reason': ''},
                                     {'fixIds': ['burnout-d00-t1', 'burnout-d99-t1'], 'reason': 'r'}]
        self.write('links.json', links_doc(), change)
        found = self.issues()
        self.assertIn('path candidate 1: needs two or more different fixes and a reason', found)
        self.assertIn('path candidate 2: burnout-d99-t1 is not a screened fix', found)

    def test_unlinked_fixes_stay_in_the_pool(self):
        self.write('plan.json', plan_doc(), lambda p: p['ceilings']['burnout-d00']['task'].update(max=3))
        self.write('fixes.json', fixes_doc(), lambda d: d['fixes'].update({'burnout-d00-t3': task_fix('burnout-d00', 3)}))
        self.write('screen.json', screen_doc(failing=('burnout-d01-t1',)), lambda d: d['results'].update(
            {'burnout-d00-t3': d['results']['burnout-d00-t2']}))
        self.write('links.json', links_doc(), lambda d: d['links'].__setitem__(2, link('burnout-d00-t3', 'burnout-d01', 1)))
        self.assertEqual(self.issues(), '')
        pool = self.status(self.run_dir)['fixes']
        self.assertEqual(pool['unlinked'], ['burnout-d01-t1'])
        self.assertEqual(pool['screenedOut'], ['burnout-d01-t1'])
        self.assertEqual(pool['total'], 11)
        self.assertIn('burnout-d01-t1', cards.read(self.run_dir / 'fixes.json')['fixes'])


class Gate(FixStages):
    def start(self, stage):
        return cli(self.tmp, 'start', str(self.run_dir), stage)

    def test_status_follows_the_files_from_plan_to_judge(self):
        self.assertEqual(self.status(self.run_dir)['next'], 'plan')
        self.write('plan.json', plan_doc())
        # Shared fixes (#95) are not built yet, so the stage passes once the plan exists.
        self.assertEqual(self.status(self.run_dir)['next'], 'kind-pools')
        self.write('fixes.json', fixes_doc(), lambda d: d.update(pools={}, fixes={}))
        self.assertEqual(self.status(self.run_dir)['next'], 'kind-pools')
        self.write('fixes.json', fixes_doc())
        self.assertEqual(self.status(self.run_dir)['next'], 'screen')
        self.write('screen.json', screen_doc())
        self.assertEqual(self.status(self.run_dir)['next'], 'assemble')
        self.write('links.json', links_doc())
        self.assertEqual(self.status(self.run_dir)['next'], 'judge')

    def test_kind_with_no_ceiling_above_zero_does_not_run(self):
        self.write('plan.json', plan_doc(task=0))
        self.assertEqual(self.status(self.run_dir)['next'], 'screen')
        self.write('plan.json', plan_doc(task=0), lambda p: p['ceilings']['burnout-d03']['task'].update(max=1))
        ready = self.start('kind-pools')
        self.assertEqual(ready.returncode, 0, ready.stderr)
        self.assertEqual(json.loads(ready.stdout)['kinds'], {'task': 'tools/possibilities/briefs/kinds/task.md'})

    def test_each_stage_names_its_brief(self):
        planned = self.start('plan')
        self.assertEqual(planned.returncode, 0, planned.stderr)
        self.assertEqual(json.loads(planned.stdout), {'run': self.run_dir.name, 'stage': 'plan',
                                                      'brief': 'tools/possibilities/briefs/planner.md', 'kinds': ['task']})
        self.write('plan.json', plan_doc())
        pools = json.loads(self.start('kind-pools').stdout)
        self.assertEqual(pools['brief'], 'tools/possibilities/briefs/kinds/_shared.md')
        self.write('fixes.json', fixes_doc())
        self.assertEqual(json.loads(self.start('screen').stdout)['brief'], 'tools/possibilities/briefs/screen.md')
        self.write('screen.json', screen_doc())
        self.assertEqual(json.loads(self.start('assemble').stdout)['brief'], 'tools/possibilities/briefs/assembler.md')

    def test_stages_refuse_to_start_out_of_order(self):
        for stage, pending in (('kind-pools', 'plan'), ('screen', 'plan'), ('assemble', 'plan')):
            result = self.start(stage)
            self.assertEqual(result.returncode, 2, stage)
            self.assertIn('%s cannot start: %s is not complete' % (stage, pending), result.stderr)
        self.write('plan.json', plan_doc())
        self.assertIn('kind-pools is not complete', self.start('assemble').stderr)

    def test_every_brief_the_helper_names_exists(self):
        root = cards.Path(cards.__file__).resolve().parents[2]
        for brief in list(cards.STAGE_BRIEFS.values()) + list(cards.KIND_BRIEFS.values()):
            self.assertTrue((root / brief).is_file(), brief)


if __name__ == '__main__':
    unittest.main()
