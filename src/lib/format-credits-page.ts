import type { CheerioAPI } from "cheerio";

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function splitContributorNames(listText: string): string[] {
  return listText
    .replace(/\s+and\s+/gi, ", ")
    .split(",")
    .map((n) => n.trim())
    .filter((n) => n.length > 1);
}

function parseProfessionalThanks(plain: string): { name: string; role: string; detail: string }[] {
  const match = plain.match(
    /following professionals who gave[^:]*:\s*([\s\S]+)/i
  );
  if (!match) return [];

  const body = match[1].trim();
  const chunks = body.split(
    /\s*;\s*(?=to |A very special thanks|Last but not least)/i
  );

  return chunks.map((chunk) => {
    let text = chunk.trim();
    if (/^to /i.test(text)) text = text.replace(/^to /i, "");
    if (/^A very special thanks to /i.test(text)) {
      text = text.replace(/^A very special thanks to /i, "");
    }
    if (/^Last but not least, a thanks to /i.test(text)) {
      text = text.replace(/^Last but not least, a thanks to /i, "");
    }

    const forIdx = text.search(/,\s*for\s+/i);
    if (forIdx === -1) {
      const comma = text.indexOf(",");
      const name = comma > 0 ? text.slice(0, comma).trim() : text;
      return { name, role: "", detail: text.slice(comma + 1).trim() };
    }

    const namePart = text.slice(0, forIdx).trim();
    const detail = text.slice(forIdx).replace(/^,\s*for\s+/i, "").trim();
    const comma = namePart.lastIndexOf(",");
    if (comma > 0 && comma < namePart.length - 3) {
      return {
        name: namePart.slice(0, comma).trim(),
        role: namePart.slice(comma + 1).trim(),
        detail,
      };
    }
    return { name: namePart, role: "", detail };
  });
}

function buildHomepageExceptionsHtml(): string {
  const items = [
    {
      label: "“What is the Making of a Champion Mindset?” (homepage)",
      credit: "1982.02- Smith, Kirby of George Attla run of Rondy",
    },
    {
      label: "“Focus on your goal” (homepage)",
      credit:
        "1988.03-Courtesy of Fairbanks Daily News-Miner of George Attla running ONAC",
    },
    {
      label: "“Visit a dog mushing museum” (watercolor)",
      credit: "2012.01- Sutton, Iris of Yukon Quest sled dogs",
    },
  ];

  const list = items
    .map(
      (item) => `<li>
        <p class="attla-credits-exception-label">${escapeHtml(item.label)}</p>
        <p class="attla-credits-exception-credit">${escapeHtml(item.credit)}</p>
      </li>`
    )
    .join("");

  return `<section class="attla-credits-exceptions">
  <p class="attla-credits-lead">Most image, text, and video credits appear on the pages where the material is shown. These homepage images are the main exceptions:</p>
  <ul class="attla-credits-exception-list">${list}</ul>
</section>`;
}

