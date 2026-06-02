/**
 * Focal points for cover crops (wide archive photos, banners, thumbnails).
 * Values are CSS object-position (horizontal vertical).
 */
const BY_PATH: Record<string, string> = {
  "/images/attla/1980-slideshow1-900x300.jpg": "48% 42%",
  "/images/attla/1950-slideshow2-900x300.jpg": "50% 40%",
  "/images/attla/1988-900x300.jpg": "50% 38%",
  "/images/attla/sandall-900x300.jpg": "50% 35%",
  "/images/attla/slideshow-ashof-900x300.jpg": "50% 40%",
  "/images/attla/youth-day-400x200.jpg": "50% 22%",
  "/images/attla/the-race-400x228.png": "50% 30%",
  "/images/attla/mindset-400x145.jpg": "50% 25%",
  "/images/attla/mush-400x286.jpg": "50% 28%",
  "/images/attla/sprint-racing.jpg": "50% 30%",
  "/images/attla/visit.jpg": "50% 35%",
  "/images/attla/thumb-speedakmag2.jpg": "50% 20%",
};

function normalizeSrc(src: string): string {
  const path = src.split("?")[0];
  return path.replace(/^https?:\/\/[^/]+/, "").replace(/\/$/, "");
}

export function focalPointForSrc(src: string): string {
  const path = normalizeSrc(src);
  if (BY_PATH[path]) return BY_PATH[path];

  if (/900x300|slideshow/i.test(path)) return "50% 40%";
  if (/400x\d{2,3}|thumb/i.test(path)) return "50% 24%";
  if (/size-thumbnail|wp-image-\d+.*attla/i.test(path)) return "50% 30%";

  return "50% 35%";
}
