import copy
import importlib.util
import json
from pathlib import Path
import re
import shutil
import subprocess
import sys
import tempfile
import unittest

ROOT = Path(__file__).resolve().parents[3]
SCRIPT = ROOT / 'tools/pains/catalog.py'
spec = importlib.util.spec_from_file_location('catalog', SCRIPT)
catalog = importlib.util.module_from_spec(spec)
spec.loader.exec_module(catalog)


def pain(pain_id, group='money', page='personal', **extra):
    record = {'id': pain_id, 'name': pain_id.replace('-', ' ').capitalize(), 'line': 'I worry about %s.' % pain_id,
              'page': page, 'group': group, 'secondaryGroups': [], 'status': 'accepted', 'role': 'shown',
              'sensitive': False, 'evidence': [], 'leads': [], 'maps': {}, 'aliases': [], 'relations': [],
              'founderPool': None, 'covers': [], 'history': []}
    record.update(extra)
    return record


def small_catalog():
    return {'schemaVersion': 1,
            'groups': [{'id': 'money', 'name': 'Money', 'page': 'personal', 'order': 2},
                       {'id': 'home', 'name': 'Home', 'page': 'personal', 'order': 4},
                       {'id': 'economy', 'name': 'Economy', 'page': 'societal', 'order': 1}],
            'pains': {'broke': pain('broke'), 'debt': pain('debt'),
                      'homeless': pain('homeless', 'home'),
                      'homelessness': pain('homelessness', 'economy', 'societal')}}


class Base(unittest.TestCase):
    def setUp(self):
        self.tmp = Path(tempfile.mkdtemp())
        self.addCleanup(shutil.rmtree, self.tmp)

    def repo(self, catalog_doc=None):
        """A minimal repository root for CLI runs."""
        (self.tmp / 'openspec').mkdir(exist_ok=True)
        (self.tmp / 'openspec/config.yaml').write_text('schema: spec-driven\n')
        if catalog_doc is not None:
            catalog.write(self.tmp / catalog.CATALOG, catalog_doc)
        return self.tmp

    def cli(self, *args):
        return subprocess.run([sys.executable, str(SCRIPT), *args, '--root', str(self.tmp)], capture_output=True, text=True)


class SeedTest(Base):
    def test_seed_keeps_every_inventory_id(self):
        seeded = catalog.seed(ROOT)
        text = (ROOT / catalog.INVENTORY).read_text()
        inventory_ids = re.findall(r'^  - id: (\S+)$', text, re.M)
        self.assertEqual(len(inventory_ids), 125)
        self.assertEqual(sorted(seeded['pains']), sorted(inventory_ids))

    def test_published_pains_are_accepted_and_shown_others_are_candidates(self):
        seeded = catalog.seed(ROOT)
        published = {p['id'] for d in catalog.read(ROOT / catalog.PUBLISHED)['domains'] for p in d['pains']}
        for key, p in seeded['pains'].items():
            if key in published:
                self.assertEqual((p['status'], p['role']), ('accepted', 'shown'), key)
            else:
                self.assertEqual((p['status'], p['role']), ('candidate', 'not-shown'), key)

    def test_seed_keeps_wording_maps_and_overlaps(self):
        p = catalog.seed(ROOT)['pains']['poor-sleep']
        self.assertEqual((p['name'], p['line'], p['group']), ('Sleep', "I don't sleep well.", 'body'))
        self.assertEqual(p['maps']['whoqol'], ['Q16', 'Q10'])
        self.assertEqual(p['maps']['wikidata']['qid'], 'Q1869874')
        self.assertIn({'kind': 'overlaps', 'id': 'always-tired'}, p['relations'])
        self.assertIn('Poor sleep', p['aliases'])

    def test_committed_catalog_matches_a_fresh_seed_and_validates(self):
        committed = catalog.load(ROOT)
        self.assertEqual(catalog.validate(committed), [])
        self.assertTrue(set(catalog.seed(ROOT)['pains']) <= set(committed['pains']))

    def test_flow_map_with_colon_inside_text(self):
        value, comment = catalog.scalar('{qid: Q42844, label: "major depressive disorder", note: "approximate: clinical term, broader"}  # x')
        self.assertEqual(value, {'qid': 'Q42844', 'label': 'major depressive disorder', 'note': 'approximate: clinical term, broader'})
        self.assertEqual(comment, 'x')

    def test_null_with_comment(self):
        self.assertEqual(catalog.scalar('null  # searched for "anger"; no good item'), (None, 'searched for "anger"; no good item'))

    def test_seed_refuses_to_overwrite(self):
        self.repo(small_catalog())
        result = self.cli('seed')
        self.assertEqual(result.returncode, 2)
        self.assertIn('exists', result.stderr)


