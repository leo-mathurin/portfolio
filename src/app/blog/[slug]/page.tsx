import { getBlogPosts, getPost } from "@/data/blog";
import { DATA } from "@/data/resume";
import type { Metadata } from "next";
import { BlogPost } from "@/components/blog-post";

// This is needed for static generation at build time
export async function generateStaticParams() {
  const posts = await getBlogPosts();
  return posts.filter((post): post is NonNullable<typeof post> => post !== null).map((post) => ({ 
    slug: post.slug 
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
    let post = await getPost(params.slug, lang);

    let {
      title,
      publishedAt: publishedTime,
      summary: description,
      image,
    } = post.metadata;
    let ogImage = image ? `${DATA.url}${image}` : `${DATA.url}/og?title=${title}`;

    return {
      title,
      description,
      openGraph: {
        title,
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
        title,
        description,
        images: [ogImage],
      },
    };
  } catch (error) {
    // If post not found in requested language, try English
    if (lang !== "en") {
      return generateMetadata({
        params,
        searchParams: { lang: "en" }
      });
    }
    
    // If post not found in English either, return default metadata
    return {
      title: "Blog Post Not Found",
      description: "The requested blog post could not be found."
    };
  }
}

export default function BlogPage({
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
  return (
    <section id="blog">
      <BlogPost slug={params.slug} />
    </section>
  );
}
