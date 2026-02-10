import { DATA } from "@/data/resume";
import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/briefing", "/sign-in"],
      },
    ],
    sitemap: `${DATA.url}sitemap.xml`,
  };
}
