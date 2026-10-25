import { expo } from "@better-auth/expo";
import { betterAuth } from "better-auth";
import { emailOTP } from "better-auth/plugins";
import nodemailer from "nodemailer";
import type { ItDatabase } from "@it/database/database";
import type { Log } from "@it/log/log";
import type { ServerEnv } from "./env";

export function createAuth(
  db: ItDatabase,
  log: Log,
  env: Pick<ServerEnv, "auth" | "smtp" | "webOrigins" | "isProduction">,
) {
  const { smtp } = env;
  const mailer = smtp
    ? nodemailer.createTransport({
        host: smtp.host,
        port: smtp.port,
        secure: smtp.isSecure,
        auth: { user: smtp.user, pass: smtp.password },
      })
    : null;

  const trustedOrigins = [
    ...env.webOrigins,
    "weareit://",
    ...(env.isProduction ? [] : ["exp://**"]),
  ];

  return betterAuth({
    appName: "It",
    // biome-ignore lint/style/useNamingConvention: better-auth names this option.
    baseURL: env.auth.baseUrl,
    basePath: "/auth",
    secret: env.auth.secret,
    database: { db, type: "postgres", schemaName: "public", transaction: true },
    trustedOrigins,
    plugins: [
      expo(),
      emailOTP({
        otpLength: 8,
        expiresIn: 10 * 60,
        allowedAttempts: 5,
        // biome-ignore lint/style/useNamingConvention: better-auth names this option.
        storeOTP: "hashed",
        // biome-ignore lint/style/useNamingConvention: better-auth names this option.
        async sendVerificationOTP({ email, otp, type }) {
          // The env schema requires SMTP in production, so this is only
          // ever local development or tests.
          if (!(mailer && smtp)) {
            // Local development only, with no email server: the one place a
            // log may hold a sign-in code (CODING_STANDARDS.md, "Logging").
            log.info("development_sign_in_code", { type, otp });
            return;
          }
          await mailer.sendMail({
            from: smtp.from,
            to: email,
            subject: "Your It sign-in code",
            text: `Your It sign-in code is ${otp}. It expires in 10 minutes.`,
          });
        },
      }),
    ],
    // Better Auth's own messages go through the server log. Its logger is
    // also passed extra arguments of any type (`...args: any[]` in
    // @better-auth/core 1.7.8 dist/env/logger.d.mts, checked 2026-10-22),
    // which this can't review for personal data, so only the message is kept.
    logger: {
      log: (level, message) => log[level]("better_auth", { message }),
    },
    emailAndPassword: { enabled: false },
    rateLimit: { enabled: true },
  });
}
