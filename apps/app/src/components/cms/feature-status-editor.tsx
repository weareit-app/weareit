import { View } from "react-native";
import {
  applyFeatureStatusChanges,
  featureStatuses,
  type ContentFix,
} from "@it/content/graph-schema";
import { statusCopy } from "../personal/way-row";
import { Text } from "../text";
import { Field, SelectField } from "./fields";

type StatusFields = Pick<
  ContentFix,
  "featureStatus" | "statusChangedOn" | "statusNote"
>;

const today = () => new Date().toISOString().slice(0, 10);

// The save is refused here before it reaches the API, which refuses it too.
export function refuseStatusChangesWithoutNotes(
  savedFixes: readonly ContentFix[],
  fixes: readonly ContentFix[],
) {
  const { issues } = applyFeatureStatusChanges(savedFixes, fixes, today());
  if (!issues.length) return null;
  return `Not saved. ${issues
    .map(({ path, message }) => `${path.split(".")[1]}: ${message}`)
    .join(" ")}`;
}

// Each Feature fix's roadmap status, the date it last changed and a note of
// what changed. A changed status needs a new note before the draft saves.
export function FeatureStatusEditor({
  fixes,
  savedFixes,
  onChange,
}: {
  fixes: readonly ContentFix[];
  savedFixes: readonly ContentFix[];
  onChange: (fixId: string, patch: StatusFields) => void;
}) {
  const features = fixes.filter(({ kind }) => kind === "feature");
  const { issues } = applyFeatureStatusChanges(savedFixes, features, today());
  return (
    <View className="gap-3 rounded-2xl bg-paper-raised p-5">
      <Text className="font-ui-semibold text-ink">Feature statuses</Text>
      {features.length ? null : (
        <Text className="text-ink-soft">This draft has no Feature fixes.</Text>
      )}
      {features.map((fix) => {
        const issue = issues.find(
          ({ path }) => path === `fix.${fix.id}.statusNote`,
        );
        return (
          <View key={fix.id} className="gap-2 border-t border-rule pt-3">
            <Text className="font-ui-medium text-ink">{fix.title}</Text>
            <SelectField
              label="Status"
              value={
                fix.featureStatus ? statusCopy[fix.featureStatus].label : ""
              }
              options={featureStatuses.map(
                (status) => statusCopy[status].label,
              )}
              onChange={(label) => {
                const featureStatus = featureStatuses.find(
                  (status) => statusCopy[status].label === label,
                );
                if (featureStatus) onChange(fix.id, { featureStatus });
              }}
            />
            <Field
              label="Status date"
              value={fix.statusChangedOn ?? ""}
              onChangeText={(value) =>
                onChange(fix.id, {
                  statusChangedOn: value.trim() || undefined,
                })
              }
            />
            <Field
              label="Status note"
              value={fix.statusNote ?? ""}
              multiline
              onChangeText={(value) =>
                onChange(fix.id, {
                  statusNote: value.trim() ? value : undefined,
                })
              }
            />
            {issue ? (
              <Text accessibilityRole="alert" className="text-ink">
                {issue.message}
              </Text>
            ) : null}
          </View>
        );
      })}
    </View>
  );
}
