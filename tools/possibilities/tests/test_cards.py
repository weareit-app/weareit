import copy
import importlib.util
import json
from pathlib import Path
import shutil
import subprocess
import sys
import tempfile
import unittest

ROOT = Path(__file__).resolve().parents[3]
SCRIPT = ROOT / 'tools/possibilities/cards.py'
spec = importlib.util.spec_from_file_location('cards', SCRIPT)
cards = importlib.util.module_from_spec(spec)
spec.loader.exec_module(cards)

LENS_CYCLE = ('individual', 'relational', 'community', 'policy', 'market')
AMBITION_CYCLE = ('tonight', 'this-year', 'together')


def exemplar(i, verified=True):
    e = {'name': 'Example %d Cooperative' % i, 'place': 'Preston', 'year': 2011 + i, 'outcome': '%d homes' % (10 * i),
         'lens': LENS_CYCLE[i % len(LENS_CYCLE)], 'verified': verified, 'limits': 'One town; self-reported.'}
    if verified:
        e.update({'url': 'https://example.org/%d' % i, 'accessed': '2026-10-17', 'locator': 'section 2'})
    return e


def card(i):
    it_idea = i % 4 == 0
    return {
        'title': 'Lights out at ten', 'line': 'My evenings end on my terms.',
        'lens': LENS_CYCLE[i % len(LENS_CYCLE)], 'ambition': AMBITION_CYCLE[i % 3], 'status': 'real_now',
        'fixes': [
            {'id': 'f%d-a' % i, 'title': 'Switch to a forward-moving shift schedule', 'whatChanges': 'A Preston co-op moved shifts later, not earlier.',
             'who': 'Workers and their scheduler', 'exemplarRef': 'ex-%d' % i, 'speculative': False,
             'firstStep': 'Write down your last 14 shift start times.', 'firstStepMinutes': 10, 'status': 'real_now', 'kind': 'task'},
            {'id': 'f%d-b' % i, 'title': 'Start a 9pm drawer pact with 3 housemates', 'whatChanges': 'Reminds everyone at 9pm.' if it_idea else 'Phones leave bedrooms.', 'kind': 'feature' if it_idea else 'habit',
             'who': 'You and housemates', 'exemplarRef': None, 'speculative': True, 'speculativeRationale': 'No precedent found.',
             'firstStep': 'Text the house group the proposal.', 'firstStepMinutes': 5, 'status': 'proposed_it_feature' if it_idea else 'real_now'},
        ],
        'provenance': {'sourceId': 'run', 'locator': 'cards.json', 'evidenceType': 'ai_generated', 'rights': 'CC0-1.0',
                       'reviewStatus': 'unreviewed'},
        'writerNotes': 'secret writer reasoning',
    }


def judgments(card_ids, failing=(), best=None):
    scores = {}
    for k in card_ids:
        value = 5 if k == best else 3
        scores[k] = {c: {'score': value, 'reason': 'r'} for c in cards.CRITERIA}
        scores[k]['honestStatus'] = {'pass': k not in failing, 'reason': 'r'}
    pairwise = [{'a': a, 'b': b, 'winner': a if a == best or (b != best and a < b) else b, 'reason': 'r'}
                for i, a in enumerate(card_ids) for b in card_ids[i + 1:]]
    return {'schemaVersion': 1, 'judge': {'context': 'isolated', 'at': '2026-10-17'}, 'scores': scores,
            'pairwise': pairwise, 'seed': 7}


