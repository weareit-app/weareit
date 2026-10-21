"""Staged runs get the card copy and sourcing rules on their dreams and fixes (#124)."""
import unittest

from test_cards import cards, exemplar
from test_fix_stages import reviewed
from test_graph_lint import GraphLint

FIX = 'burnout-d00-t1'


class StagedCopyLint(GraphLint):
    def write_age_limit_examples(self):
        """ex-1 is Australia's age limit; ex-2 is a Minnesota warning label, so Minnesota is a place the run knows."""
        examples = {'ex-%d' % i: exemplar(i) for i in range(12)}
        examples['ex-1'].update(name='Social media minimum age', place='Australia', year=2024,
                                outcome='Under-16s cannot hold accounts on the largest platforms.')
        examples['ex-2'].update(name='Social media warning label', place='Minnesota', year=2025)
        cards.write(self.run_dir / 'exemplars.json', {'schemaVersion': 1, 'painId': 'burnout', 'exemplars': examples})

    def fix_hits(self, rule, **fields):
        issues = self.lint(lambda d: d['fixes'][FIX].update(fields))
        return [i for i in issues if i['rule'] == rule and i.get('fixId') == FIX]


class Sourcing(StagedCopyLint):
    def test_sourced_numbers_and_places_pass(self):
        self.write_age_limit_examples()
        self.assertEqual(self.fix_hits('unsourced-detail', exemplarRef='ex-1', title='Put an age limit on social media accounts',
                                       whatChanges='In Australia, under-16s wait for accounts since 2024.'), [])

    def test_unsourced_number_is_flagged(self):
        hits = self.fix_hits('unsourced-detail', whatChanges='The laptop stays by the door, which saves 40 minutes.')
        self.assertEqual(len(hits), 1, hits)
        self.assertIn('40', hits[0]['detail'])

    def test_speculative_fix_naming_an_institution_is_unsourced(self):
        hits = self.fix_hits('unsourced-detail', speculative=True, speculativeRationale='No example yet.', exemplarRef=None,
                             whatChanges='Ask the Labor Department to cap evening email.')
        self.assertEqual(len(hits), 1, hits)
        self.assertIn('speculative', hits[0]['detail'])

    def test_title_that_names_its_example_assumes_the_reader_knows_it(self):
        self.assertEqual(len(self.fix_hits('title-assumes-example', title='Do what Preston did with the laptops')), 1)

    def test_fix_citing_an_unverified_example_is_flagged(self):
        examples = {'ex-%d' % i: exemplar(i, verified=i != 1) for i in range(12)}
        cards.write(self.run_dir / 'exemplars.json', {'schemaVersion': 1, 'painId': 'burnout', 'exemplars': examples})
        self.assertEqual(len(self.fix_hits('unverified-example')), 1)

    def test_fix_with_no_name_or_number_anywhere_is_not_specific(self):
        examples = {'ex-%d' % i: dict(exemplar(i), name='a local cooperative') for i in range(12)}
        cards.write(self.run_dir / 'exemplars.json', {'schemaVersion': 1, 'painId': 'burnout', 'exemplars': examples})
        # Lowercase text: the card rule joins title and text, so a capital opening the text reads as a name.
        self.assertEqual(len(self.fix_hits('not-specific', whatChanges='work ends at the door, so the evening starts there.')), 1)

    def test_fix_naming_a_place_its_example_does_not_is_unsourced(self):
        self.write_age_limit_examples()
        hits = self.fix_hits('unsourced-detail', exemplarRef='ex-1', title='Put an age limit on social media accounts',
                             whatChanges='Minnesota chose a warning label. Accounts wait until sixteen.')
        self.assertEqual(len(hits), 1, hits)
        self.assertIn('Minnesota', hits[0]['detail'])


