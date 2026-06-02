import * as cheerio from "cheerio";
import type { CheerioAPI } from "cheerio";
import { rewriteRootUrls, withBasePath } from "@/lib/base-path";
import { formatCreditsPage } from "@/lib/format-credits-page";
import { formatLabelledParagraphs } from "@/lib/format-labelled-sections";
import {
  cleanupHeadings,
  normalizeWinnerLists,
} from "@/lib/normalize-winners";

export interface ProcessedContent {
  bodyHtml: string;
  heroImage: { src: string; alt: string } | null;
  embedVideo: string | null;
  publishedDate: string | null;
  kind: "article" | "chapter" | "index" | "gallery";
}

function youtubeToEmbed(url: string | undefined): string | null {
  if (!url) return null;
  const trimmed = url.trim();
  if (trimmed.includes("youtube.com/embed/")) {
    return trimmed.split("?")[0] ?? trimmed;
  }
  const short = trimmed.match(/youtu\.be\/([^?&/]+)/);
  if (short) return `https://www.youtube.com/embed/${short[1]}`;
  const watch = trimmed.match(/[?&]v=([^&]+)/);
  if (watch) return `https://www.youtube.com/embed/${watch[1]}`;
  return null;
}

function videoFigure(embedUrl: string): string {
  return `<figure class="attla-video"><div class="attla-video-inner"><iframe src="${embedUrl}" title="Video" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></div></figure>`;
}

/** Unwrap Themify builder modules into normal HTML (text + video embeds). */
function processThemifyBuilder($: CheerioAPI): void {
  $(".module-video[data-url]").each((_, el) => {
    const embed = youtubeToEmbed($(el).attr("data-url"));
    $(el).replaceWith(embed ? videoFigure(embed) : "");
  });

  $(".module-text .tb_text_wrap").each((_, wrap) => {
    const inner = $(wrap).html();
    $(wrap).replaceWith(inner ?? "");
  });

  $(".module.module-text").each((_, mod) => {
    const inner = $(mod).html();
    $(mod).replaceWith(inner ?? "");
  });

  const unwrapSelectors = [
    ".themify_builder_content",
    ".module_row",
    ".themify_builder_row",
    ".row_inner",
    ".module_column",
    ".tb-column-inner",
    ".video-wrap-outer",
    ".video-wrap",
  ];

  for (const selector of unwrapSelectors) {
    $(selector).each((_, el) => {
      const $el = $(el);
      const inner = $el.html()?.trim();
      if (inner) $el.replaceWith(inner);
      else $el.remove();
    });
  }

  $("div.tb_text_wrap:empty, div.tf_clearfix:empty").remove();
}

function detectKind(path: string, $: CheerioAPI): ProcessedContent["kind"] {
  if (path.includes("chapter-") || path.includes("download-manual")) return "chapter";
  if (path.includes("gallery") || path.includes("timeline")) return "gallery";
  const hasToc =
    $("a[href*='chapter-']").length >= 3 ||
    path.includes("youth-sled-dog-program") ||
    path.includes("books-movies");
  if (hasToc) return "index";
  return "article";
}

function pickContentRoot($: CheerioAPI) {
  const entry = $(".entry-content").first();
  if (entry.length) return entry;
  const page = $(".page-content").first();
  if (page.length) return page;
  return $("body");
}

function upgradeGalleries($: CheerioAPI, $root: ReturnType<CheerioAPI>) {
  $root.find(".gallery").addClass("attla-gallery");
  $root.find(".gallery-item").each((_, item) => {
    const $item = $(item);
    const $link = $item.find("a[href]").first();
    const href = $link.attr("href");
    const $img = $item.find("img").first();
    if (href && $img.length && /\.(jpe?g|png|gif|webp)/i.test(href)) {
      $img.attr("src", href);
    }
    $img.removeClass("attachment-thumbnail size-thumbnail tf_svg_lazy");
    $img.addClass("attla-gallery-img");
    const caption = $item.find(".gallery-caption, figcaption").first().text().trim();
    if (caption && !$img.attr("alt")) $img.attr("alt", caption);
  });
}

