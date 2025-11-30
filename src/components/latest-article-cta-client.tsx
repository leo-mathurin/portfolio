"use client";

import { formatDate } from "@/lib/utils";
import { useTranslation } from "@/lib/translations";
import Image from "next/image";
import Link from "next/link";
import BlurFade from "@/components/magicui/blur-fade";
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
  const { language } = useTranslation();

  return (
    <section id="latest-article">
      <div className="space-y-12 w-full py-12">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <div className="inline-block rounded-lg bg-foreground text-background px-3 py-1 text-sm">
              Blog
            </div>
            <h2 className="text-3xl font-bold text-pretty tracking-tighter sm:text-5xl">
              {language === "fr"
                ? "Ce que j'écris dernièrement"
                : "What I've been writing lately"}
            </h2>
          </div>
        </div>
        <div className="rounded-xl border bg-card text-card-foreground overflow-hidden transition-all duration-300 ease-out hover:shadow-lg">
          <Link
            href={
              language === "en"
                ? `/blog/${latestPost.slug}`
                : `/blog/${latestPost.slug}?lang=${language}`
            }
            className="group block cursor-pointer"
          >
            <BlurFade delay={blurFadeDelay}>
              {latestPost.metadata.video ? (
                <div className="relative w-full h-64 md:h-80 overflow-hidden">
                  <video
                    src={latestPost.metadata.video}
                    muted
                    autoPlay
                    loop
                    playsInline
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
                      className={`object-cover transition-transform group-hover:scale-105 ${
                        latestPost.metadata.imagePosition || "object-top"
                      }`}
                    />
                  </div>
                )
              )}
            </BlurFade>
          </Link>
          <div className="p-6 space-y-3">
            <div className="flex items-center justify-between">
              <BlurFade delay={blurFadeDelay + 0.05}>
                <p className="text-sm text-muted-foreground">
                  {formatDate(latestPost.metadata.publishedAt, language)}
                </p>
              </BlurFade>
            </div>
            <div className="space-y-1">
              <BlurFade delay={blurFadeDelay + 0.1}>
                <h3 className="text-2xl font-bold tracking-tight">
                  {latestPost.metadata.title}
                </h3>
              </BlurFade>
              {latestPost.metadata.summary && (
                <BlurFade delay={blurFadeDelay + 0.15}>
                  <p className="text-muted-foreground line-clamp-2">
                    {latestPost.metadata.summary}
                  </p>
                </BlurFade>
              )}
            </div>
            <Link
              href={
                language === "en"
                  ? `/blog/${latestPost.slug}`
                  : `/blog/${latestPost.slug}?lang=${language}`
              }
              className="inline-block pt-2"
            >
              <Badge className="flex gap-2 px-2 py-1 text-[10px] w-fit">
                <Icons.arrowRight className="size-3" />
                {language === "fr" ? "Lire l'article" : "Read article"}
              </Badge>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
