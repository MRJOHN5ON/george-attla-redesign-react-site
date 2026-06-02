import type { CheerioAPI } from "cheerio";

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/** Homepage image credits (exceptions called out on Credits page). */
const HOMEPAGE_EXCEPTIONS = [
  {
    label: "“What is the Making of a Champion Mindset?” (homepage image)",
    credit: "1982.02- Smith, Kirby of George Attla run of Rondy",
  },
  {
    label: "“Focus on your goal” (homepage image)",
    credit:
      "1988.03-Courtesy of Fairbanks Daily News-Miner of George Attla running ONAC",
  },
  {
    label: "“Visit a dog mushing museum” (watercolor on homepage)",
    credit: "2012.01- Sutton, Iris of Yukon Quest sled dogs",
  },
] as const;

/** Six professionals — exact thanks from the original Credits page. */
const PROJECT_PROFESSIONALS = [
  {
    name: "Maxine Vehlow",
    role: "Photographer",
    thanks:
      "For her amazing energy and enthusiasm for the project. Her contribution was exceptional, namely her unparalleled historic sprint racing photos that capture a part of Alaska history like no others, and her ability to locate Fur Rendezvous World Championship Sled Dog racing information and content sources.",
  },
  {
    name: "Len Kamerling",
    role: "Film & image editor",
    thanks:
      "For his consistent and good editing and cleanup of present-day and archival video footage and images in a variety of conditions.",
  },
  {
    name: "Randy Johnson",
    role: "Archival materials",
    thanks:
      "For his awesome attention to detail in the cleaning up of archival print material with images and a variety of other art and graphics in very marginal condition.",
  },
  {
    name: "Grace Pedersen",
    role: "Text editor",
    thanks: "For her fantastic editing of the text throughout the web site.",
  },
  {
    name: "Jennifer Moss",
    role: "Web master · site design",
    thanks:
      "For her brilliant web site design and her efforts to make this project a reality. I would have been lost without her great grasp of the ever-changing web site technology and her patience with the creative process.",
  },
  {
    name: "Laura Schue",
    role: "Alaska Humanities Forum project manager",
    thanks:
      "For her unwavering support, patience, and strong belief in the project.",
  },
] as const;

/** Everyone thanked for gathering content — from original Credits paragraph. */
const CONTENT_CONTRIBUTORS = [
  "Ginger Attla",
  "Dorothy Yatlin",
  "Steven Bergman",
  "Marie Yaska",
  "Rose Ambrose",
  "Amanda Attla",
  "Madeline Williams",
  "Christine Attla",
  "Vina Below",
  "Steven and Catherine Attla",
  "Gary Attla",
  "Georgia Attla",
  "Patti Brown",
  "Susan Paskvan",
  "David and Kay Henry",
  "Cesa Sam",
  "Eileen Jackson",
  "Eddie Vent",
  "Vincent Henry",
  "Al Yatlin Sr.",
  "Wilson Sam",
  "Tim Pavlick",
  "Ross Sam",
  "Joe Ambrose",
  "Speedy Sam",
  "Jeanette Vent",
  "Fred and Audrey Bifelt",
  "Bob Eley",
  "Wayne & Jane Davis",
  "Bridget Schwafel",
  "Judy Bergemann",
  "Tom McGrane",
  "Dale & Jennifer Probert",
  "Sam Harrel",
  "Rod Boyce",
  "Colleen Redmond",
  "Heath Sandall",
  "Lisa B. Fallgren",
  "Rosemary Speranza",
  "Dirk Tordoff",
  "Allison Zusi-Cobb",
  "Judy Ferguson",
  "Karen Brewster",
  "Bill Schneider",
  "Marla Statscewich",
  "Deb Nigro",
  "Dwayne Nelson",
  "Patty Imus",
  "Ned Rozell",
  "Susan Duck",
  "Carol Daugherty",
  "Greg Sellentin",
  "Jane Pachomski",
  "Rebecca Luczycki",
  "Michael Manning",
  "Harlow Robinson",
  "Christopher Myers",
  "Jan Hazen",
  "Dave Duncan",
  "Sharon Palmisano",
  "Pat Dougherty",
  "Anne Raup",
  "Alice Arwezon",
  "Irene Stewart",
  "Bernie Washington",
  "Carole Anderson",
  "Dan Olson",
  "Jim Lavrakas",
  "Ronan Nagle",
  "Cindy Moulburg",
  "David Steele",
  "Sally Blair",
  "Kent Stugis",
  "Lew Freeman",
  "Bella & Bob Levorson",
  "Richard Moore",
] as const;

