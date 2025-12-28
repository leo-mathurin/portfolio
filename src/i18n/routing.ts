import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["en", "fr"],
  defaultLocale: "en",
  localePrefix: "never", // No URL prefixes, cookie-based only
  localeCookie: {
    name: "language", // Match existing cookie name
    maxAge: 31536000, // 1 year
    sameSite: "lax",
  },
});

