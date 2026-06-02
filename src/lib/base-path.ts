/** GitHub Pages project sites live at /repo-name — empty locally. */
export const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export function withBasePath(path: string): string {
  if (!basePath || !path) return path;
  if (path.startsWith("http://") || path.startsWith("https://") || path.startsWith("data:")) {
    return path;
  }
  if (path.startsWith(basePath)) return path;
  if (path === "/") return basePath;
  return `${basePath}${path.startsWith("/") ? path : `/${path}`}`;
}

/** Prefix root-relative URLs in crawled HTML (img src, links, PDFs). Next/Image does this automatically; raw HTML does not. */
export function rewriteRootUrls(html: string): string {
  if (!basePath) return html;
  const bp = basePath.replace(/\/$/, "");
  return html
    .replace(
      /(\s(?:src|href|data-tf-src|data-src)=["'])\/(?!\/)/g,
      `$1${bp}/`
    )
    .replace(/url\(\s*["']?\//g, `url(${bp}/`);
}