const ARCHIVE_ORGANIZATIONS = [
  "Greater Anchorage Incorporated",
  "Anchorage Museum of History & Art",
  "Z. J. Loussac Public Library",
  "University of Alaska Archives Library",
  "University of Alaska Fairbanks Alaska Film Archives",
] as const;

const ARCHIVE_PUBLICATIONS = [
  { title: "Alaska Daily News" },
  { title: "Alaska Daily Times" },
  { title: "Fairbanks Daily News-Miner" },
  { title: "Alaska Magazine" },
  { title: "Mushing Magazine" },
  { title: "Team & Trail" },
  { title: "Tundra Times" },
  { title: "River Times", note: "Fairbanks Native Association" },
  { title: "Ruralite", note: "Golden Valley Electric Association" },
  { title: "The Council", note: "Tanana Chiefs Conference" },
] as const;

const OTHER_PUBLICATION_SOURCES = [
  "Doyon Limited",
  "Alaska Sports Hall of Fame",
  "Alaska Dog Mushing Association",
] as const;

function buildHomepageExceptionsHtml(): string {
  const list = HOMEPAGE_EXCEPTIONS.map(
    (item) => `<li>
      <p class="attla-credits-exception-label">${escapeHtml(item.label)}</p>
      <p class="attla-credits-exception-credit">${escapeHtml(item.credit)}</p>
    </li>`
  ).join("");

  return `<section class="attla-credits-exceptions" aria-labelledby="credits-exceptions-heading">
  <h3 id="credits-exceptions-heading" class="attla-section-label">Homepage image credits</h3>
  <p class="attla-credits-lead">Most image, text, and video credits are listed on the pages where they appear. These homepage images are the exceptions:</p>
  <ul class="attla-credits-exception-list">${list}</ul>
</section>`;
}

function buildProfessionalsHtml(): string {
  const cards = PROJECT_PROFESSIONALS.map(
    (person) => `<article class="attla-credits-team-card">
      <h4 class="attla-credits-team-name">${escapeHtml(person.name)}</h4>
      <p class="attla-credits-team-role">${escapeHtml(person.role)}</p>
      <p class="attla-credits-team-thanks">${escapeHtml(person.thanks)}</p>
    </article>`
  ).join("");

  return `<section class="attla-credits-team" aria-labelledby="credits-team-heading">
  <h3 id="credits-team-heading" class="attla-section-label">Project professionals</h3>
  <p class="attla-credits-lead">Besides the dozens of people credited for content throughout the web site, many professionals gave a monumental amount of in-kind time:</p>
  <div class="attla-credits-team-grid">${cards}</div>
</section>`;
}

function buildContributorsHtml(): string {
  const names = CONTENT_CONTRIBUTORS.map(
    (name) => `<li>${escapeHtml(name)}</li>`
  ).join("");

  return `<section class="attla-credits-contributors" aria-labelledby="credits-contributors-heading">
  <h3 id="credits-contributors-heading" class="attla-section-label">Content contributors</h3>
  <p class="attla-credits-lead">For gathering articles, print, photos, video, audio, and more:</p>
  <ul class="attla-credits-names-list">${names}</ul>
</section>`;
}