class ValidateTest(Base):
    def issues(self, doc):
        return catalog.validate(doc)

    def test_small_catalog_valid(self):
        self.assertEqual(self.issues(small_catalog()), [])

    def test_missing_line_names_pain_and_field(self):
        doc = small_catalog()
        del doc['pains']['debt']['line']
        self.assertIn('pain debt: missing line', self.issues(doc))

    def test_missing_page(self):
        doc = small_catalog()
        doc['pains']['debt']['page'] = ''
        self.assertIn('pain debt: missing page', self.issues(doc))

    def test_relation_kind_and_target(self):
        doc = small_catalog()
        doc['pains']['broke']['relations'] = [{'kind': 'cousin', 'id': 'debt'}, {'kind': 'overlaps', 'id': 'nowhere'}]
        found = ' '.join(self.issues(doc))
        self.assertIn('relation kind must be one of', found)
        self.assertIn('unknown pain nowhere', found)

    def test_only_accepted_pains_can_be_shown(self):
        doc = small_catalog()
        doc['pains']['debt']['status'] = 'candidate'
        self.assertIn('pain debt: only an accepted pain can be shown', self.issues(doc))

    def test_group_must_be_on_the_same_page(self):
        doc = small_catalog()
        doc['pains']['debt']['group'] = 'economy'
        self.assertTrue(any('economy is on the societal page' in i for i in self.issues(doc)))

    def test_evidence_needs_an_opened_source(self):
        doc = small_catalog()
        doc['pains']['debt']['evidence'] = [{'url': 'https://example.org', 'accessed': '2026-10-19'}]
        self.assertIn('pain debt: evidence needs passage from an opened source', self.issues(doc))

    def test_merged_needs_one_target(self):
        doc = small_catalog()
        doc['pains']['homeless'].update(status='merged', role='not-shown')
        self.assertIn('pain homeless: a merged pain needs exactly one merged-into relation', self.issues(doc))
        doc['pains']['debt']['relations'] = [{'kind': 'merged-into', 'id': 'broke'}]
        self.assertIn('pain debt: only a merged pain has merged-into', self.issues(doc))

    def test_reused_id_in_file_is_rejected(self):
        path = self.tmp / 'catalog.json'
        text = json.dumps(small_catalog(), indent=2)
        duplicate = text.replace('"debt": {', '"broke": {"id": "broke"}, "debt": {', 1)
        path.write_text(duplicate)
        with self.assertRaises(catalog.CheckError):
            catalog.read(path)

    def test_validate_cli_exit_codes(self):
        doc = small_catalog()
        self.repo(doc)
        self.assertEqual(self.cli('validate').returncode, 0)
        doc['pains']['debt']['role'] = 'maybe'
        self.repo(doc)
        self.assertEqual(self.cli('validate').returncode, 1)


class ResolveTest(Base):
    def merged(self):
        doc = small_catalog()
        doc['pains']['homeless'].update(status='merged', role='not-shown', relations=[{'kind': 'merged-into', 'id': 'homelessness'}])
        return doc

    def test_merged_id_resolves_to_survivor(self):
        record, notes = catalog.resolve(self.merged(), 'homeless')
        self.assertEqual(record['id'], 'homelessness')
        self.assertEqual(notes, ['homeless was merged into homelessness'])

    def test_unknown_id(self):
        with self.assertRaises(KeyError):
            catalog.resolve(small_catalog(), 'nowhere')

    def test_merge_loop(self):
        doc = self.merged()
        doc['pains']['homelessness'].update(status='merged', role='not-shown', relations=[{'kind': 'merged-into', 'id': 'homeless'}])
        with self.assertRaises(catalog.CheckError):
            catalog.resolve(doc, 'homeless')


class RenderTest(Base):
    def test_render_lists_groups_and_marks_sensitive(self):
        doc = small_catalog()
        doc['pains']['debt']['sensitive'] = True
        text = catalog.render(doc, self.tmp)
        self.assertIn('### Money (2 shown)', text)
        self.assertIn('accepted · sensitive', text)
        self.assertIn('4 pains: 4 shown', text)


def source(url='https://example.org/scams', passage='1 in 10 adults lost money to a scam last year.'):
    return {'url': url, 'accessed': '2026-10-19', 'passage': passage}


def candidate(cid, **extra):
    c = {'id': cid, 'name': cid.replace('-', ' ').capitalize(), 'line': 'I lost money to %s.' % cid, 'page': 'personal',
         'group': 'money', 'sources': [source()], 'covers': [{'list': 'gallup-mip', 'entry': cid}]}
    c.update(extra)
    return c


