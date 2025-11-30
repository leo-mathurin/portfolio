"use client";

import { useEffect, useState } from "react";
import { useTranslation } from "@/lib/translations";
import { LatestArticleCTAClient } from "./latest-article-cta-client";
import { LatestArticleSkeleton } from "@/components/skeletons/latest-article-skeleton";
import type { BlogPost } from "@/data/blog";

const BLUR_FADE_DELAY = 0.04;

export function LatestArticleCTA() {
  const { language } = useTranslation();
  const [latestPost, setLatestPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchLatestPost() {
      try {
        const response = await fetch(`/api/blog/latest?lang=${language}`);
        if (response.ok) {
          const post = await response.json();
          setLatestPost(post);
        } else {
          setLatestPost(null);
        }
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch latest post:", error);
        setLatestPost(null);
        setLoading(false);
      }
    }

    fetchLatestPost();
  }, [language]);

  if (loading) {
    return <LatestArticleSkeleton />;
  }

  if (!latestPost) {
    return null;
  }

  return (
    <LatestArticleCTAClient
      latestPost={latestPost}
      blurFadeDelay={BLUR_FADE_DELAY * 17}
    />
  );
}
