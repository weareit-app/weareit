import { useState } from "react";
import { View } from "react-native";
import {
  applyRoadmapItemStatusChanges,
  featureStatuses,
  resolveFeatureStatuses,
  type ContentFix,
  type ContentGraph,
  type ContentRoadmapItem,
} from "@it/content/graph-schema";
import { statusCopy } from "../personal/way-row";
import { Text } from "../text";
import { Button, Field, RelationPicker, SelectField } from "./fields";

export type RoadmapContent = Pick<ContentGraph, "roadmapItems" | "fixes">;
// The saved draft's roadmap items and fixes.
type SavedContent = RoadmapContent;

const today = () => new Date().toISOString().slice(0, 10);

// The save is refused here before it reaches the API, which refuses it too.
export function refuseRoadmapStatusChangesWithoutNotes(
  savedItems: readonly ContentRoadmapItem[],
  items: readonly ContentRoadmapItem[],
) {
  const { issues } = applyRoadmapItemStatusChanges(savedItems, items, today());
  if (!issues.length) return null;
  return `Not saved. ${issues
    .map(({ path, message }) => `${path.split(".")[1]}: ${message}`)
    .join(" ")}`;
}

// Drops keys set to undefined, so the draft stays plain JSON.
function withoutUndefined<T extends object>(record: T): T {
  return Object.fromEntries(
    Object.entries(record).filter(([, value]) => value !== undefined),
  ) as T;
}

// A connected fix gives up its own status for its item's.
function connect(fix: ContentFix, itemId: string): ContentFix {
  const {
    featureStatus: _status,
    statusChangedOn: _date,
    statusNote: _note,
    ...rest
  } = fix;
  return { ...rest, roadmapItemId: itemId };
}

// A disconnected fix keeps the status it was showing in the saved draft. One
// connected to this item there keeps the item's status, date and note; one
// connected only in this edit gets back its own saved status.
function disconnect(
  fix: ContentFix,
  item: ContentRoadmapItem,
  saved: SavedContent,
): ContentFix {
  const { roadmapItemId: _item, ...rest } = fix;
  const savedFix = saved.fixes.find(({ id }) => id === fix.id);
  const shown =
    savedFix && savedFix.roadmapItemId !== item.id
      ? resolveFeatureStatuses(saved).find(({ id }) => id === fix.id)
      : undefined;
  return withoutUndefined({
    ...rest,
    featureStatus: shown?.featureStatus ?? item.status,
    statusChangedOn: shown ? shown.statusChangedOn : item.statusChangedOn,
    statusNote: shown ? shown.statusNote : item.statusNote,
  });
}

// Keeps sortOrder 0, 1, 2… in the given order.
function renumber(items: ContentRoadmapItem[]) {
  return items.map((item, sortOrder) => ({ ...item, sortOrder }));
}

