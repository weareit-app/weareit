import type {
  ContributionStatus,
  SupportFrequency,
  TransactionStatus,
} from "@it/domain/support";
import type { ItDatabase } from "./database";

export interface StripeEventRecord {
  eventId: string;
  bodySha256: string;
  type: string;
  createdAt: Date;
  contributionId?: string | undefined;
  checkoutSessionId?: string | undefined;
  customerId?: string | undefined;
  subscriptionId?: string | undefined;
  paymentIntentId?: string | undefined;
  transactionId?: string | undefined;
  amountMinor?: number | undefined;
  currency?: string | undefined;
  transactionStatus?: TransactionStatus | undefined;
  contributionStatus?: ContributionStatus | undefined;
}

export interface RevenueCatSupportEvent {
  eventId: string;
  bodySha256: string;
  type: string;
  store: string;
  originalTransactionId?: string | undefined;
  transactionId?: string | undefined;
  productId?: string | undefined;
  price?: number | undefined;
  currency?: string | undefined;
  occurredAt?: Date | undefined;
  cancellationReason?: string | undefined;
}

export async function createPendingStripeContribution(
  db: ItDatabase,
  input: {
    id: string;
    userId: string;
    amountMinor: number;
    currency: string;
    frequency: SupportFrequency;
  },
) {
  await db
    .insertInto("support_contributions")
    .values({
      id: input.id,
      user_id: input.userId,
      processor: "stripe",
      frequency: input.frequency,
      amount_minor: input.amountMinor,
      currency: input.currency,
      status: "pending",
      stripe_customer_id: null,
      stripe_checkout_session_id: null,
      stripe_subscription_id: null,
      stripe_payment_intent_id: null,
      store_transaction_id: null,
      store_original_transaction_id: null,
      store_product_id: null,
      revenuecat_app_user_id: null,
      last_payment_event_at: null,
    })
    .execute();
}

export async function attachStripeCheckout(
  db: ItDatabase,
  input: {
    id: string;
    checkoutSessionId: string;
    customerId: string | null;
  },
) {
  await db
    .updateTable("support_contributions")
    .set({
      stripe_checkout_session_id: input.checkoutSessionId,
      stripe_customer_id: input.customerId,
      updated_at: new Date(),
    })
    .where("id", "=", input.id)
    .executeTakeFirstOrThrow();
}

export async function readSupportContributionStatus(
  db: ItDatabase,
  reference: string,
  userId: string,
) {
  return db
    .selectFrom("support_contributions")
    .select(["status", "frequency"])
    .where("id", "=", reference)
    .where("user_id", "=", userId)
    .executeTakeFirst();
}

export async function readSupportContributionForPortal(
  db: ItDatabase,
  reference: string,
  userId: string,
) {
  return db
    .selectFrom("support_contributions")
    .select(["stripe_customer_id", "stripe_subscription_id"])
    .where("id", "=", reference)
    .where("user_id", "=", userId)
    .where("processor", "=", "stripe")
    .where("frequency", "=", "monthly")
    .executeTakeFirst();
}

