import { SimplePageHeader } from "@/components/page-header";
import { BackLink } from "@/components/back-link";
import { getLocale, getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import {
  getConversationMessages,
  getInboxConversations,
  mapWithConcurrency,
} from "@/lib/missive";
import { DISPLAY_TIME_ZONE } from "@/lib/todoist";
import { EmailList, type EmailItem } from "./email-list";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Emails",
  description: "Inbox at a glance.",
  robots: { index: false, follow: false },
};

export default async function EmailsPage() {
  const [conversations, t, locale] = await Promise.all([
    getInboxConversations(),
    getTranslations(),
    getLocale(),
  ]);

  // The inbox endpoint omits a body preview, so fetch each conversation's
  // latest message to surface a one-line snippet. Capped at 5 concurrent
  // requests to stay within Missive's rate limit.
  const previews = await mapWithConcurrency(conversations, 5, async (c) => {
    try {
      const [latest] = await getConversationMessages(c.id, 1);
      return latest?.preview?.trim() ?? "";
    } catch {
      return "";
    }
  });

  // Today's calendar day in Paris, so "today" rows show a time and older
  // rows show a date — all computed on the server to keep SSR deterministic.
  const today = new Date().toLocaleDateString("en-CA", {
    timeZone: DISPLAY_TIME_ZONE,
  });

  const items: EmailItem[] = conversations.map((c, i) => {
    const author = c.authors[0];
    const sender = author?.name?.trim() || author?.address || t("emails_unknown_sender");
    const subject =
      c.subject?.trim() || c.latest_message_subject?.trim() || t("emails_no_subject");

    const activityDate = new Date(c.last_activity_at * 1000);
    const activityDay = activityDate.toLocaleDateString("en-CA", {
      timeZone: DISPLAY_TIME_ZONE,
    });
    const timeLabel =
      activityDay === today
        ? activityDate.toLocaleTimeString(locale, {
            hour: "2-digit",
            minute: "2-digit",
            timeZone: DISPLAY_TIME_ZONE,
          })
        : activityDate.toLocaleDateString(locale, {
            day: "numeric",
            month: "short",
            timeZone: DISPLAY_TIME_ZONE,
          });

    return {
      id: c.id,
      sender,
      subject,
      preview: previews[i],
      messagesCount: c.messages_count,
      attachmentsCount: c.attachments_count ?? 0,
      labels: (c.shared_labels ?? []).map((l) => ({ id: l.id, name: l.name })),
      isFlagged: !!c.users?.some((u) => u.flagged),
      timeLabel,
      webUrl: c.web_url,
    };
  });

  return (
    <main className="flex flex-col min-h-[100dvh] space-y-6 pb-16">
      <SimplePageHeader title="emails" />
      <BackLink label={t("back_home")} />
      <EmailList emails={items} />
    </main>
  );
}
