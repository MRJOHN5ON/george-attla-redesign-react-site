import Image, { type ImageProps } from "next/image";
import { withBasePath } from "@/lib/base-path";
import {
  displayHintForSrc,
  type ImageDisplayContext,
} from "@/lib/image-focus";
import { cn } from "@/lib/utils";

type SiteImageProps = ImageProps & {
  /** Apply archive-aware crop / letterbox rules for framed photos. */
  coverFocus?: boolean;
  displayContext?: ImageDisplayContext;
};

/** next/image does not apply basePath in static export HTML — required for GitHub Pages. */
export function SiteImage({
  src,
  className,
  style,
  coverFocus = false,
  displayContext = "article",
  ...props
}: SiteImageProps) {
  const resolved = typeof src === "string" ? withBasePath(src) : src;

  const hint =
    coverFocus && typeof src === "string"
      ? displayHintForSrc(src, displayContext)
      : null;

  return (
    <Image
      src={resolved}
      className={cn(
        hint && (hint.objectFit === "contain" ? "object-contain" : "object-cover"),
        className
      )}
      style={
        hint
          ? {
              objectPosition: hint.objectPosition,
              objectFit: hint.objectFit,
              ...style,
            }
          : style
      }
      {...props}
    />
  );
}
