import { useLanguage } from "@/components/language-toggle";

export type TranslationKey =
  | "Home"
  | "Blog"
  | "home"
  | "blog"
  | "skills"
  | "projects"
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
    home: "Home",
    blog: "Blog",
    skills: "Skills",
    projects: "Projects",
    view_all: "Check out my latest work",
    contact: "Contact",
    get_in_touch: "Get in Touch",
    theme: "Theme",
    language: "Language",
    about: "About",
    work_experience: "Work Experience",
    education: "Education",
    projects_description: "I've worked on cloud infrastructure and networking projects, from Oracle VM servers to DNS-based ad blocking solutions. Here are some of my key implementations.",
    greeting: "hi, I'm",
    present: "Present",
    to: "-",
    current: "Current"
  },
  fr: {
    Home: "Accueil",
    Blog: "Blog",
    home: "Accueil",
    blog: "Blog",
    skills: "Compétences",
    projects: "Projets",
    view_all: "Découvrez mes derniers projets",
    contact: "Contact",
    get_in_touch: "Me contacter",
    theme: "Thème",
    language: "Langue",
    about: "À propos",
    work_experience: "Expérience professionnelle",
    education: "Formation",
    projects_description: "J'ai travaillé sur des projets d'infrastructure cloud et de réseaux, des serveurs Oracle VM aux solutions de blocage de publicités basées sur le DNS. Voici quelques-unes de mes réalisations clés.",
    greeting: "hey, je suis",
    present: "Aujourd'hui",
    to: "-",
    current: "En cours"
  }
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