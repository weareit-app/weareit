# Email provider for sign-in codes

Research for the ticket "Email provider for sign-in codes" (launch Monday 2026-10-26, sending from `weareit.app`). All sources were read on 2026-10-19. Prices are in USD.

## Recommendation: Postmark

Use **Postmark** on its transactional stream, connected through today's nodemailer SMTP transport. The planned `sendEmail({ to, subject, text })` boundary can move to Postmark's HTTP API later without changing auth (`openspec/changes/required-signup-gate/design.md`, decision 5).

Why Postmark:

- **It sends only application email, with transactional and broadcast mail kept apart.** Postmark runs separate sending infrastructure and IP pools for transactional and broadcast streams: "transactional and broadcast traffic do not mix" [P3]. Sign-in codes go on the transactional stream. The privacy-change notices and opt-in update emails that come later can use a broadcast stream on the same account [P3; `full-privacy-page` design].
- **Tracking is off by default, and our mail cannot be tracked anyway.** Link tracking defaults to "None" for every server and message [P5]. Open tracking has to be enabled per server or stream, and it works only on HTML email [P6]. Our code email is plain text (`apps/api-server/src/auth.ts`), so no pixel can be added.
- **No code change for launch.** Postmark accepts SMTP at `smtp.postmarkapp.com` on port 587 with STARTTLS. The server token is both the username and the password. Mail without an `X-PM-Message-Stream` header goes to the default transactional stream [P4]. Launch only needs the existing `SMTP_*` environment variables set.
- **It fits the privacy page.** Postmark hosts in the US (Deft near Chicago, plus AWS) and has no plans for EU hosting. Its DPA is part of the Terms of Service and includes the 2021 SCCs, so there is nothing to sign [P7]. This matches the "stored in the US" statement in `full-privacy-page`.
- **The cost is small.** The free developer plan covers 100 emails a month, which is enough until launch. After that, Basic is $15 a month for 10,000 emails, with overage at $1.80 per 1,000 [P1]. Hundreds to low thousands of emails a month fit well inside Basic.

The main risk is the **account approval**. A new Postmark account can send only to its own verified domains until Postmark approves it manually. Approval takes "less than 24 hours on weekdays", and a little longer at weekends [P2]. **Request approval by Wednesday 2026-10-21** so there is slack before the Monday launch.

Second choice: **Resend**, if Postmark approval stalls. It needs no documented review, its free tier is 3,000 emails a month, tracking is off by default, and it is certified under the EU-U.S. DPF [R1–R5]. It ranks second because the same product also sells marketing broadcasts, and its sending runs on Amazon SES (its DNS records point at `amazonses.com`) [R3].

## Comparison

| | Postmark | Resend | Amazon SES | Mailgun |
|---|---|---|---|---|
| **Domain records** | DKIM TXT and Return-Path CNAME (`pm.mtasv.net`); verification within 48 h [P8] | MX and SPF TXT on `send.`, and DKIM TXT `resend._domainkey` [R3] | DKIM (Easy DKIM), plus an MX and SPF TXT for a custom MAIL FROM; MAIL FROM detection can take up to 72 h [S3] | SPF and DKIM shown in the control panel, plus a tracking CNAME only if tracking is used [M3] |
| **Account review** | Manual, under 24 h on weekdays; until then mail only to verified domains [P2] | None documented; free plan limited to 100 emails a day [R1] | Sandbox per region (200 a day, verified recipients only); production access answered "within 96 hours" [S2] | Email and mobile-phone activation; business verification only if flagged [M2] |
| **Transactional / marketing** | Separate streams and IP pools [P3] | One product with both transactional and broadcast email [R1] | General purpose; you set it up yourself | General purpose; part of Sinch's email products [M4] |
| **Price, ~1–3k a month** | Free 100 a month; then $15 a month for 10k [P1] | Free for 3k a month (100 a day); Pro $20 for 50k [R1] | $0.10 per 1k (about $0.30 a month), plus AWS free-tier credits [S1] | Free 100 a day; Basic from $15 for 10k [M1] |
| **Data location** | US (Chicago and AWS); no EU option [P7] | Primary processing in the US; sending regions us-east-1, eu-west-1, sa-east-1, ap-northeast-1 [R2, R4] | The AWS region you choose | US or EU (Germany and Belgium) [M4] |
| **DPA** | In the ToS; SCCs [P7] | In the ToS; SCCs and DPF [R4] | In the AWS Service Terms §1.14; SCCs [S5] | Sinch Email DPA with signature blocks; SCCs [M4] |
| **Tracking default** | Links "None"; opens opt-in and HTML only [P5, P6] | Off: "disabled by default for all domains" [R5] | Only with a configuration set and event destination; HTML only [S4] | Opens and clicks not on by default [M3] |
| **SMTP / HTTP** | Both [P4] | Both; SMTP user `resend`, password = API key [R6] | Both; SMTP credentials per region [S6] | Both [M1] |

On deliverability, none of these providers publishes independent, comparable inbox-placement data. Postmark's "industry-leading deliverability and time-to-inbox" is its own claim [P3]. At It's volume, deliverability depends mostly on correct DKIM alignment, a DMARC record, low bounce rates and transactional-only content. Gmail requires SPF or DKIM, valid PTR records, TLS and a spam rate below 0.3% from all senders. It also requires DMARC and SPF+DKIM alignment from senders above 5,000 a day [G1]. We should meet the stricter set anyway.

