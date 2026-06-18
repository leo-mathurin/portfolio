"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { ChevronRight, Flag, Paperclip } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { getThread, type ThreadMessage } from "./actions";
import { EmailThread } from "./email-thread";

export interface EmailLabel {
  id: string;
  name: string;
}

/**
 * Pre-computed, serializable view of a Missive inbox conversation. All
 * locale/timezone formatting happens on the server (see page.tsx); the full
 * thread body is lazy-loaded on expand via the getThread server action.
 */
export interface EmailItem {
  id: string;
  sender: string;
  subject: string;
  /** One-line snippet from the latest message. */
  preview: string;
  messagesCount: number;
  attachmentsCount: number;
  labels: EmailLabel[];
  isFlagged: boolean;
  /** Time of day for today's activity, otherwise a short date. */
  timeLabel: string;
  /** Deep link to open the conversation in Missive (fallback / convenience). */
  webUrl: string;
}

function ThreadSkeleton() {
  return (
    <div className="space-y-2 py-2 pl-8 pr-2">
      <Skeleton className="h-3 w-40" />
      <Skeleton className="h-3 w-full" />
      <Skeleton className="h-3 w-11/12" />
      <Skeleton className="h-3 w-4/5" />
    </div>
  );
}

export function EmailList({ emails }: { emails: EmailItem[] }) {
  const t = useTranslations();
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [threads, setThreads] = useState<Record<string, ThreadMessage[]>>({});
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [errorIds, setErrorIds] = useState<Set<string>>(new Set());

  if (emails.length === 0) {
    return (
      <div className="rounded-md border p-4 text-sm text-muted-foreground">
        {t("emails_empty")}
      </div>
    );
  }

  const toggle = (email: EmailItem) => {
    if (expandedId === email.id) {
      setExpandedId(null);
      return;
    }
    setExpandedId(email.id);

    if (threads[email.id] || loadingId === email.id) return;

    setLoadingId(email.id);
    setErrorIds((prev) => {
      const next = new Set(prev);
      next.delete(email.id);
      return next;
    });

    getThread(email.id)
      .then((thread) =>
        setThreads((prev) => ({ ...prev, [email.id]: thread })),
      )
      .catch(() => setErrorIds((prev) => new Set(prev).add(email.id)))
      .finally(() =>
        setLoadingId((current) => (current === email.id ? null : current)),
      );
  };

  return (
    <ul className="divide-y">
      {emails.map((email) => {
        const isExpanded = expandedId === email.id;
        const thread = threads[email.id];
        const isLoading = loadingId === email.id;
        const hasError = errorIds.has(email.id);

        return (
          <li key={email.id} className="group">
            <button
              type="button"
              onClick={() => toggle(email)}
              aria-expanded={isExpanded}
              className="flex w-full items-start gap-2 py-3 text-left"
            >
              <ChevronRight
                className={cn(
                  "mt-0.5 size-4 shrink-0 text-muted-foreground/50 transition-transform",
                  isExpanded && "rotate-90",
                )}
              />
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="truncate text-sm font-medium">
                    {email.sender}
                  </span>
                  {email.messagesCount > 1 && (
                    <span className="shrink-0 text-xs text-muted-foreground">
                      {email.messagesCount}
                    </span>
                  )}
                  {email.attachmentsCount > 0 && (
                    <Paperclip className="size-3 shrink-0 text-muted-foreground" />
                  )}
                  {email.isFlagged && (
                    <Flag className="size-3 shrink-0 fill-amber-500 text-amber-500" />
                  )}
                </div>
                <p className="truncate text-sm text-muted-foreground">
                  {email.subject}
                </p>
                {email.preview && (
                  <p className="truncate text-xs text-muted-foreground/70">
                    {email.preview}
                  </p>
                )}
                {email.labels.length > 0 && (
                  <div className="mt-1 flex flex-wrap gap-1">
                    {email.labels.map((label) => (
                      <Badge
                        key={label.id}
                        variant="secondary"
                        className="text-[10px]"
                      >
                        {label.name}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
              <span className="mt-0.5 shrink-0 text-xs text-muted-foreground tabular-nums">
                {email.timeLabel}
              </span>
            </button>

            <motion.div
              initial={false}
              animate={{
                height: isExpanded ? "auto" : 0,
                opacity: isExpanded ? 1 : 0,
              }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="overflow-hidden"
            >
              {isLoading && <ThreadSkeleton />}
              {hasError && (
                <p className="py-2 pl-8 pr-2 text-sm text-muted-foreground">
                  {t("emails_thread_error")}{" "}
                  <a
                    href={email.webUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline underline-offset-2"
                  >
                    {t("emails_open_in_missive")}
                  </a>
                </p>
              )}
              {thread && <EmailThread messages={thread} webUrl={email.webUrl} />}
            </motion.div>
          </li>
        );
      })}
    </ul>
  );
}