export async function recordStripeEvent(
  db: ItDatabase,
  event: StripeEventRecord,
) {
  return db.transaction().execute(async (trx) => {
    const inserted = await trx
      .insertInto("support_payment_events")
      .values({
        processor: "stripe",
        event_id: event.eventId,
        body_sha256: event.bodySha256,
      })
      .onConflict((conflict) => conflict.doNothing())
      .returning("event_id")
      .executeTakeFirst();

    if (!inserted) return { duplicate: true } as const;

    let contributionQuery = trx
      .selectFrom("support_contributions")
      .select("id");

    if (event.contributionId)
      contributionQuery = contributionQuery.where(
        "id",
        "=",
        event.contributionId,
      );
    else if (event.checkoutSessionId)
      contributionQuery = contributionQuery.where(
        "stripe_checkout_session_id",
        "=",
        event.checkoutSessionId,
      );
    else if (event.subscriptionId)
      contributionQuery = contributionQuery.where(
        "stripe_subscription_id",
        "=",
        event.subscriptionId,
      );
    else if (event.paymentIntentId)
      contributionQuery = contributionQuery.where(
        "stripe_payment_intent_id",
        "=",
        event.paymentIntentId,
      );
    else return { duplicate: false, updated: false } as const;

    const contribution = await contributionQuery.executeTakeFirst();
    if (!contribution) return { duplicate: false, updated: false } as const;

    let query = trx
      .updateTable("support_contributions")
      .set({
        updated_at: new Date(),
        last_payment_event_at: event.createdAt,
      })
      .where("id", "=", contribution.id)
      .where((eb) =>
        eb.or([
          eb("last_payment_event_at", "is", null),
          eb("last_payment_event_at", "<=", event.createdAt),
        ]),
      );

    if (event.contributionStatus)
      query = query.set({ status: event.contributionStatus });
    if (event.checkoutSessionId)
      query = query.set({
        stripe_checkout_session_id: event.checkoutSessionId,
      });
    if (event.customerId)
      query = query.set({ stripe_customer_id: event.customerId });
    if (event.subscriptionId)
      query = query.set({ stripe_subscription_id: event.subscriptionId });
    if (event.paymentIntentId)
      query = query.set({ stripe_payment_intent_id: event.paymentIntentId });

    const updated = await query.returning("id").executeTakeFirst();
    const { amountMinor, transactionStatus } = event;
    if (
      event.transactionId &&
      amountMinor !== undefined &&
      event.currency &&
      transactionStatus
    ) {
      await trx
        .insertInto("support_transactions")
        .values({
          id: `${event.eventId}:transaction`,
          contribution_id: contribution.id,
          processor: "stripe",
          provider_transaction_id: event.transactionId,
          amount_minor: amountMinor,
          currency: event.currency,
          status: transactionStatus,
          occurred_at: event.createdAt,
        })
        .onConflict((conflict) =>
          conflict
            .columns(["processor", "provider_transaction_id"])
            .doUpdateSet({
              status: transactionStatus,
              amount_minor: amountMinor,
              occurred_at: event.createdAt,
            })
            .whereRef(
              "support_transactions.occurred_at",
              "<=",
              "excluded.occurred_at",
            ),
        )
        .execute();
    }

    return { duplicate: false, updated: Boolean(updated) } as const;
  });
}

function currencyExponent(currency: string) {
  try {
    return (
      new Intl.NumberFormat("en", {
        style: "currency",
        currency: currency.toUpperCase(),
      }).resolvedOptions().maximumFractionDigits ?? 2
    );
  } catch {
    return 2;
  }
}