class Base(unittest.TestCase):
    def setUp(self):
        self.tmp = Path(tempfile.mkdtemp())
        (self.tmp / 'tools/possibilities/config').mkdir(parents=True)
        (self.tmp / 'openspec').mkdir()
        (self.tmp / 'openspec/config.yaml').write_text('schema: spec-driven')
        shutil.copy(ROOT / 'tools/possibilities/config/banned-phrases.json', self.tmp / 'tools/possibilities/config/')
        (self.tmp / 'tools/possibilities/config/rubric.md').write_text('rubric')
        (self.tmp / 'docs/research/pains').mkdir(parents=True)
        shutil.copy(ROOT / cards.PAIN_CATALOG, self.tmp / cards.PAIN_CATALOG)
        self.run = self.make_run('poor-sleep')

    def tearDown(self):
        shutil.rmtree(self.tmp)

    def make_run(self, pain, n=12):
        run = self.tmp / 'docs/research/possibilities/runs' / pain / '20261017-000000'
        run.mkdir(parents=True)
        cards.write(run / 'exemplars.json', {'schemaVersion': 1, 'painId': pain, 'exemplars': {'ex-%d' % i: exemplar(i) for i in range(n)}})
        cs = {}
        for i in range(n):
            c = card(i)
            for f in c['fixes']:
                f['id'] = pain + '-' + f['id']
            cs['%s-c%02d' % (pain, i)] = c
        cards.write(run / 'cards.json', {'schemaVersion': 1, 'painId': pain, 'cards': cs})
        return run

    def mutate(self, fn):
        doc = cards.read(self.run / 'cards.json')
        fn(doc['cards'])
        cards.write(self.run / 'cards.json', doc)


class Validate(Base):
    def test_valid_run(self):
        self.assertEqual(cards.validate_run(self.run), [])

    def test_unverified_exemplar_needs_no_locator_but_verified_does(self):
        doc = cards.read(self.run / 'exemplars.json')
        del doc['exemplars']['ex-0']['locator']
        cards.write(self.run / 'exemplars.json', doc)
        self.assertTrue(any('verified requires locator' in i for i in cards.validate_run(self.run)))

    def test_five_fixes_rejected(self):
        self.mutate(lambda cs: cs['poor-sleep-c00']['fixes'].extend(copy.deepcopy(cs['poor-sleep-c01']['fixes'] * 2) + copy.deepcopy(cs['poor-sleep-c02']['fixes'][:1])))
        issues = cards.validate_run(self.run)
        self.assertTrue(any('2-5 fixes' in i for i in issues))

    def test_long_first_step_rejected(self):
        self.mutate(lambda cs: cs['poor-sleep-c00']['fixes'][0].update(firstStepMinutes=25))
        self.assertTrue(any('firstStepMinutes' in i for i in cards.validate_run(self.run)))

    def test_dangling_exemplar_ref(self):
        self.mutate(lambda cs: cs['poor-sleep-c00']['fixes'][0].update(exemplarRef='ex-missing'))
        self.assertTrue(any('exemplarRef must resolve' in i for i in cards.validate_run(self.run)))

    def test_speculative_needs_rationale(self):
        self.mutate(lambda cs: cs['poor-sleep-c00']['fixes'][1].pop('speculativeRationale'))
        self.assertTrue(any('speculativeRationale' in i for i in cards.validate_run(self.run)))

    def test_one_word_title_is_vague_but_long_clear_title_passes(self):
        self.mutate(lambda cs: cs['poor-sleep-c00'].update(title='Rested'))
        rules = lambda: {i['rule'] for i in cards.lint_run(self.run, self.tmp)['issues']}
        self.assertIn('title-vague', rules())
        self.mutate(lambda cs: cs['poor-sleep-c00'].update(title='Sleeping in separate rooms so we both rest'))
        self.assertFalse({'title-vague', 'title-length'} & rules())

    def test_scene_field_rejected(self):
        self.mutate(lambda cs: cs['poor-sleep-c00'].update(scene='At 11:01 the last jet has passed.'))
        self.assertTrue(any('scenes were dropped' in i for i in cards.validate_run(self.run)))

    def test_few_exemplars_need_reason(self):
        doc = cards.read(self.run / 'exemplars.json')
        doc['exemplars'] = {k: v for k, v in list(doc['exemplars'].items())[:5]}
        cards.write(self.run / 'exemplars.json', doc)
        self.assertTrue(any('shortfallReason' in i for i in cards.validate_run(self.run)))


