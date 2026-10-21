import { z } from "zod";
import { nonEmptyTextSchema, slugIdSchema } from "@it/domain/primitives";
import { getAllPains, personalPainDomains, worldPainDomains } from "./tier-1";

const firstActionSchema = z
  .object({
    id: slugIdSchema,
    painIds: z.array(z.string().min(1)).min(1),
    title: nonEmptyTextSchema,
    description: nonEmptyTextSchema,
    firstStep: nonEmptyTextSchema,
    effortMinutes: z.number().int().positive().max(120),
    evidence: z.enum(["candidate", "practical"]),
    safetyNote: nonEmptyTextSchema.optional(),
    source: nonEmptyTextSchema,
  })
  .strict();

const firstActionListSchema = z
  .array(firstActionSchema)
  .min(1)
  .superRefine((actions, context) => {
    if (new Set(actions.map((action) => action.id)).size !== actions.length) {
      context.addIssue({
        code: "custom",
        message: "First action IDs must be unique.",
      });
    }
  });

const firstActionData = [
  {
    id: "explore-bedroom-air",
    painIds: ["poor-sleep"],
    title: "Explore the bedroom air idea",
    description:
      "A HEPA filter could be relevant if particles or air quality are part of your sleep environment. It may not address what is keeping you awake.",
    firstStep:
      "Before buying anything, check one trusted indoor-air source, the room size, and the ongoing filter cost. If air quality does not seem relevant, skip this idea.",
    effortMinutes: 15,
    evidence: "candidate",
    safetyNote:
      "This is a question to investigate, not medical advice or a promise that filtration will improve sleep.",
    source: "docs/source/We_Are_It_MVP_Fix_Corpus.md §4.1–4.3",
  },
  {
    id: "shrink-first-step",
    painIds: ["procrastination", "no-path"],
    title: "Make the first step smaller",
    description:
      "A stalled task can mean the next action is too large or unclear.",
    firstStep:
      "Write down one thing you want to move forward. Turn it into a first step you can try in ten minutes or less.",
    effortMinutes: 10,
    evidence: "practical",
    source: "docs/source/We_Are_It_MVP_Fix_Corpus.md §4.5",
  },
  {
    id: "find-recurring-activity",
    painIds: ["loneliness", "nobody-to-do-things-with", "alone-in-caring"],
    title: "Look for a recurring place to meet people",
    description:
      "A regular activity can make it easier to see the same people again and build connection over time.",
    firstStep:
      "Think of one interest or cause you would enjoy sharing, then find one recurring local or online group around it.",
    effortMinutes: 15,
    evidence: "candidate",
    source: "docs/source/We_Are_It_MVP_Fix_Corpus.md §4.4",
  },
  {
    id: "check-one-public-claim",
    painIds: ["dont-know-whats-true", "no-accountability"],
    title: "Check one public claim or promise",
    description:
      "A small piece of careful research can make a large issue more concrete.",
    firstStep:
      "Choose one public claim or promise. Find its original source and one independent source that helps put it in context.",
    effortMinutes: 20,
    evidence: "practical",
    source: "docs/source/We_Are_It_MVP_Fix_Corpus.md §5",
  },
  {
    id: "invite-one-person",
    painIds: ["shouting-into-void", "alone-in-caring", "nothing-ever-changes"],
    title: "Invite one person to explore with you",
    description:
      "It is easier to coordinate when someone else who cares can see the same starting point.",
    firstStep:
      "Think of one person who might be curious. Tell them what you hope could change and invite them to explore It with you.",
    effortMinutes: 10,
    evidence: "candidate",
    source:
      "Product intent in docs/architecture/decisions.md; first-action archetypes in docs/source/We_Are_It_MVP_Fix_Corpus.md §5",
  },
] as const;

export const firstActions = firstActionListSchema.parse(firstActionData);
export type FirstAction = (typeof firstActions)[number];

const knownPainIds = new Set(
  [...getAllPains(personalPainDomains), ...getAllPains(worldPainDomains)].map(
    (pain) => pain.id,
  ),
);
for (const action of firstActions) {
  for (const painId of action.painIds) {
    if (!knownPainIds.has(painId)) {
      throw new Error(
        `First action ${action.id} refers to unknown pain ${painId}.`,
      );
    }
  }
}

export function getFirstActionsForPainIds(painIds: string[]) {
  const selected = new Set(painIds);
  return firstActions.filter((action) =>
    action.painIds.some((painId) => selected.has(painId)),
  );
}
