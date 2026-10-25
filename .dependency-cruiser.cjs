// Package boundaries (repo-conventions decision 4, #149): which workspace packages,
// apps, tools, and third-party libraries each part of the repo may import. Runs in
// `pnpm run lint` (CI) and as a lefthook pre-commit job with `--cache`. There is no
// baseline. An exception goes here only, as a rule's `pathNot` with a comment giving
// its reason; there are none yet.
//
// Rule syntax: dependency-cruiser 18.6.0 `doc/rules-reference.md` (`$1` in `to`
// reuses a group captured by `from.path`) and `doc/options-reference.md`, checked
// 2026-10-25.

// Workspace packages each package may import, besides itself. `@it/log` is left out
// of every row: the `log-*` rule below owns that edge, so each violation is reported
// once.
const PACKAGE_GRAPH = {
  domain: [],
  watercolor: [],
  log: [],
  content: ["domain"],
  "api-contract": ["domain"],
  database: ["domain", "content"],
};

const APP_GRAPH = {
  "api-server": ["api-contract", "database", "domain", "content"],
  app: ["api-contract", "content", "domain", "watercolor"],
};

// The only libraries from outside the workspace that the pure packages' `src/` may
// import. This is how "domain and content stay free of Expo, React Native, UI, and
// provider imports" is checked: adding a library means editing this list. The essay
// build (`packages/content/essay-build`, `scripts`) and `packages/watercolor/scripts`
// are build tools with their own dev dependencies; `src/` never imports them.
const THIRD_PARTY_ALLOWLIST = {
  domain: ["zod"],
  watercolor: ["zod"],
  content: ["zod"],
  "api-contract": [
    "zod",
    "@orpc/contract",
    "@orpc/client",
    "@orpc/openapi",
    "@orpc/zod",
  ],
  log: [],
};

// Which `@it/domain` modules each module may import, besides itself. A module is
// `src/<name>.ts` with its tests and fixtures, plus `src/<name>/`.
const DOMAIN_MODULES = {
  onboarding: ["content"],
  content: ["primitives"],
  support: ["primitives"],
  essays: ["primitives"],
  primitives: [],
};

const TEST_FILE = "\\.test\\.ts$";
const packageNames = (names) => names.map((name) => `@it/${name}`).join(", ");
const either = (names) => `(${names.join("|")})`;
const escapeRegExp = (name) => name.replace(/[.*+?^${}()|[\]\\/]/g, "\\$&");
// pnpm's isolated layout resolves a library to
// `node_modules/.pnpm/<name>@<version>/node_modules/<name>/`.
const libraries = (names) =>
  `/node_modules/${either(names.map(escapeRegExp))}/`;

