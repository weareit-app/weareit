import { Redirect } from "expo-router";

// The personal page is the landing page now; keep old links working.
export default function PersonalRedirect() {
  return <Redirect href="/" />;
}
