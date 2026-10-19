# Hosting options for launch week

- **Question:** How do we get the static web build, the API server and PostgreSQL live at `weareit.app` by Monday 2026-10-26, with one founder plus AI agents?
- **Researched:** 2026-10-19. Every vendor source below was accessed on 2026-10-19. Prices and plan features change; recheck the pricing pages before paying.
- **Fixed inputs:** Neon PostgreSQL in AWS us-east (AGENTS.md, `openspec/changes/full-privacy-page`); vendors behind It-owned boundaries (AGENTS.md); static output first (`docs/architecture/decisions.md`, "Rendering"); hosting lean "SST on AWS if it is the cheapest and easiest to change later" (`decisions.md`, open decisions).

## Recommendation

**Use Render for launch: the web build as a Render static site, the API server as a Render web service (Starter, Virginia region), and Neon in `aws-us-east-1`. Put the API on `api.weareit.app`.** Expect about **$7/month** plus Neon.

Why:

1. **Fastest safe path for a novice.** Both pieces deploy from the GitHub repo through the dashboard or one `render.yaml`; TLS, the `www` redirect and HTTP-to-HTTPS are automatic ([Render custom domains][render-domains]). Nothing to learn about VPCs, load balancers or IAM in launch week.
2. **Best privacy fit with no extra work.** On the Hobby workspace plan Render does **not** offer HTTP request logs at all; they start on Pro ([Render pricing][render-pricing], [Render logging][render-logging]). App logs (our own stdout) are kept 7 days on Hobby. That meets the full-privacy-page rule ("drop or truncate IPs and paths where possible, else at most 14 days") as long as the API server itself never logs addresses, which `visit-measurement` task 3.4 already requires.
3. **Cheap.** Static sites are free; the Starter instance (512 MB, always on) is $7/month; the Hobby workspace is $0 ([Render pricing][render-pricing]). Free instances spin down after 15 idle minutes and take about a minute to wake, and Render says not to use them in production ([Render free][render-free]), so the API needs Starter for Stripe and RevenueCat webhooks.
4. **Little lock-in.** The server already reads `PORT` and env vars and is plain Node `http`. The only Render-specific artifact is `render.yaml` (or dashboard settings). Moving to SST, Fly or Railway later means writing that host's config, not changing product code.

**Why not SST now.** SST on AWS is the most controllable option and fits a later move, but it is neither the cheapest (about $30/month with a load balancer, see below) nor the easiest in a week: it needs an AWS account, IAM setup and comfort debugging CloudFormation/Pulumi-style failures. Revisit it after launch; record the change in `decisions.md` either way.

## Comparison

|                             | **Render** (recommended)                                                                              | **SST on AWS**                                                                                                                                                                 | **Fly.io**                                                                   | **Railway**                                                                                                       | **Cloudflare (web) + API elsewhere**                                                                                       |
| --------------------------- | ----------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| Static web                  | Native static site, global CDN, free                                                                  | `StaticSite`: S3 + CloudFront                                                                                                                                                  | No static product; serve `dist` from a container                             | No static product; serve from a container                                                                         | Workers static assets, free and unlimited requests                                                                         |
| Node API with webhooks      | Web service, always on from $7                                                                        | `Service` on Fargate behind an ALB                                                                                                                                             | Machine, always on                                                           | Service, always on                                                                                                | Not on Workers (no full Node); Containers need Workers Paid and scale to zero by design. Put the API on Render/Fly         |
| Setup time, novice          | **Hours**                                                                                             | 1–3 days                                                                                                                                                                       | About a day (Dockerfile, `fly.toml`, CLI)                                    | Hours                                                                                                             | Hours, but two vendors                                                                                                     |
| Cost, small scale           | **~$7/mo** (Hobby $0 + Starter $7; static free; 5 GB bandwidth then $0.15/GB)                         | **~$30/mo**: Fargate 0.25 vCPU/0.5 GB ~$12, ALB ~$16 + ~$4 for HTTPS domain, VPC ~$0.50; static pennies                                                                        | **~$4–7/mo** (shared-cpu-1x 512 MB $3.69, 1 GB $6.70 in `iad`; no free tier) | **~$5–10/mo** (Hobby $5 includes $5 usage; RAM $10/GB-mo, CPU $20/vCPU-mo)                                        | $0 for web + API host cost                                                                                                 |
| Request logs (IPs, paths)   | **Hobby: no HTTP request logs.** Pro+: per-request logs with path. App logs 7 days (Hobby) / 14 (Pro) | ALB and CloudFront access logs are **off by default**; if enabled, CloudFront v2 lets you pick fields (omit `c-ip`). App logs in CloudWatch, SST default 1 month, configurable | No proxy request logs described in docs; app logs searchable 7 days          | **Logs every HTTP request with source IP and path**; no documented off switch. Retention 7 days (Hobby), 30 (Pro) | Static asset requests are not Worker invocations; Workers Logs 3 days (free) / 7 (paid), invocation logs can be turned off |
| US East region              | Virginia                                                                                              | us-east-1 (same region as Neon)                                                                                                                                                | `iad` Ashburn, VA                                                            | US East Metal, Virginia                                                                                           | Global edge (web only)                                                                                                     |
| Preview deploys             | Static site PR previews and single-service previews on Hobby; full-stack previews on Pro              | Per-PR stages via SST Console Autodeploy (free under 350 active resources)                                                                                                     | DIY GitHub Action (`fly-pr-review-apps`)                                     | PR environments, enable in project settings                                                                       | Per-branch/PR previews automatic                                                                                           |
| Custom domain + TLS         | Automatic; 2 domains included on Hobby, then $0.25/mo                                                 | ACM via SST; automatic with Route 53/Cloudflare DNS, manual cert otherwise                                                                                                     | `fly certs`; first 10 certs free                                             | Supported                                                                                                         | Automatic                                                                                                                  |
| Lock-in past an It boundary | Low: `render.yaml` only                                                                               | Medium: infra code is AWS-specific, but it is ours and portable in concept                                                                                                     | Low: Dockerfile (portable) + `fly.toml`                                      | Low: config only                                                                                                  | Low for web; Worker-specific if API moves there                                                                            |

