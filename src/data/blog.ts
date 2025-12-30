import { cache } from "react";
import fs from "fs";
import matter from "gray-matter";
import path from "path";
import rehypePrettyCode from "rehype-pretty-code";
import rehypeStringify from "rehype-stringify";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import { unified } from "unified";
import { unstable_cache } from "next/cache";

type HastNode = {
  type?: string;
  tagName?: string;
  properties?: Record<string, unknown>;
  children?: HastNode[];
  value?: string;
};

function hasClass(node: HastNode, className: string): boolean {
  const classes = node.properties?.className;
  if (Array.isArray(classes)) return classes.includes(className);
  if (typeof classes === "string") return classes.split(/\s+/).includes(className);
  return false;
}

function rehypeCopyButtons() {
  return (tree: HastNode) => {
    const walk = (node: HastNode) => {
      if (!node || typeof node !== "object") return;
      if (!Array.isArray(node.children)) return;

      for (let i = 0; i < node.children.length; i++) {
        const child = node.children[i];

        if (
          child?.type === "element" &&
          child.tagName === "pre" &&
          node.type === "element" &&
          !hasClass(node, "code-block-wrapper")
        ) {
          const copyIcon: HastNode = {
            type: "element",
            tagName: "svg",
            properties: {
              xmlns: "http://www.w3.org/2000/svg",
              width: 16,
              height: 16,
              viewBox: "0 0 24 24",
              fill: "none",
              stroke: "currentColor",
              strokeWidth: 2,
              strokeLinecap: "round",
              strokeLinejoin: "round",
              "aria-hidden": "true",
              focusable: "false",
            },
            children: [
              {
                type: "element",
                tagName: "rect",
                properties: { width: 14, height: 14, x: 8, y: 8, rx: 2, ry: 2 },
                children: [],
              },
              {
                type: "element",
                tagName: "path",
                properties: { d: "M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" },
                children: [],
              },
            ],
          };

          const wrapper: HastNode = {
            type: "element",
            tagName: "div",
            properties: { className: ["code-block-wrapper"] },
            children: [
              child,
              {
                type: "element",
                tagName: "div",
                properties: { className: ["copy-button-container"] },
                children: [
                  {
                    type: "element",
                    tagName: "button",
                    properties: {
                      type: "button",
                      className: ["copy-code-button"],
                      "aria-label": "Copy code to clipboard",
                      title: "Copy code",
                    },
                    children: [copyIcon],
                  },
                ],
              },
            ],
          };

          node.children[i] = wrapper;
          continue;
        }

        walk(child);
      }
    };

    walk(tree);
  };
}

export type Metadata = {
  title: string;
  publishedAt: string;
  summary: string;
  image?: string;
  video?: string;
  imagePosition?: string;
  imageCredit?: string;
};

export type BlogPost = {
  metadata: Metadata;
  slug: string;
  source: string;
};

// Cache for markdown processing to avoid reprocessing on every request
const markdownCache = new Map<string, string>();
const fileContentCache = new Map<
  string,
  { content: string; metadata: Metadata; mtime: number }
>();

function getMDXFiles(dir: string) {
  if (!fs.existsSync(dir)) {
    return [];
  }
  return fs.readdirSync(dir).filter((file) => path.extname(file) === ".mdx");
}

// Get file modification time for cache invalidation
function getFileMtime(filePath: string): number {
  try {
    return fs.statSync(filePath).mtimeMs;
  } catch {
    return 0;
  }
}

export async function markdownToHTML(
  markdown: string,
  cacheKey?: string,
): Promise<string> {
  // Use cache if available
  if (cacheKey && markdownCache.has(cacheKey)) {
    return markdownCache.get(cacheKey)!;
  }

  const p = await unified()
    .use(remarkParse)
    .use(remarkRehype)
    .use(rehypePrettyCode, {
      // https://rehype-pretty.pages.dev/#usage
      theme: {
        light: "github-light-high-contrast",
        dark: "github-dark-high-contrast",
      },
      keepBackground: false,
    })
    .use(rehypeCopyButtons)
    .use(rehypeStringify)
    .process(markdown);

  // Add lazy loading to all images for better text-first loading
  const html = p.toString().replace(/<img /g, '<img loading="lazy" ');

  // Cache the result
  if (cacheKey) {
    markdownCache.set(cacheKey, html);
  }

  return html;
}

