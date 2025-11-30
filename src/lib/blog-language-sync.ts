"use client";

import { useEffect, useRef } from "react";
import { useTranslation } from "@/lib/translations";
import { useLanguage } from "@/components/language-toggle";

interface BlogLanguageSyncProps {
  readonly initialLang: string;
}

export function BlogLanguageSync({ initialLang }: BlogLanguageSyncProps) {
  const { language } = useTranslation();
  const { setLanguage } = useLanguage();
  const hasInitialized = useRef(false);

  // Sync URL param with context on mount, then keep URL in sync
  useEffect(() => {
    if (typeof window === "undefined") return;

    if (!hasInitialized.current) {
      hasInitialized.current = true;
      const url = new URL(window.location.href);
      const urlLang = url.searchParams.get("lang");

      // Priority: URL param > initialLang prop > context language
      if (
        urlLang &&
        (urlLang === "en" || urlLang === "fr") &&
        urlLang !== language
      ) {
        setLanguage(urlLang);
        return; // URL already has the param, no need to update
      } else if (!urlLang && initialLang && initialLang !== language) {
        setLanguage(initialLang);
        // Update URL with initialLang
        url.searchParams.set("lang", initialLang);
        window.history.replaceState({}, "", url.toString());
        return;
      }
    }

    // Keep URL in sync with context language
    const url = new URL(window.location.href);
    const urlLang = url.searchParams.get("lang");
    if (urlLang !== language) {
      url.searchParams.set("lang", language);
      window.history.replaceState({}, "", url.toString());
    }
  }, [language, setLanguage, initialLang]);

  return null;
}

