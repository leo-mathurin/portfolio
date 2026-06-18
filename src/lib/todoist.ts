const TODOIST_API_BASE = "https://api.todoist.com/api/v1";

/** Timezone all task dates and times are displayed in. */
export const DISPLAY_TIME_ZONE = "Europe/Paris";

const PARIS_DATE_TIME = new Intl.DateTimeFormat("en-CA", {
  timeZone: DISPLAY_TIME_ZONE,
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  hourCycle: "h23",
});

export interface TodoistDue {
  /** Date in YYYY-MM-DD format, or full datetime if a time is set */
  date: string;
  /** Human-readable due string, e.g. "tomorrow at 6pm" */
  string: string;
  is_recurring: boolean;
  timezone?: string | null;
}

export interface TodoistTask {
  id: string;
  content: string;
  description: string;
  project_id: string;
  /** Todoist API priority: 1 (normal) → 4 (urgent, shown as "p1" in the app) */
  priority: number;
  due: TodoistDue | null;
  checked: boolean;
}

async function todoistFetch(path: string, init?: RequestInit) {
  const token = process.env.TODOIST_API_TOKEN;
  if (!token) {
    throw new Error("TODOIST_API_TOKEN is not set");
  }

  const res = await fetch(`${TODOIST_API_BASE}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      ...init?.headers,
    },
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(`Todoist API error ${res.status}: ${await res.text()}`);
  }

  return res;
}

/**
 * Fetches all active tasks that are overdue or due today,
 * following cursor-based pagination.
 */
export async function getTodayTasks(): Promise<TodoistTask[]> {
  const tasks: TodoistTask[] = [];
  let cursor: string | null = null;

  do {
    const params = new URLSearchParams({
      query: "overdue | today",
      limit: "200",
    });
    if (cursor) params.set("cursor", cursor);

    const res = await todoistFetch(`/tasks/filter?${params.toString()}`);
    const data = (await res.json()) as {
      results: TodoistTask[];
      next_cursor: string | null;
    };

    tasks.push(...data.results);
    cursor = data.next_cursor;
  } while (cursor);

  return tasks;
}

export interface DueParts {
  /** Calendar day in Europe/Paris, YYYY-MM-DD. */
  day: string;
  /** Wall-clock time in Europe/Paris (HH:mm), or null for all-day tasks. */
  time: string | null;
}

/**
 * Resolves a Todoist due date to its Europe/Paris calendar day and time.
 *
 * Timed tasks with a fixed timezone arrive as UTC (a trailing "Z") and are
 * converted to Paris; floating tasks (no "Z") are already wall-clock time in
 * the user's local zone and are kept verbatim.
 */
export function resolveDueParts(due: TodoistDue): DueParts {
  const hasTime = due.date.length > 10;
  if (!hasTime) {
    return { day: due.date.slice(0, 10), time: null };
  }

  if (!due.date.endsWith("Z")) {
    return { day: due.date.slice(0, 10), time: due.date.slice(11, 16) };
  }

  const parts = PARIS_DATE_TIME.formatToParts(new Date(due.date));
  const get = (type: string) => parts.find((p) => p.type === type)?.value ?? "";
  return {
    day: `${get("year")}-${get("month")}-${get("day")}`,
    time: `${get("hour")}:${get("minute")}`,
  };
}

/**
 * Creates a task using Todoist's Quick Add natural language syntax,
 * e.g. "Buy milk tomorrow 6pm p1 #Shopping".
 */
export async function quickAddTask(text: string): Promise<void> {
  await todoistFetch("/tasks/quick", {
    method: "POST",
    body: JSON.stringify({ text }),
  });
}

/** Marks a task as completed. Recurring tasks are rescheduled to their next occurrence. */
export async function closeTask(id: string): Promise<void> {
  await todoistFetch(`/tasks/${id}/close`, { method: "POST" });
}

/** Reopens a completed task (used for undo). */
export async function reopenTask(id: string): Promise<void> {
  await todoistFetch(`/tasks/${id}/reopen`, { method: "POST" });
}

/** Permanently deletes a task. */
export async function deleteTask(id: string): Promise<void> {
  await todoistFetch(`/tasks/${id}`, { method: "DELETE" });
}
