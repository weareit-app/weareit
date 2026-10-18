import type { PaletteId } from "@it/watercolor/palettes";
import { useEffect, useRef, useState } from "react";
import { Platform, Pressable, ScrollView, Text, View } from "react-native";
import { useFrameCallback, useSharedValue } from "react-native-reanimated";
import type { WatercolorApproach } from "../approach";
import { AnimatedPaintedOrb } from "../animated-painted-orb";
import { SkiaDot, SkiaDotField, type DotMotion } from "../skia-dot";
import { WatercolorLoader } from "../watercolor-loader";
import { measureWebDownload, type WebDownload } from "./web-download";

// Fidelity proof for spec 007 (US1): the painted orb, Option B and Option E
// side by side, with frame-time and download measurements and the founder's
// verdict. Development builds only.

type Scenario = "one-large" | "thirty-small";
type Verdict = "B" | "E" | "neither";

interface Measurement {
  approach: WatercolorApproach;
  scenario: Scenario;
  device: string;
  frameMsP99: number;
  frameMsMax: number;
  frames: number;
}

const WARMUP_MS = 1000;
const SAMPLE_MS = 10000;
const BIN_MS = 0.5;
const BINS = 400; // up to 200 ms

function device(): string {
  if (Platform.OS === "web")
    return `web: ${globalThis.navigator?.userAgent ?? "unknown browser"}`;
  return `${Platform.OS} ${String(Platform.Version)}`;
}

function Toggle<T extends string>({
  options,
  value,
  onChange,
}: {
  options: readonly { value: T; label: string }[];
  value: T;
  onChange: (v: T) => void;
}) {
  return (
    <View className="flex-row flex-wrap gap-2">
      {options.map((o) => (
        <Pressable
          key={o.value}
          onPress={() => onChange(o.value)}
          accessibilityRole="button"
          accessibilityState={{ selected: o.value === value }}
          className={`min-h-10 justify-center rounded-lg px-4 ${o.value === value ? "bg-tide" : "bg-paper-sunk"}`}
        >
          <Text
            className={
              o.value === value ? "font-ui-semibold text-on-tide" : "text-ink"
            }
          >
            {o.label}
          </Text>
        </Pressable>
      ))}
    </View>
  );
}

function Column({
  title,
  how,
  children,
}: {
  title: string;
  how: string;
  children: React.ReactNode;
}) {
  return (
    <View className="w-56 items-center gap-2">
      {children}
      <Text className="font-ui-semibold text-ink">{title}</Text>
      <Text className="text-center text-sm text-ink-soft">{how}</Text>
    </View>
  );
}

function MeasureScene({
  approach,
  scenario,
}: {
  approach: WatercolorApproach;
  scenario: Scenario;
}) {
  if (scenario === "one-large") {
    return <SkiaDot size={240} approach={approach} motion="bloom-loop" />;
  }
  // Thirty small dots share one canvas (one GPU surface).
  return (
    <SkiaDotField
      columns={6}
      rows={5}
      dotSize={40}
      gap={4}
      approach={approach}
      motion="bloom-loop"
    />
  );
}

function useFrameSampler(
  onDone: (m: { p99: number; max: number; frames: number }) => void,
) {
  const running = useSharedValue(false);
  const started = useSharedValue(0);
  const max = useSharedValue(0);
  const count = useSharedValue(0);
  const hist = useSharedValue<number[]>(new Array(BINS).fill(0));

  useFrameCallback((info) => {
    "worklet";
    if (!running.value) return;
    if (started.value === 0) started.value = info.timestamp;
    const elapsed = info.timestamp - started.value;
    const dt = info.timeSincePreviousFrame;
    if (elapsed < WARMUP_MS || dt === null) return;
    if (elapsed > WARMUP_MS + SAMPLE_MS) {
      running.value = false;
      return;
    }
    max.value = Math.max(max.value, dt);
    count.value += 1;
    const bin = Math.min(Math.floor(dt / BIN_MS), BINS - 1);
    hist.modify((h) => {
      "worklet";
      h[bin] = (h[bin] ?? 0) + 1;
      return h;
    });
  });

  const done = useRef(onDone);
  done.current = onDone;

  return () => {
    max.value = 0;
    count.value = 0;
    started.value = 0;
    hist.value = new Array(BINS).fill(0);
    running.value = true;
    setTimeout(
      () => {
        const h = hist.value;
        const target = count.value * 0.99;
        let seen = 0;
        let p99 = 0;
        for (let i = 0; i < h.length; i += 1) {
          seen += h[i] ?? 0;
          if (seen >= target) {
            p99 = (i + 1) * BIN_MS;
            break;
          }
        }
        done.current({ p99, max: max.value, frames: count.value });
      },
      WARMUP_MS + SAMPLE_MS + 500,
    );
  };
}

