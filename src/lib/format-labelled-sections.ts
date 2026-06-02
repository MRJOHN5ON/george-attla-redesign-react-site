import type { CheerioAPI } from "cheerio";

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function splitSentences(text: string): string[] {
  const parts =
    text.match(/[^.!?]+[.!?]+(?:\s+|$)|[^.!?]+$/g) ?? [text];
  return parts.map((s) => s.trim()).filter(Boolean);
}

/** Turn the FAYSDP “Program Highlights” wall of text into a scannable timeline. */
function buildProgramHighlightsHtml(label: string, plainBody: string): string {
  const sentences = splitSentences(plainBody);
  const intro: string[] = [];
  const items: { label: string; parts: string[] }[] = [];
  const closing: string[] = [];
  let current: { label: string; parts: string[] } | null = null;

  for (const sentence of sentences) {
    if (/^With the help of the community/i.test(sentence)) {
      current = null;
      closing.push(sentence);
      continue;
    }
    if (/^In 2012-2013/i.test(sentence)) {
      current = { label: "2012–2013", parts: [sentence] };
      items.push(current);
      continue;
    }
    if (/^In 2013-2014/i.test(sentence)) {
      current = { label: "2013–2014", parts: [sentence] };
      items.push(current);
      continue;
    }
    if (
      /^Also,/i.test(sentence) ||
      /^It was the first time/i.test(sentence) ||
      /^This young musher won two out of three/i.test(sentence)
    ) {
      if (!current || current.label !== "2014 Arctic Winter Games") {
        current = { label: "2014 Arctic Winter Games", parts: [] };
        items.push(current);
      }
      current.parts.push(sentence);
      continue;
    }
    if (/^This young musher won all three/i.test(sentence)) {
      current?.parts.push(sentence);
      continue;
    }
    if (items.length === 0) {
      intro.push(sentence);
    } else {
      current?.parts.push(sentence) ?? intro.push(sentence);
    }
  }

  const introHtml = intro
    .map((s) => `<p class="attla-highlights-intro">${escapeHtml(s)}</p>`)
    .join("");
  const timelineHtml = items
    .map(
      (item) => `<li class="attla-highlights-item">
        <p class="attla-highlights-year" aria-hidden="true">${escapeHtml(item.label)}</p>
        ${item.parts.map((s) => `<p>${escapeHtml(s)}</p>`).join("")}
      </li>`
    )
    .join("");
  const closingHtml = closing
    .map((s) => `<p class="attla-highlights-close">${escapeHtml(s)}</p>`)
    .join("");

  return `<section class="attla-highlights">
  <h3 class="attla-section-label">${escapeHtml(label)}</h3>
  ${introHtml}
  <ol class="attla-highlights-timeline">${timelineHtml}</ol>
  ${closingHtml}
</section>`;
}

/** Promote “<strong>Label</strong>: body” paragraphs to headings + structured blocks. */
export function formatLabelledParagraphs(
  $: CheerioAPI,
  $root: ReturnType<CheerioAPI>
): void {
  $root.find("p").each((_, el) => {
    const $p = $(el);
    const inner = $p.html()?.trim() ?? "";
    const match = inner.match(/^<strong>([\s\S]*?)<\/strong>\s*:\s*([\s\S]*)$/i);
    if (!match) return;

    const label = $(`<div>${match[1]}</div>`).text().replace(/\u00a0/g, " ").trim();
    const bodyHtml = match[2].trim();
    const plainBody = $(`<div>${bodyHtml}</div>`).text().replace(/\u00a0/g, " ").trim();

    if (!label || !plainBody) return;

    if (label === "Program Highlights" && plainBody.length > 200) {
      $p.replaceWith(buildProgramHighlightsHtml(label, plainBody));
      return;
    }

    if (label.length <= 64) {
      $p.replaceWith(
        `<h3 class="attla-section-label">${escapeHtml(label)}</h3><p>${bodyHtml}</p>`
      );
    }
  });
}
