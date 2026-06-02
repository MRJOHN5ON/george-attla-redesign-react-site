import Image, { type ImageProps } from "next/image";
import { withBasePath } from "@/lib/base-path";

/** next/image does not apply basePath in static export HTML — required for GitHub Pages. */
export function SiteImage({ src, ...props }: ImageProps) {
  const resolved =
    typeof src === "string" ? withBasePath(src) : src;
  return <Image src={resolved} {...props} />;
}
