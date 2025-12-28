import { cookies, headers } from "next/headers";
import { getRequestConfig } from "next-intl/server";
import { routing } from "./routing";

export default getRequestConfig(async () => {
  const cookieStore = await cookies();
  const languageCookie = cookieStore.get("language")?.value;
  const acceptLanguage = (await headers()).get("accept-language") ?? "";

  // Priority: cookie > accept-language header (matching current behavior)
  let locale = routing.defaultLocale;
  if (languageCookie === "en" || languageCookie === "fr") {
    locale = languageCookie;
  } else if (acceptLanguage.toLowerCase().includes("fr")) {
    locale = "fr";
  }

  return {
    locale,
    messages: (await import(`../../messages/${locale}.json`)).default,
  };
});

