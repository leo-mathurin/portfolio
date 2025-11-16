import type { Metadata } from "next";
import { DATA } from "@/data/resume";

export const metadata: Metadata = {
  title: "Blog",
  description: "Read my thoughts on software development and cybersecurity.",
  openGraph: {
    title: "Blog",
    description: "Read my thoughts on software development and cybersecurity.",
    url: `${DATA.url}/blog`,
    siteName: DATA.name,
    locale: "en_US",
    type: "website",
  },
  twitter: {
    title: "Blog",
    card: "summary_large_image",
  },
};

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
