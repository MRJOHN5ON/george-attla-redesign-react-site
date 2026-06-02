import { SiteImage } from "@/components/SiteImage";

export function ArticleHero({
  src,
  alt,
  title,
}: {
  src: string;
  alt: string;
  title: string;
}) {
  return (
    <div className="relative h-[min(52vh,520px)] w-full overflow-hidden bg-stone-200">
      <SiteImage
        src={src}
        alt={alt}
        fill
        className="object-cover"
        sizes="100vw"
        priority
        unoptimized={src.endsWith(".gif")}
      />
      <div
        className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-stone-950/25 to-stone-950/10"
        aria-hidden
      />
      <div className="absolute inset-x-0 bottom-0">
        <div className="site-container pb-10 pt-24 md:pb-14">
          <h1 className="font-display max-w-4xl text-4xl font-semibold leading-[1.08] tracking-tight text-white md:text-5xl lg:text-6xl">
            {title}
          </h1>
        </div>
      </div>
    </div>
  );
}
