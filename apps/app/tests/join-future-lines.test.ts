import { joinFutureLines } from "../src/components/personal/future-sentence";

describe("joinFutureLines", () => {
  it("joins first-person lines into one sentence", () => {
    expect(
      joinFutureLines([
        "I drift off without a fight.",
        "I sleep through the night.",
        "I wake up ready.",
      ]),
    ).toBe(
      "I drift off without a fight, sleep through the night, and wake up ready.",
    );
  });

  it("joins two lines with and, lowercasing a line that doesn't start with I", () => {
    expect(
      joinFutureLines(["I know where it goes.", "The essentials are paid."]),
    ).toBe("I know where it goes and the essentials are paid.");
  });

  it("keeps the subject of I'm lines", () => {
    expect(joinFutureLines(["I'm calm.", "I sleep well."])).toBe(
      "I'm calm and I sleep well.",
    );
  });

  it("keeps a single line as written", () => {
    expect(joinFutureLines(["Someone counts on me."])).toBe(
      "Someone counts on me.",
    );
  });
});