function buildArchivesHtml(): string {
  const orgs = ARCHIVE_ORGANIZATIONS.map((o) => `<li>${escapeHtml(o)}</li>`).join(
    ""
  );
  const pubs = ARCHIVE_PUBLICATIONS.map((p) => {
    const note =
      "note" in p && p.note
        ? ` <span class="attla-credits-pub-note">(${escapeHtml(p.note)})</span>`
        : "";
    return `<li><em>${escapeHtml(p.title)}</em>${note}</li>`;
  }).join("");
  const other = OTHER_PUBLICATION_SOURCES.map((o) => `<li>${escapeHtml(o)}</li>`).join(
    ""
  );

  return `<section class="attla-credits-archives" aria-labelledby="credits-archives-heading">
  <h3 id="credits-archives-heading" class="attla-section-label">Archives &amp; publications</h3>
  <p class="attla-credits-lead">For published archival photos, digital images, and newspaper and magazine articles:</p>
  <h4 class="attla-credits-subhead">Institutions</h4>
  <ul class="attla-credits-names-list attla-credits-names-list--compact">${orgs}</ul>
  <h4 class="attla-credits-subhead">Publications</h4>
  <ul class="attla-credits-pub-list">${pubs}</ul>
  <h4 class="attla-credits-subhead">Other publication sources</h4>
  <ul class="attla-credits-names-list attla-credits-names-list--compact">${other}</ul>
</section>`;
}

function extractParagraphHtml(
  $: CheerioAPI,
  $root: ReturnType<CheerioAPI>,
  includes: string
): string {
  let html = "";
  $root.find("p").each((_, el) => {
    if ($(el).text().includes(includes)) {
      html = $(el).html()?.trim() ?? "";
      return false;
    }
  });
  return html;
}

function extractContactLink($: CheerioAPI, $root: ReturnType<CheerioAPI>): string {
  const $link = $root.find('a[href*="contact"]').first();
  return (
    $link.prop("outerHTML") ?? '<a href="/contact-2">Contact Kathy Turco</a>'
  );
}

/**
 * Credits page — structured layout from the real page content (no regex splitting).
 */
export function formatCreditsPage(
  $: CheerioAPI,
  $root: ReturnType<CheerioAPI>,
  pagePath: string
): void {
  if (!pagePath.includes("credits-2")) return;

  const figures: string[] = [];
  $root.find("figure.wp-caption").each((_, fig) => {
    figures.push($.html(fig) ?? "");
  });

  const introHtml = extractParagraphHtml(
    $,
    $root,
    "A tremendous number of people helped make this web site"
  );
  const georgeHtml = extractParagraphHtml(
    $,
    $root,
    "very special thanks goes to George Attla"
  );
  const contactLink = extractContactLink($, $root);

  let introBody = introHtml;
  if (introBody) {
    const $wrap = $("<div></div>").html(introBody);
    $wrap.find('a[href*="contact"]').remove();
    $wrap.find("strong").remove();
    introBody = $wrap.html()?.trim() ?? introBody;
  }

  const photoGrid =
    figures.length > 0
      ? `<div class="attla-credits-photo-grid" aria-label="Photo credits">${figures.join("")}</div>`
      : "";

  const html = `${buildHomepageExceptionsHtml()}

<h2 class="attla-credits-thanks-title">Thank you</h2>

<section class="attla-credits-intro">
  <p>${introBody}</p>
  <p class="attla-credits-contact">Found an error? ${contactLink}</p>
</section>

${photoGrid}

<section class="attla-credits-callout attla-credits-callout--george">
  <h3 class="attla-section-label">George Attla</h3>
  <p>${georgeHtml}</p>
</section>

${buildProfessionalsHtml()}

${buildContributorsHtml()}

${buildArchivesHtml()}

<footer class="attla-credits-design">Web site theme and design by <strong>Jennifer Moss</strong></footer>`;

  $root.empty();
  $root.addClass("attla-credits-page");
  $root.append(html);
}
