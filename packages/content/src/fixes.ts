import { z } from "zod";
import { evidenceLevels, featureStatuses, fixKinds } from "./graph-schema";
import { getAllDreams, personalPainDomains } from "./tier-1";

// Ways a chosen future can get better, from the onboarding prototype (Design
// canvas "What can be better for you?", 2026-10-18). Only Anxiety,
// Procrastination, Poor sleep and Broke have ways so far; the evidence ratings
// have no linked sources yet.
const fixSchema = z
  .object({
    id: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
    dreamIds: z.array(z.string().min(1)).min(1),
    title: z.string().trim().min(1),
    description: z.string().trim().min(1),
    kind: z.enum(fixKinds),
    featureStatus: z.enum(featureStatuses).optional(),
    evidence: z.enum(evidenceLevels),
    evidenceNote: z.string().trim().min(1),
  })
  .strict()
  .refine((fix) => (fix.kind === "feature") === Boolean(fix.featureStatus), {
    message: "Features, and only features, carry a roadmap status.",
  });

const fixListSchema = z.array(fixSchema).superRefine((fixes, context) => {
  if (new Set(fixes.map(({ id }) => id)).size !== fixes.length) {
    context.addIssue({ code: "custom", message: "Fix IDs must be unique." });
  }
});

const fixData = [
  {
    id: "check-ins-with-someone-who-gets-it",
    dreamIds: ["steady-enough-to-plan", "calm-in-my-body"],
    title: "Check-ins with someone who gets it",
    description: "Paired with a person working on the same thing.",
    kind: "feature",
    featureStatus: "planned",
    evidence: "untested",
    evidenceNote:
      "Peer support has research behind it, but this It feature hasn't been tested.",
  },
  {
    id: "find-affordable-counseling",
    dreamIds: ["steady-enough-to-plan", "calm-in-my-body"],
    title: "Find counseling you can afford",
    description: "Look for care that fits your cost and distance.",
    kind: "once",
    evidence: "strong",
    evidenceNote:
      "Talk therapy, especially CBT, is a well-studied first treatment for anxiety.",
  },
  {
    id: "daily-wind-down",
    dreamIds: ["calm-in-my-body"],
    title: "A daily wind-down",
    description: "A few quiet minutes, most days.",
    kind: "habit",
    evidence: "limited",
    evidenceNote: "Relaxation routines help some people. Results vary.",
  },
  {
    id: "walks-with-neighbors",
    dreamIds: ["calm-in-my-body", "steady-enough-to-plan"],
    title: "Walks with neighbors",
    description: "People near you who want to get outside too.",
    kind: "habit",
    evidence: "some",
    evidenceNote:
      "Regular exercise is linked to lower anxiety in many studies.",
  },
  {
    id: "shared-help-for-big-stuff",
    dreamIds: ["less-to-worry-about"],
    title: "Shared help for the big stuff",
    description: "Neighbors pooling time and money for what's too much alone.",
    kind: "group",
    evidence: "untested",
    evidenceNote:
      "Mutual aid is widespread, but its effect on worry hasn't been measured here.",
  },
  {
    id: "make-first-action-tiny",
    dreamIds: ["clear-next-step", "start-again"],
    title: "Make the first action tiny",
    description: "Small enough that starting feels possible.",
    kind: "once",
    evidence: "some",
    evidenceNote:
      "Planning a small, specific first step is a studied way to get started.",
  },
  {
    id: "find-the-blocker",
    dreamIds: ["clear-next-step"],
    title: "Find the blocker",
    description: "Find what is stopping progress.",
    kind: "once",
    evidence: "limited",
    evidenceNote: "Sensible and common, but not well studied on its own.",
  },
  {
    id: "map-a-route-to-your-goal",
    dreamIds: ["follow-through", "clear-next-step"],
    title: "Map a route to your goal",
    description: "Compare ways to reach a goal you choose.",
    kind: "feature",
    featureStatus: "idea",
    evidence: "untested",
    evidenceNote: "An It idea. Nothing to test yet.",
  },
  {
    id: "ask-about-sleep-care",
    dreamIds: ["fall-asleep", "stay-asleep"],
    title: "Ask about a sleep-care option",
    description: "Look into proven help for sleep.",
    kind: "once",
    evidence: "strong",
    evidenceNote:
      "CBT for insomnia is the recommended first treatment for long-term insomnia.",
  },
  {
    id: "seven-day-sleep-diary",
    dreamIds: ["stay-asleep", "rested", "fall-asleep"],
    title: "Keep a seven-day diary",
    description: "Note each night to see what changes.",
    kind: "habit",
    evidence: "some",
    evidenceNote:
      "Sleep diaries are a standard part of sleep care and help spot patterns.",
  },
  {
    id: "ask-about-light-for-sleep",
    dreamIds: ["fall-asleep"],
    title: "Ask about light for sleep",
    description: "Learn how light timing affects sleep.",
    kind: "once",
    evidence: "some",
    evidenceNote:
      "Light timing shifts the body clock. Evidence is strongest for body-clock problems.",
  },
  {
    id: "find-essential-cost-support",
    dreamIds: ["bills-covered"],
    title: "Find essential-cost support",
    description: "Look for help that may lower an essential cost.",
    kind: "once",
    evidence: "limited",
    evidenceNote:
      "Help exists in many places, but how much it helps depends on where you live.",
  },
  {
    id: "adjust-a-major-bill",
    dreamIds: ["bills-covered", "steady"],
    title: "Adjust a major bill",
    description: "Ask if a big bill can be lowered or moved.",
    kind: "once",
    evidence: "limited",
    evidenceNote: "Often worth asking. Outcomes vary by company.",
  },
  {
    id: "earn-from-a-skill",
    dreamIds: ["small-pleasures", "steady"],
    title: "Earn from a skill again and again",
    description: "See if a skill could bring in money more than once.",
    kind: "once",
    evidence: "limited",
    evidenceNote: "Possible for some people. No steady income is promised.",
  },
];

export const fixes = fixListSchema.parse(fixData);
export type Fix = (typeof fixes)[number];

const knownDreamIds = new Set(
  getAllDreams(personalPainDomains).map(({ id }) => id),
);
for (const fix of fixes) {
  for (const dreamId of fix.dreamIds) {
    if (!knownDreamIds.has(dreamId))
      throw new Error(`Fix ${fix.id} refers to unknown dream ${dreamId}.`);
  }
}
