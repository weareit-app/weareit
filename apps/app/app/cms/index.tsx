import { useEffect, useMemo, useState } from "react";
import { TextInput, View } from "react-native";
import { Text } from "../../src/components/text";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient, setCmsToken } from "@it/api/client";
import type { ContentGraph } from "@it/content/graph-schema";
import { Page } from "../../src/components/page";
import {
  Button,
  Field,
  RelationPicker,
  SelectField,
} from "../../src/components/cms/fields";
import {
  FeatureStatusEditor,
  refuseStatusChangesWithoutNotes,
} from "../../src/components/cms/feature-status-editor";
import {
  RoadmapEditor,
  refuseRoadmapStatusChangesWithoutNotes,
} from "../../src/components/cms/roadmap-editor";
import { publishedContentQueryKey } from "../../src/content/use-published-content";

type Kind = "domains" | "pains" | "dreams" | "firstActions";
const cmsQueryKey = ["cms", "draft"] as const;
const versionQueryKey = ["cms", "versions"] as const;

export default function CmsScreen() {
  const queryClient = useQueryClient();
  const [tokenInput, setTokenInput] = useState("");
  const [connected, setConnected] = useState(false);
  const [graph, setGraph] = useState<ContentGraph | null>(null);
  const [kind, setKind] = useState<Kind>("pains");
  const [selectedId, setSelectedId] = useState("");
  const [selectedSourceId, setSelectedSourceId] = useState("");
  const [changeNote, setChangeNote] = useState("Edit onboarding content");
  const [showPreview, setShowPreview] = useState(false);
  const [previewGraph, setPreviewGraph] = useState<ContentGraph | null>(null);
  const [notice, setNotice] = useState("");

  const draftQuery = useQuery({
    queryKey: cmsQueryKey,
    queryFn: () => apiClient.cms.getDraft(),
    enabled: connected,
  });
  const versionsQuery = useQuery({
    queryKey: versionQueryKey,
    queryFn: () => apiClient.cms.listVersions(),
    enabled: connected,
  });
  useEffect(() => {
    if (draftQuery.data) {
      setGraph(draftQuery.data.content);
      setSelectedId(
        (current) => current || draftQuery.data.content[kind][0]?.id || "",
      );
    }
  }, [draftQuery.data]);

  const records = graph?.[kind] ?? [];
  const selected = records.find((record) => record.id === selectedId) as
    ContentGraph[Kind][number] | undefined;
  const selectedProvenance = useMemo(
    () =>
      graph?.provenance.find(
        (item) =>
          item.entityType === entityTypeFor(kind) &&
          item.entityId === selectedId,
      ),
    [graph, kind, selectedId],
  );
  const hasUnsavedChanges = Boolean(
    graph &&
    draftQuery.data &&
    JSON.stringify(graph) !== JSON.stringify(draftQuery.data.content),
  );

  const saveMutation = useMutation({
    mutationFn: async () => {
      if (!graph || !draftQuery.data)
        throw new Error("Load a draft before saving.");
      const refusal = refuseStatusChangesWithoutNotes(
        draftQuery.data.content,
        graph.fixes,
      );
      const itemRefusal = refuseRoadmapStatusChangesWithoutNotes(
        draftQuery.data.content.roadmapItems,
        graph.roadmapItems,
      );
      if (refusal || itemRefusal)
        throw new Error([refusal, itemRefusal].filter(Boolean).join(" "));
      return apiClient.cms.saveDraft({
        expectedRevision: draftQuery.data.revision,
        changeNote,
        content: graph,
      });
    },
    onSuccess: async ({ revision }) => {
      setNotice(`Draft saved as revision ${revision}.`);
      await queryClient.invalidateQueries({ queryKey: cmsQueryKey });
    },
    onError: (error) => setNotice(error.message),
  });
  const validateMutation = useMutation({
    mutationFn: () => apiClient.cms.validateDraft(),
    onSuccess: (result) =>
      setNotice(
        result.valid
          ? "Draft is ready to publish."
          : `${result.issues.length} publishing issue${result.issues.length === 1 ? "" : "s"} found.`,
      ),
    onError: (error) => setNotice(error.message),
  });
  const publishMutation = useMutation({
    mutationFn: () => apiClient.cms.publishDraft(),
    onSuccess: async (result) => {
      setNotice(
        result.published
          ? `Published version ${result.version}.`
          : `${result.issues.length} publishing issue${result.issues.length === 1 ? "" : "s"} found.`,
      );
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: versionQueryKey }),
        queryClient.invalidateQueries({ queryKey: publishedContentQueryKey }),
      ]);
    },
    onError: (error) => setNotice(error.message),
  });
  const previewMutation = useMutation({
    mutationFn: () => {
      if (!graph) throw new Error("Load a draft before previewing.");
      return apiClient.cms.previewDraft({ content: graph });
    },
    onSuccess: (draft) => {
      setPreviewGraph(draft.content);
      setShowPreview(true);
    },
    onError: (error) => setNotice(error.message),
  });
  const rollbackMutation = useMutation({
    mutationFn: (version: number) => apiClient.cms.rollback({ version }),
    onSuccess: async (result) => {
      setNotice(
        `Restored version ${result.version} as a new published version.`,
      );
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: cmsQueryKey }),
        queryClient.invalidateQueries({ queryKey: versionQueryKey }),
        queryClient.invalidateQueries({ queryKey: publishedContentQueryKey }),
      ]);
    },
    onError: (error) => setNotice(error.message),
  });

  function connect() {
    setCmsToken(tokenInput);
    setConnected(true);
    void draftQuery.refetch();
    void versionsQuery.refetch();
  }

  function updateRecord(field: string, value: string) {
    if (!graph || !selectedId) return;
    if (field === "id") {
      setGraph({
        ...graph,
        [kind]: graph[kind].map((record) =>
          record.id === selectedId ? { ...record, id: value } : record,
        ) as never,
        pains:
          kind === "domains"
            ? graph.pains.map((pain) =>
                pain.domainId === selectedId
                  ? { ...pain, domainId: value }
                  : pain,
              )
            : kind === "pains"
              ? graph.pains.map((pain) =>
                  pain.id === selectedId ? { ...pain, id: value } : pain,
                )
              : graph.pains,
        painDreamLinks: graph.painDreamLinks.map((link) => ({
          painId:
            kind === "pains" && link.painId === selectedId
              ? value
              : link.painId,
          dreamId:
            kind === "dreams" && link.dreamId === selectedId
              ? value
              : link.dreamId,
        })),
        fixDreamLinks: graph.fixDreamLinks.map((link) => ({
          ...link,
          dreamId:
            kind === "dreams" && link.dreamId === selectedId
              ? value
              : link.dreamId,
        })),
        actionPainLinks: graph.actionPainLinks.map((link) => ({
          actionId:
            kind === "firstActions" && link.actionId === selectedId
              ? value
              : link.actionId,
          painId:
            kind === "pains" && link.painId === selectedId
              ? value
              : link.painId,
        })),
        provenance: graph.provenance.map((item) => ({
          ...item,
          entityId:
            item.entityType === entityTypeFor(kind) &&
            item.entityId === selectedId
              ? value
              : item.entityId,
        })),
      });
      setSelectedId(value);
      return;
    }
    setGraph({
      ...graph,
      [kind]: graph[kind].map((record) => {
        if (record.id !== selectedId) return record;
        if (kind === "firstActions" && field === "effortMinutes")
          return { ...record, effortMinutes: Number(value) || 1 };
        if (kind === "domains" && field === "scope")
          return { ...record, scope: value === "world" ? "world" : "personal" };
        if (kind === "firstActions" && field === "evidence")
          return {
            ...record,
            evidence: value === "practical" ? "practical" : "candidate",
          };
        if (
          kind === "firstActions" &&
          field === "safetyNote" &&
          !value.trim()
        ) {
          const { safetyNote: _safetyNote, ...withoutSafetyNote } =
            record as ContentGraph["firstActions"][number];
          return withoutSafetyNote;
        }
        return { ...record, [field]: value };
      }) as never,
    });
  }

  function addRecord() {
    if (!graph) return;
    if (kind === "pains" && graph.domains.length === 0) {
      setNotice("Add a domain before adding a pain.");
      return;
    }
    const collection = graph[kind];
    const baseId = `new-${kind === "firstActions" ? "action" : kind.slice(0, -1)}-${Date.now().toString(36)}`;
    let id = baseId;
    let suffix = 2;
    while (collection.some((item) => item.id === id))
      id = `${baseId}-${suffix++}`;
    const sortOrder =
      collection.reduce(
        (maximum, item) =>
          Math.max(maximum, (item as { sortOrder: number }).sortOrder),
        -1,
      ) + 1;
    const defaults = {
      domains: {
        id,
        scope: "personal" as const,
        title: "New domain",
        sortOrder,
      },
      pains: {
        id,
        domainId: graph.domains[0]!.id,
        title: "New pain",
        description: "Describe this concern.",
        sortOrder,
      },
      dreams: {
        id,
        title: "New desired future",
        description: "Describe the future people want.",
        sortOrder,
      },
      firstActions: {
        id,
        title: "New first action",
        description: "Describe a practical way to begin.",
        firstStep: "Describe the first step.",
        effortMinutes: 15,
        evidence: "candidate" as const,
        sortOrder,
      },
    };
    const entityType = entityTypeFor(kind);
    const nextGraph = {
      ...graph,
      [kind]: [...graph[kind], defaults[kind]],
      provenance: graph.sources.length
        ? [
            ...graph.provenance,
            {
              entityType,
              entityId: id,
              sourceId: graph.sources[0]!.id,
              locator: "Add a specific source locator before publishing.",
              evidenceType: "Product curation",
              rights: kind === "firstActions" ? "CC-BY-SA-4.0" : "CC0-1.0",
              reviewStatus: "unreviewed" as const,
            },
          ]
        : graph.provenance,
    } as ContentGraph;
    setGraph(nextGraph);
    setSelectedId(id);
    setNotice(
      "Added a draft record. Update its ID, copy, and provenance before publishing.",
    );
  }

  function addSource() {
    if (!graph) return;
    const baseId = `new-source-${Date.now().toString(36)}`;
    let id = baseId;
    let suffix = 2;
    while (graph.sources.some((source) => source.id === id))
      id = `${baseId}-${suffix++}`;
    setGraph({
      ...graph,
      sources: [
        ...graph.sources,
        {
          id,
          title: "New source",
          documentPath: "",
          sourceType: "content_spec",
          rights: "Add source rights and attribution details.",
        },
      ],
    });
    setSelectedSourceId(id);
  }

  function updateSource(field: string, value: string) {
    if (!graph || !selectedSourceId) return;
    setGraph({
      ...graph,
      sources: graph.sources.map((source) =>
        source.id === selectedSourceId ? { ...source, [field]: value } : source,
      ) as ContentGraph["sources"],
    });
  }

  function deleteSource() {
    if (!graph || !selectedSourceId) return;
    if (graph.provenance.some((item) => item.sourceId === selectedSourceId)) {
      setNotice(
        "This source is referenced by provenance. Reassign those records before deleting it.",
      );
      return;
    }
    setGraph({
      ...graph,
      sources: graph.sources.filter(({ id }) => id !== selectedSourceId),
    });
    setSelectedSourceId("");
  }

  function deleteSelectedRecord() {
    if (!graph || !selected) return;
    const removeIds = new Set([selectedId]);
    if (kind === "domains") {
      for (const pain of graph.pains)
        if (pain.domainId === selectedId) removeIds.add(pain.id);
    }
    const painsToRemove =
      kind === "pains"
        ? removeIds
        : kind === "domains"
          ? new Set(
              graph.pains
                .filter((pain) => removeIds.has(pain.id))
                .map(({ id }) => id),
            )
          : new Set<string>();
    const nextGraph: ContentGraph = {
      ...graph,
      domains:
        kind === "domains"
          ? graph.domains.filter(({ id }) => id !== selectedId)
          : graph.domains,
      pains:
        kind === "pains"
          ? graph.pains.filter(({ id }) => id !== selectedId)
          : kind === "domains"
            ? graph.pains.filter(({ domainId }) => domainId !== selectedId)
            : graph.pains,
      dreams:
        kind === "dreams"
          ? graph.dreams.filter(({ id }) => id !== selectedId)
          : graph.dreams,
      firstActions:
        kind === "firstActions"
          ? graph.firstActions.filter(({ id }) => id !== selectedId)
          : graph.firstActions,
      painDreamLinks: graph.painDreamLinks.filter(
        ({ painId, dreamId }) =>
          !(kind === "dreams" && dreamId === selectedId) &&
          !painsToRemove.has(painId),
      ),
      actionPainLinks: graph.actionPainLinks.filter(
        ({ actionId, painId }) =>
          !(kind === "firstActions" && actionId === selectedId) &&
          !painsToRemove.has(painId),
      ),
      provenance: graph.provenance.filter(
        ({ entityType, entityId }) =>
          !(entityType === entityTypeFor(kind) && removeIds.has(entityId)) &&
          !(
            kind === "domains" &&
            entityType === "pain" &&
            painsToRemove.has(entityId)
          ),
      ),
    };
    setGraph(nextGraph);
    setSelectedId(nextGraph[kind][0]?.id ?? "");
    setNotice(
      `Removed ${selectedId} from this draft. Save to record the change.`,
    );
  }

  function toggleRelation(targetKind: "dream" | "pain", targetId: string) {
    if (!graph || !selectedId) return;
    if (kind === "pains") {
      const exists = graph.painDreamLinks.some(
        (link) => link.painId === selectedId && link.dreamId === targetId,
      );
      setGraph({
        ...graph,
        painDreamLinks: exists
          ? graph.painDreamLinks.filter(
              (link) =>
                !(link.painId === selectedId && link.dreamId === targetId),
            )
          : [
              ...graph.painDreamLinks,
              { painId: selectedId, dreamId: targetId },
            ],
      });
    } else if (kind === "dreams") {
      const exists = graph.painDreamLinks.some(
        (link) => link.dreamId === selectedId && link.painId === targetId,
      );
      setGraph({
        ...graph,
        painDreamLinks: exists
          ? graph.painDreamLinks.filter(
              (link) =>
                !(link.dreamId === selectedId && link.painId === targetId),
            )
          : [
              ...graph.painDreamLinks,
              { painId: targetId, dreamId: selectedId },
            ],
      });
    } else if (kind === "firstActions") {
      const exists = graph.actionPainLinks.some(
        (link) => link.actionId === selectedId && link.painId === targetId,
      );
      setGraph({
        ...graph,
        actionPainLinks: exists
          ? graph.actionPainLinks.filter(
              (link) =>
                !(link.actionId === selectedId && link.painId === targetId),
            )
          : [
              ...graph.actionPainLinks,
              { actionId: selectedId, painId: targetId },
            ],
      });
    }
  }

  function updateProvenance(
    field: "sourceId" | "locator" | "evidenceType" | "rights" | "reviewStatus",
    value: string,
  ) {
    if (!graph || !selected) return;
    const entityType = entityTypeFor(kind);
    const index = graph.provenance.findIndex(
      (item) => item.entityType === entityType && item.entityId === selectedId,
    );
    const next = [...graph.provenance];
    if (index < 0) {
      next.push({
        entityType,
        entityId: selectedId,
        sourceId: selectedSourceId || graph.sources[0]?.id || "",
        locator: "",
        evidenceType: "Product curation",
        rights: "CC0-1.0",
        reviewStatus: "unreviewed",
        [field]: value,
      } as ContentGraph["provenance"][number]);
    } else {
      next[index] = {
        ...next[index]!,
        [field]: value,
      } as ContentGraph["provenance"][number];
    }
    setGraph({ ...graph, provenance: next });
  }

  if (!connected) {
    return (
      <Page
        brand
        eyebrow="Authoring"
        title="CMS"
        description="Connect with the CMS administrator token configured for the API server."
      >
        <View className="gap-3 rounded-3xl bg-paper-raised p-5">
          <TextInput
            secureTextEntry
            value={tokenInput}
            onChangeText={setTokenInput}
            placeholder="CMS admin token"
            autoCapitalize="none"
            className="min-h-12 rounded-xl border border-rule px-4 font-ui text-ink"
          />
          <Button title="Connect" onPress={connect} />
        </View>
      </Page>
    );
  }

  if (draftQuery.isLoading || !graph || !draftQuery.data) {
    return (
      <Page
        brand
        eyebrow="Authoring"
        title="CMS"
        description={draftQuery.error?.message ?? "Loading the current draft…"}
      >
        <Button
          title="Reload draft"
          onPress={() => void draftQuery.refetch()}
        />
        {draftQuery.error ? (
          <Button
            title="Change admin token"
            onPress={() => {
              setCmsToken(null);
              setConnected(false);
              setTokenInput("");
            }}
          />
        ) : null}
      </Page>
    );
  }

  if (showPreview) {
    if (!previewGraph) {
      return (
        <Page
          brand
          eyebrow="Authoring"
          title="Onboarding preview"
          description="Preparing this draft preview…"
        >
          <Button
            title="Back to editing"
            onPress={() => setShowPreview(false)}
          />
        </Page>
      );
    }
    return (
      <Page
        brand
        eyebrow={`Draft revision ${draftQuery.data.revision}`}
        title="Onboarding preview"
        description="This preview uses draft content and does not publish it."
      >
        {previewGraph.domains.map((domain) => (
          <View
            key={domain.id}
            className="gap-2 rounded-2xl bg-paper-raised p-4"
          >
            <Text className="font-ui-semibold text-ink">
              {domain.scope === "personal" ? "Personal" : "World"} ·{" "}
              {domain.title}
            </Text>
            {previewGraph.pains
              .filter(({ domainId }) => domainId === domain.id)
              .map((pain) => {
                const dreamIds = previewGraph.painDreamLinks
                  .filter((link) => link.painId === pain.id)
                  .map((link) => link.dreamId);
                const actions = previewGraph.firstActions.filter((action) =>
                  previewGraph.actionPainLinks.some(
                    (link) =>
                      link.actionId === action.id && link.painId === pain.id,
                  ),
                );
                return (
                  <View
                    key={pain.id}
                    className="gap-1 border-t border-rule pt-2"
                  >
                    <Text className="font-ui-medium text-ink">
                      {pain.title} — {pain.description}
                    </Text>
                    <Text className="text-sm text-ink-soft">
                      Possible futures:{" "}
                      {previewGraph.dreams
                        .filter((dream) => dreamIds.includes(dream.id))
                        .map((dream) => dream.title)
                        .join(", ") || "none linked"}
                    </Text>
                    <Text className="text-sm text-ink-soft">
                      First actions:{" "}
                      {actions.map((action) => action.title).join(", ") ||
                        "none linked"}
                    </Text>
                  </View>
                );
              })}
          </View>
        ))}
        <Button title="Back to editing" onPress={() => setShowPreview(false)} />
      </Page>
    );
  }

  return (
    <Page
      brand
      eyebrow={`Draft revision ${draftQuery.data.revision}`}
      title="CMS"
      description="Edit structured onboarding content, validate its sources and links, preview, then publish a versioned snapshot."
    >
      <View className="flex-row flex-wrap gap-2">
        {(["domains", "pains", "dreams", "firstActions"] as const).map(
          (value) => (
            <Button
              key={value}
              title={labelForKind(value)}
              selected={kind === value}
              onPress={() => {
                setKind(value);
                setSelectedId(graph[value][0]?.id ?? "");
              }}
            />
          ),
        )}
      </View>
      <View className="flex-row flex-wrap gap-2">
        <Button
          title={`Add ${labelForKind(kind).toLowerCase()}`}
          onPress={addRecord}
        />
        <Button
          title="Delete selected"
          disabled={!selected}
          onPress={deleteSelectedRecord}
        />
      </View>
      <View className="gap-3 rounded-2xl bg-paper-raised p-5">
        <Text className="font-ui-semibold text-ink">Sources</Text>
        <View className="flex-row flex-wrap gap-2">
          {graph.sources.map((source) => (
            <Button
              key={source.id}
              title={source.id}
              selected={source.id === selectedSourceId}
              onPress={() => setSelectedSourceId(source.id)}
            />
          ))}
          <Button title="Add source" onPress={addSource} />
          <Button
            title="Delete selected source"
            disabled={!selectedSourceId}
            onPress={deleteSource}
          />
        </View>
        {graph.sources.find(({ id }) => id === selectedSourceId) ? (
          <>
            <Text className="text-sm text-ink-soft">
              Stable ID: {selectedSourceId}
            </Text>
            <Field
              label="Title"
              value={
                graph.sources.find(({ id }) => id === selectedSourceId)!.title
              }
              onChangeText={(value) => updateSource("title", value)}
            />
            <Field
              label="Document path or URL"
              value={
                graph.sources.find(({ id }) => id === selectedSourceId)!
                  .documentPath
              }
              onChangeText={(value) => updateSource("documentPath", value)}
            />
            <SelectField
              label="Source type"
              value={
                graph.sources.find(({ id }) => id === selectedSourceId)!
                  .sourceType
              }
              options={["research_registry", "content_spec", "fix_corpus"]}
              onChange={(value) => updateSource("sourceType", value)}
            />
            <Field
              label="Source rights"
              value={
                graph.sources.find(({ id }) => id === selectedSourceId)!.rights
              }
              onChangeText={(value) => updateSource("rights", value)}
            />
          </>
        ) : null}
      </View>
      <RoadmapEditor
        content={graph}
        savedItems={draftQuery.data.content.roadmapItems}
        onChange={({ roadmapItems, fixes }) =>
          setGraph({ ...graph, roadmapItems, fixes })
        }
      />
      <FeatureStatusEditor
        fixes={graph.fixes}
        saved={draftQuery.data.content}
        onChange={(fixId, patch) =>
          setGraph({
            ...graph,
            fixes: graph.fixes.map((fix) => {
              if (fix.id !== fixId) return fix;
              const next = { ...fix, ...patch };
              for (const key of Object.keys(patch) as (keyof typeof patch)[])
                if (next[key] === undefined) delete next[key];
              return next;
            }),
          })
        }
      />
      <View className="flex-row flex-wrap gap-2">
        {records.map((record) => (
          <Button
            key={record.id}
            title={record.id}
            selected={record.id === selectedId}
            onPress={() => setSelectedId(record.id)}
          />
        ))}
      </View>
      {selected ? (
        <View className="gap-4 rounded-3xl bg-paper-raised p-5">
          <Field
            label="Stable ID"
            value={selected.id}
            onChangeText={(value) => updateRecord("id", value)}
          />
          <Field
            label="Title"
            value={selected.title}
            onChangeText={(value) => updateRecord("title", value)}
          />
          {"description" in selected ? (
            <Field
              label="Description"
              value={selected.description}
              multiline
              onChangeText={(value) => updateRecord("description", value)}
            />
          ) : null}
          {kind === "domains" ? (
            <SelectField
              label="Scope"
              value={(selected as ContentGraph["domains"][number]).scope}
              options={["personal", "world"]}
              onChange={(value) => updateRecord("scope", value)}
            />
          ) : null}
          {kind === "pains" ? (
            <SelectField
              label="Domain"
              value={(selected as ContentGraph["pains"][number]).domainId}
              options={graph.domains.map(({ id }) => id)}
              onChange={(value) => updateRecord("domainId", value)}
            />
          ) : null}
          {kind === "firstActions" ? (
            <>
              <Field
                label="First step"
                value={
                  (selected as ContentGraph["firstActions"][number]).firstStep
                }
                multiline
                onChangeText={(value) => updateRecord("firstStep", value)}
              />
              <Field
                label="Effort in minutes"
                value={String(
                  (selected as ContentGraph["firstActions"][number])
                    .effortMinutes,
                )}
                onChangeText={(value) => updateRecord("effortMinutes", value)}
                keyboardType="number-pad"
              />
              <SelectField
                label="Evidence"
                value={
                  (selected as ContentGraph["firstActions"][number]).evidence
                }
                options={["candidate", "practical"]}
                onChange={(value) => updateRecord("evidence", value)}
              />
              <Field
                label="Safety note"
                value={
                  (selected as ContentGraph["firstActions"][number])
                    .safetyNote ?? ""
                }
                multiline
                onChangeText={(value) => updateRecord("safetyNote", value)}
              />
            </>
          ) : null}
          {kind === "pains" ? (
            <RelationPicker
              title="Related dreams"
              rows={graph.dreams}
              selectedIds={graph.painDreamLinks
                .filter(({ painId }) => painId === selectedId)
                .map(({ dreamId }) => dreamId)}
              onToggle={(id) => toggleRelation("dream", id)}
            />
          ) : null}
          {kind === "dreams" ? (
            <RelationPicker
              title="Related pains"
              rows={graph.pains}
              selectedIds={graph.painDreamLinks
                .filter(({ dreamId }) => dreamId === selectedId)
                .map(({ painId }) => painId)}
              onToggle={(id) => toggleRelation("pain", id)}
            />
          ) : null}
          {kind === "firstActions" ? (
            <RelationPicker
              title="Related pains"
              rows={graph.pains}
              selectedIds={graph.actionPainLinks
                .filter(({ actionId }) => actionId === selectedId)
                .map(({ painId }) => painId)}
              onToggle={(id) => toggleRelation("pain", id)}
            />
          ) : null}
          <View className="gap-2 border-t border-rule pt-4">
            <Text className="font-ui-semibold text-ink">Source and rights</Text>
            <SelectField
              label="Source"
              value={selectedProvenance?.sourceId ?? graph.sources[0]?.id ?? ""}
              options={graph.sources.map(({ id }) => id)}
              onChange={(value) => updateProvenance("sourceId", value)}
            />
            <Field
              label="Source locator"
              value={selectedProvenance?.locator ?? ""}
              multiline
              onChangeText={(value) => updateProvenance("locator", value)}
            />
            <Field
              label="Evidence type"
              value={selectedProvenance?.evidenceType ?? "Product curation"}
              onChangeText={(value) => updateProvenance("evidenceType", value)}
            />
            <SelectField
              label="Rights"
              value={selectedProvenance?.rights ?? "CC0-1.0"}
              options={["CC0-1.0", "CC-BY-SA-4.0"]}
              onChange={(value) => updateProvenance("rights", value)}
            />
            <SelectField
              label="Review"
              value={selectedProvenance?.reviewStatus ?? "unreviewed"}
              options={["unreviewed", "reviewed", "approved"]}
              onChange={(value) => updateProvenance("reviewStatus", value)}
            />
          </View>
        </View>
      ) : (
        <Text className="text-ink-soft">
          This draft has no {labelForKind(kind).toLowerCase()}.
        </Text>
      )}
      <Field
        label="Change note"
        value={changeNote}
        onChangeText={setChangeNote}
      />
      <View className="flex-row flex-wrap gap-2">
        <Button
          title={saveMutation.isPending ? "Saving…" : "Save draft"}
          onPress={() => saveMutation.mutate()}
        />
        <Button
          title="Validate"
          disabled={hasUnsavedChanges}
          onPress={() => validateMutation.mutate()}
        />
        <Button
          title={previewMutation.isPending ? "Preparing preview…" : "Preview"}
          onPress={() => previewMutation.mutate()}
        />
        <Button
          title={publishMutation.isPending ? "Publishing…" : "Publish"}
          disabled={hasUnsavedChanges || publishMutation.isPending}
          onPress={() => publishMutation.mutate()}
        />
      </View>
      {notice ? (
        <Text accessibilityRole="alert" className="text-ink">
          {notice}
        </Text>
      ) : null}
      <View className="gap-3 rounded-2xl bg-paper-raised p-5">
        <Text className="font-ui-semibold text-ink">Published versions</Text>
        {versionsQuery.data?.map((version) => (
          <View
            key={version.version}
            className="flex-row flex-wrap items-center justify-between gap-2"
          >
            <Text className="text-ink-soft">
              Version {version.version} · revision {version.source_revision}
            </Text>
            <Button
              title="Restore"
              onPress={() => rollbackMutation.mutate(version.version)}
            />
          </View>
        ))}
      </View>
    </Page>
  );
}

function entityTypeFor(
  kind: Kind,
): ContentGraph["provenance"][number]["entityType"] {
  return kind === "firstActions"
    ? "first_action"
    : kind === "domains"
      ? "domain"
      : kind === "pains"
        ? "pain"
        : "dream";
}

function labelForKind(kind: Kind) {
  return kind === "firstActions"
    ? "First actions"
    : kind[0]!.toUpperCase() + kind.slice(1);
}
