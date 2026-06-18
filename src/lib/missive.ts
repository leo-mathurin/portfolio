const MISSIVE_API_BASE = "https://public.missiveapp.com/v1";

/** One sender/recipient on a conversation. */
export interface MissiveAuthor {
  name: string | null;
  address: string;
}

/** Per-user conversation state (one entry per Missive user who can see it). */
export interface MissiveUserState {
  id: string;
  assigned?: boolean;
  closed?: boolean;
  archived?: boolean;
  flagged?: boolean;
  snoozed?: boolean;
  trashed?: boolean;
  junked?: boolean;
}

/** A shared (organization-level) label/tag applied to a conversation. */
export interface MissiveLabel {
  id: string;
  name: string;
}

export interface MissiveConversation {
  id: string;
  subject: string | null;
  latest_message_subject: string | null;
  /** Number of messages in the conversation. */
  messages_count: number;
  /** Number of attachments across the conversation. */
  attachments_count: number;
  /** Senders/recipients seen across the conversation. */
  authors: MissiveAuthor[];
  /** Shared labels/tags applied to the conversation. */
  shared_labels?: MissiveLabel[];
  /** Unix timestamp (seconds) of the most recent activity. */
  last_activity_at: number;
  /** Per-user state; used to surface the flagged indicator. */
  users?: MissiveUserState[];
  /** Deep link to open the conversation in the Missive web app. */
  web_url: string;
  /** Deep link to open the conversation in the Missive desktop/mobile app. */
  app_url: string;
}

/** A file attached to a message; `url` is a signed, time-limited download link. */
export interface MissiveAttachment {
  id: string;
  filename: string;
  extension: string;
  media_type: string;
  sub_type: string;
  /** Size in bytes. */
  size: number;
  url: string;
}

export interface MissiveMessage {
  id: string;
  /** e.g. "email", "custom_email". */
  type: string;
  /** Short text snippet of the message; present on the list endpoint. */
  preview: string | null;
  subject: string | null;
  /** Unix timestamp (seconds) the message was delivered. */
  delivered_at: number;
  from_field: MissiveAuthor | null;
  to_fields: MissiveAuthor[];
  cc_fields?: MissiveAuthor[];
  attachments: MissiveAttachment[];
  /** Full HTML body; only populated by getMessageBody (GET /messages/:id). */
  body?: string;
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

async function missiveFetch(path: string, init?: RequestInit) {
  const token = process.env.MISSIVE_API_TOKEN;
  if (!token) {
    throw new Error("MISSIVE_API_TOKEN is not set");
  }

  const request = () =>
    fetch(`${MISSIVE_API_BASE}${path}`, {
      ...init,
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        ...init?.headers,
      },
      cache: "no-store",
    });

  let res = await request();

  // Missive caps requests at 5 concurrent / 300 per minute. The inbox view
  // fans out one request per conversation, so absorb a single rate-limit hit
  // by waiting out the Retry-After window before giving up.
  if (res.status === 429) {
    const retryAfter = Number(res.headers.get("Retry-After")) || 1;
    await sleep(Math.min(retryAfter, 10) * 1000);
    res = await request();
  }

  if (!res.ok) {
    throw new Error(`Missive API error ${res.status}: ${await res.text()}`);
  }

  return res;
}

/**
 * Maps over `items` running at most `limit` calls concurrently, preserving
 * input order. Keeps fan-out within Missive's 5-concurrent-request ceiling.
 */
export async function mapWithConcurrency<T, R>(
  items: readonly T[],
  limit: number,
  fn: (item: T, index: number) => Promise<R>,
): Promise<R[]> {
  const results = new Array<R>(items.length);
  let cursor = 0;

  async function worker() {
    while (cursor < items.length) {
      const index = cursor++;
      results[index] = await fn(items[index], index);
    }
  }

  const workers = Array.from(
    { length: Math.min(limit, items.length) },
    worker,
  );
  await Promise.all(workers);
  return results;
}

/**
 * Fetches the most recent Inbox conversations for the API token's user.
 *
 * The list endpoint caps `limit` at 50 and paginates with `until`
 * (the oldest conversation's `last_activity_at`). A single page is plenty
 * for an at-a-glance inbox view, so we don't follow pagination here.
 */
export async function getInboxConversations(
  limit = 25,
): Promise<MissiveConversation[]> {
  const params = new URLSearchParams({
    inbox: "true",
    limit: String(Math.min(limit, 50)),
  });

  const res = await missiveFetch(`/conversations?${params.toString()}`);
  const data = (await res.json()) as { conversations: MissiveConversation[] };
  return data.conversations;
}

/**
 * Lists messages in a conversation, newest first (Missive caps `limit` at 10).
 * Messages here carry a `preview` but no `body` — fetch the body separately
 * with {@link getMessageBody}.
 */
export async function getConversationMessages(
  conversationId: string,
  limit = 10,
): Promise<MissiveMessage[]> {
  const params = new URLSearchParams({ limit: String(Math.min(limit, 10)) });
  const res = await missiveFetch(
    `/conversations/${conversationId}/messages?${params.toString()}`,
  );
  const data = (await res.json()) as { messages: MissiveMessage[] };
  return data.messages;
}

/** Fetches a single message including its full HTML `body`. */
export async function getMessageBody(
  messageId: string,
): Promise<MissiveMessage> {
  const res = await missiveFetch(`/messages/${messageId}`);
  // Missive wraps the result under `messages`; tolerate either a single object
  // or a one-element array, since the get-by-id envelope isn't well documented.
  const data = (await res.json()) as {
    messages: MissiveMessage | MissiveMessage[];
  };
  return Array.isArray(data.messages) ? data.messages[0] : data.messages;
}
