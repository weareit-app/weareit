/** @jest-environment node */
import { renderToStaticMarkup } from "react-dom/server";
import { StatusBoardBlock } from "./status-board";

const text = (html: string) =>
  html
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();

describe("StatusBoardBlock", () => {
  const html = renderToStaticMarkup(
    <StatusBoardBlock
      block={{
        type: "status-board",
        id: "claims",
        data: {
          title: "Where each claim stands",
          items: [
            {
              label: "People can name what hurts",
              status: "replicated finding",
            },
            {
              label: "Seeing futures helps people act",
              status: "working hypothesis",
              note: "Testing with the explorer.",
            },
            { label: "Habits stick with a plan", status: "replicated finding" },
          ],
        },
      }}
      sources={[]}
    />,
  );

  it("is named by its title", () => {
    expect(html).toMatch(
      /^<section aria-labelledby="claims-title"[^>]*><p id="claims-title"[^>]*>Where each claim stands<\/p>/,
    );
  });

  it("groups cards by status in order of first appearance, with the status in words", () => {
    const groups = [...html.matchAll(/<ul[^>]*>.*?<\/ul>/g)].map(([group]) =>
      text(group),
    );
    expect(groups).toEqual([
      "People can name what hurts Habits stick with a plan",
      "Seeing futures helps people act Testing with the explorer.",
    ]);
    expect(text(html)).toBe(
      "Where each claim stands Replicated finding People can name what hurts Habits stick with a plan Working hypothesis Seeing futures helps people act Testing with the explorer.",
    );
  });

  it("names each group's list by its status", () => {
    expect(html).toMatch(
      /<p id="claims-replicated-finding"[^>]*>Replicated finding<\/p><ul aria-labelledby="claims-replicated-finding"/,
    );
  });
});