class DiscoverTest(Base):
    def check(self, doc, *cands):
        return catalog.check_candidates(doc, {'candidates': {c['id']: c for c in cands}})

    def test_sweep_new_makes_a_run_per_call(self):
        self.repo(small_catalog())
        first = catalog.sweep_new(self.tmp, 'money')
        self.assertTrue((self.tmp / first['run'] / 'sweep.json').is_file())
        self.assertEqual(sorted(p['id'] for p in first['known']), ['broke', 'debt'])
        self.assertIn('homelessness', first['allIds'])
        with self.assertRaises(KeyError):
            catalog.sweep_new(self.tmp, 'nowhere')

    def test_sourced_candidate_is_proposed(self):
        result = self.check(small_catalog(), candidate('scams-and-fraud'))
        self.assertEqual(result['issues'], [])
        self.assertEqual(result['proposed'], [{'candidate': 'scams-and-fraud'}])

    def test_lead_only_candidate_stays_draft_unless_founders_own(self):
        lead = candidate('insurance-costs', sources=[], leads=['founder pool: insurance'])
        own = candidate('gig-pay', sources=[], ownPain=True)
        result = self.check(small_catalog(), lead, own)
        self.assertEqual(result['drafts'], [{'candidate': 'insurance-costs'}])
        self.assertEqual(result['proposed'], [{'candidate': 'gig-pay'}])

    def test_source_outside_the_list_follows_the_same_rules(self):
        survey = source('https://www.cdc.gov/nchs/nhis/index.html', 'National Health Interview Survey')
        self.assertEqual(self.check(small_catalog(), candidate('cant-afford-meds', sources=[survey]))['issues'], [])
        broken = candidate('cant-afford-meds', sources=[{'url': 'https://www.cdc.gov/nchs/nhis/index.html'}])
        self.assertTrue(self.check(small_catalog(), broken)['issues'])

    def test_unsourced_figure_fails(self):
        c = candidate('scams-and-fraud', prevalence='affects 1 in 4 adults')
        self.assertIn('candidate scams-and-fraud: prevalence figure 4 is not in any cited passage', self.check(small_catalog(), c)['issues'])
        ok = candidate('scams-and-fraud', prevalence='1 in 10 adults')
        self.assertEqual(self.check(small_catalog(), ok)['issues'], [])

    def test_reusing_an_id_fails(self):
        self.assertIn('candidate debt: ID already used by a catalog record; IDs are never reused',
                      self.check(small_catalog(), candidate('debt'))['issues'])

    def test_alias_match_is_skipped_and_records_coverage(self):
        doc = small_catalog()
        doc['pains']['broke']['aliases'] = ['Short on cash']
        result = self.check(doc, candidate('cash-short', name='Short on cash'))
        self.assertEqual(result['skipped'], [{'candidate': 'cash-short', 'reason': 'matches pain broke'}])
        self.assertEqual(result['covered'], [{'list': 'gallup-mip', 'entry': 'cash-short', 'painId': 'broke'}])

    def test_rejected_candidate_found_again_is_skipped(self):
        doc = small_catalog()
        doc['pains']['scams'] = pain('scams', status='rejected', role='not-shown', evidence=[source()],
                                     covers=[{'list': 'gallup-mip', 'entry': 'scams'}],
                                     history=[{'date': '2026-10-20', 'kind': 'reject', 'note': 'too narrow'}])
        again = candidate('scams-again', covers=[{'list': 'gallup-mip', 'entry': 'scams'}])
        self.assertEqual(self.check(doc, again)['skipped'], [{'candidate': 'scams-again', 'reason': 'rejected earlier as scams'}])

    def test_rejected_candidate_with_new_evidence_returns(self):
        doc = small_catalog()
        doc['pains']['scams'] = pain('scams', status='rejected', role='not-shown', evidence=[source()],
                                     history=[{'date': '2026-10-20', 'kind': 'reject', 'note': 'too narrow'}])
        again = candidate('scams-again', name='Scams', newEvidence=True,
                          sources=[source('https://www.ftc.gov/data', 'Consumers reported losing money to fraud.')])
        proposed = self.check(doc, again)['proposed']
        self.assertEqual(proposed[0]['newEvidence'], True)
        self.assertEqual(proposed[0]['rejection']['note'], 'too narrow')

    def test_duplicate_candidates_in_one_sweep(self):
        result = self.check(small_catalog(), candidate('scams-and-fraud'), candidate('fraud', name='Scams and fraud'))
        self.assertEqual(result['skipped'], [{'candidate': 'fraud', 'reason': 'duplicate of candidate scams-and-fraud'}])


class CoverageTest(Base):
    def sweep(self, mapping, cands=()):
        doc = small_catalog()
        doc['pains']['broke']['covers'] = [{'list': 'gallup-mip', 'entry': 'economy'}]
        doc['pains']['old-idea'] = pain('old-idea', status='rejected', role='not-shown', covers=[{'list': 'gallup-mip', 'entry': 'gas'}])
        self.repo(doc)
        run = self.tmp / catalog.SWEEPS / 'money' / '20261019-000000'
        run.mkdir(parents=True)
        catalog.write(run / 'lists.json', {'lists': {'gallup-mip': {
            'name': 'Gallup Most Important Problem', 'url': 'https://news.gallup.com/poll/1675/most-important-problem.aspx',
            'accessed': '2026-10-19', 'entries': {e: {'name': e.capitalize()} for e in ('economy', 'debt', 'gas', 'scams', 'moon', 'unions')}}}})
        catalog.write(run / 'mapping.json', {'entries': mapping})
        catalog.write(run / 'candidates.json', {'candidates': {c['id']: c for c in cands}})
        catalog.sweep_check(self.tmp, run)
        return catalog.coverage(self.tmp, run)

    def test_shares_and_reasons(self):
        result = self.sweep({'gallup-mip/debt': {'painId': 'debt', 'why': 'same pain'},
                             'gallup-mip/moon': {'outOfScope': 'not a human pain'},
                             'gallup-mip/unions': {'broader': 'debt'}},
                            [candidate('scams', covers=[{'list': 'gallup-mip', 'entry': 'scams'}])])
        row = result['lists']['gallup-mip']
        self.assertEqual((row['covered'], row['entries'], row['share'], row['meetsTarget']), (2, 6, 0.333, False))
        reasons = {u['entry']: u['reason'] for u in row['uncovered']}
        self.assertEqual(reasons['moon'], 'out of scope: not a human pain')
        self.assertEqual(reasons['unions'], 'covered by a broader pain: debt')
        self.assertEqual(reasons['scams'], 'waiting for review: scams')
        self.assertEqual(reasons['gas'], 'rejected by the founder as old-idea')
        self.assertEqual(result['issues'], [])
        text = (self.tmp / catalog.SWEEPS / 'money/20261019-000000/coverage.md').read_text()
        self.assertIn('2 of 6', text)

    def test_entry_without_reason_is_an_issue(self):
        result = self.sweep({})
        self.assertIn('gallup-mip/moon: uncovered entry has no reason', result['issues'])


