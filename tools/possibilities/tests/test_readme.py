"""The README's helper table is the helper's documentation: it matches `cards.py --help`."""
import re
import subprocess
import sys
import unittest

from test_cards import ROOT, SCRIPT


def help_text():
    return subprocess.run([sys.executable, str(SCRIPT), '--help'], capture_output=True, text=True, check=True).stdout


def helper_section():
    text = (ROOT / 'tools/possibilities/README.md').read_text()
    return text.split('\n## Helper\n', 1)[1].split('\n## ', 1)[0]


def helper_table():
    """The first cell of every row in the README's subcommand table."""
    table = helper_section().split('| Subcommand | Effect |', 1)[1].split('\n\n', 1)[0]
    return [line.split(' | ', 1)[0] for line in table.splitlines()[2:]]


class ReadmeMatchesHelp(unittest.TestCase):
    def test_every_subcommand_has_a_row_and_every_row_is_a_subcommand(self):
        choices = set(re.search(r'\{([a-z,-]+)\}', help_text()).group(1).split(','))
        documented = {span.split()[0] for cell in helper_table() for span in re.findall(r'`([^`]+)`', cell)}
        self.assertEqual(documented, choices)

    def test_every_option_is_documented(self):
        options = set(re.findall(r'(--[a-z]+)', help_text())) - {'--help'}
        section = helper_section()
        self.assertEqual({o for o in options if o not in section}, set())


if __name__ == '__main__':
    unittest.main()
