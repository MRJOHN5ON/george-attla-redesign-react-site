import { navItems } from "@/data/navigation";
import type { NavItem } from "@/types/home";

export interface NavCrumb {
  label: string;
  href: string;
}

export interface SectionContext {
  breadcrumbs: NavCrumb[];
  /** Top-level section (e.g. Sprint Racing) */
  section: NavItem | null;
  /** Parent of current page in nav tree */
  parent: NavItem | null;
  /** Pages at same level as current (siblings) */
  siblings: NavItem[];
  /** Direct children of current page in nav */
  children: NavItem[];
}

function findPath(
  items: NavItem[],
  path: string,
  trail: NavItem[]
): NavItem[] | null {
  for (const item of items) {
    const next = [...trail, item];
    if (item.href === path) return next;
    if (item.children) {
      const found = findPath(item.children, path, next);
      if (found) return found;
    }
  }
  return null;
}

function siblingsOf(trail: NavItem[]): NavItem[] {
  if (trail.length < 2) return [];
  const parent = trail[trail.length - 2];
  return parent.children?.filter((c) => c.href !== trail[trail.length - 1].href) ?? [];
}

export function getSectionContext(path: string): SectionContext {
  const trail = findPath(navItems, path, []);
  const breadcrumbs: NavCrumb[] = [{ label: "Home", href: "/" }];

  if (!trail) {
    const slug = path.replace(/^\//, "").split("/");
    let acc = "";
    for (const part of slug) {
      acc += `/${part}`;
      breadcrumbs.push({
        label: part.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
        href: acc,
      });
    }
    return {
      breadcrumbs,
      section: null,
      parent: null,
      siblings: [],
      children: [],
    };
  }

  for (const item of trail) {
    breadcrumbs.push({ label: item.label, href: item.href });
  }

  const current = trail[trail.length - 1];
  const section = trail.length >= 2 ? trail[1] : trail[0];
  const parent = trail.length >= 2 ? trail[trail.length - 2] : null;

  return {
    breadcrumbs,
    section: section.href === "/" ? null : section,
    parent: parent?.href === "/" ? null : parent,
    siblings: siblingsOf(trail),
    children: current.children ?? [],
  };
}