class LintTest(unittest.TestCase):
    config = catalog.lint_config()

    def rules(self, name, line, pain_id='poor-sleep', sensitive=False, severity=None):
        return [i['rule'] for i in catalog.lint_wording(name, line, pain_id, sensitive, self.config)
                if severity is None or i['severity'] == severity]

    def test_good_line_passes(self):
        self.assertEqual(self.rules('Sleep', "I don't sleep well."), [])

    def test_mismatched_id_is_flagged(self):
        self.assertIn('id-mismatch', self.rules('Addiction', "I can't stop something that's hurting me.", 'drinking-too-much'))

    def test_first_person_and_one_sentence(self):
        self.assertIn('not-first-person', self.rules('Sleep', 'Sleep is hard.'))
        self.assertIn('line-length', self.rules('Sleep', "I don't sleep. It's bad."))
        self.assertIn('line-length', self.rules('Sleep', 'Why am I awake?'))

    def test_vague_line(self):
        self.assertIn('vague-line', self.rules('Stress', "I'm overwhelmed.", 'overwhelmed'))

    def test_loaded_regional_and_clinical(self):
        self.assertIn('loaded-term', self.rules('Immigration', 'I see an invasion at the border.', 'immigration-broken'))
        self.assertIn('regional-word', self.rules('Neighbours', "I don't know my neighbours.", 'nobody-knows-anybody'))
        self.assertIn('clinical-term', self.rules('Depression', 'I have major depressive disorder.', 'feeling-down'))

    def test_graphic_wording_on_sensitive_pain_is_a_note_that_passes(self):
        line = 'Someone in my home abuses me.'
        self.assertEqual(self.rules('Abuse at home', 'I live with abuse at home.', 'unsafe-at-home', True, 'fail'), [])
        self.assertEqual(set(self.rules('Abuse at home', 'I live with abuse at home.', 'unsafe-at-home', True, 'note')), {'graphic-wording'})
        self.assertEqual(self.rules('Abuse at home', 'I live with abuse at home.', 'unsafe-at-home', False), [])
        self.assertNotIn('graphic-wording', self.rules('Safety at home', line, 'unsafe-at-home', False))


class RefineTest(Base):
    def setUp(self):
        super().setUp()
        doc = small_catalog()
        doc['groups'] += [{'id': 'body', 'name': 'Body', 'page': 'personal', 'order': 0},
                          {'id': 'safety', 'name': 'Safety', 'page': 'societal', 'order': 7}]
        doc['pains']['poor-sleep'] = pain('poor-sleep', 'body', name='Sleep', line="I don't sleep well.",
                                          relations=[{'kind': 'overlaps', 'id': 'always-tired'}])
        doc['pains']['always-tired'] = pain('always-tired', 'body', name='Tired', line="I'm tired all the time.")
        doc['pains']['overwhelmed'] = pain('overwhelmed', 'body', name='Stress', line="I'm overwhelmed.")
        self.doc = doc
        self.repo(doc)
        self.run = self.tmp / catalog.refine_new(self.tmp, 'personal')['run']

    def put(self, name, data):
        catalog.write(self.run / name, data)

    def sorts(self, *placements):
        for n, pl in enumerate(placements, 1):
            catalog.write(self.run / 'sorts' / ('%d.json' % n), {'sorter': 'isolated', 'placements': pl})

    def full(self, **moves):
        base = {k: p['group'] for k, p in self.doc['pains'].items() if p['page'] == 'personal'}
        base.update(moves)
        return base

    def test_failing_pain_needs_alternatives_that_pass(self):
        catalog.refine_lint(self.tmp, self.run)
        self.sorts(self.full(), self.full(), self.full())
        self.put('overlaps.json', {'pairs': [{'a': 'poor-sleep', 'b': 'always-tired', 'action': 'keep', 'reason': 'Sleep is the night, Tired is the day.'}]})
        self.assertIn('pain overwhelmed fails lint but has no alternatives', catalog.refine_check(self.tmp, self.run)['issues'])
        self.put('alternatives.json', {'alternatives': {'overwhelmed': [
            {'name': 'Stress', 'line': 'I have too much on my plate to think straight.'},
            {'name': 'Stress', 'line': "I'm stressed."}]}})
        issues = catalog.refine_check(self.tmp, self.run)['issues']
        self.assertEqual(len(issues), 1)
        self.assertIn('fails lint (vague-line)', issues[0])
        self.put('alternatives.json', {'alternatives': {'overwhelmed': [{'name': 'Stress', 'line': 'I have too much on my plate to think straight.'}] * 3}})
        self.assertIn('pain overwhelmed: offer one or two alternatives', catalog.refine_check(self.tmp, self.run)['issues'])

    def test_every_overlap_needs_an_action(self):
        self.sorts(self.full(), self.full(), self.full())
        self.assertIn('overlap poor-sleep/always-tired has no proposed action', catalog.refine_check(self.tmp, self.run)['issues'])
        self.put('overlaps.json', {'pairs': [{'a': 'poor-sleep', 'b': 'always-tired', 'action': 'merge', 'reason': 'Same pain.'}]})
        self.assertIn('overlap poor-sleep/always-tired: a merge names the surviving ID', catalog.refine_check(self.tmp, self.run)['issues'])
        self.put('overlaps.json', {'pairs': [{'a': 'poor-sleep', 'b': 'always-tired', 'action': 'merge', 'survivor': 'poor-sleep',
                                              'reason': 'Same pain. People pick either.'}]})
        self.assertIn('overlap poor-sleep/always-tired: give a one-sentence reason', catalog.refine_check(self.tmp, self.run)['issues'])

    def test_two_of_three_sorts_propose_a_move(self):
        self.put('overlaps.json', {'pairs': [{'a': 'poor-sleep', 'b': 'always-tired', 'action': 'keep', 'reason': 'Different.'}]})
        self.sorts(self.full(homeless='money'), self.full(homeless='money'), self.full(debt='home'))
        result = catalog.refine_check(self.tmp, self.run)
        self.assertEqual(result['moves'], [{'painId': 'homeless', 'from': 'home', 'to': 'money', 'sorts': ['money', 'money', 'home']}])
        self.assertEqual({d['painId'] for d in result['disagreements']}, {'homeless', 'debt'})

    def test_needs_three_sorts(self):
        self.sorts(self.full(), self.full())
        self.assertIn('need at least 3 blind card sorts in sorts/; found 2', catalog.refine_check(self.tmp, self.run)['issues'])

    def test_sort_input_is_blind(self):
        shown = catalog.sort_input(self.tmp, self.run, 3)
        self.assertTrue(all(set(p) == {'id', 'name', 'line'} for p in shown['pains']))
        self.assertEqual({g['id'] for g in shown['groups']}, {'money', 'home', 'body'})

    def test_small_group_is_flagged(self):
        doc = small_catalog()
        doc['groups'].append({'id': 'safety', 'name': 'Safety', 'page': 'societal', 'order': 7})
        for i in range(6):
            doc['pains']['e%d' % i] = pain('e%d' % i, 'economy', 'societal')
        doc['pains']['crime'] = pain('crime', 'safety', 'societal')
        flags = catalog.balance(doc, 'societal')['flags']
        self.assertIn({'group': 'safety', 'shown': 1, 'median': 4.0, 'flag': 'small'}, flags)

    def test_seeded_catalog_flags_safety_small_and_people_large(self):
        flags = {f['group']: f['flag'] for f in catalog.balance(catalog.seed(ROOT), 'all')['flags']}
        self.assertEqual((flags.get('safety'), flags.get('people')), ('small', 'large'))