export default function LabScreen() {
  const [palette, setPalette] = useState<PaletteId>("it-orb");
  const [motion, setMotion] = useState<DotMotion>("still");
  const [measuring, setMeasuring] = useState<{
    approach: WatercolorApproach;
    scenario: Scenario;
  } | null>(null);
  const [results, setResults] = useState<Measurement[]>([]);
  const [download, setDownload] = useState<WebDownload | null>(null);
  const [verdict, setVerdict] = useState<{
    choice: Verdict;
    date: string;
  } | null>(null);
  const [replay, setReplay] = useState(0);

  const start = useFrameSampler(({ p99, max, frames }) => {
    setResults((r) => [
      ...r.filter(
        (x) =>
          !(
            x.approach === measuring?.approach &&
            x.scenario === measuring?.scenario
          ),
      ),
      {
        approach: measuring!.approach,
        scenario: measuring!.scenario,
        device: device(),
        frameMsP99: Number(p99.toFixed(1)),
        frameMsMax: Number(max.toFixed(1)),
        frames,
      },
    ]);
    setMeasuring(null);
  });

  useEffect(() => {
    if (measuring) start();
    // start only when a new measurement begins
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [measuring]);

  useEffect(() => {
    if (Platform.OS !== "web") return;
    // Wait for the painted dot's atlas to load before reading timings.
    const timer = setTimeout(
      () => void measureWebDownload().then(setDownload),
      4000,
    );
    return () => clearTimeout(timer);
  }, []);

  const report = {
    spec: "007-watercolor-dot",
    device: device(),
    measurements: results,
    webDownload: download,
    verdict,
  };

  const dotMotion: DotMotion = motion;

  return (
    <ScrollView
      className="flex-1 bg-paper"
      contentContainerStyle={{ padding: 20, gap: 24 }}
    >
      <View className="gap-2">
        <Text
          accessibilityRole="header"
          className="font-display text-3xl text-ink"
        >
          Watercolor dot — fidelity proof
        </Text>
        <Text className="text-ink-soft">
          Development only. Is either generated dot “the same family” as the
          painted orb?
        </Text>
      </View>

      <View className="gap-3">
        <Toggle
          options={[
            { value: "it-orb", label: "It palette" },
            { value: "rose-violet", label: "Rose and violet" },
          ]}
          value={palette}
          onChange={setPalette}
        />
        <Toggle
          options={[
            { value: "still", label: "Still" },
            { value: "loader", label: "Loader" },
            { value: "bloom", label: "Bloom once" },
          ]}
          value={
            motion === "bloom-once"
              ? "bloom"
              : motion === "bloom-loop"
                ? "loader"
                : "still"
          }
          onChange={(v) => {
            setMotion(
              v === "bloom"
                ? "bloom-once"
                : v === "loader"
                  ? "bloom-loop"
                  : "still",
            );
            setReplay((n) => n + 1);
          }}
        />
      </View>

      <View className="flex-row flex-wrap justify-center gap-6" key={replay}>
        <Column
          title="Reference — paint"
          how="The hand-painted orb. Never re-colored."
        >
          <AnimatedPaintedOrb
            size={200}
            motion={motion === "still" ? "still" : motion}
          />
        </Column>
        <Column
          title="B — look-alike"
          how="Drawn live from noise: rim, bloom, granulation imitated."
        >
          <SkiaDot
            size={200}
            approach="B"
            palette={palette}
            motion={motion === "bloom-once" ? "bloom-once" : dotMotion}
            seed={3}
          />
        </Column>
        <Column
          title="E — physics-painted"
          how="Painted ahead of time by It's simulation; colored live with pigment optics."
        >
          <SkiaDot
            size={200}
            approach="E"
            palette={palette}
            motion={motion === "bloom-once" ? "bloom-once" : dotMotion}
          />
        </Column>
      </View>

      <View className="gap-3">
        <Text className="text-xl font-ui-semibold text-ink">
          Loader, as shipped
        </Text>
        <Text className="text-ink-soft">
          The real loading state, running until you leave.{" "}
          {Platform.OS === "web"
            ? "On web this is dot B drawn with the browser's WebGL (no Skia)."
            : "On iOS this is the chosen generated dot."}
        </Text>
        <View className="rounded-xl bg-paper py-2">
          <WatercolorLoader />
        </View>
      </View>

      <View className="gap-3">
        <Text className="text-xl font-ui-semibold text-ink">Smoothness</Text>
        <Text className="text-ink-soft">
          Each run takes 11 seconds: 1 s warm-up, then 10 s of frames. Keep the
          screen still.
        </Text>
        <View className="flex-row flex-wrap gap-2">
          {(["B", "E"] as const).flatMap((approach) =>
            (["one-large", "thirty-small"] as const).map((scenario) => (
              <Pressable
                key={`${approach}-${scenario}`}
                disabled={measuring !== null}
                onPress={() => setMeasuring({ approach, scenario })}
                className="min-h-10 justify-center rounded-lg bg-paper-sunk px-4"
              >
                <Text className="text-ink">
                  Measure {approach},{" "}
                  {scenario === "one-large" ? "1 large" : "30 small"}
                </Text>
              </Pressable>
            )),
          )}
        </View>
        {measuring ? (
          <View className="items-center gap-2">
            <Text className="text-ink-soft">Measuring…</Text>
            <MeasureScene
              approach={measuring.approach}
              scenario={measuring.scenario}
            />
          </View>
        ) : null}
        {results.map((r) => (
          <Text key={`${r.approach}-${r.scenario}`} className="text-ink">
            {r.approach}, {r.scenario}: p99 {r.frameMsP99} ms, max{" "}
            {r.frameMsMax} ms ({r.frames} frames){" "}
            {r.frameMsP99 <= 16.7 ? "— meets 60 fps" : "— misses 60 fps"}
          </Text>
        ))}
      </View>

      {Platform.OS === "web" ? (
        <View className="gap-2">
          <Text className="text-xl font-ui-semibold text-ink">
            Web download
          </Text>
          {download ? (
            <>
              {download.items.map((i) => (
                <Text key={i.name} className="text-ink">
                  {i.name}: {(i.bytes / 1024).toFixed(0)} KB
                </Text>
              ))}
              <Text className="font-ui-semibold text-ink">
                Total {(download.totalBytes / 1024).toFixed(0)} KB —{" "}
                {download.fitsBudget
                  ? "fits the 1 MB budget"
                  : "over the 1 MB budget"}
                {download.compressed
                  ? ""
                  : " (uncompressed as served here; production is compressed — canvaskit.wasm is about 3.2 MB gzipped)"}
              </Text>
            </>
          ) : (
            <Text className="text-ink-soft">Measuring…</Text>
          )}
        </View>
      ) : null}

      <View className="gap-3">
        <Text className="text-xl font-ui-semibold text-ink">Verdict</Text>
        <Toggle
          options={[
            { value: "B", label: "B is the same family" },
            { value: "E", label: "E is the same family" },
            { value: "neither", label: "Neither" },
          ]}
          value={verdict?.choice ?? ("" as Verdict)}
          onChange={(choice) =>
            setVerdict({ choice, date: new Date().toISOString().slice(0, 10) })
          }
        />
      </View>

      <View className="gap-2">
        <Text className="text-xl font-ui-semibold text-ink">Results</Text>
        <Text className="text-ink-soft">
          Select and copy into specs/007-watercolor-dot/proof/results.md.
        </Text>
        <Text
          selectable
          className="rounded-lg bg-paper-sunk p-3 font-mono text-xs text-ink"
        >
          {JSON.stringify(report, null, 2)}
        </Text>
      </View>
    </ScrollView>
  );
}
