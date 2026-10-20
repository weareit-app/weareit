import { fireEvent, render, screen } from "@testing-library/react-native";
import type { ContentFix } from "@it/content/graph-schema";
import {
  FeatureStatusEditor,
  refuseStatusChangesWithoutNotes,
} from "../src/components/cms/feature-status-editor";

const feature: ContentFix = {
  id: "check-ins",
  title: "Check-ins with someone who gets it",
  description: "Paired with a person working on the same thing.",
  kind: "feature",
  featureStatus: "planned",
  statusChangedOn: "2026-09-01",
  statusNote: "Decided to build it.",
  evidence: "untested",
  evidenceNote: "Not tested yet.",
  sortOrder: 0,
};
const habit: ContentFix = {
  ...feature,
  id: "wind-down",
  title: "A daily wind-down",
  kind: "habit",
  featureStatus: undefined,
  statusChangedOn: undefined,
  statusNote: undefined,
};

describe("FeatureStatusEditor", () => {
  it("lists Feature fixes with their status, date and note", async () => {
    await render(
      <FeatureStatusEditor
        fixes={[feature, habit]}
        savedFixes={[feature, habit]}
        onChange={() => {}}
      />,
    );

    expect(screen.getByText(feature.title)).toBeTruthy();
    expect(screen.queryByText(habit.title)).toBeNull();
    expect(screen.getByDisplayValue("2026-09-01")).toBeTruthy();
    expect(screen.getByDisplayValue("Decided to build it.")).toBeTruthy();
    expect(
      screen.getByRole("button", { name: "Planned", selected: true }),
    ).toBeTruthy();
  });

  it("edits the status, date and note", async () => {
    const onChange = jest.fn();
    await render(
      <FeatureStatusEditor
        fixes={[feature]}
        savedFixes={[feature]}
        onChange={onChange}
      />,
    );

    await fireEvent.press(screen.getByRole("button", { name: "In Progress" }));
    await fireEvent.changeText(
      screen.getByLabelText("Status date"),
      "2026-10-20",
    );
    await fireEvent.changeText(
      screen.getByLabelText("Status note"),
      "Building it.",
    );

    expect(onChange.mock.calls).toEqual([
      ["check-ins", { featureStatus: "in-progress" }],
      ["check-ins", { statusChangedOn: "2026-10-20" }],
      ["check-ins", { statusNote: "Building it." }],
    ]);
  });

  it("asks for a note when the status changed without one", async () => {
    await render(
      <FeatureStatusEditor
        fixes={[{ ...feature, featureStatus: "in-progress" }]}
        savedFixes={[feature]}
        onChange={() => {}}
      />,
    );

    expect(
      screen.getByText(
        "Add a note saying what changed before changing the status.",
      ),
    ).toBeTruthy();
  });

  it("is quiet once the changed status has a new note", async () => {
    await render(
      <FeatureStatusEditor
        fixes={[
          {
            ...feature,
            featureStatus: "in-progress",
            statusNote: "Building it.",
          },
        ]}
        savedFixes={[feature]}
        onChange={() => {}}
      />,
    );

    expect(screen.getByText(feature.title)).toBeTruthy();
    expect(screen.queryByText(/Add a note/)).toBeNull();
  });
});

describe("status date", () => {
  const dateHelp = "Write the status date as year-month-day, like 2026-10-20.";

  it("asks for a real date in year-month-day form", async () => {
    await render(
      <FeatureStatusEditor
        fixes={[{ ...feature, statusChangedOn: "20 Oct" }]}
        savedFixes={[feature]}
        onChange={() => {}}
      />,
    );

    expect(screen.getByText(dateHelp)).toBeTruthy();
  });

  it("is quiet for a valid date", async () => {
    await render(
      <FeatureStatusEditor
        fixes={[{ ...feature, statusChangedOn: "2026-10-20" }]}
        savedFixes={[feature]}
        onChange={() => {}}
      />,
    );

    expect(screen.getByText(feature.title)).toBeTruthy();
    expect(screen.queryByText(dateHelp)).toBeNull();
  });

  it("refuses to save a date that isn't a calendar date", () => {
    expect(
      refuseStatusChangesWithoutNotes(
        [feature],
        [{ ...feature, statusChangedOn: "2026-02-30" }],
      ),
    ).toBe(`Not saved. check-ins: ${dateHelp}`);
  });
});

describe("refuseStatusChangesWithoutNotes", () => {
  it("refuses to save a status change without a note", () => {
    expect(
      refuseStatusChangesWithoutNotes(
        [feature],
        [{ ...feature, featureStatus: "shipped" }],
      ),
    ).toBe(
      "Not saved. check-ins: Add a note saying what changed before changing the status.",
    );
    expect(
      refuseStatusChangesWithoutNotes(
        [feature],
        [{ ...feature, featureStatus: "shipped", statusNote: "Live." }],
      ),
    ).toBeNull();
  });
});
