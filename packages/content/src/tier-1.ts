import {
  painDomainListSchema,
  type Dream,
  type Pain,
  type PainDomain,
} from "./schema";

export type { Dream, Pain, PainDomain } from "./schema";

export const tier1ContentMetadata = {
  version: "tier-1-2026-10-14",
  source: "docs/source/it_mvp_tier_1_pains_and_dreams.md",
  rights: "CC0-1.0",
} as const;

// Initial presentation set from it_mvp_tier_1_pains_and_dreams.md.
// Copy remains content data so product wording can be revised independently of UI.
const personalPainDomainData = [
  {
    id: "body",
    title: "Body",
    pains: [
      {
        id: "poor-sleep",
        title: "Poor sleep",
        description: "I don't sleep well.",
        dreams: [
          { id: "rested", title: "Rested", description: "I wake up ready." },
        ],
      },
      {
        id: "out-of-shape",
        title: "Out of shape",
        description: "I don't move enough.",
        dreams: [
          {
            id: "strong",
            title: "Strong",
            description: "My body can do what I ask.",
          },
        ],
      },
    ],
  },
  {
    id: "head",
    title: "Head",
    pains: [
      {
        id: "anxiety",
        title: "Anxiety",
        description: "I worry too much.",
        dreams: [
          { id: "calm", title: "Calm", description: "My head is quiet." },
        ],
      },
      {
        id: "burnout",
        title: "Burnout",
        description: "I've got nothing left.",
        dreams: [
          {
            id: "recovered",
            title: "Recovered",
            description: "I have something left at the end of the day.",
          },
        ],
      },
      {
        id: "overwhelmed",
        title: "Overwhelmed",
        description: "There's too much at once.",
        dreams: [
          {
            id: "on-top-of-it",
            title: "On top of it",
            description: "I know what today is for.",
          },
        ],
      },
    ],
  },
  {
    id: "money",
    title: "Money",
    pains: [
      {
        id: "broke",
        title: "Broke",
        description: "Money is always tight.",
        dreams: [
          {
            id: "steady",
            title: "Steady",
            description: "A bad month stays a bad month.",
          },
          {
            id: "comfortable",
            title: "Comfortable",
            description: "I don't think about money much.",
          },
          {
            id: "free",
            title: "Free",
            description: "I don't work just to live.",
          },
        ],
      },
      {
        id: "underpaid",
        title: "Underpaid",
        description: "My work is worth more.",
        dreams: [
          {
            id: "paid-fairly",
            title: "Paid fairly",
            description: "What I get matches what I do.",
          },
        ],
      },
    ],
  },
  {
    id: "time",
    title: "Time",
    pains: [
      {
        id: "doomscrolling",
        title: "Doomscrolling",
        description: "I lose my nights to my phone.",
        dreams: [
          {
            id: "present",
            title: "Present",
            description: "My evenings are mine.",
          },
        ],
      },
      {
        id: "no-free-time",
        title: "No free time",
        description: "None of it is mine.",
        dreams: [
          {
            id: "unhurried",
            title: "Unhurried",
            description: "There's room in the day.",
          },
        ],
      },
    ],
  },
  {
    id: "people",
    title: "People",
    pains: [
      {
        id: "loneliness",
        title: "Loneliness",
        description: "I feel alone.",
        dreams: [
          {
            id: "belonging",
            title: "Belonging",
            description: "My people are close by.",
          },
        ],
      },
      {
        id: "nobody-to-do-things-with",
        title: "Nobody to do things with",
        description: "I'd go if someone asked.",
        dreams: [
          {
            id: "regular-thing",
            title: "A regular thing",
            description: "There's something on the calendar with people in it.",
          },
        ],
      },
      {
        id: "drifted-apart",
        title: "Drifted apart",
        description: "I've lost touch with people who matter.",
        dreams: [
          {
            id: "back-in-touch",
            title: "Back in touch",
            description: "I see them and it's easy again.",
          },
        ],
      },
    ],
  },
  {
    id: "doing",
    title: "Doing",
    pains: [
      {
        id: "procrastination",
        title: "Procrastination",
        description: "I put things off.",
        dreams: [
          {
            id: "follow-through",
            title: "Follow-through",
            description: "I do what I said I'd do.",
          },
        ],
      },
      {
        id: "no-path",
        title: "No path",
        description: "I know what I want and not how.",
        dreams: [
          {
            id: "next-step",
            title: "The next step",
            description: "The way there is obvious from here.",
          },
        ],
      },
      {
        id: "meaningless-work",
        title: "Meaningless work",
        description: "My work doesn't matter.",
        dreams: [
          {
            id: "purpose",
            title: "Purpose",
            description: "My work is worth doing.",
          },
        ],
      },
    ],
  },
];

export const personalPainDomains: PainDomain[] = painDomainListSchema.parse(
  personalPainDomainData,
);

