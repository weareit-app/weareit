import { View } from "react-native";

// Drawn marks for selection states. Picked is solid tide with a white tick;
// unpicked is an outline. The control's accessible state carries the meaning.
function Tick({ size }: { size: number }) {
  return (
    <View
      className="border-on-tide"
      style={{
        width: size * 0.32,
        height: size * 0.56,
        borderRightWidth: 2,
        borderBottomWidth: 2,
        marginTop: -size * 0.12,
        transform: [{ rotate: "45deg" }],
      }}
    />
  );
}

export function CheckCircle({
  checked,
  size = 22,
}: {
  checked: boolean;
  size?: number;
}) {
  return (
    <View
      aria-hidden
      className={`items-center justify-center rounded-full ${checked ? "bg-tide" : "border-2 border-ink-faint bg-paper-raised"}`}
      style={{ width: size, height: size }}
    >
      {checked ? <Tick size={size * 0.6} /> : null}
    </View>
  );
}

export function CheckSquare({
  checked,
  size = 18,
}: {
  checked: boolean;
  size?: number;
}) {
  return (
    <View
      aria-hidden
      className={`items-center justify-center rounded-[5px] ${checked ? "bg-tide" : "border-[1.5px] border-ink-faint bg-paper-raised"}`}
      style={{ width: size, height: size }}
    >
      {checked ? <Tick size={size * 0.65} /> : null}
    </View>
  );
}

export function Chevron({
  open,
  size = 9,
  className = "border-ink",
}: {
  open: boolean;
  size?: number;
  className?: string;
}) {
  return (
    <View
      aria-hidden
      className={className}
      style={{
        width: size,
        height: size,
        borderRightWidth: 2,
        borderBottomWidth: 2,
        marginTop: open ? size * 0.4 : -size * 0.4,
        transform: [{ rotate: open ? "-135deg" : "45deg" }],
      }}
    />
  );
}
