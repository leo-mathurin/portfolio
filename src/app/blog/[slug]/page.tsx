import { getBlogPosts, getPost } from "@/data/blog";
import { DATA } from "@/data/resume";
import type { Metadata } from "next";
import { BlogPostHeader } from "@/components/blog-post-header";
import { BlogPostContent } from "@/components/blog-post-content";
import { BlogLanguageSync } from "@/lib/blog-language-sync";
import { getLocale, getTranslations } from "next-intl/server";

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

export default async function BlogPage(props: {
  params: Promise<{
    slug: string;
  }>;
  searchParams: Promise<{
    lang?: string;
  }>;
}) {
  const locale = await getLocale();
  const t = await getTranslations();
  const searchParams = await props.searchParams;
  const params = await props.params;

  const requestedLang =
    searchParams.lang === "en" || searchParams.lang === "fr"
      ? searchParams.lang
      : undefined;

  // Priority: query param > cookie locale > default
  const effectiveLang = requestedLang ?? (locale === "fr" ? "fr" : "en");

  // Fetch only the effective language post (avoid shipping EN+FR full HTML)
  const post = await getPost(params.slug, effectiveLang);

  return (
    <section id="blog">
      {/* Sync language from URL param to context */}
      <BlogLanguageSync initialLang={effectiveLang} />

      <BlogPostHeader
        metadata={post.metadata}
        slug={params.slug}
        locale={effectiveLang}
        backToBlogLabel={t("back_to_blog")}
      />

      <BlogPostContent
        html={post.source}
        locale={effectiveLang}
        copyright={t("copyright")}
      />
    </section>
  );
}
