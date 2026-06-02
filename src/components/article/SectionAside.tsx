import Link from "next/link";
import { isNavActive } from "@/lib/nav-active";
import type { SectionContext } from "@/lib/nav-context";

export function SectionAside({
  context,
  currentPath,
}: {
  context: SectionContext;
  currentPath: string;
}) {
  const links = context.children.length > 0 ? context.children : context.siblings;
  if (links.length === 0) return null;

  const heading =
    context.children.length > 0
      ? `In ${context.breadcrumbs[context.breadcrumbs.length - 1]?.label ?? "this section"}`
      : context.section
        ? `More in ${context.section.label}`
        : "Related pages";

  return (
    <aside className="lg:sticky lg:top-24 lg:self-start">
      <nav
        className="rounded-xl border border-[var(--line)] bg-[var(--surface-elevated)] p-5"
        aria-label={heading}
      >
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--accent)]">
          {heading}
        </p>
        <ul className="mt-4 space-y-1">
          {links.map((item) => {
            const active = isNavActive(currentPath, item.href);
            return (
              <li key={`${item.href}-${item.label}`}>
                <Link
                  href={item.href}
                  className={
                    active
                      ? "block rounded-md bg-white px-3 py-2 text-sm font-medium text-[var(--accent)] no-underline shadow-sm"
                      : "block rounded-md px-3 py-2 text-sm text-[var(--ink-soft)] no-underline transition-colors hover:bg-white hover:text-[var(--accent)]"
                  }
                  aria-current={active ? "page" : undefined}
                >
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
        {context.section && currentPath !== context.section.href && (
          <Link
            href={context.section.href}
            className="mt-4 block text-xs font-medium text-[var(--link)] no-underline hover:text-[var(--accent)]"
          >
            ← {context.section.label} overview
          </Link>
        )}
      </nav>
    </aside>
  );
}
