"""A dry staged generate on a fixture, driven the way /possibilities-generate --staged drives it (#98).

Each stub stage writes the file its agent would write. The flow stops at both founder reviews, and goes on once
their decisions are ingested.
"""
import json
import shutil
import unittest

from test_cards import ROOT, cards
from test_fix_stages import fixes_doc, links_doc, plan_doc, screen_doc, shared_pass_only
from test_judging import dream_judgments
from test_staged import StagedBase, cli, dreams_doc

REJECTED = 'burnout-d05'


class StagedFlow(StagedBase):
    def setUp(self):
        super().setUp()
        for page in ('dream-review', 'fix-review'):
            template = 'tools/possibilities/config/%s-page.template.html' % page
            shutil.copy(ROOT / template, self.tmp / template)
        result = cli(self.tmp, 'new-run', 'burnout', '--staged', '--pilot')
        self.assertEqual(result.returncode, 0, result.stderr)
        self.run_dir = self.tmp / json.loads(result.stdout)['run']

    def ok(self, *args):
        result = cli(self.tmp, *args)
        self.assertEqual(result.returncode, 0, result.stderr or result.stdout)
        return json.loads(result.stdout)

    def next(self):
        return self.ok('status', str(self.run_dir))['next']

    def agent(self, stage, name, doc):
        """A stage's agent: start names its brief, it writes its file, and the run still validates."""
        self.ok('start', str(self.run_dir), stage)
        cards.write(self.run_dir / name, doc)
        self.ok('validate', str(self.run_dir))

    def founder_stop(self, stage, build):
        refused = cli(self.tmp, 'start', str(self.run_dir), stage)
        self.assertEqual(refused.returncode, 2)
        self.assertIn('%s is a founder stop' % stage, refused.stderr)
        return self.ok(build, str(self.run_dir))

    def save(self, name, decisions):
        path = self.run_dir / 'reviews' / name
        cards.write(path, {'schemaVersion': 1, 'setId': 'burnout-' + self.run_dir.name,
                           'exportedAt': '2026-10-20T12:00:00Z', 'decisions': decisions})
        return str(path)

    def test_the_flow_stops_at_dream_review_and_after_ingest_goes_on_to_fix_review(self):
        self.assertEqual(self.next(), 'examples')
        self.ok('start', str(self.run_dir), 'examples')
        self.write_examples(self.run_dir)
        self.ok('validate', str(self.run_dir))
        self.assertEqual(self.next(), 'dreams')
        self.agent('dreams', 'dreams.json', dreams_doc())

        # The dream review stop: the flow can't go on until the founder's decisions are ingested.
        self.assertEqual(self.next(), 'dream-review')
        built = self.founder_stop('dream-review', 'dreams-review-build')
        self.assertTrue((self.tmp / cards.DATA_ROOT / 'runs' / built['page']).is_file())
        refused = cli(self.tmp, 'start', str(self.run_dir), 'plan')
        self.assertEqual(refused.returncode, 2)
        decisions = {key: {'decision': 'reject' if key == REJECTED else 'accept', 'note': '',
                           'decidedAt': '2026-10-20T12:00:00Z'} for key in dreams_doc()['dreams']}
        self.ok('dreams-ingest', str(self.run_dir), self.save('dreams-decisions.json', decisions))

        # A pilot run plans the trial kinds without any edit to run.json.
        self.assertEqual(self.next(), 'plan')
        kinds = self.ok('start', str(self.run_dir), 'plan')['kinds']
        self.assertTrue({'leave', 'switch'} <= set(kinds))
        self.agent('plan', 'plan.json', plan_doc(kinds=kinds))
        shared = fixes_doc()
        shared_pass_only(shared)
        self.agent('shared-fixes', 'fixes.json', shared)
        self.assertEqual(self.next(), 'kind-pools')
        self.assertEqual(list(self.ok('start', str(self.run_dir), 'kind-pools')['kinds']), ['task'])
        self.agent('kind-pools', 'fixes.json', fixes_doc())
        self.agent('screen', 'screen.json', screen_doc())
        self.agent('assemble', 'links.json', links_doc())

        # The judge panel: three isolated judges, then consensus and select.
        self.assertEqual(self.next(), 'judge')
        self.ok('start', str(self.run_dir), 'judge')
        for n in (1, 2, 3):
            cards.write(self.run_dir / ('judgments-%d.json' % n), dream_judgments())
        self.ok('consensus', str(self.run_dir))
        self.ok('select', str(self.run_dir))

        # The fix review stop, then done.
        self.assertEqual(self.next(), 'fix-review')
        self.founder_stop('fix-review', 'fixes-review-build')
        proposals = cards.read(self.run_dir / 'reviews/fix-proposals.json')['proposals']
        decisions = {p['id']: {'decision': 'accept', 'note': '', 'decidedAt': '2026-10-20T13:00:00Z',
                               'links': [entry['dreamId'] for entry in p['links']]} for p in proposals}
        self.ok('fixes-ingest', str(self.run_dir), self.save('fixes-decisions.json', decisions))
        self.assertEqual(self.next(), 'done')


if __name__ == '__main__':
    unittest.main()
