import type { CheerioAPI } from "cheerio";

export interface WinnerEntry {
  year: string;
  name: string;
}

/** Parse "2011 • Name2010 • Name" or line-separated year • winner text. */
export function parseYearWinnerEntries(text: string): WinnerEntry[] {
  const clean = text.replace(/\u00a0/g, " ").replace(/\s+/g, " ").trim();
  if (!/\d{4}\s*•/.test(clean)) return [];

  const segments = clean.split(/(?=\d{4}\s*•)/).map((s) => s.trim()).filter(Boolean);
  const entries: WinnerEntry[] = [];

  for (const seg of segments) {
    const match = seg.match(/^(\d{4})\s*•\s*(.+)$/);
    if (match) {
      entries.push({ year: match[1], name: match[2].trim() });
    }
  }

  return entries;
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export function buildWinnersGridHtml(entries: WinnerEntry[]): string {
  const byYear = new Map<string, WinnerEntry>();
  for (const entry of entries) {
    byYear.set(entry.year, entry);
  }

  const sorted = [...byYear.values()].sort(
    (a, b) => Number(b.year) - Number(a.year)
  );

  const rows = sorted
    .map(({ year, name }) => {
      const highlight = /george attla/i.test(name) ? " attla-winner-row--highlight" : "";
      const muted = /cancelled/i.test(name) ? " attla-winner-row--muted" : "";
      return `<li class="attla-winner-row${highlight}${muted}"><span class="attla-winner-year">${year}</span><span class="attla-winner-name">${escapeHtml(name)}</span></li>`;
    })
    .join("");

  return `<div class="attla-winners" role="region" aria-label="Past winners by year"><ol class="attla-winners-grid">${rows}</ol></div>`;
}

/** Fix broken WordPress tables/lists that jam multiple "YEAR • Winner" entries together. */
export function normalizeWinnerLists(
  $: CheerioAPI,
  $root: ReturnType<CheerioAPI>
): void {
  $root.find("table").each((_, table) => {
    const entries = parseYearWinnerEntries($(table).text());
    if (entries.length >= 8) {
      $(table).replaceWith(buildWinnersGridHtml(entries));
    }
  });

  $root.find("td, p").each((_, el) => {
    const $el = $(el);
    if ($el.closest(".attla-winners").length) return;

    const text = $el.text();
    const yearMarkers = text.match(/\d{4}\s*•/g);
    if (!yearMarkers || yearMarkers.length < 2) return;

    const entries = parseYearWinnerEntries(text);
    if (entries.length >= 2) {
      $el.replaceWith(buildWinnersGridHtml(entries));
    }
  });
}

/** Remove empty headings and unwrap image-only h3 wrappers. */
export function cleanupHeadings($: CheerioAPI, $root: ReturnType<CheerioAPI>): void {
  $root.find("h4").each((_, h) => {
    const $h = $(h);
    if (!$h.text().replace(/\u00a0/g, "").trim() && !$h.find("img").length) {
      $h.remove();
    }
  });

  $root.find("h3").each((_, h) => {
    const $h = $(h);
    const hasImg = $h.find("img").length > 0;
    const text = $h.text().replace(/\u00a0/g, " ").trim();
    if (hasImg && text.length < 3) {
      const $figure = $(`<figure class="attla-hero-figure"></figure>`);
      $figure.append($h.contents());
      $h.replaceWith($figure);
    }
  });
}
