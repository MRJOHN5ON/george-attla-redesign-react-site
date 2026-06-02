import { SiteImage } from "@/components/SiteImage";
import Link from "next/link";
import { homeHero, site } from "@/data/home";

export function HomeHero() {
  return (
    <section className="relative min-h-[min(88vh,900px)] overflow-hidden bg-stone-900">
      <SiteImage
        src={homeHero.src}
        alt={homeHero.alt}
        fill
        className="object-cover"
        sizes="100vw"
        priority
      />

      <div className="absolute inset-0 bg-gradient-to-r from-stone-950/90 via-stone-950/50 to-stone-950/30" />
      <div className="absolute inset-0 bg-gradient-to-t from-stone-950/70 via-transparent to-stone-950/20" />

      <div className="relative flex min-h-[min(88vh,900px)] flex-col justify-end">
        <div className="site-container pb-16 pt-32 md:pb-24 md:pt-40">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-stone-300">
            Alaska · Sprint sled dog racing
          </p>
          <h1 className="font-display mt-5 max-w-4xl text-[clamp(2.5rem,7vw,5.5rem)] font-semibold leading-[1.02] tracking-tight text-white">
            {site.title}
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-stone-200 md:text-xl">
            {site.tagline}
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <Link
              href="/about-george-attla"
              className="inline-flex items-center rounded-full bg-white px-7 py-3.5 text-sm font-semibold text-[var(--ink)] no-underline transition-transform hover:scale-[1.02] active:scale-[0.98]"
            >
              About George
            </Link>
            <Link
              href="/youth-sled-dog-program"
              className="inline-flex items-center rounded-full border border-white/40 px-7 py-3.5 text-sm font-semibold text-white no-underline backdrop-blur-sm transition-colors hover:border-white hover:bg-white/10"
            >
              Youth program
            </Link>
          </div>
        </div>

        <div className="site-container border-t border-white/15 py-5">
          <p className="text-sm text-stone-300">
            <span className="text-white/60">Image:</span> {homeHero.alt}
          </p>
        </div>
      </div>
    </section>
  );
}
