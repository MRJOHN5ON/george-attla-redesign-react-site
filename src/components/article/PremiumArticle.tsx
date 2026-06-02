import Link from "next/link";
import { ArticleHero } from "@/components/article/ArticleHero";
import { ArticleVideo } from "@/components/article/ArticleVideo";
import { SectionAside } from "@/components/article/SectionAside";
import { SparsePageFallback } from "@/components/article/SparsePageFallback";
import { getSectionDesign } from "@/data/section-design";
import { getSectionContext } from "@/lib/nav-context";
import { layoutLabels, resolvePageLayout, type PageLayout } from "@/lib/page-layout";
import { processContentHtml } from "@/lib/process-content";
import { cn } from "@/lib/utils";

function layoutProseClass(layout: PageLayout): string {
  switch (layout) {
    case "index":
    case "chapter":
      return "max-w-3xl";
    case "gallery":
    case "winners":
    case "video-hub":
      return "max-w-3xl attla-layout-video-hub";
    case "video-article":
      return "max-w-3xl";
    default:
      return "max-w-[42rem]";
  }
}

export function PremiumArticle({
  title,
  contentHtml,
  path,
}: {
  title: string;
  contentHtml: string;
  path: string;
}) {
  const processed = processContentHtml(contentHtml, title, path);
  const layout = resolvePageLayout(processed, path);
  const nav = getSectionContext(path);
  const sectionDesign = getSectionDesign(path);
  const showHero = Boolean(processed.heroImage) && layout !== "sparse";
  const isSparse = layout === "sparse";
  const isPlaceholder = layout === "placeholder";
  const showAside = nav.children.length > 0 || nav.siblings.length > 0;

  return (
    <article className="bg-[var(--surface)]">
      {showHero && processed.heroImage ? (
        <ArticleHero
          src={processed.heroImage.src}
          alt={processed.heroImage.alt}
          title={title}
        />
      ) : (
        <header className="site-container border-b border-[var(--line)] pb-10 pt-14 md:pt-20">
          <nav aria-label="Breadcrumb" className="mb-6">
            <ol className="flex flex-wrap items-center gap-2 text-xs font-medium uppercase tracking-wider text-[var(--muted)]">
              {nav.breadcrumbs.map((crumb, i) => (
                <li key={crumb.href} className="flex items-center gap-2">
                  {i > 0 && (
                    <span aria-hidden className="text-[var(--line-strong)]">
                      /
                    </span>
                  )}
                  {i === nav.breadcrumbs.length - 1 ? (
                    <span className="text-[var(--ink)]">{crumb.label}</span>
                  ) : (
                    <Link
                      href={crumb.href}
                      className="no-underline transition-colors hover:text-[var(--accent)]"
                    >
                      {crumb.label}
                    </Link>
                  )}
                </li>
              ))}
            </ol>
          </nav>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--accent)]">
            {layoutLabels[layout]}
          </p>
          <h1 className="font-display mt-3 max-w-4xl text-4xl font-semibold leading-[1.08] tracking-tight text-[var(--ink)] md:text-5xl lg:text-6xl">
            {title}
          </h1>
          {processed.publishedDate && (
            <time
              dateTime={processed.publishedDate}
              className="mt-4 block text-sm text-[var(--muted)]"
            >
              {processed.publishedDate}
            </time>
          )}
        </header>
      )}

      <div
        className={cn(
          "site-container py-12 md:py-16",
          showHero && "pt-12 md:pt-16"
        )}
      >
        {showHero && (
          <nav aria-label="Breadcrumb" className="mb-8">
            <ol className="flex flex-wrap items-center gap-2 text-xs font-medium uppercase tracking-wider text-[var(--muted)]">
              {nav.breadcrumbs.map((crumb, i) => (
                <li key={crumb.href} className="flex items-center gap-2">
                  {i > 0 && <span aria-hidden>/</span>}
                  {i === nav.breadcrumbs.length - 1 ? (
                    <span>{crumb.label}</span>
                  ) : (
                    <Link
                      href={crumb.href}
                      className="no-underline hover:text-[var(--accent)]"
                    >
                      {crumb.label}
                    </Link>
                  )}
                </li>
              ))}
            </ol>
          </nav>
        )}

        {sectionDesign && !isSparse && (
          <div className="mb-10 max-w-3xl rounded-lg border border-[var(--line)] bg-[var(--surface-elevated)] px-5 py-4">
            <p className="text-[var(--ink-soft)] leading-relaxed">{sectionDesign.intro}</p>
            {sectionDesign.layoutHint && (
              <p className="mt-2 text-sm text-[var(--muted)]">{sectionDesign.layoutHint}</p>
            )}
          </div>
        )}

        {isPlaceholder && (
          <div className="mb-10 max-w-3xl rounded-lg border border-amber-200 bg-amber-50 px-5 py-4 text-sm text-amber-950">
            The original site had placeholder text on this page. Browse related sections
            using the menu or search for archival content elsewhere in the collection.
          </div>
        )}

        <div
          className={cn(
            "grid gap-12",
            showAside && !isSparse && "lg:grid-cols-[minmax(0,1fr)_280px] lg:gap-16"
          )}
        >
          <div className="min-w-0">
            {isSparse ? (
              <SparsePageFallback title={title} context={nav} />
            ) : (
              <>
                {processed.embedVideo &&
                  !processed.bodyHtml.includes("attla-video") && (
                    <ArticleVideo embedUrl={processed.embedVideo} title={title} />
                  )}

                {processed.bodyHtml.length > 0 && (
                  <div
                    className={cn(
                      "attla-prose mx-auto",
                      layoutProseClass(layout),
                      layout === "winners" && "attla-layout-winners"
                    )}
                    dangerouslySetInnerHTML={{ __html: processed.bodyHtml }}
                  />
                )}
              </>
            )}
          </div>

          {showAside && !isSparse && (
            <SectionAside context={nav} currentPath={path} />
          )}
        </div>
      </div>
    </article>
  );
}