/** @type {import('dependency-cruiser').IConfiguration} */
module.exports = {
  forbidden: [
    ...Object.entries(PACKAGE_GRAPH).map(([name, allowed]) => ({
      name: `${name}-package-graph`,
      severity: "error",
      comment: `@it/${name} may import ${packageNames(allowed) || "no workspace package"} (package graph in .dependency-cruiser.cjs).`,
      from: { path: `^packages/${name}/` },
      to: {
        path: "^packages/",
        pathNot: `^packages/${either([name, "log", ...allowed])}/`,
      },
    })),
    ...Object.entries(APP_GRAPH).map(([name, allowed]) => ({
      name: `${name}-package-graph`,
      severity: "error",
      comment: `apps/${name} may import only ${packageNames(allowed)} from the workspace (package graph in .dependency-cruiser.cjs).`,
      from: { path: `^apps/${name}/` },
      to: {
        path: "^packages/",
        pathNot: `^packages/${either(["log", ...allowed])}/`,
      },
    })),
    {
      name: "log-only-in-api-server-and-database",
      severity: "error",
      comment:
        "Only apps/api-server and @it/database may import @it/log; apps, pure packages, and tools may not.",
      from: { pathNot: "^(apps/api-server|packages/(database|log))/" },
      to: { path: "^packages/log/" },
    },
    {
      name: "nothing-imports-an-app-or-tool",
      severity: "error",
      comment:
        "Nothing depends on an app or a tool: move the shared code into a package and import it by name.",
      from: { path: "^(apps|packages|tools)/([^/]+)/" },
      to: { path: "^(apps|tools)/", pathNot: "^$1/$2/" },
    },
    {
      name: "no-relative-import-into-another-package",
      severity: "error",
      comment:
        "Import another package by its name and one of its `exports` subpaths, not by a relative path into its folder.",
      from: { path: "^(apps|packages|tools)/([^/]+)/" },
      to: {
        dependencyTypes: ["local"],
        path: "^(apps|packages|tools)/",
        pathNot: "^$1/$2/",
      },
    },
    {
      name: "src-never-imports-build-tools",
      severity: "error",
      comment:
        "A package's src/ never imports its build tools (scripts/, essay-build/), which have their own dev dependencies.",
      from: { path: "^packages/([^/]+)/src/" },
      to: { path: "^packages/$1/", pathNot: "^packages/$1/src/" },
    },
    ...Object.entries(THIRD_PARTY_ALLOWLIST).flatMap(([name, allowed]) => {
      const list = allowed.length ? allowed.join(", ") : "nothing";
      return [
        {
          name: `${name}-third-party-allowlist`,
          severity: "error",
          comment: `@it/${name} may import only ${list} from outside the workspace. Adding a library means editing THIRD_PARTY_ALLOWLIST in .dependency-cruiser.cjs.`,
          from: { path: `^packages/${name}/src/`, pathNot: TEST_FILE },
          to: {
            pathNot: allowed.length
              ? ["^packages/", libraries(allowed)]
              : "^packages/",
          },
        },
        {
          // Tests never ship, so they may also use Node's built-ins, Vitest, and the
          // package's own dev dependencies (watercolor's tests render with canvaskit-wasm).
          name: `${name}-test-third-party-allowlist`,
          severity: "error",
          comment: `@it/${name}'s tests may import ${list}, Node built-ins, vitest, and the package's dev dependencies from outside the workspace.`,
          from: { path: `^packages/${name}/src/.+${TEST_FILE}` },
          to: {
            pathNot: ["^packages/", libraries([...allowed, "vitest"])],
            dependencyTypesNot: ["core", "npm-dev"],
          },
        },
      ];
    }),
    ...Object.entries(DOMAIN_MODULES).map(([name, allowed]) => ({
      name: `domain-${name}-module-edges`,
      severity: "error",
      comment: `In @it/domain, the ${name} module may import ${
        allowed.length
          ? `only the ${allowed.join(", ")} module`
          : "no other module"
      } (DOMAIN_MODULES in .dependency-cruiser.cjs).`,
      from: { path: `^packages/domain/src/${name}[./-]` },
      to: {
        path: "^packages/domain/src/",
        pathNot: `^packages/domain/src/${either([name, ...allowed])}[./-]`,
      },
    })),
    {
      name: "orpc-server-only-in-api-server",
      severity: "error",
      comment: "Only apps/api-server imports the oRPC server library (#170).",
      from: { pathNot: "^apps/api-server/" },
      to: { path: libraries(["@orpc/server"]) },
    },
    {
      name: "no-orpc-in-repositories-or-domain",
      severity: "error",
      comment:
        "Repositories (@it/database) and domain logic (@it/domain) import no oRPC library; throw an It error class and let the router map it (#170).",
      from: { path: "^packages/(database|domain)/" },
      to: { path: "/node_modules/@orpc/" },
    },
    {
      name: "no-circular",
      severity: "error",
      comment:
        "Circular imports, between packages or between files, are not allowed; type-only imports count.",
      from: {},
      to: { circular: true },
    },
    {
      name: "not-to-unresolvable",
      severity: "error",
      comment:
        "The import doesn't resolve, so the rules above can't check it. Fix the path, or declare the package.",
      from: {},
      to: { couldNotResolve: true },
    },
  ],
  options: {
    doNotFollow: { path: "node_modules" },
    // Build output and caches that aren't tracked. Not `node_modules`: excluding it
    // would drop every third-party import from the graph.
    exclude: {
      path: "^(apps|packages|tools)/[^/]+/(\\.expo|\\.turbo|dist|storybook-static|storybook-review|test-results)/",
    },
    // Type-only imports count the same as runtime imports in every rule.
    tsPreCompilationDeps: true,
    // The app's tsconfig gives the `@/*` alias; no other project has paths. An
    // absolute path, because 18.6.0 resolves the `extends` of a relative one from
    // the wrong folder.
    tsConfig: {
      fileName: require("node:path").join(__dirname, "apps/app/tsconfig.json"),
    },
    enhancedResolveOptions: {
      exportsFields: ["exports"],
      conditionNames: [
        "import",
        "require",
        "node",
        "default",
        "types",
        "react-native",
      ],
      mainFields: ["module", "main", "types", "typings"],
    },
  },
};
