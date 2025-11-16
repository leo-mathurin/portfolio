"use client";

import { DATA } from "@/data/resume";
import { formatDate } from "@/lib/utils";
import { useTranslation } from "@/lib/translations";
import Image from "next/image";
import Link from "next/link";
import { Icons } from "@/components/icons";
import { useEffect, useMemo, useRef, useState } from "react";
import { notFound } from "next/navigation";
import { useLanguage } from "@/components/language-toggle";
import BlurFade from "@/components/magicui/blur-fade";

interface BlogPostProps {
  readonly slug: string;
  readonly preloadedPosts?: {
    en: {
      source: string;
      metadata: any;
      slug: string;
    };
    fr: {
      source: string;
      metadata: any;
      slug: string;
    } | null;
  } | null;
  readonly initialLang?: string;
}

export function BlogPost({ slug, preloadedPosts, initialLang }: BlogPostProps) {
  const { language } = useTranslation();
  const { setLanguage } = useLanguage();

  // Use lazy initializer to determine initial language from URL or props
  const [currentLanguage, setCurrentLanguage] = useState<string>(() => {
    // During SSR, use initialLang prop or default to 'en'
    if (typeof window === "undefined") {
      return initialLang || "en";
    }
    // On client, check URL first, then initialLang, then default to 'en'
    const url = new URL(window.location.href);
    const urlLang = url.searchParams.get("lang");
    return urlLang && (urlLang === "en" || urlLang === "fr")
      ? urlLang
      : initialLang || "en";
  });

  // Memoize the current post based on language and preloaded posts
  const currentPost = useMemo(() => {
    if (!preloadedPosts) return null;
    const lang = currentLanguage as "en" | "fr";
    return preloadedPosts[lang] || preloadedPosts.en;
  }, [preloadedPosts, currentLanguage]);

  const isInitialMount = useRef(true);

  // Initialize language on mount and sync with context
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      // Sync currentLanguage with language context if different
      if (currentLanguage !== language) {
        setLanguage(currentLanguage);
      }

      // Update URL if needed
      if (typeof window !== "undefined") {
        const url = new URL(window.location.href);
        const urlLang = url.searchParams.get("lang");

        if (currentLanguage !== "en" && !urlLang) {
          url.searchParams.set("lang", currentLanguage);
          window.history.replaceState({}, "", url.toString());
        }
      }
    }
  }, [currentLanguage, language, setLanguage]);

  // Handle language changes from context
  useEffect(() => {
    if (!isInitialMount.current && language !== currentLanguage) {
      setCurrentLanguage(language);

      // Update URL
      if (typeof window !== "undefined") {
        const url = new URL(window.location.href);
        url.searchParams.set("lang", language);
        window.history.replaceState({}, "", url.toString());
      }
    }
  }, [language, currentLanguage]);

  // If no preloaded posts, show not found (shouldn't happen with static generation)
  if (!currentPost) {
    notFound();
  }

  const post = currentPost;

  // Memoize JSON-LD structured data
  const jsonLd = useMemo(
    () => ({
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      headline: post.metadata.title,
      datePublished: post.metadata.publishedAt,
      dateModified: post.metadata.publishedAt,
      description: post.metadata.summary,
      image: post.metadata.image
        ? `${DATA.url}${post.metadata.image}`
        : `${DATA.url}/og?title=${post.metadata.title}`,
      ...(post.metadata.video && {
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
      }),
      url: `${DATA.url}/blog/${slug}`,
      author: {
        "@type": "Person",
        name: DATA.name,
      },
    }),
    [post.metadata, slug]
  );

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
          <div className="relative w-full h-64 md:h-80 rounded-lg overflow-hidden mb-8">
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
        </BlurFade>
      ) : (
        post.metadata.image && (
          <BlurFade delay={BLUR_FADE_DELAY * 4}>
            <div className="relative w-full h-64 md:h-80 rounded-lg overflow-hidden mb-8">
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
          </BlurFade>
        )
      )}

      <BlurFade delay={BLUR_FADE_DELAY * 5}>
        <article
          className="prose dark:prose-invert text-pretty"
          dangerouslySetInnerHTML={{ __html: post.source }}
        ></article>
      </BlurFade>

      <BlurFade delay={BLUR_FADE_DELAY * 6}>
        <div className="mt-10 pt-6 border-t border-neutral-200 dark:border-neutral-800">
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
        </div>
      </BlurFade>

      <BlurFade delay={BLUR_FADE_DELAY * 7}>
        <div className="mt-12 sm:mb-0 mb-12 text-sm text-neutral-500 dark:text-neutral-400 text-center italic">
          {language === "fr"
            ? "© 2025 Léo Mathurin. Tous droits réservés."
            : "© 2025 Léo Mathurin. All Rights Reserved."}
        </div>
      </BlurFade>
    </>
  );
}
