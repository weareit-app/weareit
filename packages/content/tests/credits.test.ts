import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { escoCredit, iscedCredit } from "../src/credits";

const licensing = readFileSync(
  new URL("../essays/licensing/essay.md", import.meta.url),
  "utf8",
);

// The licensing essay and the Help build It page show the same credits.
describe("credits", () => {
  it.each([
    ["ESCO", escoCredit],
    ["ISCED", iscedCredit],
  ])("the licensing essay repeats the %s credit word for word", (_, credit) => {
    expect(licensing).toContain(credit.text);
    expect(licensing).toContain(`(${credit.url})`);
    if (credit.licenseUrl)
      expect(licensing).toContain(`(${credit.licenseUrl})`);
  });
});
