import { useLanguage } from "@/components/language-toggle";

export type TranslationKey =
  | "Home"
  | "Blog"
  | "Notes"
  | "home"
  | "blog"
  | "notes"
  | "skills"
  | "projects"
  | "hackathons"
  | "hackathons_intro_title"
  | "hackathons_intro_desc"
  | "view_all"
  | "contact"
  | "get_in_touch"
  | "theme"
  | "language"
  | "about"
  | "work_experience"
  | "education"
  | "projects_description"
  | "greeting"
  | "present"
  | "to"
  | "current";

export const translations: Record<string, Record<TranslationKey, string>> = {
  en: {
    Home: "Home",
    Blog: "Blog",
    Notes: "Notes",
    home: "Home",
    blog: "Blog",
    notes: "Notes",
    skills: "Skills",
    projects: "Projects",
    hackathons: "Hackathons",
    hackathons_intro_title: "I like building things",
    hackathons_intro_desc:
      "During my time in university, I attended {count}+ hackathons. People from around the country would come together and build incredible things in 2-3 days. It was eye-opening to see the endless possibilities brought to life by a group of motivated and passionate individuals.",
    view_all: "Check out my latest work",
    contact: "Contact",
    get_in_touch: "Get in Touch",
    theme: "Theme",
    language: "Language",
    about: "About",
    work_experience: "Work Experience",
    education: "Education",
    projects_description:
      "I've worked on cloud infrastructure and networking projects, from Oracle VM servers to DNS-based ad blocking solutions. Here are some of my key implementations.",
    greeting: "hi, I'm",
    present: "Present",
    to: "-",
    current: "Current",
  },
  fr: {
    Home: "Accueil",
    Blog: "Blog",
    Notes: "Notes",
    home: "Accueil",
    blog: "Blog",
    notes: "Notes",
    skills: "Compétences",
    projects: "Projets",
    hackathons: "Hackathons",
    hackathons_intro_title: "Créer, c’est mon truc",
    hackathons_intro_desc:
      "Pendant mes études, j’ai participé à plus de {count} hackathons. Des personnes venant de partout se rassemblaient pour créer des projets incroyables en 2 à 3 jours. C’était fascinant de voir tout ce qu’un groupe passionné de personnes pouvait accomplir en si peu de temps.",
    view_all: "Découvrez mes derniers projets",
    contact: "Contact",
    get_in_touch: "Me contacter",
    theme: "Thème",
    language: "Langue",
    about: "À propos",
    work_experience: "Expérience professionnelle",
    education: "Formation",
    projects_description:
      "J'ai travaillé sur des projets d'infrastructure cloud et de réseaux, des serveurs Oracle VM aux solutions de blocage de publicités basées sur le DNS. Voici quelques-unes de mes réalisations clés.",
    greeting: "hey, je suis",
    present: "Aujourd'hui",
    to: "-",
    current: "En cours",
  },
};

export function useTranslation() {
  const { language } = useLanguage();

  function t(key: TranslationKey | string): string {
    if (key in translations[language]) {
      return translations[language][key as TranslationKey];
    }

    return key;
  }

  return { t, language };
}
