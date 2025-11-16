import { getBlogPosts } from "@/data/blog";
import { BlogLanguageClient } from "@/components/blog-language-client";
import BlurFadeText from "@/components/magicui/blur-fade-text";
import type { BlogPost } from "@/data/blog";

// Define a delay constant for the animations
const BLUR_FADE_DELAY = 0.04;

export const metadata = {
  title: "Blog",
  description: "Read my thoughts on software development and technology.",
};

// Preload all blog posts for both languages
async function getPreloadedPosts() {
  const englishPosts = await getBlogPosts("en");
  const frenchPosts = await getBlogPosts("fr");

  return {
    en: englishPosts,
    fr: frenchPosts,
  };
}

export default async function BlogPage() {
  // Preload posts in multiple languages on the server
  const posts = await getPreloadedPosts();

  return (
    <main className="flex flex-col min-h-[100dvh] space-y-10">
      <section id="blog-hero">
        <BlurFadeText
          delay={BLUR_FADE_DELAY}
          text="blog"
          className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none text-pretty"
          yOffset={8}
        />
      </section>
      <section id="blog-content">
        <BlogLanguageClient
          initialPosts={posts.en as BlogPost[]}
          preloadedPosts={posts as { en: BlogPost[]; fr: BlogPost[] }}
          blurFadeDelay={BLUR_FADE_DELAY}
        />
      </section>
    </main>
  );
}
