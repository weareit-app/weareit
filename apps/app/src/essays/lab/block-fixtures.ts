import {
  blockSchemas,
  essaySourceSchema,
  type EssayBlockOf,
} from "@it/content/essay-schema";

// Sample blocks for the essay-blocks lab and the block tests, parsed by the
// content schemas as the essay build would, so a fixture that drifts from a
// schema fails. The chart figures are placeholders with a placeholder source,
// not sourced facts.

export const sourcesFixture = [
  essaySourceSchema.parse({
    id: "placeholder-counts",
    title: "Placeholder incident counts",
    publisher: "the essay-blocks lab",
    url: "https://example.org/placeholder-counts",
  }),
  essaySourceSchema.parse({
    id: "implementation-intentions",
    title: "Implementation intentions and goal achievement: a meta-analysis",
    publisher: "Gollwitzer and Sheeran",
    url: "https://doi.org/10.1016/S0065-2601(06)38002-1",
    date: "2006",
  }),
];

export const evidenceFixture: EssayBlockOf<"evidence"> = {
  type: "evidence",
  id: "plans-help",
  data: blockSchemas.evidence.parse({
    claim:
      "People keep a new habit more often when they plan when and where they will do it.",
    source: "implementation-intentions",
    date: "2006-03-15",
    status: "replicated finding",
    limitation:
      "Most studies were short and measured intentions in students, not lasting change.",
  }),
};

export const chartFixture: EssayBlockOf<"chart"> = {
  type: "chart",
  id: "incidents",
  data: blockSchemas.chart.parse({
    title: "Reported AI incidents per year",
    description:
      "Reported AI incidents rose every year from 2019 to 2023, from 41 to 123.",
    source: "placeholder-counts",
    unit: "incidents reported",
    timeframe: "2019–2023",
    population: "Incidents submitted to and accepted by the database",
    uncertainty: "Counts depend on what people report, so they undercount.",
    updated: "2026-09-30",
    columns: [
      { key: "year", label: "Year" },
      { key: "incidents", label: "Incidents reported" },
    ],
    data: [
      { year: 2019, incidents: 41 },
      { year: 2020, incidents: 58 },
      { year: 2021, incidents: 82 },
      { year: 2022, incidents: 97 },
      { year: 2023, incidents: 123 },
    ],
    spec: {
      mark: "bar",
      encoding: {
        x: { field: "year", type: "ordinal", title: "Year" },
        y: {
          field: "incidents",
          type: "quantitative",
          title: "Incidents reported",
        },
      },
    },
  }),
};

export const tableFixture: EssayBlockOf<"table"> = {
  type: "table",
  id: "licenses",
  data: blockSchemas.table.parse({
    caption: "Licenses for each part of It",
    columns: [
      { key: "part", label: "Part" },
      { key: "license", label: "License" },
      { key: "status", label: "Status" },
    ],
    rows: [
      { part: "App code", license: "AGPL-3.0", status: "today" },
      { part: "Content", license: "CC BY-SA 4.0", status: "planned" },
    ],
  }),
};

const chart = chartFixture.data;
export const tableWithContextFixture: EssayBlockOf<"table"> = {
  type: "table",
  id: "incidents-table",
  data: blockSchemas.table.parse({
    caption: "Reported AI incidents per year",
    columns: chart.columns,
    rows: chart.data,
    source: chart.source,
    unit: chart.unit,
    timeframe: chart.timeframe,
    population: chart.population,
    uncertainty: chart.uncertainty,
    updated: chart.updated,
  }),
};
