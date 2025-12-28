"use client";

import { useEffect, useState } from "react";
import { useLocale } from "next-intl";
import { useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";
import BlurFade from "@/components/magicui/blur-fade";
import { formatDate } from "@/lib/utils";
import type { BlogPost } from "@/data/blog";

interface BlogLanguageClientProps {
  initialPosts: BlogPost[];
  preloadedPosts?: {
    en: BlogPost[];
    fr: BlogPost[];
  };
  blurFadeDelay: number;
}

export function BlogLanguageClient({
  initialPosts,
  preloadedPosts,
  blurFadeDelay,
}: BlogLanguageClientProps) {
  const locale = useLocale();
  const t = useTranslations();
  const [fetchedPosts, setFetchedPosts] = useState<BlogPost[] | null>(null);

  // Fetch posts from API only when preloadedPosts is not available
  useEffect(() => {
    if (preloadedPosts) return;

    const fetchPosts = async () => {
      const response = await fetch(`/api/blog?lang=${locale}`).catch(
        (error) => {
          console.error("Failed to fetch posts:", error);
          return null;
        },
      );

      if (!response?.ok) {
        if (response) {
          console.error(`HTTP error! Status: ${response.status}`);
        }
        return;
      }

      const data = await response.json();
      setFetchedPosts(data);
    };

    fetchPosts();
  }, [locale, preloadedPosts]);

  // Derive posts: preloaded > fetched > initial
  const posts = preloadedPosts
    ? preloadedPosts[locale as "en" | "fr"] || preloadedPosts.en
    : (fetchedPosts ?? initialPosts);

  if (!posts || posts.length === 0) {
    return <p className="text-muted-foreground">{t("no_blog_posts")}</p>;
  }

  return (
    <>
      {posts
        .toSorted((a, b) =>
          new Date(a.metadata.publishedAt) > new Date(b.metadata.publishedAt)
            ? -1
            : 1,
        )
        .map((post, id) => (
          <BlurFade delay={blurFadeDelay * 2 + id * 0.05} key={post?.slug}>
            <Link
              className="flex flex-col space-y-2 mb-8 group"
              href={
                locale === "en"
                  ? `/blog/${post?.slug}`
                  : `/blog/${post?.slug}?lang=${locale}`
              }
            >
              {post?.metadata?.video ? (
                <div className="relative w-full h-48 rounded-lg overflow-hidden mb-2">
                  <video
                    src={post.metadata.video}
                    muted
                    autoPlay
                    preload="none"
                    loop
                    playsInline
                    className={`w-full h-full object-cover ${
                      post?.metadata?.imagePosition || "object-top"
                    }`}
                    poster={post.metadata.image || undefined}
                  />
                </div>
              ) : (
                post?.metadata?.image && (
                  <div className="relative w-full h-48 rounded-lg overflow-hidden mb-2">
                    <Image
                      src={post.metadata.image}
                      alt={post.metadata.title}
                      fill
                      className={`object-cover ${
                        post?.metadata?.imagePosition || "object-top"
                      } transition-transform group-hover:scale-105`}
                    />
                  </div>
                )
              )}
              <div className="w-full flex flex-col">
                <p className="font-medium tracking-tight">
                  {post?.metadata?.title}
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  {post?.metadata?.publishedAt &&
                    formatDate(post.metadata.publishedAt, locale)}
                </p>
                {post?.metadata?.summary && (
                  <p className="text-sm text-muted-foreground mt-2">
                    {post.metadata.summary}
                  </p>
                )}
              </div>
            </Link>
          </BlurFade>
        ))}
    </>
  );
}
