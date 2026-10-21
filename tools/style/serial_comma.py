"""Find lists that leave out the Oxford (serial) comma, and add it.

It copy uses the serial comma: "forms, bills, and calls", never "forms, bills and calls"
(docs/style/copy-style-guide.md, founder 2026-10-20). This is a heuristic, shared by the pain
and possibility lints: a clause with comma-separated short items whose last item is joined by
"and" or "or" without a comma before it. Clauses like "When it rains, I stay home and read"
pass, because an item that starts a new clause (a pronoun subject, "so", "but", "which") isn't
a list item.

Usage: python3 tools/style/serial_comma.py <file>…   prints each match with its line number.
"""

import re
import sys

CLAUSE = re.compile(r'[^.;:!?]+')
CONJUNCTION = re.compile(r' (and|or) ')
# A part after a comma that starts like this begins a new clause, not a list item.
CLAUSE_START = {'so', 'but', 'yet', 'which', 'who', 'whom', 'whose', 'that', 'because', 'while', 'when', 'where', 'if',
                'then', 'although', 'though', 'since', 'unless', 'until', 'as', 'i', "i'm", "i've", "i'd", "i'll", 'you',
                'he', 'she', 'we', 'they', 'it', "it's", 'there', 'this', 'these', 'those', 'and', 'or', 'nor', 'not',
                'others', 'knowing'}
# Words that open a sentence with a clause before its comma ("Next time you apply, email…").
INTRO_START = {'next', 'when', 'whenever', 'if', 'once', 'while', 'since', 'because', 'although', 'tonight', 'today', 'tomorrow'}
# An aside between commas ("Some roles, like mentoring kids, use…") isn't a list item.
ASIDE_START = {'such', 'like', 'for', 'the', 'especially'}
MAX_ITEM_WORDS = 4
# "shot, at school or anywhere else" adds a phrase rather than listing; "at work, in stores or by landlords" lists
# phrases. A part starting with one of these counts as a list item only if the item before it does too.
PREPOSITIONS = {'at', 'in', 'on', 'by', 'for', 'from', 'to', 'with', 'without', 'over', 'under', 'into', 'through',
                'about', 'around', 'after', 'before', 'during', 'like', 'never', 'always', 'even', 'just', 'only',
                'often', 'usually', 'sometimes', 'mostly', 'especially', 'maybe', 'perhaps'}


def is_item(text):
    words = text.split()
    return 0 < len(words) <= MAX_ITEM_WORDS and words[0].lower().strip('"“(') not in CLAUSE_START


def find(text):
    """Every list in `text` missing its serial comma, as {'at': index of the space before and/or, 'list': the list text}."""
    found = []
    for clause in CLAUSE.finditer(text):
        parts = clause[0].split(', ')
        if len(parts) < 2:
            continue
        last = parts[-1]
        joined = CONJUNCTION.search(last)
        if not joined:
            continue
        head = last[:joined.start()]
        # "…for your address, including the fee and how far ahead": an addition, not the end of a list.
        if not is_item(head) or head.split()[0].lower() == 'including' or not all(is_item(p) for p in parts[1:-1]):
            continue
        # "In participatory budgeting, residents propose and vote": an opening phrase, then one clause.
        # "Next time you apply, email the recruiter and ask": an opening clause, then one clause.
        first = parts[0].split()[0].lower().strip('"“(') if parts[0].split() else ''
        if len(parts) == 2 and (first in PREPOSITIONS or first in INTRO_START):
            continue
        if any(p.split()[0].lower() in ASIDE_START for p in parts[1:-1] if p.split()):
            continue
        # "one question, under 25 words, about a bill or vote": an aside, not a list item.
        if any(re.search(r'\d', p) and len(p.split()) > 1 for p in parts[1:-1]):
            continue
        before = parts[-2].split()[-3:]
        if head.split()[0].lower() in PREPOSITIONS and not any(w.lower() in PREPOSITIONS - {'like'} for w in before):
            continue
        at = clause.start() + len(clause[0]) - len(last) + joined.start()
        found.append({'at': at, 'list': clause[0].strip()})
    return found


def fix(text):
    """`text` with a serial comma added to every list that leaves it out."""
    for hit in reversed(find(text)):
        text = text[:hit['at']] + ',' + text[hit['at']:]
    return text


def main(paths):
    status = 0
    for path in paths:
        for n, line in enumerate(open(path, encoding='utf-8'), 1):
            for hit in find(line):
                print('%s:%d: no serial comma in "%s"' % (path, n, hit['list']))
                status = 1
    return status


if __name__ == '__main__':
    sys.exit(main(sys.argv[1:]))
