"use client";

import BlurFade from "@/components/magicui/blur-fade";
import BlurFadeText from "@/components/magicui/blur-fade-text";
import { useTranslation } from "@/lib/translations";
import Link from "next/link";

const BLUR_FADE_DELAY = 0.04;

export default function NotesPage() {
  const { language } = useTranslation();

  return (
    <main className="flex flex-col min-h-[100dvh] space-y-10">
      <section id="notes-hero">
        <div className="mx-auto w-full max-w-2xl space-y-8">
          <div className="gap-2 flex justify-between">
            <div className="flex-col flex flex-1 space-y-1.5">
              <BlurFadeText
                delay={BLUR_FADE_DELAY}
                className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none text-pretty"
                yOffset={8}
                text="Notes"
              />
              <BlurFadeText
                className="max-w-[600px] md:text-xl text-balance font-sans text-muted-foreground"
                delay={BLUR_FADE_DELAY}
                text={
                  language === "fr"
                    ? "Un petit endroit pour noter des idées et pensées qui me font vibrer."
                    : "Just a place to write down ideas and thoughts that resonate with who I am."
                }
              />
            </div>
          </div>
        </div>
      </section>

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
              {language === "fr" ? "de Darius Foroux" : "from Darius Foroux"}
            </li>
            <li>
              •{" "}
              <Link
                className="text-blue-500 hover:underline"
                href="https://www.navalmanack.com/"
              >
                {language === "fr"
                  ? "L'almanach de Naval Ravikant"
                  : "The Almanack Of Naval Ravikant"}
              </Link>{" "}
              {language === "fr"
                ? "- un recueil de réflexions d'un self-made millionaire qui nous partage ses principes de vie, et comment allier ambition et sagesse."
                : "- a collection of reflections from a self-made millionaire who shares his life principles and how to combine ambition and wisdom."}
            </li>
          </ul>
        </BlurFade>
      </section>
    </main>
  );
}
