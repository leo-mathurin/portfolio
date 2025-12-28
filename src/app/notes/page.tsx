"use client";

import BlurFade from "@/components/magicui/blur-fade";
import { SimplePageHeader } from "@/components/page-header";
import { NotesBento, type BentoItem } from "@/components/notes-bento";
import { useLocale } from "next-intl";
import { useTranslations } from "next-intl";
import Link from "next/link";

const BLUR_FADE_DELAY = 0.04;

const bentoColumns: BentoItem[][] = [
  // Column 1
  [
    {
      src: "/notes/3ed0a67b-1510-492b-ac01-3e4c9d9a459d.webp",
      alt: "Note 1",
      flexGrow: 1.2,
    },
    {
      src: "/notes/aec9b411-6f15-45f7-aee9-8b6ed7cdfc3f.webp",
      alt: "Note 2",
      flexGrow: 1.2,
    },
    { src: "/notes/IMG_0001.webp", alt: "Note 3", flexGrow: 1.2 },
    { src: "/notes/IMG_0182.webp", alt: "Note 4", flexGrow: 1 },
    { src: "/notes/IMG_0234.webp", alt: "Note 5", flexGrow: 1.3 },
    { src: "/notes/IMG_0403.webp", alt: "Note 6", flexGrow: 1 },
    { src: "/notes/IMG_1051.webp", alt: "Note 19", flexGrow: 2 },
  ],
  // Column 2
  [
    { src: "/notes/IMG_7591.webp", alt: "Note 11", flexGrow: 1.1 },
    { src: "/notes/IMG_0993.webp", alt: "Note 8", flexGrow: 1.3 },
    { src: "/notes/IMG_5185.webp", alt: "Note 9", flexGrow: 1.6 },
    { src: "/notes/IMG_0628.webp", alt: "Note 7", flexGrow: 1.5 },
    { src: "/notes/IMG_7573.webp", alt: "Note 10", flexGrow: 1 },
    { src: "/notes/IMG_8114.webp", alt: "Note 12", flexGrow: 1 },
    {
      src: "/notes/video1.hevc.mp4",
      alt: "Video 1",
      flexGrow: 1,
      type: "video",
    },
  ],
  // Column 3
  [
    { src: "/notes/IMG_8345.webp", alt: "Note 14", flexGrow: 1 },
    { src: "/notes/IMG_8400.webp", alt: "Note 15", flexGrow: 1 },
    { src: "/notes/IMG_8233.webp", alt: "Note 13", flexGrow: 2 },
    { src: "/notes/IMG_8544.webp", alt: "Note 16", flexGrow: 1.3 },
    { src: "/notes/IMG_9003.webp", alt: "Note 17", flexGrow: 1.2 },
    {
      src: "/notes/video.hevc.mp4",
      alt: "Video",
      flexGrow: 1.8,
      type: "video",
    },
    { src: "/notes/IMG_1010.webp", alt: "Note 18", flexGrow: 2 },
  ],
];

export default function NotesPage() {
  const locale = useLocale();
  const t = useTranslations();

  return (
    <main className="flex flex-col min-h-[100dvh] space-y-10">
      {/* Header renders instantly without animation for LCP */}
      <SimplePageHeader
        title="notes"
        subtitle={t("notes_subtitle")}
      />

      <section id="notes-content">
        <BlurFade delay={BLUR_FADE_DELAY * 5}>
          <ul className="space-y-2">
            <li>
              •{" "}
              <Link
                className="text-blue-500 hover:underline"
                href="https://dariusforoux.com/life-without-challenges/"
              >
                Life Without Challenges Is an Early Death
              </Link>{" "}
              {t("notes_darius_foroux")}
            </li>
            <li>
              •{" "}
              <Link
                className="text-blue-500 hover:underline"
                href="https://www.navalmanack.com/"
              >
                {t("notes_naval_title")}
              </Link>{" "}
              {t("notes_naval_desc")}
            </li>
          </ul>
        </BlurFade>
      </section>

      <div className="h-64 md:h-96"></div>

      <section
        id="notes-bento"
        className="w-screen relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] px-3 sm:px-6 pb-16 sm:pb-4"
      >
        <BlurFade delay={BLUR_FADE_DELAY * 7}>
          <p className="text-xs mx-auto text-muted-foreground text-center mb-2">
            {t("notes_friends_family")}
          </p>
          <NotesBento columns={bentoColumns} />
        </BlurFade>
      </section>
    </main>
  );
}