Not shortlisted:

- **Vercel or Netlify for web.** Both host Expo static output and are documented by Expo ([Expo publishing][expo-publish]). Vercel's Hobby plan is "restricted to non-commercial personal use", and "any method of requesting or processing payment from visitors" counts as commercial ([Vercel fair use][vercel-fair-use]); the Support It flow takes payments, so It would need Pro. It still needs a separate API host, so it adds a vendor and cost without solving the hard part.
- **EAS Hosting.** Expo's recommended web host, but custom domains need a paid plan ($19/mo Starter) and it runs on Cloudflare Workers, which Expo says is not for full Node servers ([EAS Hosting][eas-hosting], [Expo pricing][expo-pricing]). Same split as Cloudflare.

## Findings by option

### Render

- Plans: Hobby $0/mo + compute, Pro $25/mo + compute. Starter web instance $7/mo (512 MB, 0.5 CPU). Hobby includes 5 GB bandwidth, then $0.15/GB; 2 custom domains, then $0.25/domain/month; log retention 7 days; HTTP request logs not available on Hobby. — [Render pricing][render-pricing]
- Log retention 7 / 14 / 30 days for Hobby / Pro / Scale. Pro+ get one log entry per public HTTP request, with method, status, URL, host and path; the page doesn't say whether client IPs are included. — [Render logging][render-logging]
- Regions: Oregon, Ohio, Virginia, Frankfurt, Singapore. A service's region can't be changed later. Static sites have no region (global CDN). — [Render regions][render-regions]
- Static sites are free, support redirect/rewrite rules and custom headers, and can build a preview per PR. — [Render static sites][render-static]
- Free web services spin down after 15 minutes idle, take about a minute to start, and "Do not use them for production applications." — [Render free][render-free]
- Full preview environments need Pro. — [Render preview environments][render-previews]
- Monorepos: files outside a service's root directory are unavailable at build and runtime, so for pnpm workspaces keep the root at the repo root and use build filters. — [Render monorepo][render-monorepo]
- Adding an apex domain also adds `www` and redirects it; certificates are issued and renewed automatically. — [Render custom domains][render-domains]

### SST on AWS

- `Service` runs containers on Fargate in ECS, optionally behind an ALB. Default 0.25 vCPU / 0.5 GB is about $12/mo in us-east-1 (about $6 on Spot); ALB about $16/mo plus about $4 for HTTPS with a custom domain, plus LCU usage. HTTPS listeners need a custom domain. CloudWatch log group kept one month by default. — [SST Service][sst-service]
- `Vpc` costs about $0.50/mo by default and creates no NAT unless asked (`nat: "ec2"` about $6/mo; managed NAT about $65/mo). — [SST Vpc][sst-vpc]
- `StaticSite` uploads a build output to S3 behind CloudFront, with ACM certificates created automatically (cert must be in us-east-1); examples cover Vite and others, not Expo, but the build command and output directory are generic. — [SST StaticSite][sst-static]
- SST Console Autodeploy creates a `pr-<n>` stage per PR and removes it when the PR closes; free up to 350 active resources a month. — [SST Console][sst-console]
- ALB access logs (which include client IP and request path) are "disabled by default". — [ALB access logs][alb-logs]
- CloudFront standard logs are enabled per distribution, and logging v2 lets you choose which fields to deliver. — [CloudFront access logs][cf-logs], [CloudFront standard logging v2][cf-logs-v2]

