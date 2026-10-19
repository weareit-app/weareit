import { Link } from "expo-router";
import { useState } from "react";
import { Pressable, TextInput, View } from "react-native";
import { Text } from "../src/components/text";
import { useShallow } from "zustand/react/shallow";
import { apiClient } from "@it/api/client";
import { usePublishedContent } from "../src/content/use-published-content";
import { Page } from "../src/components/page";
import { authClient } from "../src/auth/auth-client";
import { useOnboardingStore } from "../src/state/onboarding-store";

export default function SaveProgressScreen() {
  const draft = useOnboardingStore(
    useShallow((state) => ({
      personalPainIds: state.personalPainIds,
      worldPainIds: state.worldPainIds,
      personalDreamIds: state.personalDreamIds,
      worldDreamIds: state.worldDreamIds,
      personalPaths: state.personalPaths,
      worldPaths: state.worldPaths,
      helpInterests: state.helpInterests,
      draftUpdatedAt: state.draftUpdatedAt,
    })),
  );
  const contentQuery = usePublishedContent();
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [codeSent, setCodeSent] = useState(false);
  const [saved, setSaved] = useState(false);
  const [pending, setPending] = useState(false);
  const [notice, setNotice] = useState("");

  async function requestCode() {
    setPending(true);
    setNotice("");
    try {
      const normalizedEmail = email.trim().toLowerCase();
      const result = await authClient.emailOtp.sendVerificationOtp({
        email: normalizedEmail,
        type: "sign-in",
      });
      if (result.error) throw new Error(result.error.message);
      setEmail(normalizedEmail);
      setCodeSent(true);
      setNotice("Check your email for an eight-digit sign-in code.");
    } catch (error) {
      setNotice(
        error instanceof Error ? error.message : "Couldn't send a code.",
      );
    } finally {
      setPending(false);
    }
  }

  async function verifyAndSave() {
    setPending(true);
    setNotice("");
    try {
      const result = await authClient.signIn.emailOtp({
        email,
        otp: otp.trim(),
        name: "It explorer",
      });
      if (result.error) throw new Error(result.error.message);
      if (!contentQuery.data)
        throw new Error(
          "The roadmap is unavailable. Your choices are still on this device.",
        );
      await apiClient.account.saveOnboarding({
        contentVersion: contentQuery.data.version,
        draft,
      });
      setSaved(true);
    } catch (error) {
      setNotice(
        error instanceof Error
          ? error.message
          : "Couldn't save your exploration. Your choices are still on this device.",
      );
    } finally {
      setPending(false);
    }
  }

  if (saved) {
    return (
      <Page
        eyebrow="Your account is ready"
        title="Your exploration is saved."
        description={`Your choices are now saved to your account for ${email}. You can keep exploring and change them later.`}
      >
        <Link href="/ways-to-help" asChild>
          <Pressable className="min-h-12 self-start justify-center rounded-full bg-tide px-6">
            <Text className="font-ui-semibold text-on-tide">
              Continue exploring
            </Text>
          </Pressable>
        </Link>
      </Page>
    );
  }

  return (
    <Page
      eyebrow="Save your exploration"
      title={codeSent ? "Check your email." : "Keep what you found."}
      description={
        codeSent
          ? `We sent a sign-in code to ${email}. Enter it here to create your account and save your choices.`
          : "Your choices have stayed on this device. Enter your email only if you'd like to create an account and save them."
      }
    >
      {!codeSent ? (
        <View className="gap-4">
          <Text className="font-ui-semibold text-ink">Email address</Text>
          <TextInput
            accessibilityLabel="Email address"
            autoCapitalize="none"
            autoComplete="email"
            autoCorrect={false}
            keyboardType="email-address"
            onChangeText={setEmail}
            placeholder="you@example.com"
            value={email}
            className="min-h-12 rounded-2xl border border-rule bg-paper-raised px-4 font-ui text-ink"
          />
          <Pressable
            accessibilityRole="button"
            disabled={pending || !email.trim()}
            onPress={() => void requestCode()}
            className="min-h-12 self-start justify-center rounded-full bg-tide px-6"
          >
            <Text className="font-ui-semibold text-on-tide">
              {pending ? "Sending code…" : "Email me a code"}
            </Text>
          </Pressable>
        </View>
      ) : (
        <View className="gap-4">
          <Text className="font-ui-semibold text-ink">Eight-digit code</Text>
          <TextInput
            accessibilityLabel="Email sign-in code"
            autoComplete="one-time-code"
            keyboardType="number-pad"
            maxLength={8}
            onChangeText={setOtp}
            placeholder="00000000"
            value={otp}
            className="min-h-12 rounded-2xl border border-rule bg-paper-raised px-4 font-ui text-ink"
          />
          <Pressable
            accessibilityRole="button"
            disabled={pending || otp.trim().length !== 8}
            onPress={() => void verifyAndSave()}
            className="min-h-12 self-start justify-center rounded-full bg-tide px-6"
          >
            <Text className="font-ui-semibold text-on-tide">
              {pending ? "Saving…" : "Verify and save"}
            </Text>
          </Pressable>
          <Pressable
            accessibilityRole="button"
            disabled={pending}
            onPress={() => void requestCode()}
            className="min-h-12 self-start justify-center rounded-full border border-tide px-6"
          >
            <Text className="font-ui-semibold text-tide-deep">
              Send another code
            </Text>
          </Pressable>
        </View>
      )}
      {notice ? (
        <Text accessibilityRole="alert" className="leading-6 text-ink-soft">
          {notice}
        </Text>
      ) : null}
      <Text className="leading-6 text-ink-soft">
        Your answers are sent only after you verify the email code. You can keep
        exploring without an account.
      </Text>
      <Link href="/ways-to-help" asChild>
        <Pressable className="min-h-12 self-start justify-center rounded-full border border-tide px-6">
          <Text className="font-ui-semibold text-tide-deep">Not now</Text>
        </Pressable>
      </Link>
    </Page>
  );
}
