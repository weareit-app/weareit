import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { checkActionPins, checkRepo } from "../check-action-pins.mjs";

const SHA = "3d3c42e5aac5ba805825da76410c181273ba90b1";
const OTHER_SHA = "820762786026740c76f36085b0efc47a31fe5020";

const policy = `# Dependency versions

## GitHub Actions

- \`actions/checkout\` v7.0.1, \`${SHA}\`.

## Spec and agent tooling

- Something pinned at \`${OTHER_SHA}\`.
`;

function check(steps: string) {
  return checkActionPins({
    workflows: [
      {
        path: ".github/workflows/ci.yml",
        text: `jobs:\n  check:\n    steps:\n${steps}`,
      },
    ],
    policy,
  });
}

describe("checkActionPins", () => {
  it("passes on the repo's own workflows and policy", () => {
    const root = fileURLToPath(new URL("../../..", import.meta.url));
    expect(checkRepo(root)).toEqual([]);
  });

  it("passes a recorded SHA pin with a version comment", () => {
    expect(check(`      - uses: actions/checkout@${SHA} # v7.0.1\n`)).toEqual(
      [],
    );
  });

  it("exempts local actions", () => {
    expect(check("      - uses: ./.github/actions/setup\n")).toEqual([]);
  });

  it("fails a tag-only pin", () => {
    const problems = check("      - uses: actions/checkout@v7\n");
    expect(problems).toHaveLength(1);
    expect(problems[0]).toMatch(
      /^\.github\/workflows\/ci\.yml:4: "actions\/checkout@v7" is not pinned/,
    );
  });

  it("fails a SHA pin without a version comment", () => {
    expect(check(`      - uses: actions/checkout@${SHA}\n`)).toHaveLength(1);
  });

  it("fails a short SHA", () => {
    expect(
      check(`      - uses: actions/checkout@3d3c42e # v7.0.1\n`),
    ).toHaveLength(1);
  });

  it("fails a SHA that is not recorded under GitHub Actions", () => {
    const unrecorded = "0123456789abcdef0123456789abcdef01234567";
    const problems = check(
      `      - uses: actions/setup-node@${unrecorded} # v7.0.0\n`,
    );
    expect(problems).toHaveLength(1);
    expect(problems[0]).toContain(`${unrecorded} is not recorded`);
  });

  it("fails a SHA recorded only in another section", () => {
    expect(
      check(`      - uses: actions/setup-node@${OTHER_SHA} # v7.0.0\n`),
    ).toHaveLength(1);
  });

  it("checks quoted values and uses without a list dash", () => {
    expect(
      check(`      - name: x\n        uses: "actions/checkout@v7"\n`),
    ).toHaveLength(1);
    expect(
      check(
        `      - name: x\n        uses: "actions/checkout@${SHA}" # v7.0.1\n`,
      ),
    ).toEqual([]);
  });
});
