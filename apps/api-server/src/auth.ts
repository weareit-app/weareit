import { expo } from "@better-auth/expo";
import { betterAuth } from "better-auth";
import { emailOTP } from "better-auth/plugins";
import nodemailer from "nodemailer";
import type { ItDatabase } from "@it/database/database";

export function createAuth(db: ItDatabase) {
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
            console.info(
              `[development email] ${type} code for ${email}: ${otp}`,
            );
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
    emailAndPassword: { enabled: false },
    rateLimit: { enabled: true },
  });
}
