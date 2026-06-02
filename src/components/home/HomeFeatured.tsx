import { youtubeEmbed } from "@/data/home";

export function HomeFeatured() {
  return (
    <section className="border-b border-[var(--line)] bg-white py-16 md:py-24">
      <div className="site-container">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
          <div className="max-w-lg">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--accent)]">
              Featured
            </p>
            <h2 className="font-display mt-4 text-3xl font-semibold leading-tight tracking-tight text-[var(--ink)] md:text-4xl">
              Mindset of a Winner
            </h2>
            <p className="mt-6 text-lg leading-relaxed text-[var(--muted)]">
              George Attla says winning is all in the head. He explains a champion
              always gives his or her best and has winning thoughts; it does not mean
              winning every time.
            </p>
          </div>
          <div className="relative">
            <div className="overflow-hidden rounded-2xl bg-stone-900 shadow-[var(--shadow-image)] ring-1 ring-stone-900/10">
              <div className="relative aspect-video">
                <iframe
                  src={youtubeEmbed}
                  title="Mindset of a Winner"
                  className="absolute inset-0 size-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