def fixture_runs(base):
    """A checked sweep and refine run on a small catalog, ready for review-build. Returns (sweep, refine)."""
    doc = small_catalog()
    doc['groups'].append({'id': 'body', 'name': 'Body', 'page': 'personal', 'order': 0})
    doc['pains']['poor-sleep'] = pain('poor-sleep', 'body', name='Sleep', line="I don't sleep well.",
                                      relations=[{'kind': 'overlaps', 'id': 'always-tired'}])
    doc['pains']['always-tired'] = pain('always-tired', 'body', name='Tired', line="I'm tired all the time.")
    doc['pains']['overwhelmed'] = pain('overwhelmed', 'body', name='Stress', line="I'm overwhelmed.")
    (base / 'openspec').mkdir(exist_ok=True)
    (base / 'openspec/config.yaml').write_text('schema: spec-driven\n')
    catalog.write(base / catalog.CATALOG, doc)
    sweep = base / catalog.sweep_new(base, 'money')['run']
    catalog.write(sweep / 'candidates.json', {'candidates': {
        'scams-and-fraud': candidate('scams-and-fraud', name='Scams', line='I lost money to a scam.', prevalence='1 in 10 adults'),
        'insurance-costs': candidate('insurance-costs', name='Insurance', line="I can't afford insurance.", sources=[], leads=['pool'])}})
    catalog.sweep_check(base, sweep)
    refine = base / catalog.refine_new(base, 'personal')['run']
    catalog.refine_lint(base, refine)
    catalog.write(refine / 'alternatives.json', {'alternatives': {'overwhelmed': [
        {'name': 'Stress', 'line': 'I have too much on my plate to think straight.', 'why': 'Something to picture.'},
        {'name': 'Too much', 'line': 'I have more to do than hours in the day.', 'why': 'Names the cause.'}]}})
    catalog.write(refine / 'overlaps.json', {'pairs': [{'a': 'poor-sleep', 'b': 'always-tired', 'action': 'merge',
                                                        'survivor': 'poor-sleep', 'reason': 'People pick either for the same nights.'}]})
    full = {k: p['group'] for k, p in doc['pains'].items() if p['page'] == 'personal'}
    for n, moved in enumerate(({'homeless': 'money'}, {'homeless': 'money'}, {}), 1):
        catalog.write(refine / 'sorts' / ('%d.json' % n), {'sorter': 'isolated', 'placements': {**full, **moved}})
    assert catalog.refine_check(base, refine)['issues'] == []
    return sweep, refine