class Lint(Base):
    def rules(self):
        return {i['rule'] for i in cards.lint_run(self.run, self.tmp)['issues']}

    def test_clean_fixture_passes(self):
        result = cards.lint_run(self.run, self.tmp)
        self.assertTrue(result['passed'], result['issues'])
        self.assertTrue((self.run / 'lint.json').is_file())

    def test_generic_phrase(self):
        self.mutate(lambda cs: cs['poor-sleep-c00']['fixes'][0].update(title='Find support for sleep'))
        self.assertIn('generic-phrase', self.rules())

    def test_modal_word_boundary(self):
        self.mutate(lambda cs: cs['poor-sleep-c00'].update(line='The mayor may listen to us.'))
        self.assertNotIn('stacked-hedges', self.rules())

    def test_one_plain_limit_allowed_but_not_stacked(self):
        self.mutate(lambda cs: cs['poor-sleep-c00'].update(line='I might sleep better.'))
        self.assertNotIn('stacked-hedges', self.rules())
        self.mutate(lambda cs: cs['poor-sleep-c00']['fixes'][0].update(whatChanges='It may possibly help Preston workers.'))
        self.assertIn('stacked-hedges', self.rules())

    def test_boilerplate_caveat(self):
        self.mutate(lambda cs: cs['poor-sleep-c00']['fixes'][0].update(whatChanges='An AI proposal for Preston workers.'))
        self.assertIn('boilerplate-caveat', self.rules())

    def test_exclamation_and_hype(self):
        self.mutate(lambda cs: cs['poor-sleep-c00']['fixes'][0].update(title='Unlock Preston rest now!'))
        self.assertTrue({'exclamation', 'generic-phrase'} <= self.rules())

    def test_not_specific(self):
        self.mutate(lambda cs: cs['poor-sleep-c00']['fixes'][0].update(title='Change the rota', whatChanges='shifts move.'))
        doc = cards.read(self.run / 'exemplars.json')
        doc['exemplars']['ex-0']['name'] = 'a local scheme'
        cards.write(self.run / 'exemplars.json', doc)
        self.assertIn('not-specific', self.rules())

    def test_unverified_example_cited(self):
        doc = cards.read(self.run / 'exemplars.json')
        doc['exemplars']['ex-0'] = exemplar(0, verified=False)
        cards.write(self.run / 'exemplars.json', doc)
        self.assertIn('unverified-example', self.rules())

    def test_regional_words_and_acronym_titles(self):
        self.mutate(lambda cs: cs['poor-sleep-c00']['fixes'][0].update(title='Ask your GP about CBT-I', whatChanges='A Preston rota change.'))
        rules = self.rules()
        self.assertTrue({'regional-word', 'acronym-in-title'} <= rules)

    def test_title_assumes_example(self):
        self.mutate(lambda cs: cs['poor-sleep-c00']['fixes'][0].update(title='Bring the Preston results to your board'))
        self.assertIn('title-assumes-example', self.rules())

    def test_it_ideas_and_basics_coverage(self):
        self.mutate(lambda cs: [f.update(status='societal_proposal') for c in cs.values() for f in c['fixes']])
        self.assertTrue({'it-ideas-coverage', 'basics-coverage'} <= self.rules())

    def test_ambiguous_it(self):
        self.mutate(lambda cs: cs['poor-sleep-c01']['fixes'][0].update(whatChanges="Preston tried it. It's common in many towns."))
        self.assertIn('ambiguous-it', self.rules())

    def test_feature_text_is_a_pitch_not_it_could(self):
        self.mutate(lambda cs: cs['poor-sleep-c00']['fixes'][1].update(whatChanges='It could remind everyone at 9pm.'))
        self.assertIn('feature-pitch', self.rules())
        self.mutate(lambda cs: cs['poor-sleep-c00']['fixes'][1].update(whatChanges='Reminds everyone at 9pm.', title='Get a 9pm reminder, with It'))
        self.assertIn('feature-pitch', self.rules())
        self.mutate(lambda cs: cs['poor-sleep-c00']['fixes'][1].update(title='Get a 9pm reminder for the whole house'))
        self.assertNotIn('feature-pitch', self.rules())
        self.mutate(lambda cs: cs['poor-sleep-c01']['fixes'][0].update(whatChanges='Preston did. It could work here.'))
        self.assertIn('ambiguous-it', self.rules())

    def test_practice_needs_feature_idea(self):
        self.mutate(lambda cs: cs['poor-sleep-c01']['fixes'][0].update(kind='practice'))
        self.assertTrue(any('practice needs featureIdea' in i for i in cards.validate_run(self.run)))
        self.mutate(lambda cs: cs['poor-sleep-c01']['fixes'][0].update(featureIdea='Coaches you before the talk.'))
        self.assertFalse(any('featureIdea' in i for i in cards.validate_run(self.run)))

    def test_learn_titles_and_action_dreams_flagged(self):
        self.mutate(lambda cs: cs['poor-sleep-c00']['fixes'][0].update(title='Learn how Preston changed shifts'))
        self.mutate(lambda cs: cs['poor-sleep-c01'].update(title='Telling my boss about the rota'))
        rules = {i['rule'] for i in cards.lint_run(self.run, self.tmp)['issues']}
        self.assertTrue({'not-an-action', 'dream-not-outcome'} <= rules)

    def test_learn_kind_allows_usable_skills_only(self):
        self.mutate(lambda cs: cs['poor-sleep-c00']['fixes'][0].update(kind='learn', title='Learn box breathing to calm down fast'))
        rules = {i['rule'] for i in cards.lint_run(self.run, self.tmp)['issues']}
        self.assertFalse({'not-an-action', 'learn-about-others'} & rules)
        self.mutate(lambda cs: cs['poor-sleep-c00']['fixes'][0].update(title='Learn how one city became a large landlord'))
        self.assertIn('learn-about-others', {i['rule'] for i in cards.lint_run(self.run, self.tmp)['issues']})
        self.mutate(lambda cs: cs['poor-sleep-c00']['fixes'][0].update(title='Learn how Vienna built public housing'))
        self.assertIn('learn-about-others', {i['rule'] for i in cards.lint_run(self.run, self.tmp)['issues']})

    def test_kind_required_and_matches_status(self):
        self.mutate(lambda cs: cs['poor-sleep-c01']['fixes'][0].pop('kind'))
        self.assertTrue(any('kind must be' in i for i in cards.validate_run(self.run)))
        self.mutate(lambda cs: cs['poor-sleep-c01']['fixes'][0].update(kind='feature'))
        self.assertTrue(any('kind feature goes with' in i for i in cards.validate_run(self.run)))

    def test_unsourced_number_and_name(self):
        self.mutate(lambda cs: cs['poor-sleep-c00']['fixes'][0].update(whatChanges='A Preston co-op cut night shifts by 40% in April.'))
        issue = [i for i in cards.lint_run(self.run, self.tmp)['issues'] if i['rule'] == 'unsourced-detail']
        self.assertTrue(issue and '40' in issue[0]['detail'] and 'April' in issue[0]['detail'])

    def test_sourced_details_pass(self):
        # exemplar 0: place Preston, year 2011, outcome '0 homes'
        self.mutate(lambda cs: cs['poor-sleep-c00']['fixes'][0].update(whatChanges='In 2011 a Preston co-op changed its shifts.'))
        self.assertNotIn('unsourced-detail', self.rules())

    def test_speculative_fix_cannot_name_institutions(self):
        self.mutate(lambda cs: cs['poor-sleep-c00']['fixes'][1].update(whatChanges='Ask the Bureau of Labor Statistics for help.'))
        self.assertIn('unsourced-detail', self.rules())

    def test_clock_times_are_one_number(self):
        found = cards.details('School moved from 7:50 to 8:45.')
        self.assertEqual(found['numbers'], {'7:50', '8:45'})

    def test_sentence_opening_known_place_is_checked(self):
        found = cards.details('Australia set an age limit. Minnesota chose a warning. People disagree.', known={'Minnesota'})
        self.assertEqual(found['names'], {'Minnesota'})

    def test_built_claim(self):
        self.mutate(lambda cs: cs['poor-sleep-c00']['fixes'][0].update(status='proposed_it_feature', whatChanges='It matches you with 3 neighbours.'))
        self.assertIn('built-claim', self.rules())

    def test_title_line_and_fix_text_length(self):
        self.mutate(lambda cs: cs['poor-sleep-c00'].update(title='This title has grown into a whole sentence of eleven words now', line='One. Two.'))
        self.mutate(lambda cs: cs['poor-sleep-c00']['fixes'][0].update(whatChanges='Preston one. Two. Three. Four.'))
        self.assertTrue({'title-length', 'line-length', 'fix-text-length'} <= self.rules())

    def test_coverage(self):
        self.mutate(lambda cs: [c.update(lens='individual', ambition='tonight') for c in cs.values()])
        self.assertTrue({'lens-coverage', 'ambition-coverage'} <= self.rules())


