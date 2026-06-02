import Image, { type ImageProps } from "next/image";
import { withBasePath } from "@/lib/base-path";
import { focalPointForSrc } from "@/lib/image-focus";
import { cn } from "@/lib/utils";

type SiteImageProps = ImageProps & {
  /** When true, apply archive-aware object-position for cover crops. */
  coverFocus?: boolean;
};

/** next/image does not apply basePath in static export HTML — required for GitHub Pages. */
export function SiteImage({
  src,
  className,
  style,
  coverFocus = false,
  ...props
}: SiteImageProps) {
  const resolved = typeof src === "string" ? withBasePath(src) : src;
  const focusStyle =
    coverFocus && typeof src === "string"
      ? { objectPosition: focalPointForSrc(src), ...style }
      : style;

  return (
    <Image
      src={resolved}
      className={cn(coverFocus && "object-cover", className)}
      style={focusStyle}
      {...props}
    />
  );
}
