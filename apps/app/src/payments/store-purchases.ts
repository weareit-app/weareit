export function purchaseStoreSupport(_optionId: string): Promise<void> {
  return Promise.reject(
    new Error("App Store purchases are available in the iOS app only."),
  );
}