class ReviewTest(Base):
    def test_build_collects_every_kind_and_injects_the_page(self):
        sweep, refine = fixture_runs(self.tmp)
        out = catalog.review_build(self.tmp, [sweep, refine], 'pilot')
        self.assertEqual(out['byKind'], {'add': 2, 'merge': 1, 'move': 1, 'reword': 1})
        folder = self.tmp / out['set']
        doc = catalog.read(folder / 'proposals.json')
        add = next(p for p in doc['proposals'] if p['painIds'] == ['insurance-costs'])
        self.assertTrue(add['draft'])
        self.assertEqual([a['role'] for a in [add['proposed']] + add['alternatives']], ['not-shown', 'shown'])
        html = (folder / 'review.html').read_text()
        self.assertNotIn('/*__DATA__*/', html)
        self.assertIn('I have too much on my plate', html)
        self.assertNotIn('"payload"', html)

    def test_later_proposals_return(self):
        sweep, refine = fixture_runs(self.tmp)
        catalog.write(self.tmp / catalog.LATER, {'proposals': [{'kind': 'reword', 'painIds': ['debt'], 'group': 'money',
            'current': {'name': 'Debt', 'line': 'I owe.'}, 'proposed': {'name': 'Debt', 'line': 'I owe more than I earn.'},
            'alternatives': [], 'why': {'prompt': 'later'}, 'allowOwn': True, 'payload': {}}]})
        out = catalog.review_build(self.tmp, [refine])
        self.assertEqual(out['later'], 1)
        self.assertEqual(catalog.read(self.tmp / out['set'] / 'proposals.json')['proposals'][0]['painIds'], ['debt'])

    def test_same_overlap_from_two_runs_is_shown_once(self):
        sweep, refine = fixture_runs(self.tmp)
        out = catalog.review_build(self.tmp, [refine, refine])
        self.assertEqual(out['byKind']['merge'], 1)
        self.assertEqual(out['byKind']['reword'], 2)

    def test_unchecked_run_is_refused(self):
        sweep, refine = fixture_runs(self.tmp)
        catalog.write(refine / 'refine-check.json', {'issues': ['x'], 'moves': []})
        with self.assertRaises(catalog.CheckError):
            catalog.review_build(self.tmp, [refine])


def draft_from(doc, revision=3):
    """An editor draft holding the catalog's shown pains, as cms.getDraft returns it."""
    return {'revision': revision, 'content': {
        'domains': [{'id': g['id'], 'scope': 'personal' if g['page'] == 'personal' else 'world', 'title': g['name'], 'sortOrder': g['order']}
                    for g in doc['groups']],
        'pains': [{'id': p['id'], 'domainId': p['group'], 'title': p['name'], 'description': p['line'], 'sortOrder': n}
                  for n, p in enumerate(p for p in doc['pains'].values() if p['role'] == 'shown')],
        'dreams': [{'id': 'scam-proof', 'title': 'Scam-proof', 'description': 'I spot scams early.', 'sortOrder': 0}],
        'painDreamLinks': [], 'firstActions': [], 'actionPainLinks': [], 'fixes': [], 'fixDreamLinks': [],
        'sources': [], 'provenance': []}}


class FakeCms:
    def __init__(self, draft, conflict=False):
        self.draft, self.conflict, self.saved = draft, conflict, None

    def get_draft(self):
        return self.draft

    def preview_draft(self, content):
        self.previewed = content
        return {'revision': self.draft['revision'], 'content': content}

    def save_draft(self, revision, note, content):
        if self.conflict or revision != self.draft['revision']:
            raise catalog.CheckError('cms.saveDraft failed (409): revision changed')
        self.saved = {'revision': revision, 'note': note, 'content': content}
        return {'revision': revision + 1}


