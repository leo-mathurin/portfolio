import { Skeleton } from "@/components/ui/skeleton";
import BlurFade from "@/components/magicui/blur-fade";

const BLUR_FADE_DELAY = 0.04;

export function LatestArticleSkeleton() {
  return (
    <section id="latest-article">
      <div className="space-y-12 w-full py-12">
        <BlurFade delay={BLUR_FADE_DELAY * 17}>
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <Skeleton className="h-6 w-16 mx-auto rounded-lg" />
              <Skeleton className="h-10 w-80 mx-auto sm:h-12 sm:w-96" />
            </div>
          </div>
        </BlurFade>
        <BlurFade delay={BLUR_FADE_DELAY * 17 + 0.05}>
          <div className="rounded-xl border bg-card overflow-hidden">
            <Skeleton className="w-full h-64 md:h-80 rounded-none" />
            <div className="p-6 space-y-3">
              <Skeleton className="h-4 w-24" />
              <div className="space-y-2">
                <Skeleton className="h-7 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
              </div>
              <Skeleton className="h-6 w-28 mt-2" />
            </div>
          </div>
        </BlurFade>
      </div>
    </section>
  );
}

