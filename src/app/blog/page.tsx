import { getBlogPosts } from "@/data/blog";
import Image from "next/image";
import Link from "next/link";
import BlurFade from "@/components/magicui/blur-fade";
import { BlogLanguageClient } from "@/components/blog-language-client";

// Define a delay constant for the animations
const BLUR_FADE_DELAY = 0.1;

export const metadata = {
  title: "Blog",
  description: "Read my thoughts on software development and technology.",
};

export default async function BlogPage() {
  // Get initial posts with server component (will be hydrated by client later)
  const initialPosts = await getBlogPosts();

  return (
    <section>
      <BlurFade delay={BLUR_FADE_DELAY}>
        <h1 className="font-medium text-2xl mb-8 tracking-tighter">blog</h1>
      </BlurFade>
      
      {/* Client component for language switching */}
      <BlogLanguageClient initialPosts={initialPosts} blurFadeDelay={BLUR_FADE_DELAY} />
    </section>
  );
}
