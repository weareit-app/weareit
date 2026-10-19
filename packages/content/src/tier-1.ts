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

// Personal set, flat under the pain tree's headings (docs/spec/pains/pain-tree.md;
// every pain top level, parked pains left out, 2026-10-18). Names and lines
// come from docs/spec/pains/pain-inventory.yaml. Futures are drafts from the onboarding
// prototype; pains with none yet still show, and say so when opened.
const pain = (
  id: string,
  title: string,
  description: string,
  dreams: [id: string, title: string, description: string][] = [],
) => ({
  id,
  title,
  description,
  dreams: dreams.map(([dreamId, dreamTitle, dreamDescription]) => ({
    id: dreamId,
    title: dreamTitle,
    description: dreamDescription,
  })),
});

const personalPainDomainData = [
  {
    id: "body",
    title: "Body",
    pains: [
      pain("poor-sleep", "Sleep", "I don't sleep well.", [
        ["fall-asleep", "Fall asleep", "I drift off without a fight."],
        ["stay-asleep", "Stay asleep", "I sleep through the night."],
        ["rested", "Rested", "I wake up ready."],
      ]),
      pain(
        "out-of-shape",
        "Fitness",
        "I don't feel as fit or active as I'd like.",
        [
          ["strong", "Strong", "My body can do what I ask."],
          [
            "moving-with-friends",
            "Moving with friends",
            "Exercise is something we do together.",
          ],
        ],
      ),
      pain("always-tired", "Tired", "I'm tired all the time.", [
        ["energy-to-spare", "Energy to spare", "I have some left over."],
        ["clear-headed", "Clear-headed", "I can think straight."],
      ]),
      pain(
        "health-runs-my-life",
        "Illness",
        "I'm living with a condition that limits me.",
      ),
      pain("chronic-pain", "Pain", "I hurt most days.", [
        [
          "moving-without-pain",
          "Moving without pain",
          "I can do things without bracing for it.",
        ],
        [
          "care-that-listens",
          "Care that listens",
          "Someone takes my pain seriously.",
        ],
      ]),
      pain(
        "cant-get-care",
        "Healthcare",
        "I can't see a doctor when I need one.",
      ),
      pain("eating-badly", "Diet", "I don't eat the way I want to.", [
        ["healthy", "Healthy", "I eat in a way that feels good."],
        [
          "cooking-with-others",
          "Cooking with others",
          "Meals are something we share.",
        ],
      ]),
      pain("not-built-for-me", "Disability", "I can't access things I need."),
    ],
  },
  {
    id: "mind",
    title: "Mind",
    pains: [
      pain("anxiety", "Anxiety", "I worry too much.", [
        [
          "steady-enough-to-plan",
          "Steady enough to plan",
          "I can think ahead without spiralling.",
        ],
        ["calm-in-my-body", "Calm in my body", "My chest isn't tight all day."],
        [
          "less-to-worry-about",
          "Less to worry about",
          "Fewer things hang over me.",
        ],
      ]),
      pain("overwhelmed", "Stress", "I'm overwhelmed.", [
        [
          "one-thing-at-a-time",
          "One thing at a time",
          "I know what today is for.",
        ],
        [
          "help-when-i-need-it",
          "Help when I need it",
          "I can hand something off.",
        ],
      ]),
      pain("feeling-down", "Depression", "I feel low most days."),
      pain(
        "hard-on-myself",
        "Self-esteem",
        "I'm never good enough for myself.",
      ),
      pain("cant-focus", "Focus", "I can't keep my mind on one thing.", [
        ["clear-headed", "Clear-headed", "I can think straight."],
        [
          "fewer-interruptions",
          "Fewer interruptions",
          "I get to finish a thought.",
        ],
      ]),
      pain("grief", "Grief", "I'm missing someone I lost."),
      pain(
        "drinking-too-much",
        "Addiction",
        "I can't stop something that's hurting me.",
        [
          ["drinking-less", "Drinking less", "I drink the amount I choose."],
          [
            "fun-without-a-drink",
            "Fun that doesn't need a drink",
            "A good night doesn't depend on it.",
          ],
        ],
      ),
    ],
  },
  {
    id: "money",
    title: "Money",
    pains: [
      pain("broke", "Broke", "I'm always short on money.", [
        ["bills-covered", "Bills covered", "The essentials are paid."],
        [
          "small-pleasures",
          "Small pleasures",
          "There's a little left for something nice.",
        ],
        ["steady", "Steady", "A bad month stays a bad month."],
      ]),
      pain("no-cushion", "Savings", "I have nothing put aside.", [
        ["a-cushion", "A cushion", "I have something put aside."],
        [
          "ready-for-surprises",
          "Ready for surprises",
          "One surprise bill won't sink me.",
        ],
      ]),
      pain(
        "running-out-of-food",
        "Food",
        "I worry the food won't last the month.",
      ),
      pain("debt", "Debt", "I owe more than I can pay down.", [
        ["free-and-clear", "Free and clear", "I don't owe anyone."],
        ["a-plan-out", "A plan out", "I can see the way to zero."],
      ]),
      pain("cant-stop-working", "Retirement", "I won't have enough to retire."),
    ],
  },
  {
    id: "work",
    title: "Work",
    pains: [
      pain("unemployment", "Unemployment", "I can't find work."),
      pain("job-could-go", "Layoffs", "I could lose my job any day."),
      pain("underpaid", "Underpaid", "I'm paid less than my work is worth.", [
        ["paid-fairly", "Paid fairly", "What I get matches what I do."],
        [
          "everyone-paid-fairly",
          "Everyone paid fairly",
          "Nobody doing this work is shortchanged.",
        ],
      ]),
      pain("bad-job", "Mistreatment", "I'm treated badly at work."),
      pain("meaningless-work", "Meaning", "I don't think my work matters.", [
        [
          "work-to-tell-my-kid-about",
          "Work I'd tell my kid about",
          "I'm proud of what I do.",
        ],
        ["useful", "Useful", "My work helps someone."],
      ]),
      pain("wrong-career", "Career", "I'm in the wrong line of work.", [
        ["doing-what-fits", "Doing what fits", "My work suits me."],
        ["room-to-switch", "Room to switch", "Changing course is possible."],
      ]),
      pain("burnout", "Burnout", "I've got nothing left.", [
        [
          "rested-and-enough",
          "Rested and enough",
          "I have something left at the end of the day.",
        ],
        [
          "work-that-fits-a-life",
          "Work that fits a life",
          "My job leaves room for the rest of me.",
        ],
        [
          "fair-share-of-the-load",
          "A fair share of the load",
          "I'm not carrying it all alone.",
        ],
      ]),
    ],
  },
  {
    id: "home",
    title: "Home",
    pains: [
      pain("homeless", "Homeless", "I don't have a reliable place to stay."),
      pain(
        "home-is-hard",
        "Housing",
        "I live somewhere cramped, broken or noisy.",
      ),
      pain("cold-home", "Heating", "I can't afford to heat my home."),
      pain("might-lose-my-home", "Eviction", "I might lose my home."),
      pain("unsafe-near-me", "Safety", "I don't feel safe where I live."),
      pain(
        "getting-around",
        "Transport",
        "I struggle to get where I need to go.",
      ),
    ],
  },
  {
    id: "time",
    title: "Time",
    pains: [
      pain("no-free-time", "Busy", "I have no time that's mine.", [
        [
          "hours-that-are-mine",
          "Hours that are mine",
          "Some of the week belongs to me.",
        ],
        [
          "time-with-people-i-love",
          "Time with people I love",
          "I see the people who matter.",
        ],
      ]),
      pain("chores", "Chores", "I spend my days cooking and cleaning."),
      pain(
        "life-admin",
        "Paperwork",
        "I lose my week to forms, bills and phone queues.",
      ),
      pain(
        "legal-mess",
        "Legal trouble",
        "I'm stuck in a legal problem I can't afford.",
      ),
      pain("doomscrolling", "Doomscrolling", "I lose my nights to my phone.", [
        ["off-the-phone", "Off the phone", "I put it down when I want to."],
        ["present", "Present", "My evenings are mine."],
      ]),
      pain("no-fun", "Fun", "I can't remember the last time I played."),
    ],
  },
  {
    id: "people",
    title: "People",
    pains: [
      pain(
        "unsafe-at-home",
        "Safety at home",
        "I don't feel safe with someone in my life.",
      ),
      pain("loneliness", "Loneliness", "I feel alone.", [
        ["known", "Known", "Someone knows what's going on with me."],
        ["needed", "Needed", "Someone counts on me."],
      ]),
      pain(
        "want-a-partner",
        "Dating",
        "I want a partner and it isn't happening.",
      ),
      pain(
        "no-one-to-lean-on",
        "Support",
        "I have no one to call when I need help.",
      ),
      pain("belonging", "Belonging", "I don't feel like I belong anywhere."),
      pain(
        "nobody-into-my-thing",
        "Interests",
        "I can't find people who love what I love.",
      ),
      pain("intimacy", "Intimacy", "I'm missing closeness with someone."),
      pain(
        "nobody-to-do-things-with",
        "Invitations",
        "I'd go out if someone asked.",
      ),
      pain(
        "drifted-apart",
        "Friends",
        "I've lost touch with people who matter.",
        [
          ["back-in-touch", "Back in touch", "I see them and it's easy again."],
          [
            "closer-than-before",
            "Closer than before",
            "We know each other better now.",
          ],
        ],
      ),
      pain(
        "relationship-strain",
        "Relationship",
        "I'm struggling with my partner.",
        [
          ["home-is-good", "Home is good", "I'm glad to come home."],
          [
            "talking-it-through",
            "Talking it through",
            "We can work things out.",
          ],
        ],
      ),
      pain("home-tension", "Family", "I'm caught in fighting at home."),
      pain(
        "caregiving",
        "Caregiving",
        "I'm looking after someone and it takes everything.",
      ),
      pain("parenting-is-hard", "Parenting", "I'm worn out raising my kids."),
    ],
  },
  {
    id: "purpose",
    title: "Purpose",
    pains: [
      pain(
        "learning",
        "Learning",
        "I want to learn something, but I don't know how to start.",
      ),
      pain("need-skills", "Skills", "I don't have the skills I need now.", [
        ["capable", "Capable", "I can do what's needed."],
        ["learning", "Learning", "I'm building skills that matter."],
      ]),
      pain("procrastination", "Procrastination", "I put things off.", [
        ["clear-next-step", "Clear next step", "I know what to do next."],
        ["start-again", "Start again", "Getting going doesn't take a run-up."],
        ["follow-through", "Follow-through", "I do what I said I'd do."],
      ]),
      pain(
        "no-path",
        "Direction",
        "I know what I want but not how to get there.",
      ),
      pain("stuck", "Stuck", "I feel like my life isn't going anywhere.", [
        ["moving-again", "Moving again", "Something is changing."],
        [
          "next-step-i-believe-in",
          "A next step I believe in",
          "The way forward makes sense to me.",
        ],
      ]),
      pain(
        "nothing-i-make",
        "Creativity",
        "I don't get to make things any more.",
      ),
    ],
  },
];

