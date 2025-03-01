"use client";

import { useEffect, useState } from "react";
import { useTranslation } from "@/lib/translations";
import Image from "next/image";
import Link from "next/link";
import BlurFade from "@/components/magicui/blur-fade";
import { formatDate } from "@/lib/utils";

interface BlogLanguageClientProps {
  initialPosts: any[];
  blurFadeDelay: number;
}

export function BlogLanguageClient({ initialPosts, blurFadeDelay }: BlogLanguageClientProps) {
  const { language } = useTranslation();
  const [posts, setPosts] = useState(initialPosts);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Only fetch if language changes from initial load
    async function fetchPosts() {
      if (language === "en" && initialPosts.length > 0) {
        // Use initial posts for English if we have them
        setPosts(initialPosts);
        return;
      }
      
      setLoading(true);
      try {
        const response = await fetch(`/api/blog?lang=${language}`);
        if (!response.ok) {
          throw new Error("Failed to fetch posts");
        }
        const data = await response.json();
        setPosts(data);
      } catch (error) {
        console.error("Error fetching posts:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchPosts();
  }, [language, initialPosts]);

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
          <BlurFade delay={blurFadeDelay * 2 + id * 0.05} key={post.slug}>
            <Link
              className="flex flex-col space-y-2 mb-8 group"
              href={`/blog/${post.slug}`}
            >
              {post.metadata.image && (
                <div className="relative w-full h-48 rounded-lg overflow-hidden mb-2">
                  <Image
                    src={post.metadata.image}
                    alt={post.metadata.title}
                    fill
                    className="object-cover object-top transition-transform group-hover:scale-105"
                  />
                </div>
              )}
              <div className="w-full flex flex-col">
                <p className="font-medium tracking-tight">{post.metadata.title}</p>
                <p className="text-sm text-muted-foreground mt-1">
                  {formatDate(post.metadata.publishedAt, language)}
                </p>
                {post.metadata.summary && (
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