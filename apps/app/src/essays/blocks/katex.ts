// Loaded on demand by the maths block, so KaTeX and its stylesheet and fonts
// stay out of every other page's bundle. The stylesheet and fonts are copies
// served from this site (public/katex, refreshed by `pnpm katex:web`).
const stylesheet = "/katex/katex.min.css";

if (!document.querySelector(`link[href="${stylesheet}"]`)) {
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = stylesheet;
  document.head.appendChild(link);
}

export { default as katex } from "katex";
