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

export interface MissiveConversation {
  id: string;
  subject: string | null;
  latest_message_subject: string | null;
  /** Number of messages in the conversation. */
  messages_count: number;
  /** Senders/recipients seen across the conversation. */
  authors: MissiveAuthor[];
  /** Unix timestamp (seconds) of the most recent activity. */
  last_activity_at: number;
  /** Per-user state; used to surface the flagged indicator. */
  users?: MissiveUserState[];
  /** Deep link to open the conversation in the Missive web app. */
  web_url: string;
  /** Deep link to open the conversation in the Missive desktop/mobile app. */
  app_url: string;
}

async function missiveFetch(path: string, init?: RequestInit) {
  const token = process.env.MISSIVE_API_TOKEN;
  if (!token) {
    throw new Error("MISSIVE_API_TOKEN is not set");
  }

  const res = await fetch(`${MISSIVE_API_BASE}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      ...init?.headers,
    },
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(`Missive API error ${res.status}: ${await res.text()}`);
  }

  return res;
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
