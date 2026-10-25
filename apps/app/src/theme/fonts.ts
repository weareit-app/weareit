// biome-ignore-all lint/style/useNamingConvention: the keys are the family names @expo-google-fonts exports and global.css refers to.
import {
  Bitter_400Regular,
  Bitter_400Regular_Italic,
  Bitter_600SemiBold,
  Bitter_600SemiBold_Italic,
} from "@expo-google-fonts/bitter";
import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
} from "@expo-google-fonts/inter";

// Every face the app uses, keyed by the family name the font-* tokens in
// global.css refer to. React Native picks fonts by family name, not by
// weight, so each weight is its own family. See docs/architecture/typography.md.
export const appFonts = {
  Bitter_400Regular,
  Bitter_400Regular_Italic,
  Bitter_600SemiBold,
  Bitter_600SemiBold_Italic,
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
};
