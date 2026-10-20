"""Ask, Use a resource, and the trial kinds Leave and Switch, which only a pilot run accepts (#94)."""
import json
import re
import unittest

from test_cards import cards
from test_fix_stages import DREAMS, FixStages, cli, fixes_doc, plan_doc, shared_pass_only, task_fix

TRIALS = ('leave', 'switch')


def ask_fix(dream):
    fix = task_fix(dream, 1)
    fix.update(title='Ask your manager for no meetings after 4 p.m.', whatChanges='Most managers say yes to one clear request.',
               kind='ask', origin='kind:ask',
               method={'decisionMaker': 'your manager', 'request': 'No meetings after 4 p.m. on weekdays.'},
               firstStep='Write the one-line request in a note to your manager.')
    return fix


def resource_fix(dream, status='existing_resource'):
    fix = task_fix(dream, 2)
    fix.update(title='Call your employee assistance line', whatChanges='Most large employers pay for a few free counseling sessions.',
               kind='resource', origin='kind:resource', status=status,
               method={'provider': 'your employer, through an outside counseling service', 'eligibility': 'employees and their households',
                       'access': 'the phone number in the benefits portal', 'bring': 'your employee ID'},
               firstStep='Find the assistance line number in your benefits portal.')
    return fix


def trial_fix(dream, kind):
    fix = task_fix(dream, 3)
    method = {'leave': {'leaving': 'the after-hours work chat', 'tradeOff': 'You may hear about changes a day later.'},
              'switch': {'switchFrom': 'a bank that charges overdraft fees', 'switchTo': 'a credit union with no overdraft fees',
                         'tradeOff': 'Fewer branches and a week of moving payments.'}}[kind]
    title = {'leave': 'Leave the after-hours work chat', 'switch': 'Move your checking account to a credit union'}[kind]
    fix.update(title=title, whatChanges='The evening stays yours.', kind=kind, origin='kind:' + kind, method=method,
               firstStep='Compare two options tonight.')
    return fix


def with_kinds(*kinds):
    """A full Task pool, plus one fix of each kind for burnout-d00, and that kind's pool."""
    def change(doc):
        for kind in kinds:
            fix = {'ask': ask_fix, 'resource': resource_fix}.get(kind, lambda d: trial_fix(d, kind))('burnout-d00')
            doc['fixes']['burnout-d00-%s1' % kind] = fix
            doc['pools'][kind] = {'shortfalls': {}}
    return change


def ceilings(*kinds, trials=False):
    """plan_doc, with a ceiling of 1 on burnout-d00 for each kind named; trials adds rows for the trial kinds."""
    plan = plan_doc(kinds=list(cards.KIND_BRIEFS) + (list(TRIALS) if trials else []))
    for kind in kinds:
        plan['ceilings']['burnout-d00'][kind] = {'max': 1, 'reason': 'One clear fix fits.'}
    return plan


class Kinds(FixStages):
    def pilot(self):
        meta = cards.read(self.run_dir / 'run.json')
        meta['pilot'] = True
        cards.write(self.run_dir / 'run.json', meta)

    def pool(self, *kinds, change=None, pilot=False):
        self.write('plan.json', ceilings(*kinds, trials=pilot))
        doc = fixes_doc()
        with_kinds(*kinds)(doc)
        self.write('fixes.json', doc, change)
        return self.issues()


class Ask(Kinds):
    def test_ask_with_a_decision_maker_and_a_request_is_valid(self):
        self.assertEqual(self.pool('ask'), '')

    def test_ask_without_a_decision_maker_fails(self):
        found = self.pool('ask', change=lambda d: d['fixes']['burnout-d00-ask1']['method'].pop('decisionMaker'))
        self.assertIn('fix burnout-d00-ask1: method needs decisionMaker', found)

    def test_ask_without_a_request_fails(self):
        found = self.pool('ask', change=lambda d: d['fixes']['burnout-d00-ask1']['method'].update(request=' '))
        self.assertIn('fix burnout-d00-ask1: method needs request', found)


