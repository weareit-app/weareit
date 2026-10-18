import { render } from "@testing-library/react-native";
import { AnimatedPaintedOrb } from "../src/watercolor/animated-painted-orb";

// A minimal stand-in for Reanimated: enough to see which animations start.
const mockReanimated = {
  reduceMotion: false,
  withRepeat: jest.fn((...a: unknown[]) => a[0]),
  withTiming: jest.fn((...a: unknown[]) => a[0]),
};

jest.mock("react-native-reanimated", () => {
  const { View } = jest.requireActual("react-native");
  return {
    __esModule: true,
    default: { View },
    Easing: {
      inOut: () => () => 0,
      out: () => () => 0,
      sin: () => 0,
      cubic: () => 0,
      linear: () => 0,
    },
    useReducedMotion: () => mockReanimated.reduceMotion,
    useSharedValue: (v: number) => ({ value: v }),
    useAnimatedStyle: (f: () => object) => f(),
    withRepeat: (...a: unknown[]) => mockReanimated.withRepeat(...a),
    withTiming: (...a: unknown[]) => mockReanimated.withTiming(...a),
  };
});

describe("AnimatedPaintedOrb", () => {
  beforeEach(() => {
    mockReanimated.withRepeat.mockClear();
    mockReanimated.withTiming.mockClear();
  });

  it("blooms in a loop as a loader", async () => {
    mockReanimated.reduceMotion = false;
    await render(<AnimatedPaintedOrb size={56} motion="bloom-loop" />);
    expect(mockReanimated.withRepeat).toHaveBeenCalledTimes(1);
  });

  it("blooms once without repeating", async () => {
    mockReanimated.reduceMotion = false;
    await render(<AnimatedPaintedOrb size={56} motion="bloom-once" />);
    expect(mockReanimated.withRepeat).not.toHaveBeenCalled();
    expect(mockReanimated.withTiming).toHaveBeenCalledTimes(1);
  });

  it("stays still with reduced motion (FR-019)", async () => {
    mockReanimated.reduceMotion = true;
    await render(<AnimatedPaintedOrb size={56} motion="bloom-loop" />);
    await render(<AnimatedPaintedOrb size={56} motion="bloom-once" />);
    expect(mockReanimated.withRepeat).not.toHaveBeenCalled();
    expect(mockReanimated.withTiming).not.toHaveBeenCalled();
  });
});
