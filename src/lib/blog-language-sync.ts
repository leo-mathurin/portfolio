"use client";

import { useEffect, useRef } from "react";
import { useLocale } from "next-intl";
import { useLanguage } from "@/components/language-toggle";
import { useRouter } from "next/navigation";

interface BlogLanguageSyncProps {
  readonly initialLang: string;
}

export function BlogLanguageSync({ initialLang }: BlogLanguageSyncProps) {
  const locale = useLocale();
  const { setLanguage } = useLanguage();
  const router = useRouter();
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
        urlLang !== locale
      ) {
        setLanguage(urlLang);
        return; // URL already has the param, no need to update
      } else if (!urlLang && initialLang && initialLang !== locale) {
        setLanguage(initialLang);
        // Update URL with initialLang via App Router navigation
        url.searchParams.set("lang", initialLang);
        router.replace(`${url.pathname}?${url.searchParams.toString()}`, {
          scroll: false,
        });
        return;
      } else if (!urlLang) {
        // Ensure URL has a lang param so future refreshes match the content language
        url.searchParams.set("lang", locale);
        router.replace(`${url.pathname}?${url.searchParams.toString()}`, {
          scroll: false,
        });
        return;
      }
    }

    // Keep URL in sync with context language
    const url = new URL(window.location.href);
    const urlLang = url.searchParams.get("lang");
    if (urlLang !== locale) {
      url.searchParams.set("lang", locale);
      router.replace(`${url.pathname}?${url.searchParams.toString()}`, {
        scroll: false,
      });
    }
  }, [locale, setLanguage, initialLang, router]);

  return null;
}

