import { getBlogPosts } from "@/data/blog";
import BlurFade from "@/components/magicui/blur-fade";
import { BlogLanguageClient } from "@/components/blog-language-client";

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
    fr: frenchPosts
  };
}

export default async function BlogPage() {
  // Preload posts in multiple languages on the server
  const posts = await getPreloadedPosts();
  
  return (
    <section id="blog">
      <BlurFade delay={BLUR_FADE_DELAY}>
        <h1 className="mb-8 font-medium text-2xl tracking-tighter">Blog</h1>
      </BlurFade>
      
      <BlogLanguageClient 
        initialPosts={posts.en} 
        preloadedPosts={posts} 
        blurFadeDelay={BLUR_FADE_DELAY} 
      />
    </section>
  );
}
