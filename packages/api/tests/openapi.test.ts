import { isContractProcedure } from "@orpc/contract";
import { describe, expect, it } from "vitest";
import { apiContract } from "../src/contract";
import { generateOpenApiDocument } from "../src/openapi";

// Every procedure path in the contract, at any depth, so a new operation
// without docs text fails here.
function procedurePaths(router: object, prefix: string[] = []): string[][] {
  return Object.entries(router).flatMap(([key, value]) =>
    isContractProcedure(value)
      ? [[...prefix, key]]
      : procedurePaths(value as object, [...prefix, key]),
  );
}

// The document's operations by operationId, which oRPC sets to the
// procedure path joined with "." (@orpc/openapi 1.15.6 source, checked
// 2026-10-21), whatever HTTP path or method a route uses.
async function operationsById() {
  const document = await generateOpenApiDocument();
  const operations = new Map<string, Record<string, unknown>>();
  for (const pathItem of Object.values(document.paths ?? {}))
    for (const operation of Object.values(pathItem ?? {}))
      if (
        operation &&
        typeof operation === "object" &&
        "operationId" in operation
      )
        operations.set(String(operation.operationId), operation);
  return { document, operations };
}

const paths = procedurePaths(apiContract);

describe("generated OpenAPI document", () => {
  it("describes every operation with a summary, a description, and its group's tag", async () => {
    const { operations } = await operationsById();

    expect(paths.length).toBeGreaterThan(0);
    for (const path of paths) {
      const id = path.join(".");
      const operation = operations.get(id);
      expect(operation, id).toBeDefined();
      expect(operation?.summary, id).toMatch(/\S/);
      expect(operation?.description, id).toMatch(/\S/);
      expect(operation?.tags, id).toEqual([path[0]]);
    }
  });

  it("requires the admin token only for CMS operations", async () => {
    const { document, operations } = await operationsById();

    expect(document.components?.securitySchemes?.cmsAdminToken).toMatchObject({
      type: "http",
      scheme: "bearer",
    });
    for (const path of paths) {
      const id = path.join(".");
      const security = operations.get(id)?.security;
      if (path[0] === "cms")
        expect(security, id).toEqual([{ cmsAdminToken: [] }]);
      else expect(security, id).toBeUndefined();
    }
  });
});
