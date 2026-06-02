import Link from "next/link";
import { footerCta, navItems, sidebarLinks, site } from "@/data/home";

export function SiteFooter() {
  const explore = navItems.filter((n) => !n.children?.length).slice(0, 5);

  return (
    <footer className="mt-auto border-t border-[var(--line)] bg-[var(--ink)] text-stone-300">
      <div className="site-container py-16 md:py-20">
        <div className="grid gap-12 md:grid-cols-12">
          <div className="md:col-span-5">
            <p className="font-display text-2xl font-semibold text-white md:text-3xl">
              {site.title}
            </p>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-stone-400">
              {site.tagline}
            </p>
            <p className="mt-6 text-sm leading-relaxed text-stone-500">
              This site was made possible by a grant from the Alaska Humanities Forum.
              All materials are free for educational use with credit to original authors.
            </p>
          </div>

          <div className="md:col-span-3">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-stone-500">
              Explore
            </p>
            <ul className="mt-4 space-y-2.5">
              {explore.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm text-stone-300 no-underline transition-colors hover:text-white"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-4">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-stone-500">
              Resources
            </p>
            <ul className="mt-4 space-y-2.5">
              {[...sidebarLinks, ...footerCta].map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm text-stone-300 no-underline transition-colors hover:text-white"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-3 border-t border-stone-800 pt-8 text-xs text-stone-500 sm:flex-row sm:items-center sm:justify-between">
          <p className="m-0">
            © <Link href="/" className="text-stone-400 no-underline hover:text-white">{site.title}</Link>{" "}
            {new Date().getFullYear()}
          </p>
          <a href="#top" className="text-stone-400 no-underline hover:text-white">
            Back to top
          </a>
        </div>
      </div>
    </footer>
  );
}
