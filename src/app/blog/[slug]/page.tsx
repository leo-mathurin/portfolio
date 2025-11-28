import { getBlogPosts, getPost } from "@/data/blog";
import { DATA } from "@/data/resume";
import type { Metadata } from "next";
import { BlogPost } from "@/components/blog-post";

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
export async function generateMetadata({
  params,
  searchParams,
}: {
  params: {
    slug: string;
  };
  searchParams: {
    lang?: string;
  };
}): Promise<Metadata | undefined> {
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
        params,
        searchParams: { lang: "en" },
      });
    }

    // If post not found in English either, return default metadata
    return {
      title: `Blog Post Not Found • ${DATA.name}`,
      description: "The requested blog post could not be found.",
    };
  }
}

// Function to pre-fetch posts in different languages for client use
async function getPreloadedPosts(slug: string) {
  try {
    // Preload both English and French versions to eliminate API calls
    const enPost = await getPost(slug, "en");

    let frPost = null;
    try {
      frPost = await getPost(slug, "fr");
    } catch {
      // French version not available, that's fine
    }

    return {
      en: enPost,
      fr: frPost || enPost, // Fallback to English if French not available
    };
  } catch (error) {
    console.error("Error preloading posts:", error);
    return null;
  }
}

export default async function BlogPage({
  params,
  searchParams,
}: {
  params: {
    slug: string;
  };
  searchParams: {
    lang?: string;
  };
}) {
  // Pre-fetch blog posts in both languages to avoid API calls
  const preloadedPosts = await getPreloadedPosts(params.slug);
  const initialLang = searchParams.lang || "en";

  return (
    <section id="blog">
      <BlogPost
        slug={params.slug}
        preloadedPosts={preloadedPosts}
        initialLang={initialLang}
      />
    </section>
  );
}
