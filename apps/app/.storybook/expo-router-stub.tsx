import { cloneElement, isValidElement, type ReactNode } from "react";
import { Text } from "react-native";

// Storybook builds with Vite, which can't load expo-router (its CommonJS
// build calls require at runtime, "require is not defined"). Stories only
// need links to render, so Link becomes a plain anchor and navigation does
// nothing. Aliased in main.ts.
type LinkProps = {
  href: string;
  asChild?: boolean;
  onPress?: () => void;
  children?: ReactNode;
};

export type Href = string;

export function Link({ href, asChild, onPress, children }: LinkProps) {
  if (asChild && isValidElement<Record<string, unknown>>(children)) {
    return cloneElement(children, { href, onPress });
  }
  return (
    <Text role="link" {...{ href }} onPress={onPress}>
      {children}
    </Text>
  );
}

export function useRouter() {
  return { push() {}, replace() {}, back() {} };
}
