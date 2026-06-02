export function ArticleVideo({ embedUrl, title }: { embedUrl: string; title: string }) {
  return (
    <figure className="not-prose my-12 overflow-hidden rounded-xl bg-stone-900 shadow-2xl ring-1 ring-stone-900/10">
      <div className="relative aspect-video w-full">
        <iframe
          src={embedUrl}
          title={title}
          className="absolute inset-0 size-full border-0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    </figure>
  );
}
