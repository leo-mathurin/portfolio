import { Flag } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { cn } from "@/lib/utils";

/**
 * Pre-computed, serializable view of a Missive inbox conversation. All
 * locale/timezone formatting happens on the server (see page.tsx) so the
 * read-only list can stay a server component.
 */
export interface EmailItem {
  id: string;
  sender: string;
  subject: string;
  messagesCount: number;
  isFlagged: boolean;
  /** Time of day for today's activity, otherwise a short date. */
  timeLabel: string;
  /** Deep link to open the conversation in Missive. */
  url: string;
}

export async function EmailList({ emails }: { emails: EmailItem[] }) {
  const t = await getTranslations();

  if (emails.length === 0) {
    return (
      <div className="rounded-md border p-4 text-sm text-muted-foreground">
        {t("emails_empty")}
      </div>
    );
  }

  return (
    <ul className="divide-y">
      {emails.map((email) => (
        <li key={email.id} className="group">
          <a
            href={email.url}
            target="_blank"
            rel="noreferrer"
            className="flex items-start gap-3 py-3"
          >
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
                {email.isFlagged && (
                  <Flag className="size-3 shrink-0 fill-amber-500 text-amber-500" />
                )}
              </div>
              <p className="truncate text-sm text-muted-foreground">
                {email.subject}
              </p>
            </div>
            <span
              className={cn(
                "mt-0.5 shrink-0 text-xs text-muted-foreground tabular-nums",
              )}
            >
              {email.timeLabel}
            </span>
          </a>
        </li>
      ))}
    </ul>
  );
}
