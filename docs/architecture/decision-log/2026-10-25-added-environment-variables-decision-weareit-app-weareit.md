# 2026-10-25

Added the environment variables decision (weareit-app/weareit#171): one plain-Zod schema per program parsed once at its entry point, all-or-none Stripe, SMTP, and RevenueCat groups required in production, `app.config.ts` parsing the public schema, errors without values, a test keeping each `.env.example` in step, and the shared root `.env` as a deliberate exception to per-app env files.
