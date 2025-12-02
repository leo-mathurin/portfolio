"use client";

import { useEffect, useRef } from "react";
import { DATA } from "@/data/resume";
import { useTranslation } from "@/lib/translations";
import Image from "next/image";
import BlurFade from "@/components/magicui/blur-fade";
import { Newsletter } from "@/components/newsletter";
import { Separator } from "./ui/separator";
import { createRoot } from "react-dom/client";
import CopyToClipboard from "./copy-to-clipboard";

interface BlogPostContentProps {
  readonly content: {
    en: string;
    fr: string | null;
  };
}

const BLUR_FADE_DELAY = 0.04;

export function BlogPostContent({ content }: BlogPostContentProps) {
  const { language } = useTranslation();
  const articleRef = useRef<HTMLElement>(null);

  const currentContent =
    language === "fr" && content.fr ? content.fr : content.en;

  useEffect(() => {
    if (!articleRef.current) return;

    const preElements = articleRef.current.querySelectorAll("pre");

    preElements.forEach((pre) => {
      // Skip if already processed (check if parent has copy button container)
      const parent = pre.parentElement;
      if (parent?.querySelector(".copy-button-container")) return;

      // Get the code content
      const codeElement = pre.querySelector("code");
      if (!codeElement) return;

      // Extract text content from code element
      const codeText = codeElement.textContent || "";

      // Wrap pre in container if not already wrapped
      let wrapper = parent;
      if (!wrapper || !wrapper.classList.contains("code-block-wrapper")) {
        wrapper = document.createElement("div");
        wrapper.className = "code-block-wrapper";
        wrapper.style.position = "relative";
        pre.parentNode?.insertBefore(wrapper, pre);
        wrapper.appendChild(pre);
      }

      // Create container for copy button
      const container = document.createElement("div");
      container.className = "copy-button-container";

      // Create React root and render copy button
      const root = createRoot(container);
      root.render(<CopyToClipboard code={codeText} />);
      wrapper.appendChild(container);
    });
  }, [currentContent]);

  return (
    <>
      <BlurFade delay={BLUR_FADE_DELAY * 5}>
        <article
          ref={articleRef}
          className="prose dark:prose-invert text-pretty"
          dangerouslySetInnerHTML={{ __html: currentContent }}
        ></article>
      </BlurFade>

      <BlurFade className="my-24" delay={BLUR_FADE_DELAY * 6}>
        <Newsletter />
      </BlurFade>

      <BlurFade delay={BLUR_FADE_DELAY * 7}>
        <Separator className="mt-10 mb-6" />
        <div className="flex items-center justify-end gap-3">
          <div className="text-right">
            <p className="font-medium">Léo Mathurin</p>
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              {DATA.title[language as keyof typeof DATA.title]}
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
      </BlurFade>

      <BlurFade delay={BLUR_FADE_DELAY * 8}>
        <div className="mt-12 sm:mb-0 mb-12 text-sm text-neutral-500 dark:text-neutral-400 text-center italic">
          {language === "fr"
            ? "© 2025 Léo Mathurin. Tous droits réservés."
            : "© 2025 Léo Mathurin. All Rights Reserved."}
        </div>
      </BlurFade>
    </>
  );
}
