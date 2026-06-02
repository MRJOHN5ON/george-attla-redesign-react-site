"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, Menu, Rss, Search, X } from "lucide-react";
import { useEffect, useState, type CSSProperties, type ReactNode } from "react";
import { SearchDialog } from "@/components/SearchDialog";
import {
  exploreNav,
  navItems,
  primaryBarNav,
  site,
} from "@/data/home";
import { isNavActive, isNavBranchActive } from "@/lib/nav-active";
import { cn } from "@/lib/utils";
import type { NavItem } from "@/types/home";

function hasChildren(item: NavItem): boolean {
  return Boolean(item.children?.length);
}

function NavLink({
  item,
  className,
  onClick,
  style,
  active,
  children,
  ariaLabel,
}: {
  item: NavItem;
  className: string;
  onClick?: () => void;
  style?: CSSProperties;
  active?: boolean;
  children?: ReactNode;
  ariaLabel?: string;
}) {
  return (
    <Link
      href={item.href}
      className={cn(className, active && "text-[var(--accent)]")}
      onClick={onClick}
      style={style}
      aria-current={active ? "page" : undefined}
      aria-label={ariaLabel}
    >
      {children ?? item.label}
    </Link>
  );
}

/** Top of each dropdown — makes clear the bar label is also a page. */
function DropdownSectionHeader({
  item,
  pathname,
  onNavigate,
}: {
  item: NavItem;
  pathname: string;
  onNavigate?: () => void;
}) {
  const active = isNavActive(pathname, item.href);

  return (
    <div className="mb-3 flex items-baseline justify-between gap-3 border-b border-[var(--line)] pb-3">
      <NavLink
        item={item}
        active={active}
        onClick={onNavigate}
        className="font-display text-[15px] font-semibold leading-snug text-[var(--ink)] no-underline transition-colors hover:text-[var(--accent)]"
      />
      <span className="shrink-0 text-[11px] font-medium uppercase tracking-wider text-[var(--muted)]">
        Overview
      </span>
    </div>
  );
}

function NavMenuTrigger({
  item,
  active,
  className,
}: {
  item: NavItem;
  active?: boolean;
  className?: string;
}) {
  return (
    <div className={cn("flex items-stretch", className)}>
      <NavLink
        item={item}
        active={active}
        className="flex items-center rounded-l-md px-3 py-2.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--ink-soft)] no-underline transition-colors hover:bg-[var(--surface-elevated)] hover:text-[var(--accent)] xl:pl-3.5"
        aria-label={`${item.label} overview`}
      />
      <span
        className="flex items-center rounded-r-md px-1.5 py-2.5 text-[var(--muted)] transition-colors group-hover:bg-[var(--surface-elevated)] group-hover:text-[var(--accent)] xl:pr-2"
        aria-hidden
      >
        <ChevronDown className="size-3.5 transition-transform group-hover:rotate-180" />
      </span>
    </div>
  );
}

function SubmenuLinks({
  items,
  pathname,
  onNavigate,
}: {
  items: NavItem[];
  pathname: string;
  onNavigate?: () => void;
}) {
  return (
    <ul className="space-y-0.5">
      {items.map((child) => (
        <li key={`${child.href}-${child.label}`}>
          <NavLink
            item={child}
            active={isNavActive(pathname, child.href)}
            onClick={onNavigate}
            className="block rounded-md px-3 py-2 text-[13px] text-[var(--ink-soft)] no-underline transition-colors hover:bg-[var(--surface-elevated)] hover:text-[var(--accent)]"
          />
          {hasChildren(child) && (
            <ul className="ml-3 border-l border-[var(--line)] pl-2">
              {child.children!.map((grand) => (
                <li key={`${grand.href}-${grand.label}`}>
                  <NavLink
                    item={grand}
                    active={isNavActive(pathname, grand.href)}
                    onClick={onNavigate}
                    className="block rounded-md px-2 py-1.5 text-[12px] text-[var(--muted)] no-underline transition-colors hover:text-[var(--accent)]"
                  />
                </li>
              ))}
            </ul>
          )}
        </li>
      ))}
    </ul>
  );
}

