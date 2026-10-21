# Use a resource brief: a service that already exists

Read `briefs/kinds/_shared.md` first. This brief covers only Use a resource fixes (`kind: resource`, origin `kind:resource`).

Use a resource means contacting a service that already exists for people like the reader: a hotline, a clinic, a benefits program, a legal aid office, a library, or 211. Its title names the service, or the type of service, and what the person does with it.

## Method

Many people never claim help they qualify for. In a field experiment with the Internal Revenue Service, a mailing, a simpler form, and showing the size of the benefit all raised claims (Bhargava and Manoli), which suggests that not knowing and complexity are part of the reason. So a good Use a resource fix makes the service easy to find and easy to start: who runs it, whether the reader qualifies, how to reach it, and what to have ready. These are the fields.

For each accepted dream with a Use a resource ceiling above zero, list the services in the run's examples that move a person toward it. Prefer services that are free, widely available, or that most people don't know they qualify for. Keep only the strongest, up to the ceiling. For sensitive pains, include real crisis and care resources, as the README requires.

## Method fields

Fill these in `method` before writing any copy:

| Field | What it holds |
| --- | --- |
| `provider` | Who runs it ("your county's housing authority", "a local nonprofit through 211") |
| `eligibility` | Who qualifies ("renters with a court date", "anyone") |
| `access` | How to reach it: a phone number, a text line, a website, or a place, as the cited example gives it |
| `bring` | What to have ready (a lease, a pay stub, an ID), or "nothing" |

Every name, number, and place in these fields and in the copy must appear in the cited exemplar's record. A speculative fix names the type of service ("your local legal aid office"), never an institution.

## Is it really Use a resource?

| If… | then it's… |
| --- | --- |
| the person changes something themselves, with no service involved | a Task |
| it needs someone's yes on a request they could refuse, not a service open to people who qualify | an Ask |
| it's joining an ongoing group of peers rather than using a service | a Group |
| it's something It would build | a Feature |

Kind and status stay separate. A Use a resource fix usually has status `existing_resource`, because the service already exists. `real_now` is also allowed, for a step the reader can take today without contacting anyone, such as using a library's free online courses. Validation fails any other status.

## Examples

Good:
- **Title:** "Call 211 for help with rent this month"
- **Text:** "211 connects you with local rent, utility, and food programs, free and by phone or text. Have your lease and last pay stub nearby, since most programs ask for them."
- **Method:** `provider` "local nonprofits, through 211", `eligibility` "anyone in the United States", `access` "call or text 211", `bring` "your lease and a recent pay stub".
- **Lens and ambition:** `community`, `tonight`.

Bad:
- **Title:** "Look into what help is available"

This one names no service, says nothing about who qualifies or how to reach it, and leaves all the work to the reader.
