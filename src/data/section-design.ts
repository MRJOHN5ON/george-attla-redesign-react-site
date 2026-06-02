/**
 * Executive layout decisions per top-level archive section.
 * Intros are additive UI copy; all page body text remains from the crawl.
 */
export interface SectionDesign {
  id: string;
  /** Paths that belong to this section (prefix match) */
  pathPrefixes: string[];
  intro: string;
  layoutHint?: string;
}

export const sectionDesigns: SectionDesign[] = [
  {
    id: "youth",
    pathPrefixes: ["/youth-sled-dog-program", "/frank-attla", "/chapter-", "/get-involved", "/learn-about", "/join-a-mushing", "/visit-a-dog"],
    intro:
      "Educational resources for starting and sustaining youth sled dog programs in schools and communities.",
    layoutHint: "Manual & chapters — use the table of contents to download PDFs by chapter.",
  },
  {
    id: "mindset",
    pathPrefixes: ["/on-mindset", "/not-give", "/dog-connection", "/champion-sled", "/lingo", "/im-not-a-give"],
    intro:
      "George Attla on winning mindset, dog connection, and the mental discipline of a champion.",
  },
  {
    id: "meet-the-man",
    pathPrefixes: ["/meet-the-man", "/about-george", "/role-model", "/no-stopping", "/real-dogmen"],
    intro:
      "Biography, character, and the people who shaped George Attla’s life on and off the trail.",
  },
  {
    id: "racing",
    pathPrefixes: [
      "/sprint-racing",
      "/racing-career",
      "/attlas-racing",
      "/races-run",
      "/early-career",
      "/7-decades",
      "/the-fur-rondy",
      "/open-north-american",
      "/tok-champions",
      "/koyukuk",
      "/by-george",
      "/dogs-of-speed",
      "/the-race",
    ],
    intro:
      "Seven decades of sprint racing — footage, interviews, and championship history across Alaska.",
    layoutHint: "Video-heavy pages: scroll through each clip; winners lists are formatted by year.",
  },
  {
    id: "hall-of-fame",
    pathPrefixes: ["/alaska-sports-hall", "/healthy-heros"],
    intro: "Alaska Sports Hall of Fame recognition and related honors.",
  },
  {
    id: "opus",
    pathPrefixes: ["/books", "/everything-i-know", "/spirit-of-the-wind", "/attla-books"],
    intro: "Books and film documenting George Attla’s life and sled dog racing.",
  },
  {
    id: "history",
    pathPrefixes: ["/history", "/work-of-today", "/time-machine", "/timeline"],
    intro: "Historical context and contemporary work preserving mushing heritage.",
  },
  {
    id: "people",
    pathPrefixes: ["/people", "/young-mushers", "/fans-talk", "/competitors", "/family-of"],
    intro: "Voices from mushers, fans, competitors, and the community around the sport.",
  },
  {
    id: "about",
    pathPrefixes: ["/about", "/contact", "/dedication", "/project-support", "/credits"],
    intro: "About this digital archive, credits, and project supporters.",
  },
];

export function getSectionDesign(path: string): SectionDesign | null {
  for (const design of sectionDesigns) {
    if (design.pathPrefixes.some((prefix) => path.startsWith(prefix))) {
      return design;
    }
  }
  return null;
}
