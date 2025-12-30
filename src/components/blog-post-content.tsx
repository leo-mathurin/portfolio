import { DATA } from "@/data/resume";
import Image from "next/image";
import { Newsletter } from "@/components/newsletter";
import { Separator } from "./ui/separator";
import { BlogCopyButtonsClient } from "@/components/blog-copy-buttons-client";

interface BlogPostContentProps {
  readonly html: string;
  readonly locale: "en" | "fr";
  readonly copyright?: string;
}

export function BlogPostContent({
  html,
  locale,
  copyright = "©",
}: BlogPostContentProps) {
  return (
    <>
      {/* Tiny client delegate for copy buttons (no per-block React mounts) */}
      <BlogCopyButtonsClient />

      <article
        className="prose dark:prose-invert text-pretty"
        dangerouslySetInnerHTML={{ __html: html }}
      />

      <div className="my-24">
        <Newsletter />
      </div>

      <div>
        <Separator className="mt-10 mb-6" />
        <div className="flex items-center justify-end gap-3">
          <div className="text-right">
            <p className="font-medium">Léo Mathurin</p>
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              {DATA.title[locale as keyof typeof DATA.title]}
            </p>
          </div>
          <div className="h-10 w-10 rounded-full overflow-hidden bg-neutral-100 dark:bg-neutral-800">
            <Image
              src="/memoji.png"
              alt="Léo Mathurin"
              width={40}
              height={40}
              className="h-full w-full object-cover"
            />
          </div>
        </div>
      </div>

      <div className="mt-12 sm:mb-0 mb-12 text-sm text-neutral-500 dark:text-neutral-400 text-center italic">
        {copyright}
      </div>
    </>
  );
}