function RacingMegaMenu({
  item,
  pathname,
}: {
  item: NavItem;
  pathname: string;
}) {
  const [career, ...races] = item.children ?? [];
  const branchActive = isNavBranchActive(pathname, item);

  return (
    <li className="group relative">
      <NavMenuTrigger item={item} active={branchActive} />

      <div className="invisible absolute left-0 top-full z-50 pt-2 opacity-0 transition-all duration-200 group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100">
        <div className="w-[min(calc(100vw-2.5rem),42rem)] rounded-xl border border-[var(--line)] bg-white p-5 shadow-xl">
          <DropdownSectionHeader item={item} pathname={pathname} />
          <div className="grid gap-6 sm:grid-cols-2">
            {career && (
              <div>
                <NavLink
                  item={career}
                  active={isNavBranchActive(pathname, career)}
                  className="mb-2 block font-display text-base font-semibold text-[var(--ink)] no-underline hover:text-[var(--accent)]"
                />
                {career.children && (
                  <SubmenuLinks items={career.children} pathname={pathname} />
                )}
              </div>
            )}
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.14em] text-[var(--muted)]">
                Championships & races
              </p>
              <SubmenuLinks items={races} pathname={pathname} />
            </div>
          </div>
        </div>
      </div>
    </li>
  );
}