class UseAResource(Kinds):
    def test_resource_with_an_existing_or_real_status_is_valid(self):
        self.assertEqual(self.pool('resource'), '')
        self.assertEqual(self.pool('resource', change=lambda d: d['fixes']['burnout-d00-resource1'].update(status='real_now')), '')

    def test_resource_marked_as_an_it_feature_fails(self):
        found = self.pool('resource', change=lambda d: d['fixes']['burnout-d00-resource1'].update(status='proposed_it_feature'))
        self.assertIn('fix burnout-d00-resource1: a resource fix has status existing_resource or real_now', found)

    def test_resource_marked_as_a_societal_proposal_fails(self):
        found = self.pool('resource', change=lambda d: d['fixes']['burnout-d00-resource1'].update(status='societal_proposal'))
        self.assertIn('fix burnout-d00-resource1: a resource fix has status existing_resource or real_now', found)

    def test_resource_needs_who_runs_it_who_qualifies_how_to_reach_it_and_what_to_bring(self):
        found = self.pool('resource', change=lambda d: d['fixes']['burnout-d00-resource1'].update(method={}))
        for field in ('provider', 'eligibility', 'access', 'bring'):
            self.assertIn('fix burnout-d00-resource1: method needs ' + field, found)


class TrialKinds(Kinds):
    def test_switch_fix_outside_a_pilot_run_fails(self):
        self.write('plan.json', ceilings())
        self.write('fixes.json', fixes_doc(), with_kinds('switch'))
        found = self.issues()
        self.assertIn('fix burnout-d00-switch1: switch is a trial kind, accepted only in a pilot run', found)
        self.assertIn('pool switch: switch is a trial kind, accepted only in a pilot run', found)

    def test_plan_outside_a_pilot_run_cannot_set_a_trial_ceiling(self):
        self.write('plan.json', ceilings('leave', trials=True))
        self.assertIn('plan burnout-d00 leave: leave is a trial kind, accepted only in a pilot run', self.issues())

    def test_pilot_run_accepts_leave_and_switch(self):
        self.pilot()
        self.assertEqual(self.pool('leave', 'switch', pilot=True), '')

    def test_pilot_plan_sets_a_ceiling_for_the_trial_kinds(self):
        self.pilot()
        self.write('plan.json', ceilings())
        found = self.issues()
        for kind in TRIALS:
            self.assertIn('plan burnout-d00: no ceiling for ' + kind, found)

    def test_trial_kinds_need_their_method_fields(self):
        self.pilot()
        def empty(doc):
            for kind in TRIALS:
                doc['fixes']['burnout-d00-%s1' % kind]['method'] = {}
        found = self.pool('leave', 'switch', change=empty, pilot=True)
        for fix, fields in (('leave1', ('leaving', 'tradeOff')), ('switch1', ('switchFrom', 'switchTo', 'tradeOff'))):
            for field in fields:
                self.assertIn('fix burnout-d00-%s: method needs %s' % (fix, field), found)

    def test_only_a_pilot_run_plans_and_drafts_the_trial_kinds(self):
        start = lambda stage: json.loads(cli(self.tmp, 'start', str(self.run_dir), stage).stdout)
        self.assertEqual(start('plan')['kinds'], list(cards.KIND_BRIEFS))
        self.pilot()
        self.assertEqual(start('plan')['kinds'], list(cards.KIND_BRIEFS) + list(TRIALS))
        self.write('plan.json', ceilings('switch', trials=True))
        self.write('fixes.json', fixes_doc(), shared_pass_only)
        self.assertEqual(start('kind-pools')['kinds'], {'task': cards.KIND_BRIEFS['task'], 'switch': cards.TRIAL_KIND_BRIEFS['switch']})


class Briefs(unittest.TestCase):
    root = cards.Path(cards.__file__).resolve().parents[2]

    def test_every_kind_has_a_brief_and_method_fields(self):
        kinds = {**cards.KIND_BRIEFS, **cards.TRIAL_KIND_BRIEFS}
        self.assertTrue({'task', 'ask', 'resource'} <= set(cards.KIND_BRIEFS))
        self.assertEqual(set(cards.TRIAL_KIND_BRIEFS), set(TRIALS))
        for kind, brief in kinds.items():
            self.assertTrue((self.root / brief).is_file(), brief)
            self.assertIn(kind, cards.METHOD_FIELDS)

    def test_copy_guide_lists_the_new_kinds_with_leave_and_switch_on_trial(self):
        guide = (self.root / 'docs/style/copy-style-guide.md').read_text()
        rows = {m.group(1): m.group(0) for m in re.finditer(r'^\| \*\*([^*]+)\*\*.*$', guide, re.M)}
        for name, icon in (('Ask', 'message-circle-question'), ('Use a resource', 'life-buoy'),
                           ('Leave', 'door-open'), ('Switch', 'arrow-left-right')):
            self.assertIn('`%s`' % icon, rows.get(name, ''), name)
        for name in ('Leave', 'Switch'):
            self.assertIn('trial', rows[name].lower(), name)


if __name__ == '__main__':
    unittest.main()
