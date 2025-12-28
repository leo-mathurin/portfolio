"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { translateDate } from "@/lib/translate-date";
import { motion } from "framer-motion";
import { ChevronRightIcon } from "lucide-react";
import Link from "next/link";
import React from "react";
import { Icons } from "@/components/icons";

interface ResumeCardProps {
  logoUrl: string;
  altText: string;
  title: string;
  subtitle?: string;
  href?: string;
  badges?: readonly string[];
  period: string;
  description: string;
  language: string;
  isCurrentDate?: boolean;
}

function getDomainFromUrl(url: string): string {
  try {
    const urlObj = new URL(url);
    return urlObj.hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}

export const ResumeCard = ({
  logoUrl,
  altText,
  title,
  subtitle,
  href,
  badges,
  period,
  description,
  language,
}: ResumeCardProps) => {
  const [isExpanded, setIsExpanded] = React.useState(false);

  return (
    <div
      onClick={() => setIsExpanded(!isExpanded)}
      className="block cursor-pointer"
    >
      <Card>
        <div className="flex items-center">
          <div className="flex-none">
            <Avatar className="border size-12 m-auto bg-muted-background dark:bg-foreground">
              <AvatarImage
                src={logoUrl}
                alt={altText}
                className="object-contain"
              />
              <AvatarFallback>{altText[0]}</AvatarFallback>
            </Avatar>
          </div>
          <div className="flex-grow ml-4 items-center flex-col group">
            <CardHeader>
              <div className="flex items-center justify-between gap-x-2 text-base">
                <h3 className="inline-flex items-center justify-center font-semibold leading-none text-xs sm:text-sm">
                  {title}
                  {badges && (
                    <span className="inline-flex gap-x-1">
                      {badges.map((badge, index) => (
                        <Badge
                          variant="secondary"
                          className="align-middle text-xs"
                          key={index}
                        >
                          {badge}
                        </Badge>
                      ))}
                    </span>
                  )}
                  <ChevronRightIcon
                    className={cn(
                      "size-4 translate-x-0 transform opacity-0 transition-all duration-300 ease-out group-hover:translate-x-1 group-hover:opacity-100",
                      isExpanded ? "rotate-90" : "rotate-0",
                    )}
                  />
                </h3>
                <div className="text-xs sm:text-sm tabular-nums text-muted-foreground text-right">
                  <span
                    dangerouslySetInnerHTML={{
                      __html: translateDate(period, language),
                    }}
                  />
                </div>
              </div>
              {subtitle && <div className="font-sans text-xs">{subtitle}</div>}
            </CardHeader>
          </div>
        </div>
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{
            opacity: isExpanded ? 1 : 0,
            height: isExpanded ? "auto" : 0,
            marginTop: isExpanded ? "0.5rem" : 0,
          }}
          transition={{
            duration: 0.7,
            ease: [0.16, 1, 0.3, 1],
          }}
          className="text-xs sm:text-sm space-y-1 px-6 overflow-hidden"
        >
          <div>{description}</div>
          {href && href.trim() !== "" && (
            <Link
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block pt-2"
              onClick={(e) => {
                e.stopPropagation();
              }}
            >
              <Badge className="flex gap-2 px-2 py-1 text-[10px] w-fit">
                <Icons.arrowRight className="size-3" />
                {getDomainFromUrl(href)}
              </Badge>
            </Link>
          )}
        </motion.div>
      </Card>
    </div>
  );
};
