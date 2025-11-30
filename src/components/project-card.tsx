import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { translateDate } from "@/lib/translations";
import Image from "next/image";
import Link from "next/link";
import Markdown from "react-markdown";

// Fonction pour ajouter le paramètre de langue à une URL si nécessaire
function getLocalizedHref(href: string, language: string): string {
  if (!href || language === "en") return href;

  // Ne pas ajouter le paramètre de langue aux liens externes
  if (href.startsWith("http")) return href;

  // Si l'URL contient déjà des paramètres, ajouter le paramètre de langue
  if (href.includes("?")) {
    return `${href}&lang=${language}`;
  }

  // Sinon, ajouter le paramètre de langue avec un ?
  return `${href}?lang=${language}`;
}

interface Props {
  title: string;
  href?: string;
  description: string;
  dates: string;
  tags: readonly { en: string; fr: string }[];
  link?: string;
  image?: string;
  video?: string;
  links?: readonly {
    type: string | { en: string; fr: string };
    href: string;
    icon: React.ReactNode;
    newWindow?: boolean;
  }[];
  className?: string;
  language: string;
  newWindow?: boolean;
}

export function ProjectCard({
  title,
  href,
  description,
  dates,
  tags,
  link,
  image,
  video,
  links,
  className,
  language,
  newWindow,
}: Props) {
  // Préparer l'URL localisée
  const localizedHref = href ? getLocalizedHref(href, language) : "#";

  return (
    <Card
      className={
        "flex flex-col overflow-hidden border transition-all duration-300 ease-out hover:shadow-lg h-full"
      }
    >
      <Link
        href={localizedHref}
        className={cn("block border-b cursor-pointer", className)}
        {...(newWindow ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      >
        {video && (
          <video
            src={video}
            autoPlay
            loop
            muted
            playsInline
            className="pointer-events-none mx-auto h-40 w-full object-cover object-top" // needed because random black line at bottom of video
          />
        )}
        {image && (
          <Image
            src={image}
            alt={title}
            width={500}
            height={300}
            className="h-40 w-full overflow-hidden object-cover object-top"
          />
        )}
      </Link>
      <CardHeader className="px-2">
        <div className="space-y-1">
          <CardTitle className="mt-1 text-base">{title}</CardTitle>
          <time className="font-sans text-xs">
            {translateDate(dates, language)}
          </time>
          <div className="hidden font-sans text-xs underline print:visible">
            {link?.replace("https://", "").replace("www.", "").replace("/", "")}
          </div>
          <Markdown className="prose max-w-full text-pretty font-sans text-xs text-muted-foreground dark:prose-invert">
            {description}
          </Markdown>
        </div>
      </CardHeader>
      <CardContent className="mt-auto flex flex-col px-2">
        {tags && tags.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1">
            {tags?.map((tag, idx) => (
              <Badge
                className="px-1 py-0 text-[10px]"
                variant="secondary"
                key={`tag-${idx}`}
              >
                {tag[language as "en" | "fr"]}
              </Badge>
            ))}
          </div>
        )}
      </CardContent>
      <CardFooter className="px-2 pb-2">
        {links && links.length > 0 && (
          <div className="flex flex-row flex-wrap items-start gap-1">
            {links?.map((link, idx) => (
              <Link
                href={getLocalizedHref(link?.href, language)}
                key={idx}
                {...(link.newWindow ||
                (link.href.startsWith("http") && newWindow)
                  ? { target: "_blank", rel: "noopener noreferrer" }
                  : {})}
              >
                <Badge key={idx} className="flex gap-2 px-2 py-1 text-[10px]">
                  {link.icon}
                  {typeof link.type === "string"
                    ? link.type
                    : (link.type as { en: string; fr: string })[
                        language as "en" | "fr"
                      ]}
                </Badge>
              </Link>
            ))}
          </div>
        )}
      </CardFooter>
    </Card>
  );
}