### Fly.io

- Pay as you go, no plan fee, no free tier (trial of 2 machine-hours or 7 days). shared-cpu-1x in `iad`: 256 MB $2.19, 512 MB $3.69, 1 GB $6.70 per month. First 10 single-hostname certificates free. Outbound data $0.02/GB in North America. — [Fly pricing][fly-pricing]
- Ashburn, Virginia is `iad`. — [Fly regions][fly-regions]
- Grafana log search keeps logs 7 days; the logging overview does not describe proxy request logs. — [Fly logging][fly-logging]
- PR review apps are a DIY GitHub Actions workflow using `superfly/fly-pr-review-apps`. — [Fly review apps][fly-review]

### Railway

- Hobby $5/mo including $5 of usage; Pro $20/mo including $20. RAM $10/GB-month, CPU $20/vCPU-month, egress $0.05/GB. — [Railway plans][railway-plans]
- Region "US East Metal", Virginia (`us-east4-eqdc4a`). — [Railway regions][railway-regions]
- HTTP request logs include source IP (`@srcIp`) and path (`@path`); the docs don't say they can be turned off. Retention: Free 3 days, Hobby 7, Pro 30. — [Railway logs][railway-logs]
- PR environments are created per PR once enabled and deleted when the PR closes. — [Railway environments][railway-envs]

### Cloudflare

- Requests to static assets are "free and unlimited". — [Workers static assets billing][cf-assets]
- Workers Logs are kept 3 days (free) or 7 days (paid); invocation logs can be turned off with `invocation_logs = false`. — [Workers Logs][cf-workers-logs]
- Containers need Workers Paid ($5/mo) and scale to zero, with billing stopping when the instance sleeps. — [Containers pricing][cf-containers]
- Pages creates a preview per PR from the same repo; previews are public by default. — [Pages previews][cf-previews]

### Shared facts

- Neon's AWS US regions: `aws-us-east-1` (N. Virginia), `aws-us-east-2` (Ohio), `aws-us-west-2` (Oregon). — [Neon regions][neon-regions]
- Expo static output writes one HTML file per route to `dist` via `npx expo export -p web`; Expo documents EAS Hosting, Netlify, Vercel, Amplify, Firebase and GitHub Pages, not Render. — [Expo publishing][expo-publish]
- `.app` is on the HSTS preload list, so HTTPS is required on every `.app` site; the site is unreachable until its certificate is issued. — [Google Registry .app][dot-app]

## Notes for It

