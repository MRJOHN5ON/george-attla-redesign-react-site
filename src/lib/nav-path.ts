/** Convert original site URLs to local clone paths. */
export function toLocalPath(href: string): string {
  if (!href || href.startsWith("/")) return href || "/";
  try {
    const u = new URL(href);
    if (u.hostname.replace(/^www\./, "").includes("attlamakingofachampion.com")) {
      const p = u.pathname.replace(/\/$/, "");
      return p || "/";
    }
  } catch {
    /* keep external */
  }
  return href;
}