// Internal implementation for getPost
async function getPostImpl(slug: string, language: string = "en") {
  // Try to find the post in the language-specific directory
  let filePath: string;

  // Get path to language-specific directory and default English directory
  const langDir = path.join(process.cwd(), "content", language);
  const enDir = path.join(process.cwd(), "content", "en");
  const oldDefaultDir = path.join(process.cwd(), "content");

  // First try language-specific path
  filePath = path.join(langDir, `${slug}.mdx`);

  // If file doesn't exist in language directory and language is not English,
  // try English directory
  if (!fs.existsSync(filePath)) {
    if (language !== "en") {
      filePath = path.join(enDir, `${slug}.mdx`);
    }

    // If file doesn't exist in English directory or we're already looking for English,
    // try the old default content directory as fallback for backward compatibility
    if (!fs.existsSync(filePath)) {
      filePath = path.join(oldDefaultDir, `${slug}.mdx`);

      // If file doesn't exist in fallback directory either, throw error
      if (!fs.existsSync(filePath)) {
        throw new Error(`Post not found: ${slug}`);
      }
    }
  }

  // Check cache first
  const cacheKey = `${filePath}`;
  const mtime = getFileMtime(filePath);
  const cached = fileContentCache.get(cacheKey);

  if (cached && cached.mtime === mtime) {
    return {
      source: cached.content,
      metadata: cached.metadata,
      slug,
    };
  }

  // Read and process file
  const source = fs.readFileSync(filePath, "utf-8");
  const { content: rawContent, data: metadata } = matter(source);
  const markdownCacheKey = `${cacheKey}:${mtime}`;
  const content = await markdownToHTML(rawContent, markdownCacheKey);

  // Cache the result
  fileContentCache.set(cacheKey, {
    content,
    metadata: metadata as Metadata,
    mtime,
  });

  return {
    source: content,
    metadata: metadata as Metadata,
    slug,
  };
}

// Wrap with React cache for request deduplication
const getPostCached = (slug: string, language: string = "en") =>
  unstable_cache(
    () => getPostImpl(slug, language),
    ["getPost", slug, language],
    { revalidate: false },
  )();

// Wrap with React cache for request deduplication (within a single request)
export const getPost = cache(getPostCached);

async function getAllPosts(language: string = "en") {
  // Get the appropriate directories based on language
  const oldDefaultDir = path.join(process.cwd(), "content");
  const enDir = path.join(process.cwd(), "content", "en");
  const langDir = path.join(process.cwd(), "content", language);

  // Start with the English directory as the default source for English posts
  const defaultDir = language === "en" ? enDir : langDir;

  // Get files from default directory for this language
  let defaultFiles: { file: string; dir: string }[] = [];
  if (fs.existsSync(defaultDir)) {
    defaultFiles = getMDXFiles(defaultDir).map((file) => ({
      file,
      dir: defaultDir,
    }));
  }

  // For non-English languages, also check English directory as fallback
  let fallbackFiles: { file: string; dir: string }[] = [];
  if (language !== "en" && fs.existsSync(enDir)) {
    fallbackFiles = getMDXFiles(enDir).map((file) => ({
      file,
      dir: enDir,
    }));
  }

  // Check old content directory as additional fallback for backward compatibility
  let oldDefaultFiles: { file: string; dir: string }[] = [];
  if (fs.existsSync(oldDefaultDir)) {
    oldDefaultFiles = getMDXFiles(oldDefaultDir).map((file) => ({
      file,
      dir: oldDefaultDir,
    }));
  }

  // Combine files, with language-specific files taking highest precedence,
  // then English files (for non-English languages), then old default files
  const allFiles = [...oldDefaultFiles];

  // Add English files if looking for non-English content
  if (language !== "en") {
    // Override old default files with English files when they exist
    fallbackFiles.forEach((enFile) => {
      const index = allFiles.findIndex(
        (defaultFile) =>
          path.basename(defaultFile.file, ".mdx") ===
          path.basename(enFile.file, ".mdx"),
      );

      if (index !== -1) {
        // Replace default file with English file
        allFiles[index] = enFile;
      } else {
        // Add new English file
        allFiles.push(enFile);
      }
    });
  }

  // Finally override with language-specific files when they exist
  defaultFiles.forEach((langFile) => {
    const index = allFiles.findIndex(
      (defaultFile) =>
        path.basename(defaultFile.file, ".mdx") ===
        path.basename(langFile.file, ".mdx"),
    );

    if (index !== -1) {
      // Replace default file with language-specific file
      allFiles[index] = langFile;
    } else {
      // Add new language-specific file
      allFiles.push(langFile);
    }
  });

  return Promise.all(
    allFiles.map(async ({ file, dir }) => {
      const slug = path.basename(file, path.extname(file));
      try {
        // Determine the post language based on directory
        let postLanguage = "en";

        // Extract language from directory path
        const dirName = path.basename(dir);
        const parentDir = path.basename(path.dirname(dir));

        if (parentDir === "content" && dirName !== "content") {
          postLanguage = dirName;
        }

        // Get the post with the appropriate language
        const post = await getPost(slug, postLanguage);
        return {
          metadata: post.metadata,
          slug,
          source: post.source,
        };
      } catch (error) {
        console.error(`Error loading post ${slug}:`, error);
        return null;
      }
    }),
  ).then((posts) => posts.filter(Boolean));
}

// Wrap with React cache for request deduplication
export const getBlogPosts = cache(async (language: string = "en") => {
  return getAllPosts(language);
});

/**
 * Get the latest blog post for a given language.
 * Uses React cache for request deduplication.
 */
export const getLatestPost = cache(async (language: string = "en") => {
  const posts = await getBlogPosts(language);
  if (!posts || posts.length === 0) return null;

  // Sort by date and return the most recent
  const sortedPosts = posts
    .filter((post): post is BlogPost => post !== null)
    .sort((a, b) => {
      return (
        new Date(b.metadata.publishedAt).getTime() -
        new Date(a.metadata.publishedAt).getTime()
      );
    });

  return sortedPosts[0] || null;
});
