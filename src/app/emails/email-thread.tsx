"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { ExternalLink, MoreHorizontal, Paperclip } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ThreadMessage } from "./actions";

/**
 * Renders one message body, collapsing quoted reply history behind a Gmail-style
 * "•••" toggle (shown only when there is quoted content to reveal).
 */
function MessageBody({
  html,
  quotedHtml,
}: {
  html: string;
  quotedHtml: string | null;
}) {
  const t = useTranslations();
  const [showQuoted, setShowQuoted] = useState(false);

  return (
    <div className="overflow-x-auto">
      <div
        className="prose prose-sm dark:prose-invert max-w-none break-words"
        dangerouslySetInnerHTML={{ __html: html }}
      />

      {quotedHtml && (
        <>
          <button
            type="button"
            onClick={() => setShowQuoted((v) => !v)}
            aria-expanded={showQuoted}
            aria-label={t("emails_toggle_quoted")}
            title={t("emails_toggle_quoted")}
            className={cn(
              "mt-1 inline-flex h-5 items-center rounded bg-muted px-1.5 text-muted-foreground transition-colors hover:bg-muted-foreground/20",
              showQuoted && "bg-muted-foreground/20",
            )}
          >
            <MoreHorizontal className="size-4" />
          </button>

          {showQuoted && (
            <div
              className="prose prose-sm dark:prose-invert mt-2 max-w-none break-words border-l-2 border-muted pl-3 text-muted-foreground"
              dangerouslySetInnerHTML={{ __html: quotedHtml }}
            />
          )}
        </>
      )}
    </div>
  );
}

/**
 * Renders a conversation's messages oldest-to-newest. Each body is already
 * sanitized on the server (see actions.ts -> sanitizeEmailHtml), so it is safe
 * to inject here. Bodies are wrapped in overflow-x-auto because email markup is
 * frequently wider than the page column.
 */
export function EmailThread({
  messages,
  webUrl,
}: {
  messages: ThreadMessage[];
  webUrl: string;
}) {
  const t = useTranslations();

  return (
    <div className="space-y-6 pb-4 pl-8 pr-2">
      {messages.map((message) => (
        <article key={message.id} className="space-y-2">
          <header className="space-y-0.5 text-xs text-muted-foreground">
            <div className="flex items-center justify-between gap-2">
              <span className="truncate font-medium text-foreground">
                {message.fromName}
              </span>
              <span className="shrink-0 tabular-nums">{message.dateLabel}</span>
            </div>
            {message.fromAddress &&
              message.fromAddress !== message.fromName && (
                <div className="truncate">{message.fromAddress}</div>
              )}
            {message.to.length > 0 && (
              <div className="truncate">
                {t("emails_to")}: {message.to.join(", ")}
              </div>
            )}
          </header>

          {message.attachments.length > 0 && (
            <ul className="flex flex-wrap gap-2">
              {message.attachments.map((attachment) => (
                <li key={attachment.id}>
                  <a
                    href={attachment.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 rounded-md border px-2 py-1 text-xs hover:bg-muted"
                  >
                    <Paperclip className="size-3 shrink-0" />
                    <span className="max-w-[12rem] truncate">
                      {attachment.filename}
                    </span>
                    {attachment.sizeLabel && (
                      <span className="text-muted-foreground">
                        {attachment.sizeLabel}
                      </span>
                    )}
                  </a>
                </li>
              ))}
            </ul>
          )}

          <MessageBody html={message.html} quotedHtml={message.quotedHtml} />
        </article>
      ))}

      <a
        href={webUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1 text-xs text-muted-foreground underline-offset-2 hover:underline"
      >
        <ExternalLink className="size-3" />
        {t("emails_open_in_missive")}
      </a>
    </div>
  );
}
