import { SiteImage } from "@/components/SiteImage";
import Link from "next/link";
import type { HomePost } from "@/types/home";

function StoryCard({ post, large = false }: { post: HomePost; large?: boolean }) {
  if (large) {
    return (
      <article className="group relative col-span-1 overflow-hidden rounded-2xl bg-stone-900 md:col-span-2 md:row-span-2">
        <Link href={post.href} className="block h-full min-h-[420px] no-underline md:min-h-full">
          <SiteImage
            src={post.image}
            alt={post.title}
            fill
            coverFocus
            displayContext="card"
            className="opacity-90 transition-transform duration-700 group-hover:scale-[1.03]"
            sizes="(max-width: 768px) 100vw, 50vw"
            unoptimized={post.image.endsWith(".gif")}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-stone-950/95 via-stone-950/40 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 p-8 md:p-10">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-stone-300">
              Featured story
            </p>
            <h3 className="font-display mt-3 text-3xl font-semibold leading-tight text-white md:text-4xl">
              {post.title}
            </h3>
            <p className="mt-4 line-clamp-3 max-w-lg text-base leading-relaxed text-stone-200">
              {post.excerpt}
            </p>
          </div>
        </Link>
      </article>
    );
  }

  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl bg-white shadow-[var(--shadow-soft)] ring-1 ring-[var(--line)] transition-shadow hover:shadow-[var(--shadow-image)]">
      <Link href={post.href} className="relative block aspect-[4/3] overflow-hidden no-underline">
        <SiteImage
          src={post.image}
          alt={post.title}
          fill
          coverFocus
          displayContext="card"
          className="transition-transform duration-500 group-hover:scale-[1.04]"
          sizes="(max-width: 768px) 100vw, 33vw"
          unoptimized={post.image.endsWith(".gif")}
        />
      </Link>
      <div className="flex flex-1 flex-col p-6">
        <h3 className="font-display text-xl font-semibold leading-snug text-[var(--ink)]">
          <Link href={post.href} className="no-underline hover:text-[var(--accent)]">
            {post.title}
          </Link>
        </h3>
        <p className="mt-3 flex-1 text-sm leading-relaxed text-[var(--muted)] line-clamp-3">
          {post.excerpt}
        </p>
        <Link
          href={post.href}
          className="mt-5 text-xs font-semibold uppercase tracking-wider text-[var(--link)] no-underline"
        >
          Read →
        </Link>
      </div>
    </article>
  );
}

export function HomeStories({ posts }: { posts: HomePost[] }) {
  const [lead, ...rest] = posts;

  return (
    <section className="py-16 md:py-24" aria-labelledby="stories-heading">
      <div className="site-container">
        <div className="mb-12 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--accent)]">
              From the archive
            </p>
            <h2
              id="stories-heading"
              className="font-display mt-3 text-3xl font-semibold tracking-tight text-[var(--ink)] md:text-4xl"
            >
              Stories & resources
            </h2>
          </div>
          <p className="max-w-md text-sm leading-relaxed text-[var(--muted)]">
            Racing history, youth programs, mindset, and Alaska mushing culture — every
            article preserved from the original site.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {lead && <StoryCard post={lead} large />}
          {rest.map((post) => (
            <StoryCard key={post.title} post={post} />
          ))}
        </div>
      </div>
    </section>
  );
}
