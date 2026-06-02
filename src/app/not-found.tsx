import Link from "next/link";
import { SiteLayout } from "@/components/SiteLayout";
import { site } from "@/data/home";

export default function NotFound() {
  return (
    <SiteLayout>
      <div className="site-container flex min-h-[50vh] flex-col items-center justify-center py-24 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--accent)]">
          404
        </p>
        <h1 className="font-display mt-4 text-4xl font-semibold text-[var(--ink)]">
          Page not found
        </h1>
        <p className="mt-4 max-w-md text-[var(--muted)]">
          This page is not in the archive.
        </p>
        <Link
          href="/"
          className="mt-8 inline-flex rounded-full bg-[var(--ink)] px-6 py-3 text-sm font-semibold text-white no-underline"
        >
          {site.title}
        </Link>
      </div>
    </SiteLayout>
  );
}
