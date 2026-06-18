"use server";

import { auth } from "@clerk/nextjs/server";
import { getLocale } from "next-intl/server";
import {
  getConversationMessages,
  getMessageBody,
  mapWithConcurrency,
  type MissiveAuthor,
} from "@/lib/missive";
import { DISPLAY_TIME_ZONE } from "@/lib/todoist";
import { sanitizeEmailHtml } from "@/lib/sanitize-email";

async function requireAuth() {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("Unauthorized");
  }
}

export interface ThreadAttachment {
  id: string;
  filename: string;
  url: string;
  sizeLabel: string;
}

/** A single message in a thread, fully serialized and sanitized for the client. */
export interface ThreadMessage {
  id: string;
  fromName: string;
  fromAddress: string;
  to: string[];
  dateLabel: string;
  attachments: ThreadAttachment[];
  /** Sanitized HTML body, safe for dangerouslySetInnerHTML. */
  html: string;
}

function formatSize(bytes: number): string {
  if (!bytes) return "";
  const units = ["B", "KB", "MB", "GB"];
  let value = bytes;
  let unit = 0;
  while (value >= 1024 && unit < units.length - 1) {
    value /= 1024;
    unit++;
  }
  return `${value < 10 && unit > 0 ? value.toFixed(1) : Math.round(value)} ${units[unit]}`;
}

function authorLabel(author: MissiveAuthor | null): {
  name: string;
  address: string;
} {
  if (!author) return { name: "", address: "" };
  return { name: author.name?.trim() || author.address, address: author.address };
}

/**
 * Loads a conversation's full thread: every message's sanitized HTML body,
 * its from/to header, attachments, and a localized date — ordered oldest to
 * newest for natural reading. Bodies are fetched concurrently (capped at 5)
 * since each needs its own GET /messages/:id call.
 */
export async function getThread(
  conversationId: string,
): Promise<ThreadMessage[]> {
  await requireAuth();

  const locale = await getLocale();
  const dateFormat = new Intl.DateTimeFormat(locale, {
    timeZone: DISPLAY_TIME_ZONE,
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  // Newest first from the API; fetch each full body, then reverse for display.
  const messages = await getConversationMessages(conversationId);
  const withBodies = await mapWithConcurrency(messages, 5, (m) =>
    getMessageBody(m.id),
  );

  const thread: ThreadMessage[] = withBodies.map((message, i) => {
    const from = authorLabel(message.from_field);
    return {
      id: message.id,
      fromName: from.name,
      fromAddress: from.address,
      to: (message.to_fields ?? []).map((t) => t.name?.trim() || t.address),
      dateLabel: dateFormat.format(
        new Date((message.delivered_at ?? messages[i].delivered_at) * 1000),
      ),
      attachments: (message.attachments ?? []).map((a) => ({
        id: a.id,
        filename: a.filename,
        url: a.url,
        sizeLabel: formatSize(a.size),
      })),
      html: sanitizeEmailHtml(message.body ?? ""),
    };
  });

  return thread.reverse();
}