const worldPainDomainData = [
  {
    id: "power",
    title: "Power",
    pains: [
      {
        id: "they-dont-listen",
        title: "They don't listen",
        description: "Nobody in charge answers to me.",
        dreams: [
          {
            id: "real-representation",
            title: "Real representation",
            description: "My rep actually calls back.",
          },
        ],
      },
      {
        id: "dont-know-who-to-vote-for",
        title: "I don't know who to vote for",
        description: "The ballot is a guess.",
        dreams: [
          {
            id: "confident-at-ballot",
            title: "Confident at the ballot",
            description: "I vote knowing what I'm voting for.",
          },
        ],
      },
      {
        id: "no-accountability",
        title: "No accountability",
        description: "They say anything and nothing follows.",
        dreams: [
          {
            id: "watched",
            title: "Watched",
            description: "We know who kept their promises.",
          },
        ],
      },
    ],
  },
  {
    id: "economy",
    title: "Economy",
    pains: [
      {
        id: "rent-eats-everything",
        title: "Rent eats everything",
        description: "Housing takes half.",
        dreams: [
          {
            id: "affordable-housing",
            title: "Affordable housing",
            description: "Rent leaves room for a life.",
          },
        ],
      },
      {
        id: "one-illness-away",
        title: "One illness away",
        description: "Getting sick would ruin me.",
        dreams: [
          {
            id: "healthcare",
            title: "Healthcare",
            description: "You get care when you need it.",
          },
        ],
      },
      {
        id: "it-all-goes-up",
        title: "It all goes up",
        description: "The people who own things get everything.",
        dreams: [
          {
            id: "shared-ownership",
            title: "Shared ownership",
            description: "The profit stays here.",
          },
        ],
      },
    ],
  },
  {
    id: "each-other",
    title: "Each other",
    pains: [
      {
        id: "nobody-knows-anybody",
        title: "Nobody knows anybody",
        description: "My street is strangers.",
        dreams: [
          {
            id: "real-community",
            title: "Real community",
            description: "There are people here who show up.",
          },
        ],
      },
      {
        id: "we-cant-talk",
        title: "We can't talk",
        description: "Disagreeing ends it.",
        dreams: [
          {
            id: "common-ground",
            title: "Common ground",
            description: "We argue and still get things done.",
          },
        ],
      },
    ],
  },
  {
    id: "dignity",
    title: "Dignity",
    pains: [
      {
        id: "treated-differently",
        title: "Treated differently",
        description: "Who I am counts against me.",
        dreams: [
          {
            id: "taken-as-i-am",
            title: "Taken as I am",
            description: "I walk in and it's not a factor.",
          },
        ],
      },
      {
        id: "people-treated-badly",
        title: "People get treated badly for who they are",
        description: "I watch it happen.",
        dreams: [
          {
            id: "everyones-counted-in",
            title: "Everyone's counted in",
            description: "Nobody has to shrink to be safe here.",
          },
        ],
      },
    ],
  },
  {
    id: "information",
    title: "Information",
    pains: [
      {
        id: "dont-know-whats-true",
        title: "I don't know what's true",
        description: "Everything contradicts everything.",
        dreams: [
          {
            id: "honest-news",
            title: "Honest news",
            description: "I trust what I read.",
          },
        ],
      },
      {
        id: "nobody-covers-here",
        title: "Nobody covers here",
        description: "I don't know what's happening in my own town.",
        dreams: [
          {
            id: "local-coverage",
            title: "Local coverage",
            description: "Someone reports on this place.",
          },
        ],
      },
    ],
  },
  {
    id: "change",
    title: "Change",
    pains: [
      {
        id: "nothing-ever-changes",
        title: "Nothing ever changes",
        description: "We all know the problem and it stays.",
        dreams: [
          {
            id: "momentum",
            title: "Momentum",
            description: "Things we agree on actually happen.",
          },
        ],
      },
      {
        id: "shouting-into-void",
        title: "Shouting into the void",
        description: "I care and it goes nowhere.",
        dreams: [
          {
            id: "it-counted",
            title: "It counted",
            description: "What I did showed up somewhere.",
          },
        ],
      },
      {
        id: "alone-in-caring",
        title: "Alone in caring",
        description: "I don't know who else gives a damn.",
        dreams: [
          {
            id: "found-my-people",
            title: "Found my people",
            description: "There's a group and it's local.",
          },
        ],
      },
    ],
  },
];

export const worldPainDomains: PainDomain[] =
  painDomainListSchema.parse(worldPainDomainData);

export function getAllDreams(domains: PainDomain[]): Dream[] {
  return domains.flatMap((domain) =>
    domain.pains.flatMap((pain) => pain.dreams),
  );
}

export function getAllPains(domains: PainDomain[]): Pain[] {
  return domains.flatMap((domain) => domain.pains);
}
