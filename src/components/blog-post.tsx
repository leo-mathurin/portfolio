"use client";

import { DATA } from "@/data/resume";
import { formatDate, parseMarkdownLinks } from "@/lib/utils";
import { useTranslation } from "@/lib/translations";
import Image from "next/image";
import Link from "next/link";
import { Icons } from "@/components/icons";
import { useEffect, useMemo, useRef } from "react";
import { notFound } from "next/navigation";
import { useLanguage } from "@/components/language-toggle";
import BlurFade from "@/components/magicui/blur-fade";
import type { Metadata } from "@/data/blog";
import { Newsletter } from "@/components/newsletter";
import { Separator } from "./ui/separator";

interface BlogPostProps {
  readonly slug: string;
  readonly preloadedPosts?: {
    en: {
      source: string;
      metadata: Metadata;
      slug: string;
    };
    fr: {
      source: string;
      metadata: Metadata;
      slug: string;
    } | null;
  } | null;
  readonly initialLang?: string;
}

export function BlogPost({ slug, preloadedPosts, initialLang }: BlogPostProps) {
  const { language } = useTranslation();
  const { setLanguage } = useLanguage();
  const hasInitialized = useRef(false);

  // Sync URL param with context on mount, then keep URL in sync
  useEffect(() => {
    if (typeof window === "undefined") return;

    if (!hasInitialized.current) {
      hasInitialized.current = true;
      const url = new URL(window.location.href);
      const urlLang = url.searchParams.get("lang");

      // Priority: URL param > initialLang prop > context language
      if (
        urlLang &&
        (urlLang === "en" || urlLang === "fr") &&
        urlLang !== language
      ) {
        setLanguage(urlLang);
        return; // URL already has the param, no need to update
      } else if (!urlLang && initialLang && initialLang !== language) {
        setLanguage(initialLang);
        // Update URL with initialLang
        url.searchParams.set("lang", initialLang);
        window.history.replaceState({}, "", url.toString());
        return;
      }
    }

    // Keep URL in sync with context language
    const url = new URL(window.location.href);
    const urlLang = url.searchParams.get("lang");
    if (urlLang !== language) {
      url.searchParams.set("lang", language);
      window.history.replaceState({}, "", url.toString());
    }
  }, [language, setLanguage, initialLang]);

  // Memoize the current post based on language and preloaded posts
  const currentPost = useMemo(() => {
    if (!preloadedPosts) return null;
    const lang = language as "en" | "fr";
    return preloadedPosts[lang] || preloadedPosts.en;
  }, [preloadedPosts, language]);

  // If no preloaded posts, show not found (shouldn't happen with static generation)
  if (!currentPost) {
    notFound();
  }

  const post = currentPost;

  // Memoize JSON-LD structured data
  const jsonLd = useMemo(() => {
    const base = {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      headline: post.metadata.title,
      datePublished: post.metadata.publishedAt,
      dateModified: post.metadata.publishedAt,
      description: post.metadata.summary,
      image: post.metadata.image
        ? `${DATA.url}${post.metadata.image}`
        : `${DATA.url}/og?title=${post.metadata.title}`,
      url: `${DATA.url}/blog/${slug}`,
      author: {
        "@type": "Person",
        name: DATA.name,
      },
    };

    if (post.metadata.video) {
      return {
        ...base,
        video: {
          "@type": "VideoObject",
          contentUrl: post.metadata.video,
          thumbnailUrl: post.metadata.image
            ? `${DATA.url}${post.metadata.image}`
            : `${DATA.url}/og?title=${post.metadata.title}`,
          name: post.metadata.title,
          description: post.metadata.summary,
          uploadDate: post.metadata.publishedAt,
        },
      };
    }

    return base;
  }, [post.metadata, slug]);

  const BLUR_FADE_DELAY = 0.04;

  return (
    <>
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd),
        }}
      />
      <BlurFade delay={BLUR_FADE_DELAY}>
        <div className="flex justify-between items-center mt-2 mb-8 text-sm max-w-[650px]">
          <Link
            href="/blog"
            className="flex items-center gap-2 hover:underline"
          >
            <Icons.arrowLeft className="size-4" />
            {language === "fr" ? "Retour au blog" : "Back to blog"}
          </Link>
        </div>
      </BlurFade>
      <BlurFade delay={BLUR_FADE_DELAY * 2}>
        <h1 className="title font-medium text-2xl tracking-tighter max-w-[650px]">
          {post.metadata.title}
        </h1>
      </BlurFade>
      <BlurFade delay={BLUR_FADE_DELAY * 3}>
        <div className="flex justify-between items-center mt-2 mb-8 text-sm max-w-[650px]">
          <p className="text-sm text-neutral-600 dark:text-neutral-400">
            {formatDate(post.metadata.publishedAt, language)}
          </p>
        </div>
      </BlurFade>
      {post.metadata.video ? (
        <BlurFade delay={BLUR_FADE_DELAY * 4}>
          <div className="mb-8">
            <div className="relative w-full h-64 md:h-80 rounded-lg overflow-hidden">
              <video
                src={post.metadata.video}
                autoPlay
                muted
                loop
                controls
                playsInline
                className={`w-full h-full object-cover ${
                  post.metadata.imagePosition || "object-top"
                }`}
                poster={post.metadata.image ? post.metadata.image : undefined}
              />
            </div>
            {post.metadata.imageCredit && (
              <p className="text-xs text-neutral-500 dark:text-neutral-400 text-center mt-2 italic">
                {parseMarkdownLinks(post.metadata.imageCredit)}
              </p>
            )}
          </div>
        </BlurFade>
      ) : (
        post.metadata.image && (
          <BlurFade delay={BLUR_FADE_DELAY * 4}>
            <div className="mb-8">
              <div className="relative w-full h-64 md:h-80 rounded-lg overflow-hidden">
                <Image
                  src={post.metadata.image}
                  alt={post.metadata.title}
                  fill
                  priority
                  className={`object-cover ${
                    post.metadata.imagePosition || "object-top"
                  } aspect-3/2`}
                />
              </div>
              {post.metadata.imageCredit && (
                <p className="text-xs text-neutral-500 dark:text-neutral-400 text-center mt-2 italic">
                  {parseMarkdownLinks(post.metadata.imageCredit)}
                </p>
              )}
            </div>
          </BlurFade>
        )
      )}

      <BlurFade delay={BLUR_FADE_DELAY * 5}>
        <article
          className="prose dark:prose-invert text-pretty"
          dangerouslySetInnerHTML={{ __html: post.source }}
        ></article>
      </BlurFade>

      <BlurFade className="my-24" delay={BLUR_FADE_DELAY * 6}>
        <Newsletter />
      </BlurFade>

      <BlurFade delay={BLUR_FADE_DELAY * 7}>
        <Separator className="mt-10 mb-6" />
        <div className="flex items-center justify-end gap-3">
          <div className="text-right">
            <p className="font-medium">Léo Mathurin</p>
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              {DATA.title[language as keyof typeof DATA.title]}
            </p>
          </div>
          <div className="h-10 w-10 rounded-full overflow-hidden bg-neutral-100 dark:bg-neutral-800">
            <Image
              src="/memoji.png"
              alt="Léo Mathurin"
              width={40}
              height={40}
              className="h-full w-full object-cover"
            />
          </div>
        </div>
      </BlurFade>

      <BlurFade delay={BLUR_FADE_DELAY * 8}>
        <div className="mt-12 sm:mb-0 mb-12 text-sm text-neutral-500 dark:text-neutral-400 text-center italic">
          {language === "fr"
            ? "© 2025 Léo Mathurin. Tous droits réservés."
            : "© 2025 Léo Mathurin. All Rights Reserved."}
        </div>
      </BlurFade>
    </>
  );
}
