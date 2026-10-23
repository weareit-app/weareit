import { expo } from "@better-auth/expo";
import { betterAuth } from "better-auth";
import { emailOTP } from "better-auth/plugins";
import nodemailer from "nodemailer";
import type { ItDatabase } from "@it/database/database";
import type { Log } from "@it/log/log";

export function createAuth(db: ItDatabase, log: Log) {
  const secret = process.env.BETTER_AUTH_SECRET;
  if (!secret || secret.length < 32)
    throw new Error(
      "Set BETTER_AUTH_SECRET to a random value of at least 32 characters.",
    );

  const smtpHost = process.env.SMTP_HOST;
  const mailer = smtpHost
    ? nodemailer.createTransport({
        host: smtpHost,
        port: Number(process.env.SMTP_PORT ?? 587),
        secure: process.env.SMTP_SECURE === "true",
        auth:
          process.env.SMTP_USER && process.env.SMTP_PASSWORD
            ? {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASSWORD,
              }
            : undefined,
      })
    : null;

  const trustedOrigins = [
    ...(
      process.env.WEB_ORIGINS ?? "http://localhost:8081,http://127.0.0.1:8081"
    )
      .split(",")
      .map((origin) => origin.trim())
      .filter(Boolean),
    "weareit://",
    ...(process.env.NODE_ENV === "production" ? [] : ["exp://**"]),
  ];

  return betterAuth({
    appName: "It",
    baseURL: process.env.BETTER_AUTH_URL ?? "http://localhost:3001",
    basePath: "/auth",
    secret,
    database: { db, type: "postgres", schemaName: "public", transaction: true },
    trustedOrigins,
    plugins: [
      expo(),
      emailOTP({
        otpLength: 8,
        expiresIn: 10 * 60,
        allowedAttempts: 5,
        storeOTP: "hashed",
        async sendVerificationOTP({ email, otp, type }) {
          if (!mailer) {
            if (process.env.NODE_ENV === "production")
              throw new Error(
                "Configure SMTP_HOST before enabling email sign-in.",
              );
            // Local development only, with no email server: the one place a
            // log may hold a sign-in code (CODING_STANDARDS.md, "Logging").
            log.info("development_sign_in_code", { type, otp });
            return;
          }
          const from = process.env.SMTP_FROM;
          if (!from)
            throw new Error("Set SMTP_FROM to send email sign-in codes.");
          await mailer.sendMail({
            from,
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
