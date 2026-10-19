import { Text as NativeText, type TextProps } from "react-native";

const fontRole = /\bfont-(display|heading|body|ui)\b/;

// Text in the interface font unless the className picks another role.
// React Native has no inherited default font, so every Text needs a family.
export function Text({ className, ...props }: TextProps) {
  const classes = className ?? "";
  return (
    <NativeText
      className={fontRole.test(classes) ? classes : `font-ui ${classes}`}
      {...props}
    />
  );
}
