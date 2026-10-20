import { Pressable, TextInput, View } from "react-native";
import { Text } from "../text";

// Plain form controls for the founder's CMS.

export function Field({
  label,
  value,
  onChangeText,
  multiline,
  keyboardType,
}: {
  label: string;
  value: string;
  onChangeText: (value: string) => void;
  multiline?: boolean;
  keyboardType?: "number-pad";
}) {
  return (
    <View className="gap-1">
      <Text className="text-sm font-ui-semibold text-ink">{label}</Text>
      <TextInput
        accessibilityLabel={label}
        value={value}
        onChangeText={onChangeText}
        multiline={multiline}
        keyboardType={keyboardType}
        className={`rounded-xl border border-rule px-4 py-3 font-ui text-ink ${multiline ? "min-h-24" : "min-h-12"}`}
      />
    </View>
  );
}

export function SelectField({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
}) {
  return (
    <View className="gap-2">
      <Text className="text-sm font-ui-semibold text-ink">{label}</Text>
      <View className="flex-row flex-wrap gap-2">
        {options.map((option) => (
          <Button
            key={option}
            title={option}
            selected={value === option}
            onPress={() => onChange(option)}
          />
        ))}
      </View>
    </View>
  );
}

export function RelationPicker({
  title,
  rows,
  selectedIds,
  onToggle,
}: {
  title: string;
  rows: { id: string; title: string }[];
  selectedIds: string[];
  onToggle: (id: string) => void;
}) {
  return (
    <View className="gap-2">
      <Text className="font-ui-semibold text-ink">{title}</Text>
      <View className="flex-row flex-wrap gap-2">
        {rows.map((row) => (
          <Button
            key={row.id}
            title={row.title}
            selected={selectedIds.includes(row.id)}
            onPress={() => onToggle(row.id)}
          />
        ))}
      </View>
    </View>
  );
}

export function Button({
  title,
  onPress,
  selected = false,
  disabled = false,
}: {
  title: string;
  onPress: () => void;
  selected?: boolean;
  disabled?: boolean;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected, disabled }}
      disabled={disabled}
      onPress={onPress}
      className={`min-h-10 justify-center rounded-xl border px-4 py-2 ${disabled ? "opacity-50" : ""} ${selected ? "border-tide bg-tide" : "border-rule bg-paper-raised"}`}
    >
      <Text className={selected ? "font-ui-semibold text-on-tide" : "text-ink"}>
        {title}
      </Text>
    </Pressable>
  );
}
