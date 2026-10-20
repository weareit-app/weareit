---
title: Licensing
question: What of It is open, under which license, and what is only planned?
# Unpublished until the founder approves this text (public-pages task 7.6).
published: false
updated: 2026-10-20
changes:
  - date: 2026-10-20
    note: First draft, from the working licensing decisions, for the founder to review.
sources:
  - id: licensing-decisions
    title: Working licensing decisions
    publisher: We Are It, on GitHub
    url: https://github.com/weareit-app/weareit/blob/master/docs/architecture/licensing.md
---

This page says which license each part of It is meant to have, which of those are in place today, and whose work It uses. When something changes, the date at the top and the list of changes say what.

## What is true today

All of It's code is public. Anyone can read it at [github.com/weareit-app/weareit](https://github.com/weareit-app/weareit), along with the plans, the specs and the decisions behind them.

Being public isn't the same as being licensed, though. The repository doesn't have its license files yet, so for now none of the licenses below has been applied, and the usual copyright rules still hold. We'll add the license files before we accept work from anyone outside It, and this page will change on the day we do.

## Licenses by kind of material

These are the licenses we've chosen for each kind of material[^licensing-decisions]. Each row says whether it applies today or is planned.

| Material                                                 | License                                                                                                                 | Today or planned                                               | Where to find it                                                                                   |
| -------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------- | -------------------------------------------------------------------------------------------------- |
| App and server code                                      | [GNU Affero General Public License, version 3 or later (AGPL-3.0-or-later)](https://www.gnu.org/licenses/agpl-3.0.html) | Planned. The code is public today, without a license file yet. | [The code on GitHub](https://github.com/weareit-app/weareit)                                       |
| Software development kits (SDKs) and the public protocol | [Apache License 2.0](https://www.apache.org/licenses/LICENSE-2.0)                                                       | Planned. No SDK or protocol has been released yet.             | Not released yet                                                                                   |
| Knowledge data and the open research dataset             | [Creative Commons Zero (CC0 1.0), a public domain dedication](https://creativecommons.org/publicdomain/zero/1.0/)       | Planned. No dataset has been released yet.                     | Not released yet                                                                                   |
| Guides and essays, including this page                   | [Creative Commons Attribution-ShareAlike 4.0 (CC BY-SA 4.0)](https://creativecommons.org/licenses/by-sa/4.0/)           | Planned. Not applied yet.                                      | [The essays on GitHub](https://github.com/weareit-app/weareit/tree/master/packages/content/essays) |
| Illustrations, such as the watercolor dots               | [Creative Commons Zero (CC0 1.0), a public domain dedication](https://creativecommons.org/publicdomain/zero/1.0/)       | Planned. Not applied yet.                                      | Not released separately yet                                                                        |

### What each license means for you

- **App and server code (AGPL).** You'll be able to use, change and share the code. If you run a changed version as a service for other people, you have to share your changes under the same license. The license doesn't require the hosted app to be free of charge.
- **SDKs and the public protocol (Apache 2.0).** These are meant for other people's apps, so they'll have a looser license that lets them be used anywhere, including in closed-source apps. They'll be kept separate from the app code so they never carry the AGPL with them.
- **Knowledge data and illustrations (CC0).** You'll be able to use them for anything, without asking and without credit. We'll still record where each piece came from, and data drawn from other people's work keeps whatever terms that work has.
- **Guides and essays (CC BY-SA).** You'll be able to copy and adapt them if you credit It and share your version under the same license. If someone who wrote part of an essay asks to have their name taken off, we'll do it where we reasonably can.

### Still to be written

Before outside contributions are accepted, three documents need to exist:

1. The exact wording of an exception to the AGPL that lets the app be offered through Apple's App Store.
2. The terms for contributing, which say what rights a contributor grants for code, data, prose and illustrations.
3. A trademark policy for the name and the logo.

## Shared ownership

We intend for the people who use It to share in owning and running it, and for It's core to stay available for anyone to run on their own servers. Today that is an intention, not a commitment: It is one person and a small company, and nothing about shared ownership has been written into a legal document yet. A license alone can't promise it, so it will need its own governance documents :status[open question].

## Credits

It uses work published by other people. Naming it here doesn't mean they endorse It or are involved with it.

### Fonts

- **Bitter**, the font for headings and reading text, was designed by Huerta Tipográfica and is available under the [SIL Open Font License 1.1](https://openfontlicense.org). [Bitter on Google Fonts](https://fonts.google.com/specimen/Bitter).
- **Inter**, the font for buttons and other interface text, was designed by Rasmus Andersson and is available under the [SIL Open Font License 1.1](https://openfontlicense.org). [Inter on GitHub](https://github.com/rsms/inter).

### Occupations, skills and education

The Help build It page, which is coming soon, lets people describe what they know. That page uses these lists.

Occupation and skill names come from ESCO, the European classification of skills, competences and occupations, published by the European Commission under the Creative Commons Attribution 4.0 International license (CC BY 4.0). We've changed some of the names to make them clearer, so a name you see here may differ from ESCO's. [ESCO's website](https://esco.ec.europa.eu) and [the CC BY 4.0 license](https://creativecommons.org/licenses/by/4.0/).

Education levels and fields of study come from the International Standard Classification of Education (ISCED 2011), published by the UNESCO Institute for Statistics. [ISCED on the UNESCO Institute for Statistics website](https://uis.unesco.org/en/topic/international-standard-classification-education-isced).