// The roadmap items: their copy, status, date and note, their order, and the
// Feature fixes connected to them. A changed status needs a new note before
// the draft saves.
export function RoadmapEditor({
  content,
  saved,
  onChange,
}: {
  content: RoadmapContent;
  saved: SavedContent;
  onChange: (next: RoadmapContent) => void;
}) {
  const [selectedId, setSelectedId] = useState("");
  const items = [...content.roadmapItems].sort(
    (a, b) => a.sortOrder - b.sortOrder,
  );
  const selected = items.find(({ id }) => id === selectedId);
  const savedItems = saved.roadmapItems;
  const isNew = selected && !savedItems.some(({ id }) => id === selected.id);
  const features = content.fixes.filter(({ kind }) => kind === "feature");
  const { issues } = applyRoadmapItemStatusChanges(savedItems, items, today());
  const issue = issues.find(
    ({ path }) => path === `roadmap_item.${selectedId}.statusNote`,
  );

  function updateItem(patch: Partial<ContentRoadmapItem>) {
    if (!selected) return;
    const next = withoutUndefined({ ...selected, ...patch });
    onChange({
      roadmapItems: content.roadmapItems.map((item) =>
        item.id === selected.id ? next : item,
      ),
      // A new item's ID can still change; its fixes follow it.
      fixes:
        patch.id === undefined
          ? content.fixes
          : content.fixes.map((fix) =>
              fix.roadmapItemId === selected.id
                ? { ...fix, roadmapItemId: patch.id }
                : fix,
            ),
    });
    if (patch.id !== undefined) setSelectedId(patch.id);
  }

  function addItem() {
    const baseId = `new-roadmap-item-${Date.now().toString(36)}`;
    let id = baseId;
    let suffix = 2;
    while (items.some((item) => item.id === id)) id = `${baseId}-${suffix++}`;
    onChange({
      ...content,
      roadmapItems: [
        ...items,
        {
          id,
          title: "New roadmap item",
          line: "Describe this work in one line.",
          status: "idea",
          sortOrder: items.length,
        },
      ],
    });
    setSelectedId(id);
  }

  function move(offset: -1 | 1) {
    const index = items.findIndex(({ id }) => id === selectedId);
    const target = index + offset;
    if (index < 0 || target < 0 || target >= items.length) return;
    const next = [...items];
    [next[index], next[target]] = [next[target]!, next[index]!];
    onChange({ ...content, roadmapItems: renumber(next) });
  }

  function removeItem() {
    if (!selected) return;
    onChange({
      roadmapItems: renumber(items.filter(({ id }) => id !== selected.id)),
      fixes: content.fixes.map((fix) =>
        fix.roadmapItemId === selected.id
          ? disconnect(fix, selected, saved)
          : fix,
      ),
    });
    setSelectedId("");
  }

  function toggleFix(fixId: string) {
    if (!selected) return;
    onChange({
      ...content,
      fixes: content.fixes.map((fix) => {
        if (fix.id !== fixId) return fix;
        return fix.roadmapItemId === selected.id
          ? disconnect(fix, selected, saved)
          : connect(fix, selected.id);
      }),
    });
  }

  return (
    <View className="gap-3 rounded-2xl bg-paper-raised p-5">
      <Text className="font-ui-semibold text-ink">Roadmap</Text>
      {items.length ? null : (
        <Text className="text-ink-soft">This draft has no roadmap items.</Text>
      )}
      <View className="flex-row flex-wrap gap-2">
        {items.map((item) => (
          <Button
            key={item.id}
            title={item.title}
            selected={item.id === selectedId}
            onPress={() => setSelectedId(item.id)}
          />
        ))}
        <Button title="Add roadmap item" onPress={addItem} />
      </View>
      {selected ? (
        <View className="gap-3 border-t border-rule pt-3">
          {isNew ? (
            <Field
              label="Stable ID"
              value={selected.id}
              onChangeText={(id) => updateItem({ id })}
            />
          ) : (
            <Text className="text-sm text-ink-soft">
              Stable ID: {selected.id}
            </Text>
          )}
          <Field
            label="Title"
            value={selected.title}
            onChangeText={(title) => updateItem({ title })}
          />
          <Field
            label="One line"
            value={selected.line}
            onChangeText={(line) => updateItem({ line })}
          />
          <SelectField
            label="Status"
            value={statusCopy[selected.status].label}
            options={featureStatuses.map((status) => statusCopy[status].label)}
            onChange={(label) => {
              const status = featureStatuses.find(
                (value) => statusCopy[value].label === label,
              );
              if (status) updateItem({ status });
            }}
          />
          <Field
            label="Status date"
            value={selected.statusChangedOn ?? ""}
            onChangeText={(value) =>
              updateItem({ statusChangedOn: value.trim() || undefined })
            }
          />
          <Field
            label="Status note"
            value={selected.statusNote ?? ""}
            multiline
            onChangeText={(value) =>
              updateItem({ statusNote: value.trim() ? value : undefined })
            }
          />
          {issue ? (
            <Text accessibilityRole="alert" className="text-ink">
              {issue.message}
            </Text>
          ) : null}
          <RelationPicker
            title="Connected Feature fixes (they show this item's status)"
            rows={features}
            selectedIds={features
              .filter(({ roadmapItemId }) => roadmapItemId === selected.id)
              .map(({ id }) => id)}
            onToggle={toggleFix}
          />
          <View className="flex-row flex-wrap gap-2">
            <Button
              title="Move up"
              disabled={items[0]?.id === selected.id}
              onPress={() => move(-1)}
            />
            <Button
              title="Move down"
              disabled={items.at(-1)?.id === selected.id}
              onPress={() => move(1)}
            />
            <Button title="Remove item" onPress={removeItem} />
          </View>
        </View>
      ) : null}
    </View>
  );
}
