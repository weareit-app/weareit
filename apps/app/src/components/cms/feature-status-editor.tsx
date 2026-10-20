import { View } from "react-native";
import {
  applyFeatureStatusChanges,
  featureStatuses,
  resolveFeatureStatuses,
  type ContentFix,
  type ContentGraph,
} from "@it/content/graph-schema";
import { statusCopy } from "../personal/way-row";
import { Text } from "../text";
import { Field, SelectField } from "./fields";

type StatusFields = Pick<
  ContentFix,
  "featureStatus" | "statusChangedOn" | "statusNote"
>;

const today = () => new Date().toISOString().slice(0, 10);

// The saved draft's fixes and roadmap items. A fix is compared with the status
// it was showing, so one disconnected from its item keeps that status freely.
type SavedContent = Pick<ContentGraph, "fixes" | "roadmapItems">;

// The save is refused here before it reaches the API, which refuses it too.
export function refuseStatusChangesWithoutNotes(
  saved: SavedContent,
  fixes: readonly ContentFix[],
) {
  const { issues } = applyFeatureStatusChanges(
    resolveFeatureStatuses(saved),
    fixes,
    today(),
  );
  if (!issues.length) return null;
  return `Not saved. ${issues
    .map(({ path, message }) => `${path.split(".")[1]}: ${message}`)
    .join(" ")}`;
}

// Each Feature fix's roadmap status, the date it last changed and a note of
// what changed. A changed status needs a new note before the draft saves.
export function FeatureStatusEditor({
  fixes,
  saved,
  onChange,
}: {
  fixes: readonly ContentFix[];
  saved: SavedContent;
  onChange: (fixId: string, patch: StatusFields) => void;
}) {
  // A fix connected to a roadmap item takes its status from the Roadmap section.
  const features = fixes.filter(
    ({ kind, roadmapItemId }) => kind === "feature" && !roadmapItemId,
  );
  const { issues } = applyFeatureStatusChanges(
    resolveFeatureStatuses(saved),
    features,
    today(),
  );
  return (
    <View className="gap-3 rounded-2xl bg-paper-raised p-5">
      <Text className="font-ui-semibold text-ink">Feature statuses</Text>
      {features.length ? null : (
        <Text className="text-ink-soft">
          This draft has no Feature fixes outside roadmap items.
        </Text>
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
