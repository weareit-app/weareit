import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { afterEach, describe, expect, it } from "vitest";
import { checkActionPins, checkRepo } from "../check-action-pins.mjs";

const SHA = "3d3c42e5aac5ba805825da76410c181273ba90b1";
const OTHER_SHA = "820762786026740c76f36085b0efc47a31fe5020";
const EMBEDDED_SHA = "0123456789abcdef0123456789abcdef01234567";

const policy = `# Dependency versions

## Continuous integration

- \`actions/checkout\` v7.0.1, \`${SHA}\`.
- A sha256 that only contains a SHA: \`${EMBEDDED_SHA}0000\`.

## Spec and agent tooling

- Something pinned at \`${OTHER_SHA}\`.
`;

function check(steps: string) {
  return checkActionPins({
    files: [
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
      /^\.github\/workflows\/ci\.yml:4: "actions\/checkout@v7" isn't pinned/,
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

  it("fails a SHA that isn't recorded in the policy section", () => {
    const unrecorded = "0123456789abcdef0123456789abcdef01234567";
    const problems = check(
      `      - uses: actions/setup-node@${unrecorded} # v7.0.0\n`,
    );
    expect(problems).toHaveLength(1);
    expect(problems[0]).toContain(`${unrecorded} isn't recorded`);
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

  it("fails a SHA that appears only inside a longer hex string", () => {
    const problems = check(
      `      - uses: actions/setup-node@${EMBEDDED_SHA} # v7.0.0\n`,
    );
    expect(problems).toHaveLength(1);
    expect(problems[0]).toContain("isn't recorded");
  });

  it("reads a quoted uses key", () => {
    expect(check(`      - "uses": actions/checkout@v7\n`)).toHaveLength(1);
    expect(check(`      - "uses": actions/checkout@${SHA} # v7.0.1\n`)).toEqual(
      [],
    );
  });

  it("fails flow-style uses it can't read", () => {
    for (const steps of [
      "      - { name: x, uses: actions/checkout@v7 }\n",
      `    steps: [{ uses: "actions/checkout@${SHA}" }]\n`,
    ]) {
      const problems = check(steps);
      expect(problems).toHaveLength(1);
      expect(problems[0]).toContain("on its own block-style line");
    }
  });

  it("ignores uses: inside run blocks", () => {
    const steps = [
      "      - run: |",
      "          echo start",
      "",
      "          uses: not-an-action",
      "      - name: folded",
      "        run: >-",
      "          uses: also-not-an-action",
      `      - uses: actions/checkout@${SHA} # v7.0.1`,
      "",
    ].join("\n");
    expect(check(steps)).toEqual([]);
  });

  it("still checks a uses after a run block ends", () => {
    const steps =
      "      - run: |\n          echo hi\n      - uses: actions/checkout@v7\n";
    expect(check(steps)).toHaveLength(1);
  });

  it("ignores commented-out uses", () => {
    expect(check("      # - uses: actions/checkout@v7\n")).toEqual([]);
  });

  it("fails clearly when the policy section is missing", () => {
    const problems = checkActionPins({
      files: [
        {
          path: ".github/workflows/ci.yml",
          text: `      - uses: actions/checkout@${SHA} # v7.0.1\n`,
        },
      ],
      policy: `# Dependency versions\n\n## GitHub Actions\n\n${SHA}\n`,
    });
    expect(problems).toEqual([
      'docs/architecture/dependency-policy.md has no "Continuous integration" section to record action pins in',
    ]);
  });
});

describe("checkRepo", () => {
  let root: string | undefined;
  afterEach(() => {
    if (root) rmSync(root, { recursive: true, force: true });
  });

  function repo(files: Record<string, string>) {
    root = mkdtempSync(join(tmpdir(), "action-pins-"));
    for (const [path, text] of Object.entries(files)) {
      mkdirSync(dirname(join(root, path)), { recursive: true });
      writeFileSync(join(root, path), text);
    }
    return root;
  }

  it("checks composite actions under .github/actions", () => {
    const dir = repo({
      "docs/architecture/dependency-policy.md": policy,
      ".github/workflows/ci.yml": `    steps:\n      - uses: actions/checkout@${SHA} # v7.0.1\n      - uses: ./.github/actions/setup\n`,
      ".github/actions/setup/action.yml":
        "runs:\n  using: composite\n  steps:\n    - uses: pnpm/action-setup@v6\n",
      ".github/actions/other/action.yaml": `runs:\n  steps:\n    - uses: actions/checkout@${SHA} # v7.0.1\n`,
    });
    expect(checkRepo(dir)).toEqual([
      `.github/actions/setup/action.yml:4: "pnpm/action-setup@v6" isn't pinned as owner/repo@<40-char lowercase SHA> # vX.Y.Z`,
    ]);
  });

  it("fails when there are no workflows to check", () => {
    const dir = repo({ "docs/architecture/dependency-policy.md": policy });
    expect(checkRepo(dir)).toEqual([
      "found no workflows in .github/workflows to check",
    ]);
  });
});