export const personalPainDomains: PainDomain[] = painDomainListSchema.parse(
  personalPainDomainData,
);

// Societal set, flat under the pain tree's headings, from the same inventory.
// Pains the founder parked for later (founder_choice: later) stay out of both;
// each heading lists its pains in the tree's order.
const worldPainDomainData = [
  {
    id: "government",
    title: "Government",
    pains: [
      pain(
        "they-dont-listen",
        "Representation",
        "I'm not heard by the people in charge.",
        [
          [
            "real-representation",
            "Real representation",
            "My rep actually calls back.",
          ],
        ],
      ),
      pain(
        "far-away-decisions",
        "Local control",
        "I watch decisions about here get made far away.",
      ),
      pain(
        "freedoms",
        "Freedoms",
        "I'm losing the freedom to make my own choices.",
      ),
      pain(
        "infrastructure",
        "Infrastructure",
        "I depend on roads, water and power that keep breaking down.",
      ),
      pain(
        "dont-know-who-to-vote-for",
        "Voting",
        "I don't know who to vote for.",
        [
          [
            "confident-at-ballot",
            "Confident at the ballot",
            "I vote knowing what I'm voting for.",
          ],
        ],
      ),
      pain(
        "no-accountability",
        "Accountability",
        "I see leaders break promises with no consequences.",
        [["watched", "Watched", "We know who kept their promises."]],
      ),
      pain(
        "corruption",
        "Corruption",
        "I see the rules bend for people with money.",
      ),
      pain("taxes-dont-buy-much", "Taxes", "I pay more and get less back."),
      pain(
        "democracy-slipping",
        "Institutions",
        "I see the institutions we rely on falling apart.",
      ),
      pain(
        "immigration-broken",
        "Immigration",
        "I don't think the immigration system is working well.",
      ),
    ],
  },
  {
    id: "economy",
    title: "Economy",
    pains: [
      pain(
        "cost-of-living",
        "Inflation",
        "I can't keep up with rising prices.",
      ),
      pain("childcare-costs", "Childcare", "I can't afford childcare."),
      pain(
        "study-costs",
        "Student debt",
        "I'll be paying for my education for years.",
      ),
      pain(
        "cant-afford-kids",
        "Starting a family",
        "I want kids but can't afford them.",
      ),
      pain("rent-eats-everything", "Rent", "I pay too much for housing.", [
        [
          "affordable-housing",
          "Affordable housing",
          "Rent leaves room for a life.",
        ],
      ]),
      pain(
        "homelessness",
        "Homelessness",
        "I see more neighbors with no home.",
      ),
      pain(
        "it-all-goes-up",
        "Inequality",
        "I see the gap between those with plenty and those struggling grow.",
        [["shared-ownership", "Shared ownership", "The profit stays here."]],
      ),
      pain(
        "ai-and-jobs",
        "AI",
        "I worry AI will take work and no one's ready.",
      ),
      pain(
        "no-floor",
        "Safety net",
        "I know if I fall, nothing will catch me.",
      ),
      pain("hunger", "Hunger", "I see people near me without enough to eat."),
      pain("town-dying", "Decline", "I'm watching my town empty out."),
    ],
  },
  {
    id: "health",
    title: "Health",
    pains: [
      pain(
        "one-illness-away",
        "Medical bills",
        "I worry about what healthcare will cost me.",
        [["healthcare", "Healthcare", "We get care when we need it."]],
      ),
      pain(
        "mental-health-crisis",
        "Mental health",
        "I see people I care about struggling with their mental health.",
      ),
      pain("addiction-here", "Drugs", "I'm losing people I know to drugs."),
      pain(
        "older-people-alone",
        "Aging",
        "I see older people left on their own.",
      ),
    ],
  },
  {
    id: "community",
    title: "Community",
    pains: [
      pain(
        "nobody-knows-anybody",
        "Neighbors",
        "I don't know the people on my street.",
        [
          [
            "real-community",
            "Real community",
            "There are people here who show up.",
          ],
        ],
      ),
      pain(
        "trust",
        "Trust",
        "I can't trust the people and groups around me any more.",
      ),
      pain(
        "we-cant-talk",
        "Polarization",
        "I can't disagree with someone without losing them.",
        [
          [
            "common-ground",
            "Common ground",
            "We argue and still get things done.",
          ],
        ],
      ),
      pain(
        "cant-pool",
        "Sharing",
        "I know we could afford it together, but there's no way to pool.",
      ),
    ],
  },
  {
    id: "fairness",
    title: "Fairness",
    pains: [
      pain(
        "treated-differently",
        "Discrimination",
        "I'm treated worse because of who I am.",
        [
          [
            "taken-as-i-am",
            "Taken as I am",
            "I walk in and it's not a factor.",
          ],
        ],
      ),
      pain(
        "people-treated-badly",
        "Prejudice",
        "I watch people get treated badly for who they are.",
        [
          [
            "everyones-counted-in",
            "Everyone's counted in",
            "Nobody has to shrink to be safe here.",
          ],
        ],
      ),
      pain(
        "justice-unfair",
        "Justice",
        "I see police and courts treat people differently.",
      ),
      pain(
        "where-youre-born",
        "Opportunity",
        "I see where you're born decide your life.",
      ),
    ],
  },
  {
    id: "information",
    title: "Information",
    pains: [
      pain(
        "dont-know-whats-true",
        "Misinformation",
        "I don't know what's true any more.",
        [["honest-news", "Honest news", "I trust what I read."]],
      ),
      pain(
        "nobody-covers-here",
        "Local news",
        "I don't know what's happening in my own town.",
        [
          [
            "local-coverage",
            "Local coverage",
            "Someone reports on this place.",
          ],
        ],
      ),
      pain(
        "watched-by-companies",
        "Privacy",
        "I feel watched by companies that know everything about me.",
      ),
    ],
  },
  {
    id: "environment",
    title: "Environment",
    pains: [
      pain(
        "climate",
        "Climate change",
        "I'm worried about the planet heating up.",
      ),
      pain(
        "disasters",
        "Disasters",
        "I'm living with floods, fires, storms or extreme heat.",
      ),
      pain("dirty-air", "Pollution", "I see pollution harming where I live."),
      pain("car-or-nothing", "Cars", "I can't get anywhere without a car."),
      pain(
        "nature-disappearing",
        "Nature",
        "I see fewer birds, trees and green spaces.",
      ),
    ],
  },
  {
    id: "safety",
    title: "Safety",
    pains: [
      pain(
        "crime-and-violence",
        "Crime",
        "I don't feel safe from crime and violence.",
      ),
      pain(
        "world-on-fire",
        "War",
        "I see war threatening people and places I care about.",
      ),
    ],
  },
  {
    id: "kids",
    title: "Kids",
    pains: [
      pain(
        "kids-future",
        "Kids' future",
        "I think kids will have it worse than we did.",
      ),
      pain(
        "schools-fail-kids",
        "Education",
        "I see kids not getting what they need at school.",
      ),
      pain("screens-and-kids", "Screens", "I see phones raising our kids."),
    ],
  },
  {
    id: "making-change",
    title: "Making change",
    pains: [
      pain(
        "nothing-ever-changes",
        "Gridlock",
        "I see the same problems stay year after year.",
        [["momentum", "Momentum", "Things we agree on actually happen."]],
      ),
      pain(
        "groups-go-nowhere",
        "Meetings",
        "I go to meetings where nothing happens.",
      ),
      pain("shouting-into-void", "Unheard", "I care and it goes nowhere.", [
        ["it-counted", "It counted", "What I did showed up somewhere."],
      ]),
      pain("alone-in-caring", "Allies", "I don't know who else cares.", [
        [
          "found-my-people",
          "Found my people",
          "There's a group and it's local.",
        ],
      ]),
      pain(
        "dont-know-whats-happening",
        "Coordination",
        "I can't find who's already working on this.",
      ),
      pain("want-to-help", "Helping", "I'd do something if I knew what."),
      pain("giving-feels-blind", "Giving", "I'd give if I knew it worked."),
      pain(
        "idea-no-team",
        "Collaborators",
        "I have an idea and nobody to build it with.",
      ),
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
