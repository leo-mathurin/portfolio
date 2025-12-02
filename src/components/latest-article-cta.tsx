import { Suspense } from "react";
import { getLatestPost } from "@/data/blog";
import { LatestArticleCTAClient } from "./latest-article-cta-client";
import { LatestArticleSkeleton } from "@/components/skeletons/latest-article-skeleton";

const BLUR_FADE_DELAY = 0.04;

interface LatestArticleCTAProps {
  language: string;
}

/**
 * Server Component that fetches the latest blog post.
 * Wrapped in Suspense for streaming.
 */
async function LatestArticleContent({ language }: LatestArticleCTAProps) {
  const latestPost = await getLatestPost(language);

  if (!latestPost) {
    return null;
  }

  return (
    <LatestArticleCTAClient
      latestPost={latestPost}
      blurFadeDelay={BLUR_FADE_DELAY}
    />
  );
}

/**
 * LatestArticleCTA with server-side data fetching and Suspense streaming.
 * Shows skeleton immediately while data loads on the server.
 */
export function LatestArticleCTA({ language }: LatestArticleCTAProps) {
  return (
    <Suspense fallback={<LatestArticleSkeleton />}>
      <LatestArticleContent language={language} />
    </Suspense>
  );
}
