import Link from "next/link";
import type { SectionContext } from "@/lib/nav-context";

export function SparsePageFallback({
  title,
  context,
}: {
  title: string;
  context: SectionContext;
}) {
  const links = context.children.length > 0 ? context.children : context.siblings;

  return (
    <div className="rounded-xl border border-[var(--line)] bg-[var(--surface-elevated)] p-8 text-center">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--accent)]">
        Section hub
      </p>
      <p className="mt-4 text-[var(--muted)] leading-relaxed">
        <strong className="text-[var(--ink)]">{title}</strong> is a navigation overview on
        the original site. The detailed content lives on the pages below.
      </p>
      {links.length > 0 && (
        <ul className="mx-auto mt-8 max-w-md space-y-2 text-left">
          {links.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className="block rounded-lg border border-[var(--line)] bg-white px-4 py-3 text-sm font-medium text-[var(--ink)] no-underline transition-colors hover:border-[var(--accent)] hover:text-[var(--accent)]"
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      )}
      {context.section && (
        <Link
          href={context.section.href}
          className="mt-6 inline-block text-sm font-medium text-[var(--link)] no-underline"
        >
          View {context.section.label} →
        </Link>
      )}
    </div>
  );
}