class IngestTest(Base):
    def setUp(self):
        super().setUp()
        self.sweep, self.refine = fixture_runs(self.tmp)
        self.set_dir = self.tmp / catalog.review_build(self.tmp, [self.sweep, self.refine], 'pilot')['set']
        self.proposals = catalog.read(self.set_dir / 'proposals.json')['proposals']
        self.cms = FakeCms(draft_from(catalog.load(self.tmp)))

    def pid(self, kind, pain_id=None):
        return next(p['id'] for p in self.proposals if p['kind'] == kind and (pain_id is None or pain_id in p['painIds']))

    def ingest(self, decisions, **kw):
        path = self.tmp / 'decisions.json'
        catalog.write(path, {'schemaVersion': 1, 'setId': catalog.read(self.set_dir / 'proposals.json')['setId'], 'decisions': decisions})
        return catalog.ingest(self.tmp, self.set_dir, path, client=self.cms, date='2026-10-21', **kw)

    def test_accepted_reword_updates_catalog_history_and_draft(self):
        out = self.ingest({self.pid('reword'): {'decision': 'alternative', 'choice': 0, 'note': 'names the cause'}})
        p = catalog.load(self.tmp)['pains']['overwhelmed']
        self.assertEqual((p['name'], p['line']), ('Too much', 'I have more to do than hours in the day.'))
        self.assertIn("I'm overwhelmed.", p['aliases'])
        h = p['history'][-1]
        self.assertEqual((h['date'], h['kind'], h['note'], h['from']['line']), ('2026-10-21', 'reword', 'names the cause', "I'm overwhelmed."))
        self.assertIn('lint vague-line', h['prompt'])
        live = next(x for x in self.cms.saved['content']['pains'] if x['id'] == 'overwhelmed')
        self.assertEqual(live['description'], 'I have more to do than hours in the day.')
        self.assertIn('update overwhelmed', self.cms.saved['note'])
        self.assertEqual(out['editor']['revision'], 4)

    def test_later_changes_nothing_and_returns(self):
        before = catalog.load(self.tmp)
        self.ingest({self.pid('reword'): {'decision': 'later'}})
        self.assertEqual(catalog.load(self.tmp)['pains']['overwhelmed'], before['pains']['overwhelmed'])
        self.assertIsNone(self.cms.saved)
        again = catalog.review_build(self.tmp, [self.refine])
        self.assertGreaterEqual(again['later'], 1)

    def test_rejected_candidate_is_remembered_and_skipped_next_time(self):
        self.ingest({self.pid('add', 'scams-and-fraud'): {'decision': 'reject', 'note': 'too narrow'}})
        doc = catalog.load(self.tmp)
        self.assertEqual(doc['pains']['scams-and-fraud']['status'], 'rejected')
        again = catalog.check_candidates(doc, {'candidates': {'scam-losses': candidate('scam-losses', covers=[{'list': 'gallup-mip', 'entry': 'scams-and-fraud'}])}})
        self.assertEqual(again['skipped'], [{'candidate': 'scam-losses', 'reason': 'rejected earlier as scams-and-fraud'}])

    def test_duplicate_reject_moves_coverage_to_the_twin(self):
        self.ingest({self.pid('add', 'scams-and-fraud'): {'decision': 'reject', 'duplicateOf': ['debt'], 'note': 'same as debt'}})
        doc = catalog.load(self.tmp)
        self.assertEqual(doc['pains']['scams-and-fraud']['covers'], [])
        self.assertIn({'list': 'gallup-mip', 'entry': 'scams-and-fraud'}, doc['pains']['debt']['covers'])
        self.assertEqual(doc['pains']['scams-and-fraud']['history'][0]['duplicateOf'], ['debt'])
        with self.assertRaises(catalog.CheckError):
            catalog.ingest(self.tmp, self.set_dir, self.tmp / 'decisions.json', client=self.cms)

    def test_new_shown_pain_waits_for_futures(self):
        out = self.ingest({self.pid('add', 'scams-and-fraud'): {'decision': 'alternative', 'choice': 0}})
        self.assertEqual(catalog.load(self.tmp)['pains']['scams-and-fraud']['role'], 'shown')
        self.assertEqual(out['editor']['waiting'], ['scams-and-fraud'])
        self.assertIsNone(self.cms.saved)

    def test_new_shown_pain_with_approved_futures_is_added(self):
        before = catalog.load(self.tmp)
        after, touched, *_ = catalog.apply_decisions(before, catalog.read(self.set_dir / 'proposals.json'),
                                                     {'decisions': {self.pid('add', 'scams-and-fraud'): {'decision': 'alternative', 'choice': 0}}})
        after['pains']['scams-and-fraud']['futures'] = ['scam-proof']
        patch = catalog.draft_patch(before, after, touched, self.cms.draft)
        self.assertEqual(patch['changes'][0]['change'], 'add')
        self.assertIn({'painId': 'scams-and-fraud', 'dreamId': 'scam-proof'}, patch['content']['painDreamLinks'])

    def test_draft_only_as_own(self):
        with self.assertRaises(catalog.CheckError):
            self.ingest({self.pid('add', 'insurance-costs'): {'decision': 'accept'}})
        self.ingest({self.pid('add', 'insurance-costs'): {'decision': 'own', 'own': {'name': 'Insurance', 'line': "I can't afford insurance.", 'role': 'not-shown'}}})
        self.assertEqual(catalog.load(self.tmp)['pains']['insurance-costs']['history'][0]['own'], True)

    def test_merge_of_shown_pain_is_held_until_the_editor_can_retire(self):
        out = self.ingest({self.pid('merge'): {'decision': 'accept'}})
        self.assertEqual(out['held'], [self.pid('merge')])
        self.assertEqual(catalog.load(self.tmp)['pains']['always-tired']['status'], 'accepted')
        self.assertIn('merge', [p['kind'] for p in catalog.read(self.tmp / catalog.LATER)['proposals']])

    def test_merge_keeps_aliases_and_retires_with_replacement(self):
        for p in self.cms.draft['content']['pains']:
            p['retired'] = False
        self.ingest({self.pid('merge'): {'decision': 'accept', 'note': 'same nights'}})
        doc = catalog.load(self.tmp)
        self.assertEqual(doc['pains']['always-tired']['status'], 'merged')
        self.assertIn("I'm tired all the time.", doc['pains']['poor-sleep']['aliases'])
        self.assertEqual(catalog.resolve(doc, 'always-tired')[0]['id'], 'poor-sleep')
        live = next(x for x in self.cms.saved['content']['pains'] if x['id'] == 'always-tired')
        self.assertEqual((live['retired'], live['replacementPainId']), (True, 'poor-sleep'))

    def test_move_and_heading_warning(self):
        out = self.ingest({self.pid('move'): {'decision': 'accept'}})
        self.assertEqual(catalog.load(self.tmp)['pains']['homeless']['group'], 'money')
        self.assertTrue(any(w.startswith('Home would have 0 shown pains') for w in out['editor']['warnings']))
        self.assertEqual(next(x for x in self.cms.saved['content']['pains'] if x['id'] == 'homeless')['domainId'], 'money')

    def test_split_gives_new_id(self):
        doc = catalog.read(self.set_dir / 'proposals.json')
        doc['proposals'].append({'id': 'p999', 'kind': 'split', 'painIds': ['debt'], 'group': 'money', 'current': {}, 'proposed': {'name': 'Debt', 'line': 'I owe more than I earn.'},
                                 'alternatives': [], 'why': {'prompt': 'overlap'}, 'allowOwn': False, 'side': [], 'draft': False,
                                 'payload': {'splitOf': 'debt', 'into': [{'name': 'Debt', 'line': 'I owe more than I earn.'}, {'name': 'Medical debt', 'line': 'I owe for care I needed.'}]}})
        after, touched, log, later, issues = catalog.apply_decisions(catalog.load(self.tmp), doc, {'decisions': {'p999': {'decision': 'accept'}}})
        self.assertEqual(issues, [])
        self.assertEqual(after['pains']['medical-debt']['relations'], [{'kind': 'split-from', 'id': 'debt'}])
        self.assertEqual(after['pains']['debt']['history'][-1]['kind'], 'split')

    def test_revision_conflict_writes_nothing(self):
        self.cms.conflict = True
        before = (self.tmp / catalog.CATALOG).read_text()
        with self.assertRaises(catalog.CheckError):
            self.ingest({self.pid('reword'): {'decision': 'accept'}})
        self.assertEqual((self.tmp / catalog.CATALOG).read_text(), before)
        self.assertFalse((self.set_dir / 'ingested.json').exists())

    def test_editor_edit_is_never_overwritten(self):
        live = next(x for x in self.cms.draft['content']['pains'] if x['id'] == 'overwhelmed')
        live['description'] = 'I have too many plates spinning.'
        out = self.ingest({self.pid('reword'): {'decision': 'accept'}})
        self.assertEqual(out['editor']['conflicts'][0]['painId'], 'overwhelmed')
        self.assertIsNone(self.cms.saved)

    def test_dry_run_writes_nothing_and_ingest_runs_once(self):
        before = (self.tmp / catalog.CATALOG).read_text()
        out = self.ingest({self.pid('reword'): {'decision': 'accept'}}, dry_run=True)
        self.assertEqual(out['editor']['changes'][0]['painId'], 'overwhelmed')
        self.assertEqual((self.tmp / catalog.CATALOG).read_text(), before)
        self.assertIsNone(self.cms.saved)
        self.ingest({self.pid('reword'): {'decision': 'accept'}})
        with self.assertRaises(catalog.CheckError):
            self.ingest({self.pid('reword'): {'decision': 'accept'}})


