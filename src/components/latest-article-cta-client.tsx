"use client";

import { formatDate } from "@/lib/utils";
import { useLocale } from "next-intl";
import { useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";
import BlurFadeText from "@/components/magicui/blur-fade-text";
import { Icons } from "@/components/icons";
import { Badge } from "@/components/ui/badge";

interface LatestArticleCTAClientProps {
  latestPost: {
    slug: string;
    metadata: {
      title: string;
      publishedAt: string;
      summary: string;
      image?: string;
      video?: string;
      imagePosition?: string;
    };
  };
  blurFadeDelay: number;
}

export function LatestArticleCTAClient({
  latestPost,
  blurFadeDelay,
}: LatestArticleCTAClientProps) {
  const locale = useLocale();
  const t = useTranslations();

  return (
    <section id="latest-article">
      <div className="space-y-12 w-full py-12">
        {/* Static header - shows immediately, same as skeleton */}
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <div className="inline-block rounded-lg bg-foreground text-background px-3 py-1 text-sm">
              Blog
            </div>
            <h2 className="text-3xl font-bold text-pretty tracking-tighter sm:text-5xl">
              {t("latest_writing")}
            </h2>
          </div>
        </div>

        {/* Card with animated data */}
        <div className="rounded-xl border bg-card text-card-foreground overflow-hidden transition-all duration-300 ease-out hover:shadow-lg">
          <Link
            href={
              locale === "en"
                ? `/blog/${latestPost.slug}`
                : `/blog/${latestPost.slug}?lang=${locale}`
            }
            className="group block cursor-pointer"
          >
            {latestPost.metadata.video ? (
              <div className="relative w-full h-64 md:h-80 overflow-hidden">
                <video
                  src={latestPost.metadata.video}
                  muted
                  autoPlay
                  loop
                  playsInline
                  preload="none"
                  className={`w-full h-full object-cover transition-transform group-hover:scale-105 ${
                    latestPost.metadata.imagePosition || "object-top"
                  }`}
                  poster={latestPost.metadata.image || undefined}
                />
              </div>
            ) : (
              latestPost.metadata.image && (
                <div className="relative w-full h-64 md:h-80 overflow-hidden">
                  <Image
                    src={latestPost.metadata.image}
                    alt={latestPost.metadata.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 672px"
                    className={`object-cover transition-transform group-hover:scale-105 ${
                      latestPost.metadata.imagePosition || "object-top"
                    }`}
                  />
                </div>
              )
            )}
          </Link>
          <div className="p-6 space-y-3">
            <div className="flex items-center justify-between">
              {/* Animated date */}
              <BlurFadeText
                text={formatDate(latestPost.metadata.publishedAt, locale)}
                className="text-sm text-muted-foreground"
                delay={blurFadeDelay}
              />
            </div>
            <div className="space-y-1">
              {/* Animated title */}
              <BlurFadeText
                text={latestPost.metadata.title}
                className="text-2xl font-bold tracking-tight"
                delay={blurFadeDelay + 0.05}
              />
              {/* Animated summary */}
              {latestPost.metadata.summary && (
                <BlurFadeText
                  text={latestPost.metadata.summary}
                  className="text-muted-foreground line-clamp-2"
                  delay={blurFadeDelay + 0.1}
                />
              )}
            </div>
            <Link
              href={
                locale === "en"
                  ? `/blog/${latestPost.slug}`
                  : `/blog/${latestPost.slug}?lang=${locale}`
              }
              className="inline-block pt-2"
            >
              <Badge className="flex gap-2 px-2 py-1 text-[10px] w-fit">
                <Icons.arrowRight className="size-3" />
                {t("read_article")}
              </Badge>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
