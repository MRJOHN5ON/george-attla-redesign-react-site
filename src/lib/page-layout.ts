import type { ProcessedContent } from "@/lib/process-content";

export type PageLayout =
  | "article"
  | "chapter"
  | "index"
  | "gallery"
  | "winners"
  | "video-hub"
  | "video-article"
  | "credits"
  | "sparse"
  | "placeholder";

export function resolvePageLayout(
  processed: ProcessedContent,
  path: string
): PageLayout {
  const html = processed.bodyHtml.toLowerCase();

  if (html.includes("lorem ipsum")) return "placeholder";
  if (processed.bodyHtml.length < 100) return "sparse";

  const videos = (processed.bodyHtml.match(/class="attla-video"/g) ?? []).length;
  if (videos >= 2) return "video-hub";
  if (videos === 1) return "video-article";
  if (processed.bodyHtml.includes("attla-winners")) return "winners";
  if (processed.kind === "gallery" || (processed.bodyHtml.match(/attla-gallery/g) ?? []).length > 0) {
    return processed.kind === "gallery" ? "gallery" : "article";
  }
  if (processed.kind === "index") return "index";
  if (processed.kind === "chapter" || path.includes("chapter-")) return "chapter";
  if (path.includes("credits-2")) return "credits";

  return "article";
}

export const layoutLabels: Record<PageLayout, string> = {
  article: "Article",
  chapter: "Chapter",
  index: "Guide",
  gallery: "Gallery",
  winners: "Championship records",
  "video-hub": "Video archive",
  "video-article": "Featured video",
  credits: "Credits",
  sparse: "Section overview",
  placeholder: "Archive note",
};
