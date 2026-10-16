import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import {
  onboardingDraftSchema,
  toggleSelection,
  type HelpInterestId,
  type SelectionState,
} from "@it/domain/onboarding";
import { onboardingStorage } from "../storage";

type OnboardingStore = SelectionState & {
  personalDreamIds: string[];
  worldDreamIds: string[];
  helpInterests: HelpInterestId[];
  draftUpdatedAt: number;
  ready: boolean;
  togglePersonalPain: (id: string) => void;
  toggleWorldPain: (id: string) => void;
  togglePersonalDream: (id: string) => void;
  toggleWorldDream: (id: string) => void;
  toggleHelpInterest: (id: HelpInterestId) => void;
  setReady: (ready: boolean) => void;
  clearDraft: () => void;
};

export const useOnboardingStore = create<OnboardingStore>()(
  persist(
    (set) => ({
      personalPainIds: [],
      worldPainIds: [],
      personalDreamIds: [],
      worldDreamIds: [],
      helpInterests: [],
      draftUpdatedAt: Date.now(),
      ready: false,
      togglePersonalPain: (id) =>
        set((state) => ({
          personalPainIds: toggleSelection(state.personalPainIds, id),
          draftUpdatedAt: Date.now(),
        })),
      toggleWorldPain: (id) =>
        set((state) => ({
          worldPainIds: toggleSelection(state.worldPainIds, id),
          draftUpdatedAt: Date.now(),
        })),
      togglePersonalDream: (id) =>
        set((state) => ({
          personalDreamIds: toggleSelection(state.personalDreamIds, id),
          draftUpdatedAt: Date.now(),
        })),
      toggleWorldDream: (id) =>
        set((state) => ({
          worldDreamIds: toggleSelection(state.worldDreamIds, id),
          draftUpdatedAt: Date.now(),
        })),
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
              helpInterests: [],
              draftUpdatedAt: Date.now(),
            };
      },
      partialize: (state) => ({
        personalPainIds: state.personalPainIds,
        worldPainIds: state.worldPainIds,
        personalDreamIds: state.personalDreamIds,
        worldDreamIds: state.worldDreamIds,
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
