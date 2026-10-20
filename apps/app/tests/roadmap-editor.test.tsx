import {
  fireEvent,
  render,
  screen,
  within,
} from "@testing-library/react-native";
import { useState } from "react";
import type { ContentFix, ContentRoadmapItem } from "@it/content/graph-schema";
import {
  RoadmapEditor,
  refuseRoadmapStatusChangesWithoutNotes,
  type RoadmapContent,
} from "../src/components/cms/roadmap-editor";

const spanish: ContentRoadmapItem = {
  id: "use-it-in-spanish",
  title: "Use It in Spanish",
  line: "Every page and pain in Spanish.",
  status: "planned",
  statusChangedOn: "2026-10-01",
  statusNote: "Decided to build it after launch.",
  sortOrder: 0,
};
const groups: ContentRoadmapItem = {
  id: "local-groups",
  title: "Local groups",
  line: "Meet people near you.",
  status: "idea",
  statusNote: "Someone asked for it.",
  sortOrder: 1,
};
const checkIns: ContentFix = {
  id: "check-ins",
  title: "Check-ins with someone who gets it",
  description: "Paired with a person working on the same thing.",
  kind: "feature",
  featureStatus: "idea",
  statusNote: "An early idea.",
  evidence: "untested",
  evidenceNote: "Not tested yet.",
  sortOrder: 0,
};
const translatedPages: ContentFix = {
  id: "translated-pages",
  title: "Pages in your language",
  description: "Read It in Spanish.",
  kind: "feature",
  roadmapItemId: spanish.id,
  evidence: "untested",
  evidenceNote: "Not tested yet.",
  sortOrder: 1,
};
const windDown: ContentFix = {
  id: "wind-down",
  title: "A daily wind-down",
  description: "A few quiet minutes, most days.",
  kind: "habit",
  evidence: "limited",
  evidenceNote: "Results vary.",
  sortOrder: 2,
};

const initial: RoadmapContent = {
  roadmapItems: [spanish, groups],
  fixes: [checkIns, translatedPages, windDown],
};

// Keeps the editor's changes, as the CMS screen does.
async function renderEditor(start = initial) {
  const latest = { current: start };
  function Harness() {
    const [content, setContent] = useState(start);
    return (
      <RoadmapEditor
        content={content}
        savedItems={initial.roadmapItems}
        onChange={(next) => {
          latest.current = next;
          setContent(next);
        }}
      />
    );
  }
  await render(<Harness />);
  return latest;
}

const press = (name: string | RegExp) =>
  fireEvent.press(screen.getByRole("button", { name }));

describe("RoadmapEditor", () => {
  it("lists items in roadmap order and edits the selected one", async () => {
    const latest = await renderEditor();

    const [first, second] = screen.getAllByRole("button", {
      name: /^(Use It in Spanish|Local groups)$/,
    });
    expect(within(first!).getByText("Use It in Spanish")).toBeTruthy();
    expect(within(second!).getByText("Local groups")).toBeTruthy();
    await press("Use It in Spanish");
    expect(screen.getByText("Stable ID: use-it-in-spanish")).toBeTruthy();
    await fireEvent.changeText(screen.getByLabelText("Title"), "Spanish");
    await fireEvent.changeText(
      screen.getByLabelText("One line"),
      "It in Spanish.",
    );

    expect(latest.current.roadmapItems[0]).toMatchObject({
      id: "use-it-in-spanish",
      title: "Spanish",
      line: "It in Spanish.",
    });
  });

  it("asks for a note when an item's status changes", async () => {
    const latest = await renderEditor();

    await press("Use It in Spanish");
    await press("In progress");
    expect(
      screen.getByText(
        "Add a note saying what changed before changing the status.",
      ),
    ).toBeTruthy();
    await fireEvent.changeText(
      screen.getByLabelText("Status note"),
      "Translating now.",
    );

    expect(screen.queryByText(/Add a note/)).toBeNull();
    expect(latest.current.roadmapItems[0]).toMatchObject({
      status: "in-progress",
      statusNote: "Translating now.",
    });
  });

  it("connects a Feature fix, which gives up its own status", async () => {
    const latest = await renderEditor();

    await press("Use It in Spanish");
    expect(screen.queryByRole("button", { name: windDown.title })).toBeNull();
    await press(checkIns.title);

    const fix = latest.current.fixes.find(({ id }) => id === checkIns.id)!;
    expect(fix.roadmapItemId).toBe(spanish.id);
    expect(fix.featureStatus).toBeUndefined();
    expect(fix.statusNote).toBeUndefined();
  });

  it("disconnects a fix, which keeps the status it was showing", async () => {
    const latest = await renderEditor();

    await press("Use It in Spanish");
    await press(translatedPages.title);

    expect(
      latest.current.fixes.find(({ id }) => id === translatedPages.id),
    ).toEqual({
      ...translatedPages,
      roadmapItemId: undefined,
      featureStatus: "planned",
      statusChangedOn: "2026-10-01",
      statusNote: "Decided to build it after launch.",
    });
  });

  it("moves a fix from one item to another", async () => {
    const latest = await renderEditor();

    await press("Local groups");
    await press(translatedPages.title);

    expect(
      latest.current.fixes.find(({ id }) => id === translatedPages.id)
        ?.roadmapItemId,
    ).toBe(groups.id);
  });

  it("reorders items", async () => {
    const latest = await renderEditor();

    await press("Local groups");
    await press("Move up");

    expect(
      [...latest.current.roadmapItems]
        .sort((a, b) => a.sortOrder - b.sortOrder)
        .map(({ id }) => id),
    ).toEqual(["local-groups", "use-it-in-spanish"]);
  });

  it("adds an item with an editable ID", async () => {
    const latest = await renderEditor();

    await press("Add roadmap item");
    await fireEvent.changeText(
      screen.getByLabelText("Stable ID"),
      "use-it-offline",
    );

    expect(latest.current.roadmapItems).toHaveLength(3);
    expect(latest.current.roadmapItems[2]).toMatchObject({
      id: "use-it-offline",
      status: "idea",
      sortOrder: 2,
    });
  });

  it("removes an item and disconnects its fixes", async () => {
    const latest = await renderEditor();

    await press("Use It in Spanish");
    await press("Remove item");

    expect(latest.current.roadmapItems.map(({ id }) => id)).toEqual([
      "local-groups",
    ]);
    const fix = latest.current.fixes.find(
      ({ id }) => id === translatedPages.id,
    );
    expect(fix?.featureStatus).toBe("planned");
    expect(fix?.roadmapItemId).toBeUndefined();
  });
});

describe("refuseRoadmapStatusChangesWithoutNotes", () => {
  it("refuses to save an item status change without a note", () => {
    expect(
      refuseRoadmapStatusChangesWithoutNotes(
        [spanish],
        [{ ...spanish, status: "live" }],
      ),
    ).toBe(
      "Not saved. use-it-in-spanish: Add a note saying what changed before changing the status.",
    );
    expect(
      refuseRoadmapStatusChangesWithoutNotes(
        [spanish],
        [{ ...spanish, status: "live", statusNote: "Live." }],
      ),
    ).toBeNull();
  });
});
