"use client";

import { DATA } from "@/data/resume";
import { useTranslation } from "@/lib/translations";
import Image from "next/image";
import BlurFade from "@/components/magicui/blur-fade";
import { Newsletter } from "@/components/newsletter";
import { Separator } from "./ui/separator";

interface BlogPostContentProps {
  readonly content: {
    en: string;
    fr: string | null;
  };
}

const BLUR_FADE_DELAY = 0.04;

export function BlogPostContent({ content }: BlogPostContentProps) {
  const { language } = useTranslation();

  const currentContent =
    language === "fr" && content.fr ? content.fr : content.en;

  return (
    <>
      <BlurFade delay={BLUR_FADE_DELAY * 5}>
        <article
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
