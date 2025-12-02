"use client";

import { DATA } from "@/data/resume";
import { formatDate, parseMarkdownLinks } from "@/lib/utils";
import { useTranslation } from "@/lib/translations";
import Image from "next/image";
import Link from "next/link";
import { Icons } from "@/components/icons";
import type { Metadata } from "@/data/blog";

interface BlogPostHeaderProps {
  readonly metadata: {
    en: Metadata;
    fr: Metadata | null;
  };
  readonly slug: string;
}

export function BlogPostHeader({ metadata, slug }: BlogPostHeaderProps) {
  const { language } = useTranslation();

  const currentMetadata =
    language === "fr" && metadata.fr ? metadata.fr : metadata.en;

  // JSON-LD structured data
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: currentMetadata.title,
    datePublished: currentMetadata.publishedAt,
    dateModified: currentMetadata.publishedAt,
    description: currentMetadata.summary,
    image: currentMetadata.image
      ? `${DATA.url}${currentMetadata.image}`
      : `${DATA.url}/og?title=${currentMetadata.title}`,
    url: `${DATA.url}/blog/${slug}`,
    author: {
      "@type": "Person",
      name: DATA.name,
    },
    ...(currentMetadata.video && {
      video: {
        "@type": "VideoObject",
        contentUrl: currentMetadata.video,
        thumbnailUrl: currentMetadata.image
          ? `${DATA.url}${currentMetadata.image}`
          : `${DATA.url}/og?title=${currentMetadata.title}`,
        name: currentMetadata.title,
        description: currentMetadata.summary,
        uploadDate: currentMetadata.publishedAt,
      },
    }),
  };

  return (
    <>
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd),
        }}
      />
      {/* Back link - renders instantly */}
      <div className="flex justify-between items-center mt-2 mb-8 text-sm max-w-[650px]">
        <Link href="/blog" className="flex items-center gap-2 hover:underline">
          <Icons.arrowLeft className="size-4" />
          {language === "fr" ? "Retour au blog" : "Back to blog"}
        </Link>
      </div>

      {/* Title - renders instantly for LCP */}
      <h1 className="title font-medium text-2xl tracking-tighter max-w-[650px]">
        {currentMetadata.title}
      </h1>

      {/* Date - renders instantly */}
      <div className="flex justify-between items-center mt-2 mb-8 text-sm max-w-[650px]">
        <p className="text-sm text-neutral-600 dark:text-neutral-400">
          {formatDate(currentMetadata.publishedAt, language)}
        </p>
      </div>

      {/* Header image/video - renders instantly without BlurFade for LCP optimization */}
      {currentMetadata.video ? (
        <div className="mb-8">
          <div className="relative w-full h-64 md:h-80 rounded-lg overflow-hidden">
            <video
              src={currentMetadata.video}
              autoPlay
              muted
              loop
              preload="none"
              controls
              playsInline
              className={`w-full h-full object-cover ${
                currentMetadata.imagePosition || "object-top"
              }`}
              poster={currentMetadata.image ? currentMetadata.image : undefined}
            />
          </div>
          {currentMetadata.imageCredit && (
            <p className="text-xs text-neutral-500 dark:text-neutral-400 text-center mt-2 italic">
              {parseMarkdownLinks(currentMetadata.imageCredit)}
            </p>
          )}
        </div>
      ) : (
        currentMetadata.image && (
          <div className="mb-8">
            <div className="relative w-full h-64 md:h-80 rounded-lg overflow-hidden">
              <Image
                src={currentMetadata.image}
                alt={currentMetadata.title}
                fill
                priority
                fetchPriority="high"
                className={`object-cover ${
                  currentMetadata.imagePosition || "object-top"
                } aspect-3/2`}
              />
            </div>
            {currentMetadata.imageCredit && (
              <p className="text-xs text-neutral-500 dark:text-neutral-400 text-center mt-2 italic">
                {parseMarkdownLinks(currentMetadata.imageCredit)}
              </p>
            )}
          </div>
        )
      )}
    </>
  );
}
