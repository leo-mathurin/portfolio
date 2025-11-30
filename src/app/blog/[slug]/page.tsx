import { Suspense } from "react";
import { getBlogPosts, getPost } from "@/data/blog";
import { DATA } from "@/data/resume";
import type { Metadata } from "next";
import { BlogPostHeader } from "@/components/blog-post-header";
import { BlogPostContent } from "@/components/blog-post-content";
import { BlogContentSkeleton } from "@/components/skeletons/blog-content-skeleton";
import { BlogLanguageSync } from "@/lib/blog-language-sync";

// This is needed for static generation at build time
export async function generateStaticParams() {
  const posts = await getBlogPosts();
  return posts
    .filter((post): post is NonNullable<typeof post> => post !== null)
    .map((post) => ({
      slug: post.slug,
    }));
}

// Metadata needs to be generated at build time, so we'll use the default language (English)
export async function generateMetadata(props: {
  params: Promise<{
    slug: string;
  }>;
  searchParams: Promise<{
    lang?: string;
  }>;
}): Promise<Metadata | undefined> {
  const searchParams = await props.searchParams;
  const params = await props.params;
  // Use lang from search params if available, otherwise default to English
  const lang = searchParams.lang || "en";

  try {
    const post = await getPost(params.slug, lang);

    const {
      title,
      publishedAt: publishedTime,
      summary: description,
      image,
    } = post.metadata;
    const ogImage = image
      ? `${DATA.url}${image}`
      : `${DATA.url}/og?title=${title}`;

    return {
      title: `${title} • ${DATA.name}`,
      description,
      openGraph: {
        title: `${title} • ${DATA.name}`,
        description,
        type: "article",
        publishedTime,
        url: `${DATA.url}/blog/${post.slug}`,
        images: [
          {
            url: ogImage,
          },
        ],
      },
      twitter: {
        card: "summary_large_image",
        title: `${title} • ${DATA.name}`,
        description,
        images: [ogImage],
      },
    };
  } catch {
    // If post not found in requested language, try English
    if (lang !== "en") {
      return generateMetadata({
        params: Promise.resolve({ slug: params.slug }),
        searchParams: Promise.resolve({ lang: "en" }),
      });
    }

    // If post not found in English either, return default metadata
    return {
      title: `Blog Post Not Found • ${DATA.name}`,
      description: "The requested blog post could not be found.",
    };
  }
}

// Async component to fetch and render content - this will stream via Suspense
async function BlogContentLoader({ slug }: { slug: string }) {
  // Fetch both language versions
  const enPost = await getPost(slug, "en");

  let frPost = null;
  try {
    frPost = await getPost(slug, "fr");
  } catch {
    // French version not available
  }

  return (
    <BlogPostContent
      content={{
        en: enPost.source,
        fr: frPost?.source ?? null,
      }}
    />
  );
}

export default async function BlogPage(props: {
  params: Promise<{
    slug: string;
  }>;
  searchParams: Promise<{
    lang?: string;
  }>;
}) {
  const searchParams = await props.searchParams;
  const params = await props.params;
  const initialLang = searchParams.lang || "en";

  // Fetch metadata for both languages (lightweight - just frontmatter)
  const enPost = await getPost(params.slug, "en");
  let frPostMetadata = null;
  try {
    const frPost = await getPost(params.slug, "fr");
    frPostMetadata = frPost.metadata;
  } catch {
    // French version not available
  }

  return (
    <section id="blog">
      {/* Sync language from URL param to context */}
      <BlogLanguageSync initialLang={initialLang} />

      {/* Header renders immediately with metadata */}
      <BlogPostHeader
        metadata={{
          en: enPost.metadata,
          fr: frPostMetadata,
        }}
        slug={params.slug}
      />

      {/* Content streams in via Suspense */}
      <Suspense fallback={<BlogContentSkeleton />}>
        <BlogContentLoader slug={params.slug} />
      </Suspense>
    </section>
  );
}