export async function recordRevenueCatSupportEvent(
  db: ItDatabase,
  event: RevenueCatSupportEvent,
) {
  const processor =
    event.store === "APP_STORE" || event.store === "MAC_APP_STORE"
      ? "app_store"
      : event.store === "PLAY_STORE"
        ? "play_store"
        : null;
  if (!processor) return { ignored: true } as const;

  const transactionId = event.transactionId;
  const originalId = event.originalTransactionId ?? transactionId;
  if (!originalId) return { ignored: true } as const;
  const creationEvent = [
    "INITIAL_PURCHASE",
    "RENEWAL",
    "NON_RENEWING_PURCHASE",
  ].includes(event.type);
  const mappedStatus =
    event.type === "BILLING_ISSUE"
      ? "past_due"
      : event.type === "EXPIRATION"
        ? "expired"
        : event.type === "CANCELLATION"
          ? event.cancellationReason === "CUSTOMER_SUPPORT"
            ? "refunded"
            : event.cancellationReason === "BILLING_ERROR"
              ? "past_due"
              : event.cancellationReason === "UNSUBSCRIBE" ||
                  event.cancellationReason === "PRICE_INCREASE"
                ? "cancel_scheduled"
                : "canceled"
          : event.type === "NON_RENEWING_PURCHASE"
            ? "succeeded"
            : [
                  "INITIAL_PURCHASE",
                  "RENEWAL",
                  "UNCANCELLATION",
                  "PRODUCT_CHANGE",
                  "SUBSCRIPTION_EXTENDED",
                  "REFUND_REVERSED",
                ].includes(event.type)
              ? "active"
              : null;
  const occurredAt = event.occurredAt ?? new Date();

  return db.transaction().execute(async (trx) => {
    const inserted = await trx
      .insertInto("support_payment_events")
      .values({
        processor: "revenuecat",
        event_id: event.eventId,
        body_sha256: event.bodySha256,
      })
      .onConflict((conflict) => conflict.doNothing())
      .returning("event_id")
      .executeTakeFirst();
    if (!inserted) return { duplicate: true } as const;
    if (!mappedStatus) return { ignored: true } as const;

    const current = await trx
      .selectFrom("support_contributions")
      .select(["id", "frequency"])
      .where("processor", "=", processor)
      .where("store_original_transaction_id", "=", originalId)
      .executeTakeFirst();
    if (!current && !creationEvent) return { ignored: true } as const;
    const status =
      event.type === "REFUND_REVERSED" && current?.frequency === "once"
        ? "succeeded"
        : mappedStatus;
    const amountExponent = event.currency
      ? currencyExponent(event.currency)
      : 2;
    const amountMinor =
      event.price === undefined
        ? undefined
        : Math.round(event.price * 10 ** amountExponent);
    const contributionId = current?.id ?? `store:${processor}:${originalId}`;

    if (current) {
      await trx
        .updateTable("support_contributions")
        .set({
          status,
          ...(event.productId ? { store_product_id: event.productId } : {}),
          ...(transactionId ? { store_transaction_id: transactionId } : {}),
          ...(amountMinor !== undefined && amountMinor >= 0
            ? { amount_minor: amountMinor }
            : {}),
          ...(event.currency ? { currency: event.currency.toLowerCase() } : {}),
          updated_at: new Date(),
          last_payment_event_at: occurredAt,
        })
        .where("id", "=", current.id)
        .where((eb) =>
          eb.or([
            eb("last_payment_event_at", "is", null),
            eb("last_payment_event_at", "<=", occurredAt),
          ]),
        )
        .execute();
    } else {
      await trx
        .insertInto("support_contributions")
        .values({
          id: contributionId,
          user_id: null,
          processor,
          frequency:
            event.type === "NON_RENEWING_PURCHASE" ? "once" : "monthly",
          amount_minor: amountMinor ?? 100,
          currency: (event.currency ?? "USD").toLowerCase(),
          status,
          stripe_customer_id: null,
          stripe_checkout_session_id: null,
          stripe_subscription_id: null,
          stripe_payment_intent_id: null,
          store_transaction_id: transactionId ?? null,
          store_original_transaction_id: originalId,
          store_product_id: event.productId ?? null,
          revenuecat_app_user_id: null,
          last_payment_event_at: occurredAt,
        })
        .execute();
    }

    const transactionStatus = [
      "INITIAL_PURCHASE",
      "RENEWAL",
      "NON_RENEWING_PURCHASE",
      "PRODUCT_CHANGE",
      "REFUND_REVERSED",
    ].includes(event.type)
      ? "succeeded"
      : event.type === "CANCELLATION" && status === "refunded"
        ? "refunded"
        : null;

    if (
      transactionStatus &&
      transactionId &&
      amountMinor !== undefined &&
      event.currency
    ) {
      await trx
        .insertInto("support_transactions")
        .values({
          id: `${event.eventId}:transaction`,
          contribution_id: contributionId,
          processor,
          provider_transaction_id: transactionId,
          amount_minor: Math.abs(amountMinor),
          currency: event.currency.toLowerCase(),
          status: transactionStatus,
          occurred_at: occurredAt,
        })
        .onConflict((conflict) =>
          conflict
            .columns(["processor", "provider_transaction_id"])
            .doUpdateSet({
              status: transactionStatus,
              amount_minor: Math.abs(amountMinor),
              occurred_at: occurredAt,
            })
            .whereRef(
              "support_transactions.occurred_at",
              "<=",
              "excluded.occurred_at",
            ),
        )
        .execute();
    }
    return { duplicate: false, contributionId } as const;
  });
}
