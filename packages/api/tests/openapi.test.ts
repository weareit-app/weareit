import { describe, expect, it } from "vitest";
import { apiContract } from "../src/contract";
import { generateOpenApiDocument } from "../src/openapi";

// Taken from the contract, so a new operation without docs text fails here.
const operations = Object.entries(apiContract).flatMap(([group, procedures]) =>
  Object.keys(procedures).map((name) => [group, name] as const),
);

describe("generated OpenAPI document", () => {
  it("describes every operation with a summary, a description, and its group's tag", async () => {
    const document = await generateOpenApiDocument();

    for (const [group, name] of operations) {
      const operation = document.paths?.[`/${group}/${name}`]?.post;
      expect(operation, `${group}.${name}`).toBeDefined();
      expect(operation?.summary, `${group}.${name}`).toMatch(/\S/);
      expect(operation?.description, `${group}.${name}`).toMatch(/\S/);
      expect(operation?.tags).toEqual([group]);
    }
  });

  it("requires the admin token only for CMS operations", async () => {
    const document = await generateOpenApiDocument();

    expect(document.components?.securitySchemes?.cmsAdminToken).toMatchObject({
      type: "http",
      scheme: "bearer",
    });
    for (const [group, name] of operations) {
      const security = document.paths?.[`/${group}/${name}`]?.post?.security;
      if (group === "cms") expect(security).toEqual([{ cmsAdminToken: [] }]);
      else expect(security).toBeUndefined();
    }
  });
});