class Wording(StagedCopyLint):
    def test_fix_title_saying_ask_your_gp_is_a_regional_acronym(self):
        hits = self.fix_hits('acronym-in-title', title='Ask your GP about the late shifts')
        self.assertEqual(len(hits), 1, hits)
        self.assertIn('GP', hits[0]['detail'])

    def test_fix_text_saying_ask_your_gp_is_a_regional_word(self):
        hits = self.fix_hits('regional-word', whatChanges='Book a call and ask your GP about the late shifts.')
        self.assertEqual(len(hits), 1, hits)

    def test_acronym_spelled_out_in_fix_text_is_not_a_regional_word(self):
        text = 'Ask about CBT-I, cognitive behavioral therapy for insomnia, at the next checkup.'
        self.assertEqual(self.fix_hits('regional-word', whatChanges=text), [])

    def test_british_word_in_fix_text_is_a_regional_word(self):
        hits = self.fix_hits('regional-word', whatChanges='The shift rota ends at six, so work ends there.')
        self.assertEqual(len(hits), 1, hits)

    def test_fix_text_of_four_sentences_is_too_long(self):
        text = 'The laptop stays by the door. Work ends there. The evening starts. Sleep comes sooner.'
        self.assertEqual(len(self.fix_hits('fix-text-length', whatChanges=text)), 1)

    def test_three_sentences_of_fix_text_are_fine(self):
        self.assertEqual(self.fix_hits('fix-text-length', whatChanges='The laptop stays by the door. Work ends there. The evening starts.'), [])

    def test_generic_hype_and_boilerplate_phrases_are_flagged_in_fix_copy(self):
        def change(doc):
            doc['fixes'][FIX].update(whatChanges='Unlock a calmer evening.')
            doc['fixes']['burnout-d01-t1'].update(firstStep='Write it down; results may vary.')
        issues = self.lint(change)
        self.assertIn(('generic-phrase', FIX), {(i['rule'], i.get('fixId')) for i in issues})
        self.assertIn(('boilerplate-caveat', 'burnout-d01-t1'), {(i['rule'], i.get('fixId')) for i in issues})

    def test_exclamation_and_missing_serial_comma_are_flagged_in_fix_copy(self):
        self.assertEqual(len(self.fix_hits('exclamation', title='Move the laptop to the hall tonight!')), 1)
        self.assertEqual(len(self.fix_hits('serial-comma', whatChanges='The laptop, phone and badge stay by the door.')), 1)

    def test_sentence_opening_it_in_a_fix_that_is_not_a_feature_is_ambiguous(self):
        hits = self.fix_hits('ambiguous-it', whatChanges='The laptop stays by the door. It sleeps there.')
        self.assertEqual(len(hits), 1, hits)

    def test_learning_title_on_a_fix_that_is_not_learn_is_not_an_action(self):
        self.assertEqual(len(self.fix_hits('not-an-action', title='Read about evening routines')), 1)

    def test_learn_fix_about_someone_elses_example_is_flagged(self):
        hits = self.fix_hits('learn-about-others', kind='learn', origin='kind:learn',
                             title='Learn how one company ended late meetings')
        self.assertEqual(len(hits), 1, hits)

    def test_learn_fix_that_gives_a_usable_skill_passes(self):
        self.assertEqual(self.fix_hits('learn-about-others', kind='learn', origin='kind:learn',
                                       title='Learn box breathing to calm down fast'), [])

    def test_two_soft_modals_in_one_fix_are_stacked_hedges(self):
        hits = self.fix_hits('stacked-hedges', title='Move the laptop, which might help',
                             whatChanges='The evening may start sooner.')
        self.assertEqual(len(hits), 1, hits)

    def test_one_soft_modal_in_a_fix_is_a_plain_limit(self):
        self.assertEqual(self.fix_hits('stacked-hedges', whatChanges='The evening may start sooner.'), [])


def feature(**fields):
    return dict(kind='feature', status='proposed_it_feature', origin='kind:feature', **fields)


class ItRules(StagedCopyLint):
    def test_feature_described_as_already_built_is_a_built_claim(self):
        hits = self.fix_hits('built-claim', **feature(title='Find neighbors who walk at night',
                                                      whatChanges='It matches you with neighbors.'))
        self.assertEqual(len(hits), 1, hits)

    def test_feature_text_opening_with_it_is_a_pitch(self):
        self.assertEqual(len(self.fix_hits('feature-pitch', **feature(title='Find neighbors who walk at night',
                                                                      whatChanges='It would pair you with a walking buddy.'))), 1)

    def test_feature_title_mentioning_it_is_a_pitch(self):
        self.assertEqual(len(self.fix_hits('feature-pitch', **feature(title='Find walking buddies with It',
                                                                      whatChanges='Pairs you with a walking buddy.'))), 1)


class DreamCopy(StagedCopyLint):
    def dream_rules(self, **fields):
        self.write_dreams(self.run_dir, lambda d: (reviewed(d), d['dreams']['burnout-d00'].update(fields)))
        return {i['rule'] for i in self.lint() if i.get('dreamId') == 'burnout-d00'}

    def test_one_word_dream_title_is_vague(self):
        self.assertIn('title-vague', self.dream_rules(title='Rest'))

    def test_dream_title_over_ten_words_is_a_sentence(self):
        self.assertIn('title-length', self.dream_rules(title='My evenings are mine again and work stays at the office door'))

    def test_dream_line_over_one_sentence_is_too_long(self):
        self.assertIn('line-length', self.dream_rules(line='My evenings are mine. Work stays at work.'))

    def test_two_soft_modals_in_a_dream_are_stacked_hedges(self):
        self.assertIn('stacked-hedges', self.dream_rules(title='Evenings might be mine', line='Work may stop at six.'))

    def test_acronym_in_a_dream_title_is_flagged(self):
        self.assertIn('acronym-in-title', self.dream_rules(title='My GP knows my shifts'))


class Malformed(StagedCopyLint):
    def test_fix_with_copy_or_a_reference_of_the_wrong_type_does_not_crash_lint(self):
        def change(doc):
            doc['fixes'][FIX].update(title=['Move the laptop'], whatChanges=None, firstStep=3)
            doc['fixes']['burnout-d01-t1'].update(exemplarRef=['ex-1'], kind=['task'])
        self.assertIn('it-led-coverage', {i['rule'] for i in self.lint(change)})

    def test_exemplar_that_is_not_a_record_does_not_crash_lint(self):
        examples = {'ex-%d' % i: exemplar(i) for i in range(12)}
        examples['ex-1'] = 'not a record'
        cards.write(self.run_dir / 'exemplars.json', {'schemaVersion': 1, 'painId': 'burnout', 'exemplars': examples})
        self.assertIn('it-led-coverage', {i['rule'] for i in self.lint()})


if __name__ == '__main__':
    unittest.main()
