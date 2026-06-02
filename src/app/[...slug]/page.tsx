import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PremiumArticle } from "@/components/article/PremiumArticle";
import { SiteLayout } from "@/components/SiteLayout";
import { getAllPagePaths, getPageBySlug, pathToSlug } from "@/lib/pages";
import { site } from "@/data/home";

type Props = { params: Promise<{ slug: string[] }> };

export async function generateStaticParams() {
  return getAllPagePaths().map((pagePath) => ({
    slug: pathToSlug(pagePath),
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const page = await getPageBySlug(slug);
  if (!page) return { title: site.title };
  return {
    title: `${page.title} · ${site.title}`,
    description: page.title,
  };
}

export default async function ContentPage({ params }: Props) {
  const { slug } = await params;
  const page = await getPageBySlug(slug);
  if (!page) notFound();

  return (
    <SiteLayout>
      <PremiumArticle
        title={page.title}
        contentHtml={page.contentHtml}
        path={page.path}
      />
    </SiteLayout>
  );
}
