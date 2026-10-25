import Purchases from "react-native-purchases";
import { appEnv } from "../env";

const supportProducts = ["it_support_5", "it_support_15", "it_support_30"];

let configured = false;

async function configure() {
  if (configured) return;
  const apiKey = appEnv.revenueCatIosApiKey;
  if (!apiKey)
    throw new Error("RevenueCat App Store purchases are not configured yet.");
  Purchases.configure({ apiKey });
  configured = true;
}

export async function purchaseStoreSupport(optionId: string) {
  if (!supportProducts.includes(optionId))
    throw new Error("Choose one of the available support amounts.");
  await configure();
  const offerings = await Purchases.getOfferings();
  const item = offerings.current?.availablePackages.find(
    (candidate) => candidate.product.identifier === optionId,
  );
  if (!item) throw new Error("That support amount is unavailable right now.");
  await Purchases.purchasePackage(item);
}