class Judge(Base):
    def test_judge_input_strips_writer_notes_and_provenance(self):
        (self.tmp / 'docs/style').mkdir(parents=True)
        (self.tmp / 'docs/style/copy-style-guide.md').write_text('mentor voice')
        data = cards.judge_input(self.run, self.tmp)
        self.assertEqual(data['copyGuide'], 'mentor voice')
        payload = json.dumps(data)
        self.assertNotIn('secret writer reasoning', payload)
        self.assertNotIn('provenance', payload)

    def write_judgments(self, **kw):
        ids = sorted(cards.read(self.run / 'cards.json')['cards'])
        cards.write(self.run / 'judgments.json', judgments(ids, **kw))
        return ids

    def test_honest_status_failure_excluded_even_if_best(self):
        ids = self.write_judgments(failing=('poor-sleep-c03',), best='poor-sleep-c03')
        result = cards.select(self.run)
        self.assertNotIn('poor-sleep-c03', result['finalists'])
        self.assertEqual(result['excluded'][0]['cardId'], 'poor-sleep-c03')
        self.assertEqual(len(result['finalists']), 5)
        self.assertEqual(len(ids), 12)

    def test_best_card_ranks_first(self):
        self.write_judgments(best='poor-sleep-c07')
        self.assertEqual(cards.select(self.run)['finalists'][0], 'poor-sleep-c07')

    def test_lens_diversity_substitution(self):
        self.mutate(lambda cs: [c.update(lens='individual') for k, c in cs.items() if k != 'poor-sleep-c11'])
        self.mutate(lambda cs: cs['poor-sleep-c11'].update(lens='policy'))
        self.write_judgments()
        result = cards.select(self.run)
        self.assertIn('poor-sleep-c11', result['finalists'])

    def test_it_led_finalist_guaranteed(self):
        self.mutate(lambda cs: cs['poor-sleep-c11'].update(status='proposed_it_feature', lens='technology'))
        self.write_judgments(best='poor-sleep-c00')
        doc = cards.read(self.run / 'judgments.json')
        for c in cards.CRITERIA:
            doc['scores']['poor-sleep-c11'][c]['score'] = 1
        cards.write(self.run / 'judgments.json', doc)
        result = cards.select(self.run)
        self.assertIn('poor-sleep-c11', result['finalists'])
        self.assertEqual(result['itLedGuaranteed'], 'poor-sleep-c11')
        self.assertEqual(len(result['finalists']), 5)
        self.assertFalse(result['itLedMissing'])

    def test_consensus_majority_honesty_and_borda(self):
        ids = sorted(cards.read(self.run / 'cards.json')['cards'])
        cards.write(self.run / 'judgments-1.json', judgments(ids, best='poor-sleep-c05', failing=('poor-sleep-c02',)))
        cards.write(self.run / 'judgments-2.json', judgments(ids, best='poor-sleep-c05'))
        cards.write(self.run / 'judgments-3.json', judgments(ids, best='poor-sleep-c09', failing=('poor-sleep-c09',)))
        summary = cards.consensus(self.run)
        self.assertEqual(summary['judges'], 3)
        doc = cards.read(self.run / 'judgments.json')
        self.assertTrue(doc['scores']['poor-sleep-c02']['honestStatus']['pass'])   # 1 of 3 failed
        self.assertTrue(doc['scores']['poor-sleep-c09']['honestStatus']['pass'])
        self.assertEqual(doc['judge']['context'], 'isolated-consensus')
        result = cards.select(self.run)
        # Borda rewards consistency: c00 is 2nd, 2nd, 1st; c05 is 1st, 1st, 6th.
        self.assertEqual(result['finalists'][:2], ['poor-sleep-c00', 'poor-sleep-c05'])
        self.assertEqual(doc['consensus']['poor-sleep-c00']['ranks'], [2, 2, 1])

    def test_consensus_needs_two_judges(self):
        ids = sorted(cards.read(self.run / 'cards.json')['cards'])
        cards.write(self.run / 'judgments-1.json', judgments(ids))
        with self.assertRaises(cards.CheckError):
            cards.consensus(self.run)

    def test_audit_sample_deterministic(self):
        self.write_judgments()
        first = cards.select(self.run, seed=3)['auditSample']
        self.assertEqual(first, cards.select(self.run, seed=3)['auditSample'])
        self.assertEqual(len(first), 2)
        self.assertFalse(set(first) & set(cards.read(self.run / 'selection.json')['finalists']))

    def test_judgment_must_cover_every_card(self):
        ids = self.write_judgments()
        doc = cards.read(self.run / 'judgments.json')
        del doc['scores'][ids[0]]
        cards.write(self.run / 'judgments.json', doc)
        with self.assertRaises(cards.CheckError):
            cards.select(self.run)


