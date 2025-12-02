import BlurFade from "@/components/magicui/blur-fade";
import { ProjectCard } from "@/components/project-card";
import { HackathonCard } from "@/components/hackathon-card";
import { ResumeCard } from "@/components/resume-card";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/page-header";
import {
  DATA,
  type WorkItem,
  type EducationItem,
  type HackathonItem,
} from "@/data/resume";
import { translations, translateDate } from "@/lib/translations";
import { simpleMarkdownToHtml } from "@/lib/simple-markdown";
import Link from "next/link";
import { LatestArticleCTA } from "@/components/latest-article-cta";
import type React from "react";
import { headers } from "next/headers";

const BLUR_FADE_DELAY = 0.04;

// Helper function for server-side translation
function getTranslation(language: string) {
  const t = (key: string): string => {
    if (key in translations[language]) {
      return translations[language][
        key as keyof (typeof translations)[typeof language]
      ];
    }
    return key;
  };
  return t;
}

export default async function Page() {
  // Get language from headers (server-side)
  const acceptLanguage = (await headers()).get("accept-language") ?? "";
  const language = acceptLanguage.toLowerCase().includes("fr") ? "fr" : "en";
  const t = getTranslation(language);

  // Pre-compute greeting text
  const greetingText = `${t("greeting")} ${DATA.name.split(" ")[0].toLowerCase()} 👋`;
  const descriptionText =
    DATA.description[language as keyof typeof DATA.description];

  return (
    <main className="flex flex-col min-h-[100dvh] space-y-10">
      {/* Hero section - renders instantly without animation for LCP */}
      <PageHeader
        title={greetingText}
        subtitle={descriptionText}
        avatar={{
          src: DATA.avatarUrl,
          alt: DATA.name,
        }}
      />

      <section id="about">
        <BlurFade delay={BLUR_FADE_DELAY * 3}>
          <h2 className="text-xl font-bold mb-1">{t("about")}</h2>
        </BlurFade>
        <BlurFade delay={BLUR_FADE_DELAY * 4}>
          <div
            className="prose max-w-full text-pretty font-sans text-base text-muted-foreground dark:prose-invert"
            dangerouslySetInnerHTML={{
              __html: simpleMarkdownToHtml(
                DATA.summary[language as keyof typeof DATA.summary],
              ),
            }}
          />
        </BlurFade>
      </section>

      <section id="work">
        <div className="flex min-h-0 flex-col gap-y-3">
          <BlurFade delay={BLUR_FADE_DELAY * 5}>
            <h2 className="text-xl font-bold">{t("work_experience")}</h2>
          </BlurFade>
          {DATA.work.map((work: WorkItem, id: number) => {
            const periodText = work.start
              ? `${translateDate(work.start, language)} ${t("to")} ${
                  work.end === "Current"
                    ? `<em>${t("current")}</em>`
                    : translateDate(work.end, language)
                }`
              : work.end === "Current"
                ? `<em>${t("current")}</em>`
                : translateDate(work.end, language);

            return (
              <BlurFade
                key={work.company}
                delay={BLUR_FADE_DELAY * 6 + id * 0.05}
              >
                <ResumeCard
                  key={work.company}
                  logoUrl={work.logoUrl}
                  altText={work.company}
                  title={work.company}
                  subtitle={work.title[language as keyof typeof work.title]}
                  href={work.href}
                  badges={work.badges}
                  period={periodText}
                  description={
                    work.description[language as keyof typeof work.description]
                  }
                  language={language}
                />
              </BlurFade>
            );
          })}
        </div>
      </section>

      <section id="education">
        <div className="flex min-h-0 flex-col gap-y-3">
          <BlurFade delay={BLUR_FADE_DELAY * 7}>
            <h2 className="text-xl font-bold">{t("education")}</h2>
          </BlurFade>
          {DATA.education.map((education: EducationItem, id: number) => {
            const periodText = education.start
              ? `${translateDate(education.start, language)} ${t("to")} ${
                  education.end === "Current"
                    ? `<em>${t("current")}</em>`
                    : translateDate(education.end, language)
                }`
              : education.end === "Current"
                ? `<em>${t("current")}</em>`
                : translateDate(education.end, language);

            return (
              <BlurFade
                key={education.school}
                delay={BLUR_FADE_DELAY * 8 + id * 0.05}
              >
                <ResumeCard
                  key={education.school}
                  href={education.href}
                  logoUrl={education.logoUrl}
                  altText={education.school}
                  title={education.school}
                  subtitle={
                    education.degree[language as keyof typeof education.degree]
                  }
                  period={periodText}
                  language={language}
                />
              </BlurFade>
            );
          })}
        </div>
      </section>

      <section id="skills">
        <div className="flex min-h-0 flex-col gap-y-3">
          <BlurFade delay={BLUR_FADE_DELAY * 9}>
            <h2 className="text-xl font-bold">{t("skills")}</h2>
          </BlurFade>
          <div className="flex flex-wrap gap-1">
            {DATA.skills.map((skill, id) => (
              <BlurFade
                key={`skill-${id}`}
                delay={BLUR_FADE_DELAY * 10 + id * 0.05}
              >
                <Badge key={`skill-badge-${id}`}>
                  {skill[language as keyof typeof skill]}
                </Badge>
              </BlurFade>
            ))}
          </div>
        </div>
      </section>

      <section id="projects">
        <div className="space-y-12 w-full py-12">
          <BlurFade delay={BLUR_FADE_DELAY * 11}>
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-foreground text-background px-3 py-1 text-sm">
                  {t("projects")}
                </div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                  {t("view_all")}
                </h2>
                <p className="text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  {t("projects_description")}
                </p>
              </div>
            </div>
          </BlurFade>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 max-w-[800px] mx-auto">
            {DATA.projects
              .slice()
              .sort((a, b) => {
                // Fonction pour convertir les dates des projets en objets Date
                const parseProjectDate = (dateStr: string) => {
                  // Format attendu: "Month Year" ou "Month DD, Year"
                  const parts = dateStr.replace(",", "").split(" ");
                  const month = [
                    "january",
                    "february",
                    "march",
                    "april",
                    "may",
                    "june",
                    "july",
                    "august",
                    "september",
                    "october",
                    "november",
                    "december",
                  ].indexOf(parts[0].toLowerCase());

                  // Si format "Month DD, Year"
                  if (parts.length === 3) {
                    return new Date(
                      parseInt(parts[2]),
                      month,
                      parseInt(parts[1]),
                    );
                  }
                  // Si format "Month Year"
                  return new Date(parseInt(parts[1]), month, 1);
                };

                // Trier du plus récent au plus ancien
                return (
                  parseProjectDate(b.dates).getTime() -
                  parseProjectDate(a.dates).getTime()
                );
              })
              .map((project, id) => (
                <BlurFade
                  key={`project-${project.href}`}
                  delay={BLUR_FADE_DELAY * 12 + id * 0.05}
                >
                  <ProjectCard
                    href={project.href}
                    title={
                      project.title[language as keyof typeof project.title]
                    }
                    description={
                      project.description[
                        language as keyof typeof project.description
                      ]
                    }
                    dates={project.dates}
                    tags={project.technologies}
                    image={project.image}
                    video={project.video}
                    links={project.links}
                    language={language}
                    newWindow={
                      "newWindow" in project
                        ? (project.newWindow ?? false)
                        : false
                    }
                  />
                </BlurFade>
              ))}
          </div>
        </div>
      </section>

      <section id="hackathons">
        <div className="space-y-12 w-full py-12">
          <BlurFade delay={BLUR_FADE_DELAY * 13}>
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-foreground text-background px-3 py-1 text-sm">
                  {t("hackathons")}
                </div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                  {t("hackathons_intro_title")}
                </h2>
                <p className="text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  {t("hackathons_intro_desc").replace(
                    "{count}",
                    String(DATA.hackathons.length),
                  )}
                </p>
              </div>
            </div>
          </BlurFade>
          <BlurFade delay={BLUR_FADE_DELAY * 14}>
            <ul className="mb-4 ml-4 divide-y divide-dashed border-l">
              {DATA.hackathons.map((hack: HackathonItem, id: number) => {
                const title =
                  hack.title[language as keyof typeof hack.title] ?? hack.title;
                const description =
                  hack.description[language as keyof typeof hack.description] ??
                  hack.description;
                const location =
                  hack.location[language as keyof typeof hack.location] ??
                  hack.location;
                const dates =
                  hack.dates[language as keyof typeof hack.dates] ?? hack.dates;
                const image = hack.image;
                const links =
                  hack.links.length > 0
                    ? (hack.links as readonly {
                        icon: React.ReactNode;
                        title: string;
                        href: string;
                      }[])
                    : undefined;
                const key = `hackathon-${id}`;

                return (
                  <BlurFade key={key} delay={BLUR_FADE_DELAY * 15 + id * 0.05}>
                    <HackathonCard
                      title={title}
                      description={description}
                      location={location}
                      dates={dates}
                      image={image}
                      links={links}
                    />
                  </BlurFade>
                );
              })}
            </ul>
          </BlurFade>
        </div>
      </section>

      <LatestArticleCTA language={language} />

      <section id="contact">
        <div className="grid items-center justify-center gap-4 px-4 text-center md:px-6 w-full py-12">
          <BlurFade delay={BLUR_FADE_DELAY * 16}>
            <div className="space-y-3">
              <div className="inline-block rounded-lg bg-foreground text-background px-3 py-1 text-sm">
                {t("contact")}
              </div>
              <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                {t("get_in_touch")}
              </h2>
              <p className="mx-auto max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                {language === "fr" ? (
                  <>
                    Envie de discuter ? Envoyez-moi simplement un{" "}
                    <Link
                      href={DATA.contact.social.LinkedIn.url}
                      className="text-blue-500 hover:underline"
                    >
                      message sur LinkedIn
                    </Link>{" "}
                    et je vous répondrai dès que possible.
                  </>
                ) : (
                  <>
                    Want to chat? Just{" "}
                    <Link
                      href={DATA.contact.social.LinkedIn.url}
                      className="text-blue-500 hover:underline"
                    >
                      shoot me a dm on LinkedIn
                    </Link>{" "}
                    and I&apos;ll respond whenever I can.
                  </>
                )}
              </p>
            </div>
          </BlurFade>
        </div>
      </section>
    </main>
  );
}
