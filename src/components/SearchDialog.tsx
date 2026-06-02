"use client";

import Link from "next/link";
import { useCallback, useEffect, useId, useRef, useState } from "react";
import { Search, X } from "lucide-react";
import { withBasePath } from "@/lib/base-path";
import { rankSearchResults, type SearchEntry } from "@/lib/search";
import { cn } from "@/lib/utils";

export function SearchDialog({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const titleId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");
  const [index, setIndex] = useState<SearchEntry[] | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open) return;
    setQuery("");
    const t = window.setTimeout(() => inputRef.current?.focus(), 50);
    return () => window.clearTimeout(t);
  }, [open]);

  useEffect(() => {
    if (!open || index) return;
    setLoading(true);
    fetch(withBasePath("/search-index.json"))
      .then((r) => r.json())
      .then((data: SearchEntry[]) => setIndex(data))
      .catch(() => setIndex([]))
      .finally(() => setLoading(false));
  }, [open, index]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  const results =
    index && query.trim().length >= 2
      ? rankSearchResults(query, index)
      : [];

  const handleClose = useCallback(() => {
    onClose();
  }, [onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-start justify-center bg-stone-950/50 px-4 pt-[12vh] backdrop-blur-sm"
      role="presentation"
      onClick={handleClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="w-full max-w-xl overflow-hidden rounded-xl border border-[var(--line)] bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 border-b border-[var(--line)] px-4 py-3">
          <Search className="size-5 shrink-0 text-[var(--muted)]" aria-hidden />
          <input
            ref={inputRef}
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search pages, topics, names…"
            className="min-w-0 flex-1 bg-transparent text-base text-[var(--ink)] outline-none placeholder:text-[var(--muted)]"
            aria-label="Search site"
            autoComplete="off"
          />
          <button
            type="button"
            onClick={handleClose}
            className="flex size-8 items-center justify-center rounded-full text-[var(--muted)] transition-colors hover:bg-[var(--surface-elevated)] hover:text-[var(--ink)]"
            aria-label="Close search"
          >
            <X className="size-4" />
          </button>
        </div>

        <div className="max-h-[min(50vh,400px)] overflow-y-auto p-2">
          <p id={titleId} className="sr-only">
            Search results
          </p>

          {loading && (
            <p className="px-3 py-6 text-center text-sm text-[var(--muted)]">
              Loading search index…
            </p>
          )}

          {!loading && query.trim().length < 2 && (
            <p className="px-3 py-6 text-center text-sm text-[var(--muted)]">
              Type at least 2 characters to search the archive.
            </p>
          )}

          {!loading && query.trim().length >= 2 && results.length === 0 && (
            <p className="px-3 py-6 text-center text-sm text-[var(--muted)]">
              No pages match &ldquo;{query}&rdquo;.
            </p>
          )}

          {results.length > 0 && (
            <ul className="space-y-0.5">
              {results.map((hit) => (
                <li key={hit.path}>
                  <Link
                    href={hit.path}
                    onClick={handleClose}
                    className={cn(
                      "block rounded-lg px-3 py-3 no-underline transition-colors",
                      "hover:bg-[var(--surface-elevated)]"
                    )}
                  >
                    <span className="font-display text-base font-semibold text-[var(--ink)]">
                      {hit.title}
                    </span>
                    {hit.excerpt && (
                      <span className="mt-1 line-clamp-2 block text-xs leading-relaxed text-[var(--muted)]">
                        {hit.excerpt}
                      </span>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>

        <p className="border-t border-[var(--line)] px-4 py-2 text-center text-[11px] text-[var(--muted)]">
          <kbd className="rounded border border-[var(--line)] bg-[var(--surface-elevated)] px-1.5 py-0.5 font-sans text-[10px]">
            Esc
          </kbd>{" "}
          to close
        </p>
      </div>
    </div>
  );
}
