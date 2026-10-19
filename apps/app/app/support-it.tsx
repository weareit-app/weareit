import { Link, useLocalSearchParams } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Platform, Pressable, TextInput, View } from "react-native";
import { Text } from "../src/components/text";
import { apiClient } from "@it/api/client";
import { Page } from "../src/components/page";
import { purchaseStoreSupport } from "../src/payments/store-purchases";

const webLevels = ["$5", "$15", "$30", "Another amount"];
const iosStoreLevels = [
  { id: "it_support_5", label: "$5" },
  { id: "it_support_15", label: "$15" },
  { id: "it_support_30", label: "$30" },
];
const iosStore = Platform.OS === "ios";

function errorCode(error: unknown) {
  return error && typeof error === "object" && "code" in error
    ? String(error.code)
    : "";
}

export default function SupportItScreen() {
  const params = useLocalSearchParams<{ status?: string; ref?: string }>();
  const [amount, setAmount] = useState("$15");
  const [customAmount, setCustomAmount] = useState("");
  const [frequency, setFrequency] = useState<"once" | "monthly">("once");
  const [notice, setNotice] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const isWebSuccess = !iosStore && params.status === "success";
  const reference = typeof params.ref === "string" ? params.ref : undefined;
  const paymentStatus = useQuery({
    queryKey: ["support", "status", reference],
    queryFn: () => apiClient.support.getStatus({ reference: reference! }),
    enabled: isWebSuccess && Boolean(reference),
    retry: (failureCount, error) =>
      !["UNAUTHORIZED", "NOT_FOUND"].includes(errorCode(error)) &&
      failureCount < 3,
    refetchInterval: (query) =>
      query.state.data?.status === "pending" ? 2000 : false,
  });

  const levels = iosStore
    ? iosStoreLevels.map((option) => option.label)
    : webLevels;
  const selectedStoreProduct = iosStoreLevels.find(
    (option) => option.label === amount,
  );

  async function continueToPayment() {
    setNotice("");
    setIsLoading(true);
    try {
      if (iosStore) {
        if (!selectedStoreProduct)
          throw new Error("Choose an available App Store support amount.");
        await purchaseStoreSupport(selectedStoreProduct.id);
        setNotice(
          "Apple confirmed your support purchase. It will appear in our records shortly.",
        );
        return;
      }

      let amountMinor: number;
      if (amount === "Another amount") {
        const dollars = customAmount.trim();
        if (!/^\d{1,4}(?:\.\d{1,2})?$/.test(dollars))
          throw new Error("Enter an amount between $1 and $1,000.");
        amountMinor = Math.round(Number(dollars) * 100);
      } else {
        amountMinor = Number(amount.slice(1)) * 100;
      }
      if (amountMinor < 100 || amountMinor > 100_000)
        throw new Error("Enter an amount between $1 and $1,000.");

      const { url } = await apiClient.support.createCheckout({
        amountMinor,
        frequency,
      });
      window.location.assign(url);
    } catch (error) {
      setNotice(
        error instanceof Error
          ? error.message
          : "We couldn't start checkout. Please try again.",
      );
    } finally {
      setIsLoading(false);
    }
  }

  const status = paymentStatus.data?.status;
  const confirmed = ["succeeded", "active", "cancel_scheduled"].includes(
    status ?? "pending",
  );
  const paymentTitle = confirmed
    ? "Thank you for supporting It."
    : status === "refunded"
      ? "Your contribution has been refunded."
      : status === "past_due"
        ? "Monthly support needs attention."
        : status === "canceled"
          ? "Monthly support has ended."
          : status === "failed" || status === "expired"
            ? "Payment wasn’t completed."
            : "Checkout completed.";
  const paymentDescription = confirmed
    ? "Your contribution is confirmed."
    : status === "refunded"
      ? "The payment was returned to your payment method."
      : status === "past_due"
        ? "Stripe couldn’t collect the latest monthly contribution. You can review your billing details below."
        : status === "canceled"
          ? "Your monthly support has ended."
          : status === "failed" || status === "expired"
            ? "No payment was taken. You can try again whenever you’re ready."
            : errorCode(paymentStatus.error) === "UNAUTHORIZED"
              ? "Sign in with the account you used to support It to see this confirmation. Stripe will still email your receipt."
              : paymentStatus.isError
                ? "Your payment is being confirmed. You can close this page; Stripe will send the receipt."
                : "We’re waiting for Stripe to confirm the payment.";
  const canceled = params.status === "cancelled";

  async function manageSubscription() {
    if (!reference) return;
    setIsLoading(true);
    setNotice("");
    try {
      const { url } = await apiClient.support.createPortal({ reference });
      window.location.assign(url);
    } catch (error) {
      setNotice(
        error instanceof Error
          ? error.message
          : "We couldn't open subscription management.",
      );
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Page
      eyebrow="Optional support"
      title="Help keep the work moving."
      description="People can contribute time, ideas, introductions, or money. Supporting It is optional and does not unlock a better version of the product."
    >
      {isWebSuccess ? (
        <View className="gap-3 rounded-3xl bg-sun-wash p-5">
          <Text className="text-lg font-ui-semibold text-ink">
            {paymentTitle}
          </Text>
          <Text className="leading-6 text-ink-soft">{paymentDescription}</Text>
          {paymentStatus.data?.frequency === "monthly" && reference ? (
            <Pressable
              accessibilityRole="button"
              disabled={isLoading}
              onPress={() => void manageSubscription()}
              className="min-h-12 self-start justify-center rounded-full bg-ember px-6 disabled:opacity-50"
            >
              <Text className="font-ui-semibold text-on-ember">
                Manage monthly support
              </Text>
            </Pressable>
          ) : null}
        </View>
      ) : canceled ? (
        <View className="gap-2 rounded-3xl bg-sun-wash p-5">
          <Text className="font-ui-semibold text-ink">
            Checkout was canceled.
          </Text>
          <Text className="leading-6 text-ink-soft">No payment was taken.</Text>
        </View>
      ) : (
        <>
          <View className="gap-3">
            <Text className="text-lg font-ui-semibold text-ink">
              Choose an amount
            </Text>
            <View className="flex-row flex-wrap gap-3">
              {levels.map((level) => {
                return (
                  <Pressable
                    key={level}
                    onPress={() => setAmount(level)}
                    accessibilityRole="radio"
                    accessibilityState={{ checked: amount === level }}
                    aria-checked={amount === level}
                    className={`rounded-full border px-5 py-3 ${amount === level ? "border-tide bg-tide" : "border-rule bg-paper-raised"}`}
                  >
                    <Text
                      className={
                        amount === level
                          ? "font-ui-semibold text-on-tide"
                          : "font-ui-semibold text-ink"
                      }
                    >
                      {level}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
            {!iosStore && amount === "Another amount" ? (
              <View className="flex-row items-center gap-3 rounded-2xl border border-rule bg-paper-raised px-5">
                <Text className="text-lg font-ui-semibold text-ink">$</Text>
                <TextInput
                  value={customAmount}
                  onChangeText={setCustomAmount}
                  keyboardType="decimal-pad"
                  accessibilityLabel="Support amount in dollars"
                  placeholder="Other amount"
                  className="flex-1 py-4 font-ui text-ink"
                />
              </View>
            ) : null}
          </View>
          {!iosStore ? (
            <View className="gap-3">
              <Text className="text-lg font-ui-semibold text-ink">
                How often?
              </Text>
              <View className="flex-row gap-3">
                {(["once", "monthly"] as const).map((value) => (
                  <Pressable
                    key={value}
                    onPress={() => setFrequency(value)}
                    accessibilityRole="radio"
                    accessibilityState={{ checked: frequency === value }}
                    aria-checked={frequency === value}
                    className={`rounded-full border px-5 py-3 ${frequency === value ? "border-tide bg-tide" : "border-rule bg-paper-raised"}`}
                  >
                    <Text
                      className={
                        frequency === value
                          ? "font-ui-semibold text-on-tide"
                          : "font-ui-semibold text-ink"
                      }
                    >
                      {value === "once" ? "One time" : "Monthly"}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </View>
          ) : null}
          {iosStore ? (
            <Text className="leading-6 text-ink-soft">
              Amounts are set in USD. Apple will show the localized price before
              you confirm.
            </Text>
          ) : null}
          <Pressable
            accessibilityRole="button"
            disabled={isLoading || (iosStore && !selectedStoreProduct)}
            onPress={() => void continueToPayment()}
            className="min-h-12 self-start justify-center rounded-full bg-ember px-6 disabled:opacity-50"
          >
            <Text className="font-ui-semibold text-on-ember">
              {isLoading
                ? "Opening checkout…"
                : iosStore
                  ? "Support with Apple"
                  : "Continue to secure checkout"}
            </Text>
          </Pressable>
        </>
      )}
      {notice ? (
        <View accessibilityRole="alert" className="rounded-3xl bg-sun-wash p-5">
          <Text className="leading-6 text-ink-soft">{notice}</Text>
        </View>
      ) : null}
      <Link href="/ways-to-help" asChild>
        <Pressable className="min-h-12 self-start rounded-full border border-tide px-6 py-3">
          <Text className="font-ui-semibold text-tide-deep">
            Explore other ways to help
          </Text>
        </Pressable>
      </Link>
    </Page>
  );
}
