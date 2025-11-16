"use client";

import { useEffect, useState } from "react";
import { useTranslation } from "@/lib/translations";
import { LatestArticleCTAClient } from "./latest-article-cta-client";
import type { BlogPost } from "@/data/blog";

const BLUR_FADE_DELAY = 0.04;

export function LatestArticleCTA() {
  const { language } = useTranslation();
  const [latestPost, setLatestPost] = useState<BlogPost | null>(null);
  const [preloadedPosts, setPreloadedPosts] = useState<{
    en: BlogPost[];
    fr: BlogPost[];
  } | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch posts for both languages initially
  useEffect(() => {
    async function fetchAllPosts() {
      try {
        const [enResponse, frResponse] = await Promise.all([
          fetch("/api/blog?lang=en"),
          fetch("/api/blog?lang=fr"),
        ]);

        const enPosts = enResponse.ok ? await enResponse.json() : [];
        const frPosts = frResponse.ok ? await frResponse.json() : [];

        setPreloadedPosts({ en: enPosts, fr: frPosts });
      } catch (error) {
        console.error("Failed to fetch posts:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchAllPosts();
  }, []);

  // Update latest post when language changes
  useEffect(() => {
    if (!preloadedPosts) return;

    const posts = preloadedPosts[language as "en" | "fr"] || preloadedPosts.en;

    if (posts.length > 0) {
      const latest = posts.sort(
        (a: BlogPost, b: BlogPost) =>
          new Date(b.metadata.publishedAt).getTime() -
          new Date(a.metadata.publishedAt).getTime(),
      )[0];
      setLatestPost(latest);
    } else {
      setLatestPost(null);
    }
  }, [language, preloadedPosts]);

  if (loading || !latestPost) {
    return null;
  }

  return (
    <LatestArticleCTAClient
      latestPost={latestPost}
      blurFadeDelay={BLUR_FADE_DELAY * 17}
    />
  );
}
