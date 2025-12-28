"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/icons";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import Image from "next/image";

interface LanguageContextProps {
  language: string;
  setLanguage: (language: string) => void;
}

const LanguageContext = React.createContext<LanguageContextProps | undefined>(
  undefined,
);

interface LanguageProviderProps {
  readonly children: React.ReactNode;
  readonly initialLanguage?: string;
}

export function LanguageProvider({
  children,
  initialLanguage = "en",
}: LanguageProviderProps) {
  const router = useRouter();
  const nextIntlLocale = useLocale();
  const [language, setLanguageState] = React.useState<string>(initialLanguage);

  React.useEffect(() => {
    // Sync with next-intl locale
    const langToUse = nextIntlLocale || initialLanguage;
    setLanguageState(langToUse);
    document.documentElement.lang = langToUse;

    // Sync localStorage and cookie with next-intl locale
    if (typeof window !== "undefined") {
      localStorage.setItem("language", langToUse);
      document.cookie = `language=${langToUse}; path=/; max-age=31536000`; // 1 year
    }
  }, [nextIntlLocale, initialLanguage]);

  const value = React.useMemo(() => {
    return {
      language: nextIntlLocale || language,
      setLanguage: (newLanguage: string) => {
        localStorage.setItem("language", newLanguage);
        // Set cookie so server can read it (next-intl reads from this cookie)
        document.cookie = `language=${newLanguage}; path=/; max-age=31536000`; // 1 year
        document.documentElement.lang = newLanguage;
        setLanguageState(newLanguage);
        // Refresh server components to pick up new language
        router.refresh();
      },
    };
  }, [nextIntlLocale, language, router]);

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = React.useContext(LanguageContext);

  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }

  return context;
}

interface LanguageToggleProps {
  readonly className?: string;
}

export function LanguageToggle({ className }: LanguageToggleProps) {
  const { language, setLanguage } = useLanguage();
  const nextIntlLocale = useLocale();
  const currentLanguage = nextIntlLocale || language;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className={cn("size-12", className)}
        >
          <Icons.globe className="size-4" />
          <span className="sr-only">Toggle language</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" side="top" className="space-y-1">
        <DropdownMenuItem
          onClick={() => setLanguage("en")}
          className={currentLanguage === "en" ? "bg-accent" : ""}
        >
          <div className="mr-2 flex items-center">
            <Image src="/flags/gb.svg" alt="UK Flag" width={16} height={12} />
          </div>
          English
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => setLanguage("fr")}
          className={currentLanguage === "fr" ? "bg-accent" : ""}
        >
          <div className="mr-2 flex items-center">
            <Image
              src="/flags/fr.svg"
              alt="France Flag"
              width={16}
              height={12}
            />
          </div>
          Français
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