/** Restructure the Credits page for scanning (same wording, clearer layout). */
export function formatCreditsPage(
  $: CheerioAPI,
  $root: ReturnType<CheerioAPI>,
  pagePath: string
): void {
  if (!pagePath.includes("credits-2")) return;

  $root.addClass("attla-credits-page");

  // Homepage exceptions (first content paragraph)
  $root.find("p").each((_, el) => {
    const $p = $(el);
    const text = $p.text();
    if (text.includes("The following are exceptions")) {
      $p.replaceWith(buildHomepageExceptionsHtml());
      return false;
    }
  });

  $root.find("h2").each((_, el) => {
    const $h = $(el);
    if ($h.text().trim().toUpperCase() === "THANK YOU!") {
      $h.replaceWith('<h2 class="attla-credits-thanks-title">Thank you</h2>');
    }
  });

  // Intro + contact
  $root.find("p").each((_, el) => {
    const $p = $(el);
    const text = $p.text().trim();
    if (
      text.startsWith("A tremendous number of people helped make this web site")
    ) {
      const $contact = $p.find('a[href*="contact"]').first().clone();
      $p.find('a[href*="contact"]').remove();
      $p.find("strong").remove();
      const introHtml = $p.html()?.trim() ?? escapeHtml(text);
      const contactHtml =
        $contact.prop("outerHTML") ??
        '<a href="/contact-2">Contact Kathy Turco</a>';
      $p.replaceWith(`<section class="attla-credits-intro">
  <p>${introHtml}</p>
  <p class="attla-credits-contact">Found an error? ${contactHtml}</p>
</section>`);
      return false;
    }
  });

  // Collect sidebar figures, then place in a photo grid
  const figures: string[] = [];
  $root.find("figure.wp-caption").each((_, fig) => {
    figures.push($(fig).prop("outerHTML") ?? "");
    $(fig).remove();
  });

  if (figures.length > 0) {
    const grid = `<div class="attla-credits-photo-grid">${figures.join("")}</div>`;
    $root.find(".attla-credits-thanks-title").after(grid);
  }

  // George Attla callout
  $root.find("p").each((_, el) => {
    const $p = $(el);
    if ($p.text().includes("very special thanks goes to George Attla")) {
      $p.replaceWith(
        `<section class="attla-credits-callout attla-credits-callout--george">
  <h3 class="attla-section-label">George Attla</h3>
  <p>${$p.html()}</p>
</section>`
      );
      return false;
    }
  });

  // Professional thanks → cards
  $root.find("p").each((_, el) => {
    const $p = $(el);
    const plain = $p.text().replace(/\u00a0/g, " ").trim();
    if (plain.includes("following professionals who gave")) {
      const cards = parseProfessionalThanks(plain)
        .map((entry) => {
          const title = [entry.name, entry.role].filter(Boolean).join(" · ");
          return `<article class="attla-credits-team-card">
            <h4 class="attla-credits-team-name">${escapeHtml(title)}</h4>
            <p>${escapeHtml(entry.detail)}</p>
          </article>`;
        })
        .join("");

      $p.replaceWith(`<section class="attla-credits-team">
  <h3 class="attla-section-label">Project professionals</h3>
  <p class="attla-credits-lead">In-kind time and expertise that made the archive possible:</p>
  <div class="attla-credits-team-grid">${cards}</div>
</section>`);
      return false;
    }
  });

  // Contributor name list
  $root.find("p").each((_, el) => {
    const $p = $(el);
    const plain = $p.text().replace(/\u00a0/g, " ").trim();
    if (plain.startsWith("For gathering articles, print, photos")) {
      const namesText = plain.replace(/^For gathering articles[^,]+,\s*a thanks to\s*/i, "");
      const names = splitContributorNames(namesText.replace(/\.\s*$/, ""));
      const chips = names
        .map((n) => `<li>${escapeHtml(n)}</li>`)
        .join("");
      $p.replaceWith(`<section class="attla-credits-contributors">
  <h3 class="attla-section-label">Content contributors</h3>
  <p class="attla-credits-lead">Thank you to everyone who helped gather articles, print, photos, video, audio, and more:</p>
  <ul class="attla-credits-name-grid">${chips}</ul>
</section>`);
      return false;
    }
  });

  // Archives & publications
  $root.find("p").each((_, el) => {
    const $p = $(el);
    const plain = $p.text().replace(/\u00a0/g, " ").trim();
    if (plain.startsWith("For published archival photos")) {
      const html = $p.html() ?? "";
      $p.replaceWith(`<section class="attla-credits-archives">
  <h3 class="attla-section-label">Archives &amp; publications</h3>
  <div class="attla-credits-archives-body">${html}</div>
</section>`);
      return false;
    }
  });

  // Design credit (h5)
  $root.find("h5").each((_, el) => {
    const $h = $(el);
    const text = $h.text().replace(/\u00a0/g, " ").trim();
    if (text.toLowerCase().includes("jennifer moss")) {
      $h.replaceWith(
        `<footer class="attla-credits-design">Web site theme and design by <strong>Jennifer Moss</strong></footer>`
      );
    }
  });

  // Remove empty paragraphs and stray builder comments
  $root.find("p").each((_, el) => {
    const $p = $(el);
    if (!$p.text().replace(/\u00a0/g, "").trim() && !$p.find("img").length) {
      $p.remove();
    }
  });
}