class DriftTest(Base):
    def test_editor_wording_is_listed_and_can_be_proposed(self):
        doc = small_catalog()
        draft = draft_from(doc)
        draft['content']['pains'][0]['description'] = 'I run out of money before payday.'
        draft['content']['pains'].append({'id': 'stray', 'domainId': 'money', 'title': 'Stray', 'description': 'I am new.', 'sortOrder': 9})
        found = catalog.drift(doc, draft)
        kinds = {f['painId']: f['kind'] for f in found}
        self.assertEqual(kinds, {'broke': 'differs', 'stray': 'not-shown-in-catalog'})
        proposals = catalog.drift_proposals(doc, found)
        self.assertEqual(proposals[0]['proposed']['line'], 'I run out of money before payday.')
        self.assertEqual(doc['pains']['broke']['line'], 'I worry about broke.')


class CmsClientTest(unittest.TestCase):
    def test_wire_format_token_and_conflict(self):
        import http.server
        import threading
        seen = []

        class Handler(http.server.BaseHTTPRequestHandler):
            def do_POST(self):
                body = json.loads(self.rfile.read(int(self.headers['Content-Length'])) or b'{}')
                seen.append((self.path, self.headers['Authorization'], body))
                if self.path == '/rpc/cms/getDraft':
                    self.reply(200, {'json': {'revision': 7, 'content': {}}})
                elif body['json']['expectedRevision'] == 7:
                    self.reply(200, {'json': {'revision': 8}})
                else:
                    self.reply(409, {'json': {'code': 'CONFLICT', 'message': 'Draft changed'}})

            def reply(self, code, payload):
                data = json.dumps(payload).encode()
                self.send_response(code)
                self.send_header('Content-Type', 'application/json')
                self.send_header('Content-Length', str(len(data)))
                self.end_headers()
                self.wfile.write(data)

            def log_message(self, *args):
                pass

        server = http.server.HTTPServer(('127.0.0.1', 0), Handler)
        threading.Thread(target=server.serve_forever, daemon=True).start()
        self.addCleanup(server.server_close)
        self.addCleanup(server.shutdown)
        client = catalog.CmsClient('http://127.0.0.1:%d' % server.server_port, 'test-token')
        self.assertEqual(client.get_draft()['revision'], 7)
        self.assertEqual(client.save_draft(7, 'note', {})['revision'], 8)
        with self.assertRaises(catalog.CheckError) as raised:
            client.save_draft(6, 'note', {})
        self.assertIn('409', str(raised.exception))
        self.assertEqual(seen[0][:2], ('/rpc/cms/getDraft', 'Bearer test-token'))
        self.assertEqual(seen[1][2], {'json': {'expectedRevision': 7, 'changeNote': 'note', 'content': {}}})


if __name__ == '__main__':
    unittest.main()
