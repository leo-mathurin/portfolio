import { SimplePageHeader } from "@/components/page-header";
import { BackLink } from "@/components/back-link";
import { getLocale, getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import { getInboxConversations } from "@/lib/missive";
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

  // Today's calendar day in Paris, so "today" rows show a time and older
  // rows show a date — all computed on the server to keep SSR deterministic.
  const today = new Date().toLocaleDateString("en-CA", {
    timeZone: DISPLAY_TIME_ZONE,
  });

  const items: EmailItem[] = conversations.map((c) => {
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
      messagesCount: c.messages_count,
      isFlagged: !!c.users?.some((u) => u.flagged),
      timeLabel,
      url: c.web_url,
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