function ExploreMegaMenu({ pathname }: { pathname: string }) {
  const exploreActive = exploreNav.some((item) => isNavBranchActive(pathname, item));

  return (
    <li className="group relative">
      <div
        className={cn(
          "flex items-center gap-0.5 rounded-md px-3 py-2.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--ink-soft)] transition-colors group-hover:bg-[var(--surface-elevated)] xl:px-3.5",
          exploreActive && "text-[var(--accent)]"
        )}
        aria-haspopup="true"
      >
        <span>Explore</span>
        <ChevronDown className="size-3.5 text-[var(--muted)] transition-transform group-hover:rotate-180" aria-hidden />
      </div>

      <div className="invisible absolute right-0 top-full z-50 pt-2 opacity-0 transition-all duration-200 group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100">
        <div className="w-[min(calc(100vw-2.5rem),56rem)] rounded-xl border border-[var(--line)] bg-white p-5 shadow-xl">
          <p className="mb-4 border-b border-[var(--line)] pb-3 font-display text-[15px] font-semibold text-[var(--ink)]">
            More from the archive
          </p>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            {exploreNav.map((section) => (
              <div key={`${section.href}-${section.label}`}>
                <NavLink
                  item={section}
                  active={isNavBranchActive(pathname, section)}
                  className="mb-2 block font-display text-[15px] font-semibold leading-snug text-[var(--ink)] no-underline hover:text-[var(--accent)]"
                />
                {section.children && (
                  <ul className="space-y-1">
                    {section.children.map((child) => (
                      <li key={`${child.href}-${child.label}`}>
                        <NavLink
                          item={child}
                          active={isNavActive(pathname, child.href)}
                          className="block text-[12px] leading-snug text-[var(--muted)] no-underline transition-colors hover:text-[var(--accent)]"
                        />
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </li>
  );
}

function DesktopDropdownItem({ item, pathname }: { item: NavItem; pathname: string }) {
  const branchActive = isNavBranchActive(pathname, item);

  if (item.href === "/sprint-racing-2") {
    return <RacingMegaMenu item={item} pathname={pathname} />;
  }

  if (!hasChildren(item)) {
    return (
      <li>
        <NavLink
          item={item}
          active={isNavActive(pathname, item.href)}
          className="block px-3 py-2.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--ink-soft)] no-underline transition-colors hover:text-[var(--accent)] xl:px-3.5"
        />
      </li>
    );
  }

  return (
    <li className="group relative">
      <NavMenuTrigger item={item} active={branchActive} />
      <div className="invisible absolute left-0 top-full z-50 min-w-[min(100vw-2rem,280px)] pt-2 opacity-0 transition-all duration-200 group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100">
        <div className="rounded-lg border border-[var(--line)] bg-white p-3 shadow-xl">
          <DropdownSectionHeader item={item} pathname={pathname} />
          <SubmenuLinks items={item.children!} pathname={pathname} />
        </div>
      </div>
    </li>
  );
}

function MobileNavBranch({
  item,
  depth,
  onNavigate,
  openKeys,
  toggleKey,
  pathname,
}: {
  item: NavItem;
  depth: number;
  onNavigate: () => void;
  openKeys: Set<string>;
  toggleKey: (key: string) => void;
  pathname: string;
}) {
  const key = `${item.href}-${item.label}`;
  const open = openKeys.has(key);
  const padding = { paddingLeft: `${16 + depth * 12}px` };
  const active = isNavActive(pathname, item.href);

  if (!hasChildren(item)) {
    return (
      <li>
        <NavLink
          item={item}
          active={active}
          onClick={onNavigate}
          className="block py-3 text-sm text-[var(--ink-soft)] no-underline"
          style={padding}
        />
      </li>
    );
  }

  return (
    <li>
      <div className="flex items-stretch border-t border-[var(--line)]" style={padding}>
        <NavLink
          item={item}
          active={active}
          onClick={onNavigate}
          className="min-w-0 flex-1 py-3 text-sm font-medium no-underline"
        />
        <button
          type="button"
          aria-expanded={open}
          aria-label={`Expand ${item.label}`}
          onClick={() => toggleKey(key)}
          className="px-4 py-3"
        >
          <ChevronDown className={cn("size-4 transition-transform", open && "rotate-180")} />
        </button>
      </div>
      {open && (
        <ul className="bg-[var(--surface-elevated)]">
          {item.children!.map((child) => (
            <MobileNavBranch
              key={`${child.href}-${child.label}`}
              item={child}
              depth={depth + 1}
              onNavigate={onNavigate}
              openKeys={openKeys}
              toggleKey={toggleKey}
              pathname={pathname}
            />
          ))}
        </ul>
      )}
    </li>
  );
}

export function SiteHeader() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [openKeys, setOpenKeys] = useState<Set<string>>(new Set());

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  const toggleKey = (key: string) => {
    setOpenKeys((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--line)] bg-white/90 backdrop-blur-md">
      <div className="site-container">
        <div className="flex items-center justify-between gap-4 py-3 md:py-4">
          <Link href="/" className="min-w-0 shrink no-underline">
            <span className="font-display block text-lg font-semibold leading-tight tracking-tight text-[var(--ink)] sm:text-xl xl:text-2xl">
              {site.title}
            </span>
            <span className="mt-0.5 hidden text-[11px] font-medium leading-snug text-[var(--muted)] md:block xl:text-xs">
              {site.tagline}
            </span>
          </Link>

          <div className="flex shrink-0 items-center gap-1.5">
            <a
              href={site.rssUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden items-center gap-1.5 rounded-full px-2.5 py-1.5 text-xs font-medium text-[var(--muted)] no-underline transition-colors hover:bg-[var(--surface-elevated)] hover:text-[var(--ink)] sm:inline-flex"
            >
              <Rss className="size-3.5" aria-hidden />
              <span className="hidden lg:inline">RSS</span>
            </a>
            <button
              type="button"
              aria-label="Search site"
              aria-haspopup="dialog"
              onClick={() => setSearchOpen(true)}
              className="flex size-9 items-center justify-center rounded-full text-[var(--muted)] transition-colors hover:bg-[var(--surface-elevated)] hover:text-[var(--ink)]"
            >
              <Search className="size-4" />
            </button>
            <button
              type="button"
              aria-label={menuOpen ? "Close menu" : "Open site menu"}
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen((o) => !o)}
              className="flex size-9 items-center justify-center rounded-full text-[var(--ink)] transition-colors hover:bg-[var(--surface-elevated)] xl:hidden"
            >
              {menuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
            </button>
          </div>
        </div>

        {/* Desktop: 4 primary sections + Explore (1280px+) */}
        <nav
          className="hidden border-t border-[var(--line)] py-0.5 xl:block"
          aria-label="Main"
        >
          <ul className="flex flex-nowrap items-center justify-start gap-0.5">
            {primaryBarNav.map((item) => (
              <DesktopDropdownItem
                key={`${item.href}-${item.label}`}
                item={item}
                pathname={pathname}
              />
            ))}
            <ExploreMegaMenu pathname={pathname} />
          </ul>
        </nav>

        {/* Tablet / mobile: full site tree */}
        <nav
          className={cn(
            "overflow-hidden border-t border-[var(--line)] transition-all xl:hidden",
            menuOpen ? "max-h-[85vh] overflow-y-auto py-2" : "max-h-0"
          )}
          aria-label="Main"
        >
          <ul>
            {navItems.map((item) => (
              <MobileNavBranch
                key={`${item.href}-${item.label}`}
                item={item}
                depth={0}
                onNavigate={() => setMenuOpen(false)}
                openKeys={openKeys}
                toggleKey={toggleKey}
                pathname={pathname}
              />
            ))}
          </ul>
        </nav>
      </div>

      <SearchDialog open={searchOpen} onClose={() => setSearchOpen(false)} />
    </header>
  );
}
