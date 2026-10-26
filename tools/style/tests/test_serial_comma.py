import importlib.util
import unittest
from pathlib import Path

SCRIPT = Path(__file__).resolve().parents[1] / "serial_comma.py"
spec = importlib.util.spec_from_file_location("serial_comma", SCRIPT)
serial_comma = importlib.util.module_from_spec(spec)
spec.loader.exec_module(serial_comma)


class SerialCommaTest(unittest.TestCase):
    def test_list_without_the_last_comma_is_found(self):
        for text in [
            "Forms, bills and calls on hold eat up my week.",
            "I depend on roads, water and power that keep breaking down.",
            "I need help with everyday things like bathing, dressing or cooking.",
            "I'm living with floods, fires, storms or extreme heat.",
            "I see cancer, heart disease and diabetes taking more people I know.",
            "I get treated worse at work, in stores or by landlords because of who I am.",
            "Breaking it into a draft date, a check date and a done date gives you a deadline.",
            "It pairs you with another person for 25, 50 or 75 minutes.",
            "It works in a few regions, including Greater Boston, Central Ohio and Maine.",
            "Look at your calendar and cross out one thing you can cancel, move or hand off.",
        ]:
            self.assertEqual(len(serial_comma.find(text)), 1, text)

    def test_lists_with_the_comma_and_other_sentences_pass(self):
        for text in [
            "Forms, bills, and calls on hold eat up my week.",
            "I don't have a bank account, so cashing checks and paying bills costs me extra.",
            "When it rains, I stay home and read.",
            "I can't park near my home, and people keep blocking my driveway.",
            "I see people around me treated badly because of their race, religion, or who they love.",
            "The groups I talk to and work with never get anything done.",
            "All talk, no action",
            "I'm afraid kids will get shot, at school or anywhere else.",
            "In participatory budgeting, residents propose and vote on projects.",
            "Residents may speak, often two or three minutes each.",
            "Write one question, under 25 words, about a specific bill or vote.",
            "Earbuds made for sleep, such as these, seal out some sound and play quiet noise.",
            "Next time you apply, email the recruiter and ask whether a tool reviews applications.",
            "Some are bakeries and cleaning companies, others are tech and engineering firms.",
            "Every few months I get an update on work like mine, without the hype or the doom.",
            '"Support", never "donate" or "donation"',
            "I'd like to get involved, but work and family leave me no time.",
        ]:
            self.assertEqual(serial_comma.find(text), [], text)

    def test_fix_inserts_the_comma(self):
        self.assertEqual(
            serial_comma.fix("I'm living with floods, fires, storms or extreme heat."),
            "I'm living with floods, fires, storms, or extreme heat.",
        )
        self.assertEqual(
            serial_comma.fix("Forms, bills, and calls."), "Forms, bills, and calls."
        )


if __name__ == "__main__":
    unittest.main()