- **Host-neutral code already.** `apps/api-server/src/index.ts` reads `PORT`, `DATABASE_URL`, `CMS_ADMIN_TOKEN` and `WEB_ORIGINS`, and uses Node `http`. No host SDK is needed. Keep it that way: no Render-specific env names in product code.
- **`tsx` at runtime.** `start` runs `node --import tsx src/index.ts`, and `tsx` is a devDependency of `@it/api-server`. Install with dev dependencies (don't set `NODE_ENV=production` during install), or move `tsx` to dependencies, or add a compile step. Node must be 24 (`engines` in the root `package.json`).
- **Subdomain, not a separate site.** `weareit.app` (web) and `api.weareit.app` (API) share a registrable domain, which keeps Better Auth cookies first-party. Set `WEB_ORIGINS=https://weareit.app` (plus the preview origin if used).
- **Vendor-side logs.** "No request logs on Hobby" covers what we can see and keep. Each host still processes IPs at its edge under its own privacy terms; the privacy page should name the web host as an outside service (`full-privacy-page` spec already requires this).

## Setup checklist (Render)

1. Create the Neon project in `aws-us-east-1`; run `pnpm db:migrate` and the seed against it from a laptop; copy the pooled connection string.
2. Create a Render account (Hobby). Connect the GitHub repo `weareit-app/weareit`.
3. **API web service:** region Virginia; instance Starter; root directory = repo root; build `corepack enable && pnpm install --frozen-lockfile`; start `pnpm --filter @it/api-server start`; health check path (add a cheap `GET` route if none exists). Env: `DATABASE_URL`, `CMS_ADMIN_TOKEN`, `WEB_ORIGINS`, Better Auth secret and URL, Stripe and RevenueCat keys and webhook secrets, email provider settings.
4. **Static site:** root directory = repo root; build `corepack enable && pnpm install --frozen-lockfile && pnpm --filter @it/app exec expo export -p web`; publish directory `apps/app/dist`. Set the API base URL env var the app reads at build time. Add rewrite rules only if a dynamic route 404s.
5. Turn on PR previews for the static site. Add build filters so web-only changes don't redeploy the API.
6. DNS: add `weareit.app` to the static site (Render adds `www`), `api.weareit.app` to the web service; create the records Render shows; wait for certificates.
7. Point the Stripe and RevenueCat webhooks at `https://api.weareit.app/...`; send a test event from each.
8. Check privacy settings: no log streams configured; confirm the API logs no IPs or `measurement.*` bodies (visit-measurement 3.4); note "app logs 7 days, no request logs" for the privacy page.
9. Capture the settings in `render.yaml` once it works, so the setup is reviewable and repeatable.
10. Update `docs/architecture/decisions.md`: launch host Render; SST revisit after launch.

## Founder must supply

- Where `weareit.app` is registered and which DNS provider holds it (and access to it).
- Neon region confirmed as `aws-us-east-1` (vs `us-east-2`), and the Neon plan.
- A card for Render (Starter is paid) and who owns the accounts (personal vs We Are It LLC).
- Live vs sandbox Stripe for launch, plus RevenueCat and email-provider credentials, entered by the founder in the Render dashboard.
- Whether one dashboard seat is enough (Hobby has 1 seat; Pro $25/mo adds seats and full-stack previews, but also turns on HTTP request logs, so the privacy page would then need the 14-day wording).

## Sources

All accessed 2026-10-19.

[render-pricing]: https://render.com/pricing
[render-logging]: https://render.com/docs/logging
[render-regions]: https://render.com/docs/regions
[render-static]: https://render.com/docs/static-sites
[render-free]: https://render.com/docs/free
[render-previews]: https://render.com/docs/preview-environments
[render-monorepo]: https://render.com/docs/monorepo-support
[render-domains]: https://render.com/docs/custom-domains
[sst-service]: https://sst.dev/docs/component/aws/service/
[sst-vpc]: https://sst.dev/docs/component/aws/vpc/
[sst-static]: https://sst.dev/docs/component/aws/static-site/
[sst-console]: https://sst.dev/docs/console/
[alb-logs]: https://docs.aws.amazon.com/elasticloadbalancing/latest/application/load-balancer-access-logs.html
[cf-logs]: https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/AccessLogs.html
[cf-logs-v2]: https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/standard-logging.html
[fly-pricing]: https://docs.fly.io/about/pricing
[fly-regions]: https://docs.fly.io/reference/regions
[fly-logging]: https://docs.fly.io/monitoring/logging-overview
[fly-review]: https://docs.fly.io/blueprints/review-apps-guide/
[railway-plans]: https://docs.railway.com/reference/pricing/plans
[railway-regions]: https://docs.railway.com/reference/deployment-regions
[railway-logs]: https://docs.railway.com/guides/logs
[railway-envs]: https://docs.railway.com/guides/environments
[cf-assets]: https://developers.cloudflare.com/workers/static-assets/billing-and-limitations/
[cf-workers-logs]: https://developers.cloudflare.com/workers/observability/logs/workers-logs/
[cf-containers]: https://developers.cloudflare.com/containers/pricing/
[cf-previews]: https://developers.cloudflare.com/pages/configuration/preview-deployments/
[vercel-fair-use]: https://vercel.com/docs/limits/fair-use-guidelines
[eas-hosting]: https://docs.expo.dev/eas/hosting/introduction/
[expo-pricing]: https://expo.dev/pricing
[expo-publish]: https://docs.expo.dev/guides/publishing-websites/
[neon-regions]: https://neon.com/docs/introduction/regions
[dot-app]: https://www.registry.google/domains/app/

- Render: [pricing][render-pricing], [logging][render-logging], [regions][render-regions], [static sites][render-static], [free instances][render-free], [preview environments][render-previews], [monorepo support][render-monorepo], [custom domains][render-domains]
- SST: [Service][sst-service], [Vpc][sst-vpc], [StaticSite][sst-static], [Console][sst-console]
- AWS: [ALB access logs][alb-logs], [CloudFront access logs][cf-logs], [CloudFront standard logging v2][cf-logs-v2]
- Fly.io: [pricing][fly-pricing], [regions][fly-regions], [logging][fly-logging], [review apps][fly-review]
- Railway: [plans][railway-plans], [regions][railway-regions], [logs][railway-logs], [environments][railway-envs]
- Cloudflare: [static assets billing][cf-assets], [Workers Logs][cf-workers-logs], [Containers pricing][cf-containers], [Pages previews][cf-previews]
- Vercel: [fair use guidelines][vercel-fair-use]
- Expo: [EAS Hosting][eas-hosting], [pricing][expo-pricing], [publishing websites][expo-publish]
- Neon: [regions][neon-regions]
- Google Registry: [.app][dot-app]
