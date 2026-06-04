import { SimplePageHeader } from "@/components/page-header";
import { BackLink } from "@/components/back-link";
import { getLocale, getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import { getTodayTasks } from "@/lib/todoist";
import { AddTaskForm } from "./add-task-form";
import { TaskList, type TodoItem } from "./task-list";

const TIME_ZONE = "Europe/Paris";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Todos",
  description: "Today's tasks.",
  robots: { index: false, follow: false },
};

export default async function TodosPage() {
  const [tasks, t, locale] = await Promise.all([
    getTodayTasks(),
    getTranslations(),
    getLocale(),
  ]);

  // Overdue tasks first (earlier due dates sort first lexicographically),
  // then by priority (4 = urgent) within the same day.
  const sorted = [...tasks].sort((a, b) => {
    const dayA = a.due?.date.slice(0, 10) ?? "";
    const dayB = b.due?.date.slice(0, 10) ?? "";
    if (dayA !== dayB) return dayA.localeCompare(dayB);
    if (a.priority !== b.priority) return b.priority - a.priority;
    return a.due?.date.localeCompare(b.due?.date ?? "") ?? 0;
  });

  // All date/locale-dependent values are computed here on the server and
  // passed down as plain strings, so SSR and hydration always match.
  const today = new Date().toLocaleDateString("en-CA", {
    timeZone: TIME_ZONE,
  });

  const items: TodoItem[] = sorted.map((task) => {
    const dueDay = task.due?.date.slice(0, 10);
    const isOverdue = !!dueDay && dueDay < today;
    const time = task.due && task.due.date.length > 10
      ? task.due.date.slice(11, 16)
      : null;

    let dueLabel: string | null = null;
    if (isOverdue && dueDay) {
      const day = new Date(`${dueDay}T00:00:00Z`).toLocaleDateString(locale, {
        day: "numeric",
        month: "short",
        timeZone: "UTC",
      });
      dueLabel = time ? `${day} ${time}` : day;
    } else if (time) {
      dueLabel = time;
    }

    return {
      id: task.id,
      content: task.content,
      priority: task.priority,
      isOverdue,
      isRecurring: !!task.due?.is_recurring,
      dueLabel,
    };
  });

  return (
    <main className="flex flex-col min-h-[100dvh] space-y-6 pb-16">
      <SimplePageHeader title="todos" />
      <BackLink label={t("back_home")} />
      <AddTaskForm />
      <TaskList tasks={items} />
    </main>
  );
}
