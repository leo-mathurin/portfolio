import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import Markdown from "react-markdown";

// Fonction pour traduire les mois et formater les dates
function translateDate(dateString: string, language: string) {
  if (!dateString) return dateString;
  
  // Tableau des mois en anglais et français
  const months = {
    en: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
    fr: ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"]
  };
  
  // Traduire les mois anglais en français si la langue est fr
  if (language === 'fr') {
    for (let i = 0; i < months.en.length; i++) {
      const regex = new RegExp(months.en[i], 'g');
      dateString = dateString.replace(regex, months.fr[i]);
    }
  }
  
  return dateString;
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
  }[];
  className?: string;
  language: string;
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
}: Props) {
  return (
    <Card
      className={
        "flex flex-col overflow-hidden border hover:shadow-lg transition-all duration-300 ease-out h-full"
      }
    >
      <Link
        href={href || "#"}
        className={cn("block border-b cursor-pointer", className)}
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
          <time className="font-sans text-xs">{translateDate(dates, language)}</time>
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
                {tag[language as 'en' | 'fr']}
              </Badge>
            ))}
          </div>
        )}
      </CardContent>
      <CardFooter className="px-2 pb-2">
        {links && links.length > 0 && (
          <div className="flex flex-row flex-wrap items-start gap-1">
            {links?.map((link, idx) => (
              <Link href={link?.href} key={idx}>
                <Badge key={idx} className="flex gap-2 px-2 py-1 text-[10px]">
                  {link.icon}
                  {typeof link.type === 'string' ? link.type : (link.type as {en: string, fr: string})[language as 'en' | 'fr']}
                </Badge>
              </Link>
            ))}
          </div>
        )}
      </CardFooter>
    </Card>
  );
}
