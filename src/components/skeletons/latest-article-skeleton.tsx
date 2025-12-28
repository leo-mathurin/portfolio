"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { useTranslations } from "next-intl";
import { Badge } from "@/components/ui/badge";
import { Icons } from "@/components/icons";

export function LatestArticleSkeleton() {
  const t = useTranslations();

  return (
    <section id="latest-article">
      <div className="space-y-12 w-full py-12">
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
        <div className="rounded-xl border bg-card text-card-foreground overflow-hidden">
          <div className="relative w-full h-64 md:h-80 overflow-hidden">
            <Skeleton className="w-full h-full rounded-none" />
          </div>
          <div className="p-6 space-y-3">
            <div className="flex items-center justify-between">
              <Skeleton className="h-4 w-24" />
            </div>
            <div className="space-y-1">
              <Skeleton className="h-8 w-3/4" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
            </div>
            <div className="pt-2">
              <Badge className="flex gap-2 px-2 py-1 text-[10px] w-fit">
                <Icons.arrowRight className="size-3" />
                {t("read_article")}
              </Badge>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
