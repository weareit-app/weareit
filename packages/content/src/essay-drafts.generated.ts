// Generated from essays/<slug>/essay.md by `pnpm --filter @it/content essays`.
// Don't edit it by hand: edit the essay and run the script again.
import type { Essay } from "@it/domain/essays";

/** Unpublished essays, for the development `?draft` preview only. */
export const draftEssays: Partial<Record<string, Essay>> = {
  licensing: {
    slug: "licensing",
    title: "Licensing",
    question:
      "What of It is open, under which license, and what is only planned?",
    published: false,
    updated: "2026-10-20",
    changes: [
      {
        date: "2026-10-20",
        note: "First draft, from the working licensing decisions, for the founder to review.",
      },
    ],
    sources: [
      {
        id: "licensing-decisions",
        title: "Working licensing decisions",
        publisher: "We Are It, on GitHub",
        url: "https://github.com/weareit-app/weareit/blob/master/docs/architecture/licensing.md",
      },
    ],
    body: [
      {
        type: "paragraph",
        children: [
          {
            type: "text",
            value:
              "This page says which license each part of It is meant to have, which of those are in place today, and whose work It uses. When something changes, the date at the top and the list of changes say what.",
          },
        ],
      },
      {
        type: "heading",
        level: 2,
        children: [{ type: "text", value: "What is true today" }],
      },
      {
        type: "paragraph",
        children: [
          {
            type: "text",
            value: "All of It's code is public. Anyone can read it at ",
          },
          {
            type: "link",
            href: "https://github.com/weareit-app/weareit",
            children: [
              { type: "text", value: "github.com/weareit-app/weareit" },
            ],
          },
          {
            type: "text",
            value:
              ", along with the plans, the specs and the decisions behind them.",
          },
        ],
      },
      {
        type: "paragraph",
        children: [
          {
            type: "text",
            value:
              "Being public isn't the same as being licensed, though. The repository doesn't have its license files yet, so for now none of the licenses below has been applied, and the usual copyright rules still hold. We'll add the license files before we accept work from anyone outside It, and this page will change on the day we do.",
          },
        ],
      },
      {
        type: "heading",
        level: 2,
        children: [{ type: "text", value: "Licenses by kind of material" }],
      },
      {
        type: "paragraph",
        children: [
          {
            type: "text",
            value:
              "These are the licenses we've chosen for each kind of material",
          },
          { type: "sourceRef", id: "licensing-decisions" },
          {
            type: "text",
            value: ". Each row says whether it applies today or is planned.",
          },
        ],
      },
      {
        type: "table",
        align: [null, null, null, null],
        head: [
          [{ type: "text", value: "Material" }],
          [{ type: "text", value: "License" }],
          [{ type: "text", value: "Today or planned" }],
          [{ type: "text", value: "Where to find it" }],
        ],
        rows: [
          [
            [{ type: "text", value: "App and server code" }],
            [
              {
                type: "link",
                href: "https://www.gnu.org/licenses/agpl-3.0.html",
                children: [
                  {
                    type: "text",
                    value:
                      "GNU Affero General Public License, version 3 or later (AGPL-3.0-or-later)",
                  },
                ],
              },
            ],
            [
              {
                type: "text",
                value:
                  "Planned. The code is public today, without a license file yet.",
              },
            ],
            [
              {
                type: "link",
                href: "https://github.com/weareit-app/weareit",
                children: [{ type: "text", value: "The code on GitHub" }],
              },
            ],
          ],
          [
            [
              {
                type: "text",
                value:
                  "Software development kits (SDKs) and the public protocol",
              },
            ],
            [
              {
                type: "link",
                href: "https://www.apache.org/licenses/LICENSE-2.0",
                children: [{ type: "text", value: "Apache License 2.0" }],
              },
            ],
            [
              {
                type: "text",
                value: "Planned. No SDK or protocol has been released yet.",
              },
            ],
            [{ type: "text", value: "Not released yet" }],
          ],
          [
            [
              {
                type: "text",
                value: "Knowledge data and the open research dataset",
              },
            ],
            [
              {
                type: "link",
                href: "https://creativecommons.org/publicdomain/zero/1.0/",
                children: [
                  {
                    type: "text",
                    value:
                      "Creative Commons Zero (CC0 1.0), a public domain dedication",
                  },
                ],
              },
            ],
            [
              {
                type: "text",
                value: "Planned. No dataset has been released yet.",
              },
            ],
            [{ type: "text", value: "Not released yet" }],
          ],
          [
            [{ type: "text", value: "Guides and essays, including this page" }],
            [
              {
                type: "link",
                href: "https://creativecommons.org/licenses/by-sa/4.0/",
                children: [
                  {
                    type: "text",
                    value:
                      "Creative Commons Attribution-ShareAlike 4.0 (CC BY-SA 4.0)",
                  },
                ],
              },
            ],
            [{ type: "text", value: "Planned. Not applied yet." }],
            [
              {
                type: "link",
                href: "https://github.com/weareit-app/weareit/tree/master/packages/content/essays",
                children: [{ type: "text", value: "The essays on GitHub" }],
              },
            ],
          ],
          [
            [
              {
                type: "text",
                value: "Illustrations, such as the watercolor dots",
              },
            ],
            [
              {
                type: "link",
                href: "https://creativecommons.org/publicdomain/zero/1.0/",
                children: [
                  {
                    type: "text",
                    value:
                      "Creative Commons Zero (CC0 1.0), a public domain dedication",
                  },
                ],
              },
            ],
            [{ type: "text", value: "Planned. Not applied yet." }],
            [{ type: "text", value: "Not released separately yet" }],
          ],
        ],
      },
      {
        type: "heading",
        level: 3,
        children: [{ type: "text", value: "What each license means for you" }],
      },
      {
        type: "list",
        ordered: false,
        items: [
          [
            {
              type: "paragraph",
              children: [
                {
                  type: "strong",
                  children: [
                    { type: "text", value: "App and server code (AGPL)." },
                  ],
                },
                {
                  type: "text",
                  value:
                    " You'll be able to use, change and share the code. If you run a changed version as a service for other people, you have to share your changes under the same license. The license doesn't require the hosted app to be free of charge.",
                },
              ],
            },
          ],
          [
            {
              type: "paragraph",
              children: [
                {
                  type: "strong",
                  children: [
                    {
                      type: "text",
                      value: "SDKs and the public protocol (Apache 2.0).",
                    },
                  ],
                },
                {
                  type: "text",
                  value:
                    " These are meant for other people's apps, so they'll have a looser license that lets them be used anywhere, including in closed-source apps. They'll be kept separate from the app code so they never carry the AGPL with them.",
                },
              ],
            },
          ],
          [
            {
              type: "paragraph",
              children: [
                {
                  type: "strong",
                  children: [
                    {
                      type: "text",
                      value: "Knowledge data and illustrations (CC0).",
                    },
                  ],
                },
                {
                  type: "text",
                  value:
                    " You'll be able to use them for anything, without asking and without credit. We'll still record where each piece came from, and data drawn from other people's work keeps whatever terms that work has.",
                },
              ],
            },
          ],
          [
            {
              type: "paragraph",
              children: [
                {
                  type: "strong",
                  children: [
                    { type: "text", value: "Guides and essays (CC BY-SA)." },
                  ],
                },
                {
                  type: "text",
                  value:
                    " You'll be able to copy and adapt them if you credit It and share your version under the same license. If someone who wrote part of an essay asks to have their name taken off, we'll do it where we reasonably can.",
                },
              ],
            },
          ],
        ],
      },
      {
        type: "heading",
        level: 3,
        children: [{ type: "text", value: "Still to be written" }],
      },
      {
        type: "paragraph",
        children: [
          {
            type: "text",
            value:
              "Before outside contributions are accepted, three documents need to exist:",
          },
        ],
      },
      {
        type: "list",
        ordered: true,
        items: [
          [
            {
              type: "paragraph",
              children: [
                {
                  type: "text",
                  value:
                    "The exact wording and scope of an exception to the AGPL that lets the app be offered through Apple's App Store.",
                },
              ],
            },
          ],
          [
            {
              type: "paragraph",
              children: [
                {
                  type: "text",
                  value:
                    "How people contribute: either a sign-off on each contribution (a Developer Certificate of Origin) or a signed contributor agreement, and what rights a contributor grants for code, data, prose and illustrations.",
                },
              ],
            },
          ],
          [
            {
              type: "paragraph",
              children: [
                {
                  type: "text",
                  value:
                    "A trademark policy, and governance rules that protect It's mission and its name.",
                },
              ],
            },
          ],
        ],
      },
      {
        type: "heading",
        level: 2,
        children: [{ type: "text", value: "Shared ownership" }],
      },
      {
        type: "paragraph",
        children: [
          {
            type: "text",
            value:
              "We intend for the people who use It to share in owning and running it, and for It's core to stay available for anyone to run on their own servers. Today that is an intention, not a commitment: It is one person and a small company, and nothing about shared ownership has been written into a legal document yet. A license alone can't promise shared ownership, so that will need its own governance documents ",
          },
          { type: "status", label: "open question" },
          { type: "text", value: "." },
        ],
      },
      {
        type: "heading",
        level: 2,
        children: [{ type: "text", value: "Credits" }],
      },
      {
        type: "paragraph",
        children: [
          {
            type: "text",
            value:
              "It uses work published by other people. Naming it here doesn't mean they endorse It or are involved with it.",
          },
        ],
      },
      {
        type: "heading",
        level: 3,
        children: [{ type: "text", value: "Fonts" }],
      },
      {
        type: "list",
        ordered: false,
        items: [
          [
            {
              type: "paragraph",
              children: [
                {
                  type: "strong",
                  children: [{ type: "text", value: "Bitter" }],
                },
                {
                  type: "text",
                  value:
                    ", the font for headings and reading text, was designed by Huerta Tipográfica and is available under the ",
                },
                {
                  type: "link",
                  href: "https://openfontlicense.org",
                  children: [
                    { type: "text", value: "SIL Open Font License 1.1" },
                  ],
                },
                { type: "text", value: ". " },
                {
                  type: "link",
                  href: "https://fonts.google.com/specimen/Bitter",
                  children: [{ type: "text", value: "Bitter on Google Fonts" }],
                },
                { type: "text", value: "." },
              ],
            },
          ],
          [
            {
              type: "paragraph",
              children: [
                {
                  type: "strong",
                  children: [{ type: "text", value: "Inter" }],
                },
                {
                  type: "text",
                  value:
                    ", the font for buttons and other interface text, was designed by Rasmus Andersson and is available under the ",
                },
                {
                  type: "link",
                  href: "https://openfontlicense.org",
                  children: [
                    { type: "text", value: "SIL Open Font License 1.1" },
                  ],
                },
                { type: "text", value: ". " },
                {
                  type: "link",
                  href: "https://github.com/rsms/inter",
                  children: [{ type: "text", value: "Inter on GitHub" }],
                },
                { type: "text", value: "." },
              ],
            },
          ],
        ],
      },
      {
        type: "heading",
        level: 3,
        children: [
          { type: "text", value: "Occupations, skills and education" },
        ],
      },
      {
        type: "paragraph",
        children: [
          {
            type: "text",
            value:
              "The Help build It page, which is coming soon, lets people describe what they know. That page uses these lists.",
          },
        ],
      },
      {
        type: "paragraph",
        children: [
          {
            type: "text",
            value:
              "Occupation and skill names come from ESCO, the European classification of skills, competences and occupations, published by the European Commission under the Creative Commons Attribution 4.0 International license (CC BY 4.0). We've changed some of the names to make them clearer, so a name you see in It may differ from ESCO's. ",
          },
          {
            type: "link",
            href: "https://esco.ec.europa.eu",
            children: [{ type: "text", value: "ESCO's website" }],
          },
          { type: "text", value: " and " },
          {
            type: "link",
            href: "https://creativecommons.org/licenses/by/4.0/",
            children: [{ type: "text", value: "the CC BY 4.0 license" }],
          },
          { type: "text", value: "." },
        ],
      },
      {
        type: "paragraph",
        children: [
          {
            type: "text",
            value:
              "Education levels and fields of study come from the International Standard Classification of Education (ISCED 2011), published by the UNESCO Institute for Statistics. ",
          },
          {
            type: "link",
            href: "https://uis.unesco.org/en/topic/international-standard-classification-education-isced",
            children: [
              {
                type: "text",
                value: "ISCED on the UNESCO Institute for Statistics website",
              },
            ],
          },
          { type: "text", value: "." },
        ],
      },
    ],
  },
  why: {
    slug: "why",
    title: "Why It exists",
    question: "What made this worth attempting?",
    published: false,
    updated: "2026-10-20",
    changes: [
      {
        date: "2026-10-20",
        note: "Placeholder page, written to check the essay layout. The founder is writing the real essay.",
      },
    ],
    sources: [
      {
        id: "public-pages-plan",
        title: "Public pages change (essays, roadmap and site navigation)",
        publisher: "We Are It, on GitHub",
        url: "https://github.com/weareit-app/weareit/tree/master/openspec/changes/public-pages",
      },
    ],
    body: [
      {
        type: "paragraph",
        children: [
          {
            type: "text",
            value:
              "This page is a placeholder. The founder is writing the essay that goes here, about what made It worth attempting.",
          },
        ],
      },
      {
        type: "heading",
        level: 2,
        children: [{ type: "text", value: "What this page will cover" }],
      },
      {
        type: "paragraph",
        children: [
          {
            type: "text",
            value:
              "The plan for this page is public, along with the other essays and the roadmap",
          },
          { type: "sourceRef", id: "public-pages-plan" },
          { type: "text", value: ". The essay will cover:" },
        ],
      },
      {
        type: "list",
        ordered: false,
        items: [
          [
            {
              type: "paragraph",
              children: [
                {
                  type: "text",
                  value:
                    "the question: why build It at all, when there are already apps for habits, causes and self-help",
                },
              ],
            },
          ],
          [
            {
              type: "paragraph",
              children: [
                {
                  type: "text",
                  value:
                    "what the founder noticed: people can usually name what hurts, but rarely see the different futures that could follow",
                },
              ],
            },
          ],
          [
            {
              type: "paragraph",
              children: [
                {
                  type: "text",
                  value: "what It is trying to change, and what is true today",
                },
              ],
            },
          ],
        ],
      },
      {
        type: "heading",
        level: 2,
        children: [{ type: "text", value: "What is true today" }],
      },
      {
        type: "paragraph",
        children: [
          {
            type: "text",
            value:
              "Today It is the explorer plus signup. Everything else on the roadmap is ",
          },
          { type: "status", label: "planned engineering" },
          { type: "text", value: "." },
        ],
      },
    ],
  },
};
