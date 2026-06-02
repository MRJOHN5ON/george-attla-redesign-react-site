export interface SearchEntry {
  title: string;
  path: string;
  excerpt: string;
}

export function rankSearchResults(
  query: string,
  entries: SearchEntry[],
  limit = 12
): SearchEntry[] {
  const q = query.trim().toLowerCase();
  if (q.length < 2) return [];

  const terms = q.split(/\s+/).filter(Boolean);

  const scored = entries
    .map((entry) => {
      const title = entry.title.toLowerCase();
      const excerpt = entry.excerpt.toLowerCase();
      let score = 0;

      for (const term of terms) {
        if (title.includes(term)) score += 10;
        if (title.startsWith(term)) score += 5;
        if (excerpt.includes(term)) score += 2;
      }

      if (title === q) score += 20;
      if (title.includes(q)) score += 8;

      return { entry, score };
    })
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score);

  return scored.slice(0, limit).map(({ entry }) => entry);
}
