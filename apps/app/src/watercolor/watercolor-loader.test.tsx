import { act, render, screen } from "@testing-library/react-native";
import { AccessibilityInfo } from "react-native";
import { ContentQueryState } from "../components/content-query-state";
import { dotAccessibility } from "./types";
import { LOADER_DELAY_MS, WatercolorLoader } from "./watercolor-loader";

// The dot itself is drawn by Skia or Reanimated; here it only needs to exist.
jest.mock("./gather-dot", () => ({
  GatherDot: () => {
    const { View: MockView } = jest.requireActual("react-native");
    return <MockView testID="watercolor-dot" />;
  },
}));
// The page header's logo is drawn with Skia too.
jest.mock("./brand-mark", () => ({
  BrandMark: () => {
    const { View: MockView } = jest.requireActual("react-native");
    return <MockView testID="brand-mark" />;
  },
}));

describe("WatercolorLoader", () => {
  beforeEach(() => jest.useFakeTimers());
  afterEach(() => jest.useRealTimers());

  it("shows nothing for quick loads", async () => {
    await render(<WatercolorLoader />);
    await act(() => jest.advanceTimersByTime(LOADER_DELAY_MS - 100));
    expect(screen.queryByLabelText("Loading…")).toBeNull();
    expect(screen.queryByTestId("watercolor-dot")).toBeNull();
  });

  it("shows the dot after the delay, labeled for screen readers (FR-007, FR-020)", async () => {
    await render(<WatercolorLoader />);
    await act(() => jest.advanceTimersByTime(LOADER_DELAY_MS));
    expect(screen.getByLabelText("Loading…")).toBeTruthy();
    expect(screen.getByTestId("watercolor-dot")).toBeTruthy();
  });

  it("announces loading once on iOS (FR-020)", async () => {
    const announce = jest
      .spyOn(AccessibilityInfo, "announceForAccessibility")
      .mockImplementation(() => {});
    const view = await render(<WatercolorLoader />);
    await act(() => jest.advanceTimersByTime(LOADER_DELAY_MS * 3));
    await view.rerender(<WatercolorLoader />);
    expect(announce).toHaveBeenCalledTimes(1);
    expect(announce).toHaveBeenCalledWith("Loading…");
  });
});

describe("ContentQueryState", () => {
  beforeEach(() => jest.useFakeTimers());
  afterEach(() => jest.useRealTimers());

  it("shows the watercolor loader while loading", async () => {
    await render(
      <ContentQueryState
        content="pains"
        loading
        error={null}
        retry={() => {}}
      />,
    );
    await act(() => jest.advanceTimersByTime(LOADER_DELAY_MS));
    expect(screen.getByTestId("watercolor-dot")).toBeTruthy();
  });

  it("shows retry and no dot when loading fails (FR-013)", async () => {
    await render(
      <ContentQueryState
        content="pains"
        loading={false}
        error={new Error("offline")}
        retry={() => {}}
      />,
    );
    await act(() => jest.advanceTimersByTime(LOADER_DELAY_MS));
    expect(screen.getByText("Try again")).toBeTruthy();
    expect(screen.queryByTestId("watercolor-dot")).toBeNull();
  });
});

describe("dot accessibility", () => {
  it("hides an unlabeled dot from assistive tech (FR-020)", () => {
    expect(dotAccessibility()).toMatchObject({
      accessible: false,
      accessibilityElementsHidden: true,
      importantForAccessibility: "no-hide-descendants",
    });
  });

  it("exposes a labeled dot as an image", () => {
    expect(dotAccessibility("It's watercolor mark")).toMatchObject({
      accessible: true,
      accessibilityRole: "image",
      accessibilityLabel: "It's watercolor mark",
    });
  });
});
