import metadata from "@/data/image-metadata.json";

export type ImageDisplayContext = "hero" | "card" | "article";

export interface ImageDisplayHint {
  objectPosition: string;
  objectFit: "cover" | "contain";
}

type ImageMeta = {
  w: number;
  h: number;
  aspect: number;
  category: string;
  focal: string;
  preferContain: boolean;
};

const META: Record<string, ImageMeta> = metadata;

function normalizeSrc(src: string): string {
  const path = src.split("?")[0];
  return path.replace(/^https?:\/\/[^/]+/, "").replace(/\/$/, "");
}

function getMeta(src: string): ImageMeta | undefined {
  return META[normalizeSrc(src)];
}

/** Whether a wide/tall photo should letterbox instead of crop in a frame. */
export function displayHintForSrc(
  src: string,
  context: ImageDisplayContext = "article"
): ImageDisplayHint {
  const meta = getMeta(src);
  const aspect = meta?.aspect ?? 1.4;
  const focal = meta?.focal ?? "50% 35%";

  let preferContain = meta?.preferContain ?? false;

  if (context === "hero") {
    preferContain = preferContain || aspect >= 1.7;
  } else if (context === "card") {
    preferContain = preferContain || aspect >= 1.45;
  } else if (context === "article") {
    preferContain = preferContain || aspect >= 2;
  }

  return {
    objectPosition: focal,
    objectFit: preferContain ? "contain" : "cover",
  };
}

/** @deprecated Use displayHintForSrc */
export function focalPointForSrc(src: string): string {
  return displayHintForSrc(src, "article").objectPosition;
}
