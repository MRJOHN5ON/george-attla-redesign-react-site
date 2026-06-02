import { HomeFeatured } from "@/components/home/HomeFeatured";
import { HomeHero } from "@/components/home/HomeHero";
import { HomeStories } from "@/components/home/HomeStories";
import { SiteLayout } from "@/components/SiteLayout";
import { posts } from "@/data/home";

export default function Home() {
  return (
    <SiteLayout>
      <HomeHero />
      <HomeFeatured />
      <HomeStories posts={posts} />
    </SiteLayout>
  );
}
