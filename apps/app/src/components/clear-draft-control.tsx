import { useState } from "react";
import { Modal, Pressable, Text, View } from "react-native";
import { useOnboardingStore } from "../state/onboarding-store";

export function ClearDraftControl() {
  const [confirming, setConfirming] = useState(false);
  const clearDraft = useOnboardingStore((state) => state.clearDraft);

  function clear() {
    clearDraft();
    setConfirming(false);
  }

  return (
    <>
      <Pressable
        accessibilityRole="button"
        onPress={() => setConfirming(true)}
        className="self-start py-2"
      >
        <Text className="text-sm text-muted underline">
          Clear saved choices from this device
        </Text>
      </Pressable>
      <Modal
        visible={confirming}
        transparent
        animationType="fade"
        onRequestClose={() => setConfirming(false)}
      >
        <View className="flex-1 items-center justify-center bg-black/40 px-6">
          <View className="w-full max-w-md gap-4 rounded-3xl bg-white p-6">
            <Text
              accessibilityRole="header"
              className="font-serif text-2xl font-bold text-ink"
            >
              Clear your saved choices?
            </Text>
            <Text className="leading-6 text-muted">
              This removes your personal and world choices and help interests
              from this device. You can explore again any time.
            </Text>
            <View className="flex-row justify-end gap-3">
              <Pressable
                accessibilityRole="button"
                onPress={() => setConfirming(false)}
                className="min-h-11 justify-center rounded-xl border border-[#dddddd] px-4"
              >
                <Text className="font-semibold text-ink">Keep them</Text>
              </Pressable>
              <Pressable
                accessibilityRole="button"
                onPress={clear}
                className="min-h-11 justify-center rounded-xl bg-blue px-4"
              >
                <Text className="font-semibold text-white">Clear choices</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
}
