import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import type { ApiContext, ApiRouter } from "@it/api/router";

const scalarScriptPath = "/docs/scalar.js";

// Scalar turns telemetry and hosted fonts on by default; these settings turn
// them off, with the AI agent and the product toolbar. With them the page
// requested only local URLs (browser network panel, checked 2026-10-21;
// docs/architecture/dependency-policy.md).
const scalarConfig = {
  url: "/openapi.json",
  telemetry: false,
  withDefaultFonts: false,
  agent: { disabled: true },
  showDeveloperTools: "never",
};

const docsPage = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>It API</title>
  </head>
  <body>
    <div id="app"></div>
    <script src="${scalarScriptPath}"></script>
    <script>
      Scalar.createApiReference("#app", ${JSON.stringify(scalarConfig)});
    </script>
  </body>
</html>
`;

// Scalar is a devDependency, so it is resolved only when the docs are asked for.
async function readScalarScript() {
  const entry = import.meta.resolve("@scalar/api-reference");
  return readFile(
    fileURLToPath(new URL("./browser/standalone.js", entry)),
    "utf8",
  );
}

// Imported on the first docs request, so a server started without API_DOCS
// (production) never loads the OpenAPI handler or generator.
async function loadOpenApi(router: ApiRouter) {
  const [{ OpenAPIHandler }, { generateOpenApiDocument }] = await Promise.all([
    import("@orpc/openapi/fetch"),
    import("@it/api/openapi"),
  ]);
  return { handler: new OpenAPIHandler(router), generateOpenApiDocument };
}

// Local-only developer docs (docs/architecture/decisions.md, 2026-10-21):
// the spec at /openapi.json, a Scalar page at /docs, and the OpenAPI
// transport under /api so the page's "Try it" works. Returns null for any
// other request, and for every request when disabled.
export function createApiDocs({
  router,
  enabled,
}: {
  router: ApiRouter;
  enabled: boolean;
}) {
  let openApi: ReturnType<typeof loadOpenApi> | undefined;
  let scalarScript: Promise<string> | undefined;

  return {
    async handle(
      request: Request,
      context: ApiContext,
    ): Promise<Response | null> {
      if (!enabled) return null;
      openApi ??= loadOpenApi(router);
      const { handler, generateOpenApiDocument } = await openApi;
      const { pathname } = new URL(request.url);
      if (pathname === "/openapi.json")
        return Response.json(await generateOpenApiDocument());
      if (pathname === "/docs")
        return new Response(docsPage, {
          headers: { "Content-Type": "text/html; charset=utf-8" },
        });
      if (pathname === scalarScriptPath) {
        scalarScript ??= readScalarScript();
        return new Response(await scalarScript, {
          headers: { "Content-Type": "text/javascript; charset=utf-8" },
        });
      }
      const result = await handler.handle(request, {
        prefix: "/api",
        context,
      });
      return result.matched ? result.response : null;
    },
  };
}
