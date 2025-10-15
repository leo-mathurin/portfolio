import type { Metadata } from "next";
import { DATA } from "@/data/resume";

export const metadata: Metadata = {
  title: "Notes",
  description: "My personal notes.",
  openGraph: {
    title: "Notes",
    description: "My personal notes.",
    url: `${DATA.url}/notes`,
    siteName: DATA.name,
    locale: "en_US",
    type: "website",
  },
  twitter: {
    title: "Notes",
    card: "summary_large_image",
  },
};

export default function NotesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
