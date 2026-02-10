import { DATA } from "@/data/resume";
import { getBlogPosts } from "@/data/blog";
import type { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await getBlogPosts("en");

  const blogPostEntries: MetadataRoute.Sitemap = posts
    .filter((post): post is NonNullable<typeof post> => post !== null)
    .map((post) => ({
      url: `${DATA.url}blog/${post.slug}`,
      lastModified: new Date(post.metadata.publishedAt),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    }));

  return [
    {
      url: DATA.url,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: `${DATA.url}blog`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${DATA.url}notes`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    ...blogPostEntries,
  ];
}
