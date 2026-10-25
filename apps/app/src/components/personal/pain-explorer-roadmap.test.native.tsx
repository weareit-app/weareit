import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { fireEvent, render, screen } from "@testing-library/react-native";
import type { ReactNode } from "react";
import type { ContentGraph } from "@it/domain/content";
import { PainExplorer } from "./pain-explorer";
import { publishedContentQueryKey } from "../../content/use-published-content";
import { useOnboardingStore } from "../../state/onboarding-store";

jest.mock("expo-router", () => ({
  Link: ({ children }: { children: ReactNode }) => children,
}));
// The painted icons draw with Skia, which doesn't run under Jest.
jest.mock("./group-icon", () => ({
  GroupIcon: () => null,
}));
// Choices stay in memory instead of on-device storage.
jest.mock("../../storage", () => {
  const values = new Map<string, string>();
  return {
    onboardingStorage: {
      getItem: (key: string) => values.get(key) ?? null,
      setItem: (key: string, value: string) => void values.set(key, value),
      removeItem: (key: string) => void values.delete(key),
    },
  };
});
// The published content is seeded into the query cache below.
jest.mock("../../api-client", () => ({ apiClient: {} }));
jest.mock("../content-query-state", () => ({
  ContentQueryState: () => null,
}));
jest.mock("react-native-reanimated", () => {
  const { View } =
    jest.requireActual<typeof import("react-native")>("react-native");
  const fade = { duration: () => fade };
  return {
    __esModule: true,
    default: { View },
    FadeIn: fade,
    FadeOut: fade,
    useReducedMotion: () => true,
  };
});

const content = (status: "planned" | "in-progress"): ContentGraph => ({
  domains: [{ id: "mind", scope: "personal", title: "Mind", sortOrder: 0 }],
  pains: [
    {
      id: "anxiety",
      domainId: "mind",
      title: "Anxiety",
      description: "Worry that won't let go.",
      sortOrder: 0,
    },
  ],
  dreams: [
    {
      id: "calm-in-my-body",
      title: "Calm in my body",
      description: "I feel calm in my body.",
      sortOrder: 0,
    },
  ],
  painDreamLinks: [{ painId: "anxiety", dreamId: "calm-in-my-body" }],
  firstActions: [],
  actionPainLinks: [],
  fixes: [
    {
      id: "check-ins",
      title: "Check-ins with someone who gets it",
      description: "Paired with a person working on the same thing.",
      kind: "feature",
      roadmapItemId: "peer-check-ins",
      evidence: "untested",
      evidenceNote: "Not tested yet.",
      sortOrder: 0,
    },
  ],
  fixDreamLinks: [{ fixId: "check-ins", dreamId: "calm-in-my-body" }],
  roadmapItems: [
    {
      id: "peer-check-ins",
      title: "Peer check-ins",
      line: "Pairs people working on the same thing.",
      status,
      statusChangedOn: "2026-10-20",
      statusNote: "Building it now.",
      sortOrder: 0,
    },
  ],
  sources: [],
  provenance: [],
});

async function renderExplorer(graph: ContentGraph) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { staleTime: Infinity, gcTime: Infinity } },
  });
  queryClient.setQueryData(publishedContentQueryKey, {
    version: 2,
    content: graph,
    checksum: "test",
    publishedAt: "2026-10-20T00:00:00.000Z",
  });
  useOnboardingStore.setState({
    ready: true,
    personalPainIds: ["anxiety"],
    personalPaths: [
      { painId: "anxiety", dreamIds: ["calm-in-my-body"], fixIds: [] },
    ],
  });
  await render(
    <QueryClientProvider client={queryClient}>
      <PainExplorer
        scope="personal"
        header={() => null}
        next="/onboarding/world"
      />
    </QueryClientProvider>,
  );
  await fireEvent.press(screen.getByRole("button", { name: /Mind/ }));
  await fireEvent.press(
    screen.getByRole("button", { name: /^Anxiety: I feel calm/ }),
  );
}

describe("PainExplorer with roadmap items", () => {
  it("shows a connected fix with its roadmap item's status", async () => {
    await renderExplorer(content("in-progress"));

    expect(screen.getByText("Check-ins with someone who gets it")).toBeTruthy();
    expect(screen.getByRole("button", { name: "In progress" })).toBeTruthy();
    expect(screen.queryByRole("button", { name: "Planned" })).toBeNull();
  });

  it("follows the item when its status changes", async () => {
    await renderExplorer(content("planned"));

    expect(screen.getByRole("button", { name: "Planned" })).toBeTruthy();
  });
});