class Calibration(Base):
    def setUp(self):
        super().setUp()
        shutil.rmtree(self.run.parent)
        baseline = {}
        for pain in cards.KNOWN_PAINS:
            run = self.make_run(pain, n=10)
            ids = sorted(cards.read(run / 'cards.json')['cards'])
            cards.write(run / 'judgments.json', judgments(ids))
            cards.select(run)
            for j in range(2):
                baseline['old-%s-%d' % (pain, j)] = {
                    'painId': pain, 'title': 'Rested', 'line': 'I wake up rested and ready.', 'scene': '',
                    'fixes': [{'id': 'fx-%s-a' % pain, 'title': 'Find sleep care', 'whatChanges': 'Get help.'},
                              {'id': 'fx-shared', 'title': 'Share the load', 'whatChanges': 'Agree duties.'}],
                    'provenance': {'sourceId': 'founder-review', 'locator': '#sleep', 'evidenceType': 'prior_packet',
                                   'rights': 'CC-BY-SA-4.0', 'reviewStatus': 'reviewed'}}
        (self.tmp / 'docs/research/possibilities/calibration').mkdir(parents=True)
        cards.write(self.tmp / 'docs/research/possibilities/calibration/baseline.json', {'schemaVersion': 1, 'cards': baseline})
        self.summary = cards.calibrate_build(self.tmp, seed=1)
        self.cal = self.tmp / 'docs/research/possibilities/calibration'

    def test_set_is_blind_and_sized(self):
        self.assertEqual(self.summary['items'], 40)
        self.assertEqual(self.summary['old'], 16)
        text = (self.cal / 'set.json').read_text()
        for leak in ('origin', 'old-', 'poor-sleep-c', 'runId', 'heldOut'):
            self.assertNotIn(leak, text)

    def test_held_out_stratified(self):
        key = cards.read(self.cal / 'key.json')
        for pain in cards.KNOWN_PAINS:
            held = [v for v in key.values() if v['painId'] == pain and v['heldOut']]
            self.assertEqual(sum(v['origin'] == 'old' for v in held), 1)
            self.assertIn(sum(v['origin'] == 'new' for v in held), (1, 2))

    def export(self, rating_for):
        key = cards.read(self.cal / 'key.json')
        ratings = {k: {'rating': rating_for(v), 'ratedAt': '2026-10-18T10:%02d:00Z' % i} for i, (k, v) in enumerate(sorted(key.items()))}
        path = self.tmp / 'export.json'
        cards.write(path, {'ratings': ratings})
        return path

    def test_ingest_rejects_unknown_and_bad(self):
        path = self.tmp / 'bad.json'
        cards.write(path, {'ratings': {'c99': {'rating': 'love'}}})
        with self.assertRaises(cards.CheckError):
            cards.calibrate_ingest(self.tmp, path)
        cards.write(path, {'ratings': {'c01': {'rating': 'meh'}}})
        with self.assertRaises(cards.CheckError):
            cards.calibrate_ingest(self.tmp, path)

    def test_ingest_splits_anchor_and_heldout(self):
        result = cards.calibrate_ingest(self.tmp, self.export(lambda v: 'love' if v['origin'] == 'new' else 'kill'))
        held = cards.read(self.cal / 'heldout.json')['heldOut']
        self.assertEqual(result['anchors'] + len(held), 40)
        key = cards.read(self.cal / 'key.json')
        self.assertTrue(all(key[a['id']]['heldOut'] is False for a in cards.read(self.cal / 'anchors.json')['anchors']))

    def test_report_gate_passes_on_strong_ratings(self):
        cards.calibrate_ingest(self.tmp, self.export(lambda v: 'love' if v['origin'] == 'new' else 'kill'))
        runs = [str(p) for p in sorted((self.tmp / 'docs/research/possibilities/runs').glob('*/*'))]
        cards.audit_build(self.tmp, runs)
        audit_key = cards.read(self.tmp / 'docs/research/possibilities/evaluations/generator-2026-10/audit-key.json')
        # Known pains only here, so the fresh-pain check cannot pass: gate must be iterate.
        audit = self.tmp / 'audit.json'
        cards.write(audit, {'ratings': {k: {'rating': 'keep'} for k in audit_key}})
        result = cards.report(self.tmp, audit)
        self.assertEqual(result['calibration']['byOrigin']['new']['love'], 1.0)
        self.assertEqual(result['calibration']['byOrigin']['old']['kill'], 1.0)
        self.assertEqual(result['agreement']['top3HitRate'], 1.0)
        self.assertEqual(result['gate']['result'], 'iterate')
        self.assertEqual(result['gate']['failing'], ['freshFinalistLoveKeep>=0.50'])
        self.assertEqual(result['calibration']['reviewMinutes'], 39.0)

    def test_report_gate_fails_on_weak_ratings(self):
        cards.calibrate_ingest(self.tmp, self.export(lambda v: 'kill'))
        result = cards.report(self.tmp)
        self.assertEqual(result['gate']['result'], 'iterate')
        self.assertIn('newLoveKeep>=0.50', result['gate']['failing'])
        self.assertEqual(result['agreement']['top3HitRate'], 0.0)

    def test_agreement_uses_only_held_out(self):
        key = cards.read(self.cal / 'key.json')
        # Founder kills every held-out item but loves every anchor: agreement must be 0.
        cards.calibrate_ingest(self.tmp, self.export(lambda v: 'kill' if v['heldOut'] else 'love'))
        del key
        self.assertEqual(cards.report(self.tmp)['agreement']['top3HitRate'], 0.0)


