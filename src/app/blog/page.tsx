import BlurFade from "@/components/magicui/blur-fade";
import { getBlogPosts } from "@/data/blog";
import Link from "next/link";
import Image from "next/image";

export const metadata = {
  title: "Blog",
  description: "My insights on cybersecurity, network infrastructure, and system administration projects.",
};

const BLUR_FADE_DELAY = 0.04;

export default async function BlogPage() {
  const posts = await getBlogPosts();

  return (
    <section>
      <BlurFade delay={BLUR_FADE_DELAY}>
        <h1 className="font-medium text-2xl mb-8 tracking-tighter">blog</h1>
      </BlurFade>
      {posts
        .toSorted((a, b) => 
          new Date(a.metadata.publishedAt) > new Date(b.metadata.publishedAt) ? -1 : 1
        )
        .map((post, id) => (
          <BlurFade delay={BLUR_FADE_DELAY * 2 + id * 0.05} key={post.slug}>
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
                  {post.metadata.publishedAt}
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
    </section>
  );
}
