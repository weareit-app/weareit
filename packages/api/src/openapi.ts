import { OpenAPIGenerator } from "@orpc/openapi";
import { ZodToJsonSchemaConverter } from "@orpc/zod/zod4";
import { apiContract } from "./contract";

const generator = new OpenAPIGenerator({
  schemaConverters: [new ZodToJsonSchemaConverter()],
});

// The API as OpenAPI, for the local developer docs. Paths are relative to the
// server's /api prefix.
export function generateOpenApiDocument() {
  return generator.generate(apiContract, {
    info: { title: "It API", version: "0.1.0" },
    servers: [{ url: "/api" }],
    components: {
      securitySchemes: {
        cmsAdminToken: {
          type: "http",
          scheme: "bearer",
          description: "The CMS_ADMIN_TOKEN the API server was started with.",
        },
      },
    },
  });
}
