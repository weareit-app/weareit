import { fireEvent, render, screen } from "@testing-library/react-native";
import { featureStatuses, type ContentFix } from "@it/content/graph-schema";
import { WayRow, type WayChip } from "../src/components/personal/way-row";

const notYet =
  "Something It would offer. It isn't available yet; choosing it tells us to build it.";

function feature(featureStatus: ContentFix["featureStatus"]): ContentFix {
  return {
    id: "check-ins",
    title: "Check-ins with someone who gets it",
    description: "Paired with a person working on the same thing.",
    kind: "feature",
    featureStatus,
    evidence: "untested",
    evidenceNote: "Not tested yet.",
    sortOrder: 0,
  };
}

async function renderRow(fix: ContentFix, openChip: WayChip | null = null) {
  const onChip = jest.fn();
  await render(
    <WayRow
      fix={fix}
      picked={false}
      onToggle={() => {}}
      openChip={openChip}
      onChip={onChip}
    />,
  );
  return onChip;
}

const labels = {
  shipped: "Shipped",
  "in-progress": "In Progress",
  planned: "Planned",
  exploring: "Exploring",
  idea: "Idea",
} as const;

describe("WayRow feature statuses", () => {
  it.each(featureStatuses)("writes the %s status in words", async (status) => {
    const onChip = await renderRow(feature(status));

    await fireEvent.press(screen.getByRole("button", { name: labels[status] }));

    expect(onChip).toHaveBeenCalledWith("status");
  });

  const details = {
    shipped: /^This feature is live, and you can use it in It now\.$/,
    "in-progress":
      /^We're building this feature now, but it isn't available yet\.$/,
    planned: /not built yet/,
    exploring:
      /^We're looking into this feature and may decide not to build it\.$/,
    idea: /Nothing is built or scheduled yet/,
  } as const;

  it.each(featureStatuses)("explains the %s status", async (status) => {
    await renderRow(feature(status), "status");

    expect(screen.getByText(details[status])).toBeTruthy();
  });

  it.each(featureStatuses.filter((status) => status !== "shipped"))(
    "says a %s feature isn't available yet",
    async (status) => {
      await renderRow(feature(status), "type");

      expect(screen.getByText(notYet)).toBeTruthy();
    },
  );

  it("says a Shipped feature is available in It now", async () => {
    await renderRow(feature("shipped"), "type");

    expect(
      screen.getByText("This is something It offers, and you can use it now."),
    ).toBeTruthy();
    expect(screen.queryByText(/isn't available yet/)).toBeNull();
    expect(screen.queryByText(/tells us to build it/)).toBeNull();
  });

  it("says a Shipped status is available in It now", async () => {
    await renderRow(feature("shipped"), "status");

    expect(screen.getByText(/you can use it in It now/)).toBeTruthy();
  });

  it("says an In Progress status is being built and not available yet", async () => {
    await renderRow(feature("in-progress"), "status");

    expect(screen.getByText(/building this feature now/)).toBeTruthy();
    expect(screen.getByText(/isn't available yet/)).toBeTruthy();
  });
});
