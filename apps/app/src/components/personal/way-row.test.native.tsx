import {
  CircleCheck,
  Compass,
  Hammer,
  Lightbulb,
  ListTodo,
} from "lucide-react-native";
import { fireEvent, render, screen } from "@testing-library/react-native";
import { featureStatuses, type ContentFix } from "@it/domain/content";
import { statusCopy, WayRow, type WayChip } from "./way-row";

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
  live: "Live",
  "in-progress": "In progress",
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
    live: "Available to use.",
    "in-progress": "Being built right now.",
    planned: "A decision has been made to build it.",
    exploring: "Investigating what might work, without committing yet.",
    idea: "A possibility someone has proposed.",
  } as const;

  it.each(featureStatuses)("explains the %s status", async (status) => {
    await renderRow(feature(status), "status");

    expect(screen.getByText(details[status])).toBeTruthy();
  });

  it.each(featureStatuses.filter((status) => status !== "live"))(
    "says a %s feature isn't available yet",
    async (status) => {
      await renderRow(feature(status), "type");

      expect(screen.getByText(notYet)).toBeTruthy();
    },
  );

  it("says a Live feature is available to use", async () => {
    await renderRow(feature("live"), "type");

    expect(screen.getByText("Available to use.")).toBeTruthy();
    expect(screen.queryByText(/isn't available yet/)).toBeNull();
    expect(screen.queryByText(/tells us to build it/)).toBeNull();
  });

  const icons = {
    live: CircleCheck,
    "in-progress": Hammer,
    planned: ListTodo,
    exploring: Compass,
    idea: Lightbulb,
  } as const;

  it.each(featureStatuses)("marks the %s status with its icon", (status) => {
    expect(statusCopy[status].icon).toBe(icons[status]);
  });
});
