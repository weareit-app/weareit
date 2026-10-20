import { render, screen } from "@testing-library/react-native";
import type { Essay } from "@it/content/essay-schema";
import { draftEssays } from "@it/content/essay-drafts";
import { essays } from "@it/content/essays";
import { EssayPage } from "../src/essays/essay-page";
import { EssayScreen } from "../src/essays/essay-screen";

let mockParams: Record<string, string> = {};

// Each test sets its published and draft essays.
jest.mock("@it/content/essays", () => ({
  essayPublished: { why: false },
  essays: {},
}));
jest.mock("@it/content/essay-drafts", () => ({ draftEssays: {} }));
jest.mock("expo-router", () => ({
  ...jest.requireActual("expo-router"),
  useLocalSearchParams: () => mockParams,
  Unmatched: () => {
    const { createElement } = jest.requireActual("react");
    const { Text } = jest.requireActual("react-native");
    return createElement(Text, null, "This screen doesn't exist.");
  },
}));
jest.mock("../src/navigation/site-links", () => ({
  ...jest.requireActual("../src/navigation/site-links"),
  siteGroups: [
    {
      title: "About It",
      links: [
        { label: "Why", href: "/why", when: "always", published: true },
        { label: "AI", href: "/ai", when: "always", published: false },
      ],
    },
  ],
}));
jest.mock("../src/watercolor/brand-mark", () => ({ BrandMark: () => null }));
jest.mock("react-native-reanimated", () => ({ useReducedMotion: () => false }));

const essay: Essay = {
  slug: "why",
  title: "Why It exists",
  question: "What made this worth attempting?",
  published: true,
  updated: "2026-10-20",
  changes: [
    { date: "2026-10-20", note: "Added the milestones." },
    { date: "2026-10-01", note: "First version." },
  ],
  sources: [
    {
      id: "plan",
      title: "Public pages plan",
      publisher: "We Are It, on GitHub",
      url: "https://github.com/weareit-app/weareit",
      date: "2026-10",
    },
  ],
  body: [
    {
      type: "heading",
      level: 2,
      children: [{ type: "text", value: "The question" }],
    },
    {
      type: "paragraph",
      children: [
        { type: "text", value: "The plan is public." },
        { type: "sourceRef", id: "plan" },
        { type: "text", value: " It will ship " },
        { type: "status", label: "planned engineering" },
      ],
    },
    {
      type: "list",
      ordered: false,
      items: [
        [{ type: "paragraph", children: [{ type: "text", value: "One" }] }],
      ],
    },
    {
      type: "table",
      align: [null],
      head: [[{ type: "text", value: "City" }]],
      rows: [[[{ type: "text", value: "Seattle" }]]],
    },
    {
      type: "block",
      block: {
        type: "timeline",
        id: "milestones",
        data: { entries: [{ date: "2026-10", title: "First spec" }] },
      },
    },
  ],
};

const mockEssays = essays as Record<string, Essay>;
const mockDrafts = draftEssays as Record<string, Essay>;

beforeEach(() => {
  for (const key of Object.keys(mockEssays)) delete mockEssays[key];
  for (const key of Object.keys(mockDrafts)) delete mockDrafts[key];
  mockParams = {};
});

describe("essay page", () => {
  it("shows the title, question, text and last update", async () => {
    await render(<EssayPage essay={essay} />);

    expect(screen.getByText("Why It exists")).toBeTruthy();
    expect(screen.getByText("What made this worth attempting?")).toBeTruthy();
    expect(screen.getByText("Last updated October 20, 2026")).toBeTruthy();
    expect(screen.getByRole("heading", { name: "The question" })).toBeTruthy();
    expect(
      screen.getByText("The plan is public.", { exact: false }),
    ).toBeTruthy();
    expect(screen.getByText("One")).toBeTruthy();
    expect(screen.getByText("Seattle")).toBeTruthy();
  });

  it("writes status labels as words", async () => {
    await render(<EssayPage essay={essay} />);

    expect(screen.getByText("Planned engineering")).toBeTruthy();
  });

  it("links the source beside the claim and lists it at the end", async () => {
    await render(<EssayPage essay={essay} />);

    const reference = screen.getByLabelText("Source 1: Public pages plan");
    expect(reference.props.href).toBe("https://github.com/weareit-app/weareit");
    expect(screen.getByRole("heading", { name: "Sources" })).toBeTruthy();
    expect(
      screen.getByText("We Are It, on GitHub, 2026-10", { exact: false }),
    ).toBeTruthy();
  });

  it("shows each block's plain fallback outside the web, where blocks render HTML", async () => {
    await render(<EssayPage essay={essay} />);

    expect(screen.getByText("This timeline can't be shown yet.")).toBeTruthy();
  });

  it("lists the changes newest first, with dates", async () => {
    await render(<EssayPage essay={essay} />);

    const changes = screen.getAllByText(/^(October|First|Added)/);
    expect(changes.map((node) => node.props.children)).toEqual([
      "October 20, 2026",
      "Added the milestones.",
      "October 1, 2026",
      "First version.",
    ]);
  });
});

describe("essay screen", () => {
  it("shows a published, listed essay", async () => {
    mockEssays.why = essay;
    await render(<EssayScreen slug="why" />);

    expect(screen.getByText("Why It exists")).toBeTruthy();
  });

  it("shows not-found for an unpublished essay", async () => {
    mockDrafts.why = { ...essay, published: false };
    await render(<EssayScreen slug="why" />);

    expect(screen.getByText("This screen doesn't exist.")).toBeTruthy();
    expect(screen.queryByText("Why It exists")).toBeNull();
  });

  it("shows not-found for a published essay that isn't listed", async () => {
    mockEssays.ai = { ...essay, slug: "ai" };
    await render(<EssayScreen slug="ai" />);

    expect(screen.getByText("This screen doesn't exist.")).toBeTruthy();
  });

  it("shows an unpublished essay in development with ?draft", async () => {
    mockDrafts.why = { ...essay, published: false };
    mockParams = { draft: "" };
    await render(<EssayScreen slug="why" />);

    expect(screen.getByText("Why It exists")).toBeTruthy();
  });
});
