"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/icons";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

interface PrivateMenuProps {
  readonly className?: string;
}

/**
 * Dock menu grouping the signed-in-only pages (briefing, todos)
 * behind a single icon to keep the navbar uncluttered.
 */
export function PrivateMenu({ className }: PrivateMenuProps) {
  const t = useTranslations();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className={cn("size-12", className)}>
          <Icons.folderClosed className="size-4" />
          <span className="sr-only">{t("private_space")}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" side="top" className="space-y-1">
        <DropdownMenuItem asChild>
          <Link href="/briefing">
            <Icons.notebook />
            {t("briefing")}
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/todos">
            <Icons.listTodo />
            {t("todos")}
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/emails">
            <Icons.email />
            {t("emails")}
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
