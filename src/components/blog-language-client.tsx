"use client";

import { useEffect, useState } from "react";
import { useTranslation } from "@/lib/translations";
import Image from "next/image";
import Link from "next/link";
import BlurFade from "@/components/magicui/blur-fade";
import { formatDate } from "@/lib/utils";

interface BlogLanguageClientProps {
  initialPosts: any[];
  preloadedPosts?: {
    en: any[];
    fr: any[];
  };
  blurFadeDelay: number;
}

export function BlogLanguageClient({ initialPosts, preloadedPosts, blurFadeDelay }: BlogLanguageClientProps) {
  const { language } = useTranslation();
  const [posts, setPosts] = useState(initialPosts);

  // Switch posts when language changes
  useEffect(() => {
    if (preloadedPosts) {
      // Use preloaded posts if available
      setPosts(preloadedPosts[language as 'en' | 'fr'] || preloadedPosts.en);
      return;
    }
    
    // Fall back to API if no preloaded posts
    const fetchPosts = async () => {
      try {
        const response = await fetch(`/api/blog?lang=${language}`);
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        const data = await response.json();
        setPosts(data);
      } catch (error) {
        console.error("Failed to fetch posts:", error);
        // If fetching posts fails, keep the current ones
      }
    };

    fetchPosts();
  }, [language, preloadedPosts]);

  if (!posts || posts.length === 0) {
    return (
      <p className="text-muted-foreground">
        {language === "fr" ? "Aucun article de blog disponible." : "No blog posts available."}
      </p>
    );
  }

  return (
    <>
      {posts
        .toSorted((a, b) => 
          new Date(a.metadata.publishedAt) > new Date(b.metadata.publishedAt) ? -1 : 1
        )
        .map((post, id) => (
          <BlurFade delay={blurFadeDelay * 2 + id * 0.05} key={post?.slug}>
            <Link
              className="flex flex-col space-y-2 mb-8 group"
              href={language === "en" ? `/blog/${post?.slug}` : `/blog/${post?.slug}?lang=${language}`}
            >
              {post?.metadata?.video ? (
                <div className="relative w-full h-48 rounded-lg overflow-hidden mb-2">
                  <video 
                    src={post.metadata.video}
                    muted
                    autoPlay
                    loop
                    playsInline
                    className={`w-full h-full object-cover ${post?.metadata?.imagePosition || 'object-top'}`}
                    poster={post.metadata.image || undefined}
                  />
                </div>
              ) : post?.metadata?.image && (
                <div className="relative w-full h-48 rounded-lg overflow-hidden mb-2">
                  <Image
                    src={post.metadata.image}
                    alt={post.metadata.title}
                    fill
                    className={`object-cover ${post?.metadata?.imagePosition || 'object-top'} transition-transform group-hover:scale-105`}
                  />
                </div>
              )}
              <div className="w-full flex flex-col">
                <p className="font-medium tracking-tight">{post?.metadata?.title}</p>
                <p className="text-sm text-muted-foreground mt-1">
                  {post?.metadata?.publishedAt && formatDate(post.metadata.publishedAt, language)}
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