function extractHero(
  $: CheerioAPI,
  $root: ReturnType<CheerioAPI>,
  pageTitle: string
): { src: string; alt: string } | null {
  const postImg = $(".post-image img").first();
  if (postImg.length) {
    const src = postImg.attr("src");
    if (src) {
      return { src, alt: postImg.attr("alt")?.trim() || pageTitle };
    }
  }

  const firstContentImg = $root.find("img").first();
  if (firstContentImg.length) {
    const src = firstContentImg.attr("src");
    if (src && !src.startsWith("data:")) {
      return {
        src,
        alt: firstContentImg.attr("alt")?.trim() || pageTitle,
      };
    }
  }
  return null;
}

export function processContentHtml(
  html: string,
  pageTitle: string,
  pagePath: string
): ProcessedContent {
  const $ = cheerio.load(html);

  const publishedDate =
    $(".post-date").first().text().trim() ||
    $("time[datetime]").first().attr("datetime") ||
    null;

  const $preRoot = pickContentRoot($);
  let heroImage = extractHero($, $preRoot, pageTitle);

  // Extract Themify text + videos before stripping WP chrome
  processThemifyBuilder($);

  $(".post-meta, .post-date, .post-title, .page-title, .post-image").remove();
  $('[id^="more-"]').remove();

  $("p").each((_, el) => {
    const text = $(el).text().replace(/\u00a0/g, " ").trim();
    if (!text) $(el).remove();
  });

  const $root = pickContentRoot($);
  upgradeGalleries($, $root);
  normalizeWinnerLists($, $root);
  cleanupHeadings($, $root);
  formatLabelledParagraphs($, $root);
  formatCreditsPage($, $root, pagePath);

  if (!heroImage) {
    heroImage = extractHero($, $root, pageTitle);
  }

  $root.find("img").each((_, img) => {
    const $img = $(img);
    const lazySrc = $img.attr("data-tf-src");
    if (lazySrc) {
      $img.attr("src", lazySrc);
      $img.removeAttr("data-tf-src data-tf-srcset");
    }
    $img.removeAttr("width height");
    if (!$img.attr("alt")) {
      const cap = $img.closest("figure").find("figcaption").text().trim();
      $img.attr("alt", cap || pageTitle);
    }
  });

  $root.find("a").each((_, a) => {
    const href = $(a).attr("href");
    if (href?.startsWith("https://attlamakingofachampion.com")) {
      $(a).attr("href", href.replace("https://attlamakingofachampion.com", ""));
    }
  });

  // Group video sections: h3 + optional intro paragraph before each embed
  $root.find(".attla-video").each((_, vid) => {
    const $vid = $(vid);
    const $prev = $vid.prev();
    const $heading = $prev.is("h3") ? $prev : null;
    const $intro = $heading?.prev("p");
    const $wrap = $('<div class="attla-video-chapter"></div>');
    if ($intro?.length && !$intro.find(".attla-video").length) {
      $wrap.append($intro.clone());
      $intro.remove();
    }
    if ($heading?.length) {
      $wrap.append($heading.clone());
      $heading.remove();
    }
    $wrap.append($vid.clone());
    $vid.replaceWith($wrap);
  });

  const bodyHtml = rewriteRootUrls($root.html()?.trim() || "");
  const videoCount = (bodyHtml.match(/class="attla-video"/g) ?? []).length;

  // Only promote a lone video to the hero slot; multi-video pages keep all inline
  let embedVideo: string | null = null;
  if (videoCount === 1) {
    const match = bodyHtml.match(/src="(https:\/\/www\.youtube\.com\/embed\/[^"]+)"/);
    embedVideo = match?.[1] ?? null;
  }

  const kind = detectKind(pagePath, $);

  return {
    bodyHtml,
    heroImage: heroImage
      ? { ...heroImage, src: withBasePath(heroImage.src) }
      : null,
    embedVideo,
    publishedDate,
    kind,
  };
}
