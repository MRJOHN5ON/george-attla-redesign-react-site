import type { NavItem } from "@/types/home";

/** True when this nav href matches the current route (including nested paths). */
export function isNavActive(pathname: string, href: string): boolean {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

/** True if any descendant href is active (for parent highlight). */
export function isNavBranchActive(pathname: string, item: NavItem): boolean {
  if (isNavActive(pathname, item.href)) return true;
  return item.children?.some((c) => isNavBranchActive(pathname, c)) ?? false;
}