class Stale(Base):
    def catalog(self, fn):
        path = self.tmp / cards.PAIN_CATALOG
        doc = cards.read(path)
        fn(doc['pains'])
        cards.write(path, doc)

    def run_meta(self, pain, started='2026-10-17T00:00:00+00:00', **extra):
        folder = self.tmp / 'docs/research/possibilities/runs' / pain / '20261017-000000'
        folder.mkdir(parents=True, exist_ok=True)
        cards.write(folder / 'run.json',
                    {'schemaVersion': 1, 'painId': pain, 'runId': '20261017-000000', 'startedAt': started, **extra})

    def reasons(self):
        return {s['painId']: s for s in cards.stale(self.tmp)['stale']}

    def test_unchanged_runs_are_not_stale(self):
        self.run_meta('poor-sleep')
        self.assertEqual(self.reasons(), {})

    def test_line_change_lists_old_and_new_from_history(self):
        self.run_meta('poor-sleep')
        self.catalog(lambda p: (p['poor-sleep'].update(line='I lie awake most nights.'), p['poor-sleep']['history'].append(
            {'date': '2026-10-20', 'kind': 'reword', 'from': {'name': 'Sleep', 'line': "I don't sleep well."},
             'to': {'name': 'Sleep', 'line': 'I lie awake most nights.'}})))
        entry = self.reasons()['poor-sleep']
        self.assertEqual(entry['reason'], 'wording changed')
        self.assertEqual((entry['old']['line'], entry['new']['line']), ("I don't sleep well.", 'I lie awake most nights.'))

    def test_recorded_wording_wins_over_history(self):
        self.run_meta('poor-sleep', painName='Sleep', painLine='I sleep badly.')
        self.assertEqual(self.reasons()['poor-sleep']['old']['line'], 'I sleep badly.')

    def test_merged_split_and_unknown(self):
        self.run_meta('homeless')
        self.run_meta('broke')
        self.run_meta('gone-pain')
        def change(p):
            p['homeless'].update(status='merged', role='not-shown', relations=[{'kind': 'merged-into', 'id': 'homelessness'}])
            p['broke']['history'].append({'date': '2026-10-18', 'kind': 'split', 'note': 'split off no-cushion'})
        self.catalog(change)
        found = self.reasons()
        self.assertEqual(found['homeless']['reason'], 'merged into homelessness')
        self.assertEqual(found['broke']['reason'], 'split since the run')
        self.assertEqual(found['gone-pain']['reason'], 'pain not in the catalog')


