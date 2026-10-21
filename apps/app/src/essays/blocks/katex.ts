import katex from "katex";

// Loaded on demand by the math block, so KaTeX and its stylesheet and fonts
// stay out of every other page's bundle. The stylesheet and fonts are copies
// served from this site (public/katex, refreshed by `pnpm katex:web`).
const stylesheet = "/katex/katex.min.css";

/**
 * KaTeX, once its stylesheet has loaded. Until then its output would show
 * the typeset HTML and the MathML (which the stylesheet hides) side by side,
 * so the math block keeps the TeX until this resolves. It rejects when the
 * stylesheet fails to load, which keeps the TeX for good. Every formula on
 * the page shares this one promise and one <link>.
 */
export const ready = new Promise<typeof katex>((resolve, reject) => {
  const existing = document.querySelector<HTMLLinkElement>(
    `link[href="${stylesheet}"]`,
  );
  if (existing?.sheet) {
    resolve(katex);
    return;
  }
  const link = existing ?? document.createElement("link");
  link.addEventListener("load", () => resolve(katex), { once: true });
  link.addEventListener("error", reject, { once: true });
  if (!existing) {
    link.rel = "stylesheet";
    link.href = stylesheet;
    document.head.appendChild(link);
  }
});
