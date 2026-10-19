import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import {
  chosenDreamIds,
  onboardingDraftSchema,
  selectPain,
  toggleDream,
  toggleFix,
  toggleSelection,
  unselectPain,
  type HelpInterestId,
  type PersonalPath,
  type PathSelection,
  type SelectionState,
} from "@it/domain/onboarding";
import { onboardingStorage } from "../storage";

export type PainScope = "personal" | "world";

type OnboardingStore = SelectionState & {
  personalDreamIds: string[];
  worldDreamIds: string[];
  personalPaths: PersonalPath[];
  worldPaths: PersonalPath[];
  helpInterests: HelpInterestId[];
  draftUpdatedAt: number;
  ready: boolean;
  selectPain: (scope: PainScope, painId: string) => void;
  unselectPain: (scope: PainScope, painId: string) => void;
  toggleDream: (
    scope: PainScope,
    painId: string,
    dreamId: string,
    fixDreamLinks: { fixId: string; dreamId: string }[],
  ) => void;
  toggleFix: (scope: PainScope, painId: string, fixId: string) => void;
  toggleHelpInterest: (id: HelpInterestId) => void;
  setReady: (ready: boolean) => void;
  clearDraft: () => void;
};

type ScopeState = Pick<
  OnboardingStore,
  "personalPainIds" | "personalPaths" | "worldPainIds" | "worldPaths"
>;

function selection(state: ScopeState, scope: PainScope): PathSelection {
  return scope === "personal"
    ? { painIds: state.personalPainIds, paths: state.personalPaths }
    : { painIds: state.worldPainIds, paths: state.worldPaths };
}

// The flat dream lists stay, as the account save already understands them.
function update(scope: PainScope, next: PathSelection) {
  const dreamIds = chosenDreamIds(next.paths);
  return scope === "personal"
    ? {
        personalPainIds: next.painIds,
        personalPaths: next.paths,
        personalDreamIds: dreamIds,
        draftUpdatedAt: Date.now(),
      }
    : {
        worldPainIds: next.painIds,
        worldPaths: next.paths,
        worldDreamIds: dreamIds,
        draftUpdatedAt: Date.now(),
      };
}

export const useOnboardingStore = create<OnboardingStore>()(
  persist(
    (set) => ({
      personalPainIds: [],
      worldPainIds: [],
      personalDreamIds: [],
      worldDreamIds: [],
      personalPaths: [],
      worldPaths: [],
      helpInterests: [],
      draftUpdatedAt: Date.now(),
      ready: false,
      selectPain: (scope, painId) =>
        set((state) =>
          update(scope, selectPain(selection(state, scope), painId)),
        ),
      unselectPain: (scope, painId) =>
        set((state) =>
          update(scope, unselectPain(selection(state, scope), painId)),
        ),
      toggleDream: (scope, painId, dreamId, fixDreamLinks) =>
        set((state) =>
          update(
            scope,
            toggleDream(
              selection(state, scope),
              painId,
              dreamId,
              fixDreamLinks,
            ),
          ),
        ),
      toggleFix: (scope, painId, fixId) =>
        set((state) =>
          update(scope, toggleFix(selection(state, scope), painId, fixId)),
        ),
      toggleHelpInterest: (id) =>
        set((state) => ({
          helpInterests: toggleSelection(state.helpInterests, id),
          draftUpdatedAt: Date.now(),
        })),
      setReady: (ready) => set({ ready }),
      clearDraft: () =>
        set({
          personalPainIds: [],
          worldPainIds: [],
          personalDreamIds: [],
          worldDreamIds: [],
          personalPaths: [],
          worldPaths: [],
          helpInterests: [],
          draftUpdatedAt: Date.now(),
        }),
    }),
    {
      name: "it-onboarding-draft-v1",
      version: 1,
      storage: createJSONStorage(() => onboardingStorage),
      migrate: (persistedState) => {
        const parsed = onboardingDraftSchema.safeParse(persistedState);
        return parsed.success
          ? parsed.data
          : {
              personalPainIds: [],
              worldPainIds: [],
              personalDreamIds: [],
              worldDreamIds: [],
              personalPaths: [],
              worldPaths: [],
              helpInterests: [],
              draftUpdatedAt: Date.now(),
            };
      },
      partialize: (state) => ({
        personalPainIds: state.personalPainIds,
        worldPainIds: state.worldPainIds,
        personalDreamIds: state.personalDreamIds,
        worldDreamIds: state.worldDreamIds,
        personalPaths: state.personalPaths,
        worldPaths: state.worldPaths,
        helpInterests: state.helpInterests,
        draftUpdatedAt: state.draftUpdatedAt,
      }),
      merge: (persistedState, currentState) => {
        const parsed = onboardingDraftSchema.safeParse(persistedState);
        return parsed.success
          ? { ...currentState, ...parsed.data }
          : currentState;
      },
      skipHydration: true,
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.setReady(true);
        } else {
          useOnboardingStore.getState().setReady(true);
        }
      },
    },
  ),
);