class Cli(Base):
    def test_new_run_rejects_unknown_pain_and_run_escape(self):
        base = [sys.executable, str(SCRIPT)]
        bad = subprocess.run(base + ['new-run', 'not-a-pain', '--root', str(self.tmp)], capture_output=True, text=True)
        self.assertEqual(bad.returncode, 2)
        escape = subprocess.run(base + ['lint', str(self.tmp), '--root', str(self.tmp)], capture_output=True, text=True)
        self.assertEqual(escape.returncode, 2)
        ok = subprocess.run(base + ['new-run', 'burnout', '--root', str(self.tmp)], capture_output=True, text=True)
        self.assertEqual(ok.returncode, 0, ok.stderr)
        self.assertIn("I've got nothing left.", ok.stdout)

    def test_new_run_records_wording_and_follows_merges(self):
        catalog_path = self.tmp / cards.PAIN_CATALOG
        doc = cards.read(catalog_path)
        doc['pains']['homeless'].update(status='merged', role='not-shown',
                                        relations=[{'kind': 'merged-into', 'id': 'homelessness'}])
        cards.write(catalog_path, doc)
        result = subprocess.run([sys.executable, str(SCRIPT), 'new-run', 'homeless', '--root', str(self.tmp)],
                                capture_output=True, text=True)
        self.assertEqual(result.returncode, 0, result.stderr)
        out = json.loads(result.stdout)
        self.assertIn('runs/homelessness/', out['run'])
        self.assertEqual(out['notes'], ['homeless was merged into homelessness'])
        run = cards.read(self.tmp / out['run'] / 'run.json')
        self.assertEqual((run['painName'], run['painLine']), ('Homelessness', doc['pains']['homelessness']['line']))

    def test_lint_exit_code(self):
        result = subprocess.run([sys.executable, str(SCRIPT), 'lint', str(self.run), '--root', str(self.tmp)], capture_output=True, text=True)
        self.assertEqual(result.returncode, 0, result.stdout)


if __name__ == '__main__':
    unittest.main()
