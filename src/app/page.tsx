"use client"

import BlurFade from "@/components/magicui/blur-fade";
import BlurFadeText from "@/components/magicui/blur-fade-text";
import { ProjectCard } from "@/components/project-card";
import { ResumeCard } from "@/components/resume-card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { DATA } from "@/data/resume";
import { useTranslation } from "@/lib/translations";
import Link from "next/link";
import Markdown from "react-markdown";

const BLUR_FADE_DELAY = 0.04;

export default function Page() {
  const { t, language } = useTranslation();
  
  return (
    <main className="flex flex-col min-h-[100dvh] space-y-10">
      <section id="hero">
        <div className="mx-auto w-full max-w-2xl space-y-8">
          <div className="gap-2 flex justify-between">
            <div className="flex-col flex flex-1 space-y-1.5">
              <BlurFadeText
                delay={BLUR_FADE_DELAY}
                className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none text-pretty"
                yOffset={8}
                text={`${t("greeting")} ${DATA.name.split(" ")[0].toLowerCase()} 👋`}
              />
              <BlurFadeText
                className="max-w-[600px] md:text-xl"
                delay={BLUR_FADE_DELAY}
                text={DATA.description[language as keyof typeof DATA.description]}
              />
            </div>
            <BlurFade delay={BLUR_FADE_DELAY}>
              <Avatar className="size-28 border">
                <AvatarImage alt={DATA.name} src={DATA.avatarUrl} />
                <AvatarFallback>{DATA.initials}</AvatarFallback>
              </Avatar>
            </BlurFade>
          </div>
        </div>
      </section>
      <section id="about">
        <BlurFade delay={BLUR_FADE_DELAY * 3}>
          <h2 className="text-xl font-bold">{t("about")}</h2>
        </BlurFade>
        <BlurFade delay={BLUR_FADE_DELAY * 4}>
          <Markdown className="prose max-w-full text-pretty font-sans text-base text-muted-foreground dark:prose-invert">
            {DATA.summary[language as keyof typeof DATA.summary]}
          </Markdown>
        </BlurFade>
      </section>
      <section id="work">
        <div className="flex min-h-0 flex-col gap-y-3">
          <BlurFade delay={BLUR_FADE_DELAY * 5}>
            <h2 className="text-xl font-bold">{t("work_experience")}</h2>
          </BlurFade>
          {DATA.work.map((work, id) => (
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
                period={`${work.start} ${t("to")} ${work.end ?? t("present")}`}
                description={work.description[language as keyof typeof work.description]}
                language={language}
              />
            </BlurFade>
          ))}
        </div>
      </section>
      <section id="education">
        <div className="flex min-h-0 flex-col gap-y-3">
          <BlurFade delay={BLUR_FADE_DELAY * 7}>
            <h2 className="text-xl font-bold">{t("education")}</h2>
          </BlurFade>
          {DATA.education.map((education, id) => (
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
                subtitle={education.degree[language as keyof typeof education.degree]}
                period={education.start ? `${education.start} ${t("to")} ${education.end}` : education.end}
                language={language}
              />
            </BlurFade>
          ))}
        </div>
      </section>
      <section id="skills">
        <div className="flex min-h-0 flex-col gap-y-3">
          <BlurFade delay={BLUR_FADE_DELAY * 9}>
            <h2 className="text-xl font-bold">{t("skills")}</h2>
          </BlurFade>
          <div className="flex flex-wrap gap-1">
            {DATA.skills.map((skill, id) => (
              <BlurFade key={`skill-${id}`} delay={BLUR_FADE_DELAY * 10 + id * 0.05}>
                <Badge key={`skill-badge-${id}`}>{skill[language as keyof typeof skill]}</Badge>
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
                  const parts = dateStr.replace(',', '').split(' ');
                  const month = ['january', 'february', 'march', 'april', 'may', 'june', 
                                'july', 'august', 'september', 'october', 'november', 'december']
                                .indexOf(parts[0].toLowerCase());
                  
                  // Si format "Month DD, Year"
                  if (parts.length === 3) {
                    return new Date(parseInt(parts[2]), month, parseInt(parts[1]));
                  }
                  // Si format "Month Year"
                  return new Date(parseInt(parts[1]), month, 1);
                };
                
                // Trier du plus récent au plus ancien
                return parseProjectDate(b.dates).getTime() - parseProjectDate(a.dates).getTime();
              })
              .map((project, id) => (
                <BlurFade
                  key={`project-${project.href}`}
                  delay={BLUR_FADE_DELAY * 12 + id * 0.05}
                >
                  <ProjectCard
                    href={project.href}
                    title={project.title[language as keyof typeof project.title]}
                    description={project.description[language as keyof typeof project.description]}
                    dates={project.dates}
                    tags={project.technologies}
                    image={project.image}
                    video={project.video}
                    links={project.links as any}
                    language={language}
                  />
                </BlurFade>
              ))}
          </div>
        </div>
      </section>
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