Amazon SES is the cheapest, but it loses on launch timing (up to 96 hours of sandbox review), extra setup (IAM, configuration sets, bounce handling) and self-managed reputation. Mailgun's Basic plan allows only one custom domain, and its DPA is signed by hand [M1, M4].

## Privacy notes for the privacy page

- Name **Postmark, United States**. It receives the recipient's email address and the message (sign-in code, subject and body).
- Postmark keeps message content and metadata for **45 days** by default. A retention add-on can shorten this to 7 or 28 days. Bounces, complaints and unsubscribes stay on a suppression list indefinitely [P7]. Codes expire after 10 minutes, so a stored code is low risk. The privacy page should still state the 45 days, or the founder can buy the 7-day add-on.
- Keep link and open tracking off. Do not enable it on any stream.

## Setup checklist (founder, by hand unless noted)

1. **Today:** create a Postmark account. Create a server named `It production`. Its default stream is the transactional one.
2. Add the domain `weareit.app` under Sender Signatures, then publish the records the DNS Settings page shows [P8]:
   - **DKIM** — `TXT` at the hostname Postmark generates (under `_domainkey`), with the key it shows. Copy both exactly.
   - **Return-Path** — `CNAME` from the subdomain Postmark suggests (default `pm-bounces`) to `pm.mtasv.net`. This makes SPF align for DMARC, so the root SPF record needs no change [P8].
   - **DMARC** — `TXT` at `_dmarc.weareit.app`: `v=DMARC1; p=none; rua=mailto:<a monitored address>`. Start with `p=none` [P8, G1], and tighten to `quarantine` once reports look clean.
   - **SPF on the root** — leave any existing record as it is. If `weareit.app` will receive mail (rights requests are handled by email), keep that mailbox provider's SPF and MX.
3. Press **Verify** in Postmark once the records have propagated.
4. **By Wednesday 2026-10-21:** request account approval as the Account Owner [P2]. Until approval, test by sending to an address on `weareit.app` or to `test@blackhole.postmarkapp.com`.
5. In stream settings, confirm that link tracking is **None** and open tracking is **off**.
6. Set production secrets on the API host (agent or founder): `SMTP_HOST=smtp.postmarkapp.com`, `SMTP_PORT=587`, `SMTP_SECURE=false` (STARTTLS), `SMTP_USER` and `SMTP_PASSWORD` both set to the server API token, and `SMTP_FROM="It <signin@weareit.app>"` (a verified address on the domain).
7. Send a real code to Gmail, iCloud and Outlook addresses. In each, check "Show original" for DKIM=pass, SPF=pass and DMARC=pass.
8. Pay for Basic ($15 a month) before launch. The free plan stops at 100 emails a month with no overage [P1].
9. Add "Postmark, US, email address and message, 45 days" to the provider list in `full-privacy-page`. Spanish code emails later need only new template text through `sendEmail` (`spanish-language` task 6.3).

## Sources (accessed 2026-10-19)

- [P1] Postmark pricing — https://postmarkapp.com/pricing
- [P2] Postmark, "How does the account approval process work?" — https://postmarkapp.com/support/article/1084-how-does-the-account-approval-process-work
- [P3] Postmark Message Streams — https://postmarkapp.com/message-streams
- [P4] Postmark, Send email with SMTP — https://postmarkapp.com/developer/user-guide/send-email-with-smtp
- [P5] Postmark, Tracking links — https://postmarkapp.com/developer/user-guide/tracking-links
- [P6] Postmark, Tracking opens per message stream — https://postmarkapp.com/developer/user-guide/tracking-opens/tracking-opens-per-message-stream
- [P7] Postmark EU privacy and DPA — https://postmarkapp.com/eu-privacy
- [P8] Postmark, "How do I verify a domain?" — https://postmarkapp.com/support/article/1046-how-do-i-verify-a-domain
- [R1] Resend pricing — https://resend.com/pricing
- [R2] Resend regions — https://resend.com/docs/dashboard/domains/regions
- [R3] Resend, Cloudflare DNS guide — https://resend.com/docs/knowledge-base/cloudflare
- [R4] Resend DPA — https://resend.com/legal/dpa
- [R5] Resend tracking — https://resend.com/docs/dashboard/domains/tracking
- [R6] Resend SMTP — https://resend.com/docs/send-with-smtp
- [S1] Amazon SES pricing — https://aws.amazon.com/ses/pricing/
- [S2] SES, Request production access — https://docs.aws.amazon.com/ses/latest/dg/request-production-access.html
- [S3] SES, Custom MAIL FROM domain — https://docs.aws.amazon.com/ses/latest/dg/mail-from.html
- [S4] SES metrics FAQ (open and click tracking) — https://docs.aws.amazon.com/ses/latest/dg/faqs-metrics.html
- [S5] AWS Service Terms §1.14 — https://aws.amazon.com/service-terms/
- [S6] SES SMTP interface — https://docs.aws.amazon.com/ses/latest/dg/send-email-smtp.html
- [M1] Mailgun pricing — https://www.mailgun.com/pricing/
- [M2] Mailgun Account Activation — https://help.mailgun.com/hc/en-us/articles/37182933150491-Account-Activation
- [M3] Mailgun, Tracking messages — https://documentation.mailgun.com/docs/mailgun/user-manual/tracking-messages/tracking-messages
- [M4] Mailgun (Sinch Email) DPA — https://www.mailgun.com/legal/dpa/
- [G1] Google, Email sender guidelines — https://support.google.com/a/answer/81126
