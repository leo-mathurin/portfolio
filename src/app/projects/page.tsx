import BlurFade from "@/components/magicui/blur-fade";
import { ProjectCard } from "@/components/project-card";
import { SimplePageHeader } from "@/components/page-header";
import { BackLink } from "@/components/back-link";
import { DATA } from "@/data/resume";
import { sortProjectsByDate } from "@/lib/sort-projects";
import { getTranslations, getLocale } from "next-intl/server";

const BLUR_FADE_DELAY = 0.04;

export const metadata = {
  title: "Projects",
  description: "An archive of everything I've worked on.",
};

export default async function ProjectsPage() {
  const t = await getTranslations();
  const language = await getLocale();

  const projects = sortProjectsByDate(DATA.projects);

  return (
    <main className="flex flex-col min-h-[100dvh] space-y-10">
      <SimplePageHeader
        title={t("all_projects_title")}
        subtitle={t("all_projects_subtitle")}
      />

      <BlurFade delay={BLUR_FADE_DELAY}>
        <BackLink label={t("back_home")} />
      </BlurFade>

      <section id="all-projects">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {projects.map((project, id) => (
            <BlurFade
              key={`project-${project.href}`}
              delay={BLUR_FADE_DELAY * 2 + id * 0.04}
            >
              <ProjectCard
                href={project.href}
                title={project.title[language as keyof typeof project.title]}
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
      </section>
    </main>
  );
}
