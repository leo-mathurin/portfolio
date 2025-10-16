"use client"

import { DATA } from "@/data/resume";
import { formatDate } from "@/lib/utils";
import { useTranslation } from "@/lib/translations";
import Image from "next/image";
import Link from "next/link";
import { Icons } from "@/components/icons";
import { Suspense, useEffect, useRef, useState } from "react";
import { notFound, useRouter } from "next/navigation";
import { useLanguage } from "@/components/language-toggle";

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
  const router = useRouter();
  const { language, t } = useTranslation();
  const { setLanguage } = useLanguage();
  const [post, setPost] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const initialLoadDone = useRef(false);
  const [currentLanguage, setCurrentLanguage] = useState<string>(initialLang || language);
  
  // First, handle initial load
  useEffect(() => {
    if (typeof window !== 'undefined' && !initialLoadDone.current) {
      initialLoadDone.current = true;
      
      // Determine the starting language with this priority:
      // 1. URL query parameter (highest priority)
      // 2. initialLang prop (passed from server)
      // 3. Current language from context (lowest priority)
      const url = new URL(window.location.href);
      const urlLang = url.searchParams.get("lang");
      let startingLang = language;
      
      if (urlLang && (urlLang === 'en' || urlLang === 'fr')) {
        startingLang = urlLang;
      } else if (initialLang && (initialLang === 'en' || initialLang === 'fr')) {
        startingLang = initialLang;
      }
      
      // Set the language if it's different from current
      if (startingLang !== language) {
        setLanguage(startingLang);
        setCurrentLanguage(startingLang);
      }
      
      // Update URL if language is not English and URL doesn't have lang parameter
      if (startingLang !== 'en' && !urlLang) {
        const newUrl = new URL(window.location.href);
        newUrl.searchParams.set("lang", startingLang);
        window.history.replaceState({}, '', newUrl.toString());
      }
      
      // If we have preloaded posts, use them
      if (preloadedPosts) {
        setPost(preloadedPosts[startingLang as 'en' | 'fr']);
        setLoading(false);
        return;
      }
      
      // Fall back to API if needed
      loadPost(startingLang);
    }
  }, []);
  
  // Track language changes (separate from initial URL check)
  useEffect(() => {
    // Skip the initial render
    if (initialLoadDone.current && language !== currentLanguage) {
      setCurrentLanguage(language);
      
      // Update URL
      const url = new URL(window.location.href);
      url.searchParams.set("lang", language);
      window.history.replaceState({}, '', url.toString());
      
      // If we have preloaded posts, switch directly
      if (preloadedPosts) {
        setPost(preloadedPosts[language as 'en' | 'fr']);
        return;
      }
      
      // Otherwise load via API
      loadPost(language);
    }
  }, [language]);
  
  // Separate function to load post to avoid code duplication
  async function loadPost(lang: string) {
    setLoading(true);
    
    try {
      const response = await fetch(`/api/blog/${slug}?lang=${lang}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      const postData = await response.json();
      setPost(postData);
    } catch (error) {
      console.error("Error loading blog post:", error);
      notFound();
    } finally {
      setLoading(false);
    }
  }

  // Show loading state while waiting
  if (loading) {
    return (
      <div className="flex flex-col space-y-4 w-full">
        <div className="flex justify-between items-center mt-2 mb-8 text-sm max-w-[650px]">
          <div className="flex items-center gap-2">
            <Icons.arrowLeft className="size-4" />
            <div className="h-5 bg-neutral-200 dark:bg-neutral-800 rounded animate-pulse w-24"></div>
          </div>
        </div>
        <div className="h-8 bg-neutral-200 dark:bg-neutral-800 rounded animate-pulse max-w-[650px]"></div>
        <div className="h-4 bg-neutral-200 dark:bg-neutral-800 rounded animate-pulse w-32 mt-2 mb-8"></div>
        <div className="h-64 md:h-80 bg-neutral-200 dark:bg-neutral-800 rounded animate-pulse w-full mb-8"></div>
        <div className="space-y-3">
          <div className="h-4 bg-neutral-200 dark:bg-neutral-800 rounded animate-pulse"></div>
          <div className="h-4 bg-neutral-200 dark:bg-neutral-800 rounded animate-pulse"></div>
          <div className="h-4 bg-neutral-200 dark:bg-neutral-800 rounded animate-pulse w-4/5"></div>
        </div>
      </div>
    );
  }

  if (!post) {
    notFound();
  }

  return (
    <>
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
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
                thumbnailUrl: post.metadata.image ? `${DATA.url}${post.metadata.image}` : `${DATA.url}/og?title=${post.metadata.title}`,
                name: post.metadata.title,
                description: post.metadata.summary,
                uploadDate: post.metadata.publishedAt,
              }
            }),
            url: `${DATA.url}/blog/${slug}`,
            author: {
              "@type": "Person",
              name: DATA.name,
            },
          }),
        }}
      />
      <div className="flex justify-between items-center mt-2 mb-8 text-sm max-w-[650px]">
        <Link href="/blog" className="flex items-center gap-2 hover:underline">
          <Icons.arrowLeft className="size-4" />
          {language === "fr" ? "Retour au blog" : "Back to blog"}
        </Link>
      </div>
      <h1 className="title font-medium text-2xl tracking-tighter max-w-[650px]">
        {post.metadata.title}
      </h1>
      <div className="flex justify-between items-center mt-2 mb-8 text-sm max-w-[650px]">
        <p className="text-sm text-neutral-600 dark:text-neutral-400">
          {formatDate(post.metadata.publishedAt, language)}
        </p>
      </div>
      {post.metadata.video ? (
        <div className="relative w-full h-64 md:h-80 rounded-lg overflow-hidden mb-8">
          <video 
            src={post.metadata.video}
            autoPlay
            muted
            loop
            controls
            playsInline
            className={`w-full h-full object-cover ${post.metadata.imagePosition || 'object-top'}`}
            poster={post.metadata.image ? post.metadata.image : undefined}
          />
        </div>
      ) : post.metadata.image && (
        <div className="relative w-full h-64 md:h-80 rounded-lg overflow-hidden mb-8">
          <Image
            src={post.metadata.image}
            alt={post.metadata.title}
            fill
            priority
            className={`object-cover ${post.metadata.imagePosition || 'object-top'} aspect-3/2`}
          />
        </div>
      )}
      
      <article
        className="prose dark:prose-invert text-pretty"
        dangerouslySetInnerHTML={{ __html: post.source }}
      ></article>
      
      <div className="mt-10 pt-6 border-t border-neutral-200 dark:border-neutral-800">
        <div className="flex items-center justify-end gap-3">
          <div className="text-right">
            <p className="font-medium">Léo Mathurin</p>
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              {language === "fr" ? "Développeur & Analyste Cybersécurité" : "Developer & Cybersecurity Analyst"}
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
      
      <div className="mt-12 sm:mb-0 mb-12 text-sm text-neutral-500 dark:text-neutral-400 text-center italic">
        {language === "fr" 
          ? "© 2025 Léo Mathurin. Tous droits réservés." 
          : "© 2025 Léo Mathurin. All Rights Reserved."}
      </div>
    </>
  );
} 