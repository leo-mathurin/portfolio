import { SimplePageHeader } from "@/components/page-header";
import { BackLink } from "@/components/back-link";
import { getLocale, getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import { DISPLAY_TIME_ZONE, getTodayTasks, resolveDueParts } from "@/lib/todoist";
import { AddTaskForm } from "./add-task-form";
import { TaskList, type TodoItem } from "./task-list";

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

  // Resolve every due date to its Europe/Paris day and time once, so sorting,
  // overdue checks, and labels all agree on the same timezone.
  const withDue = tasks.map((task) => ({
    task,
    due: task.due ? resolveDueParts(task.due) : null,
  }));

  // Overdue tasks first (earlier due days sort first lexicographically),
  // then by priority (4 = urgent), then by time within the same day.
  withDue.sort((a, b) => {
    const dayA = a.due?.day ?? "";
    const dayB = b.due?.day ?? "";
    if (dayA !== dayB) return dayA.localeCompare(dayB);
    if (a.task.priority !== b.task.priority) {
      return b.task.priority - a.task.priority;
    }
    return (a.due?.time ?? "").localeCompare(b.due?.time ?? "");
  });

  // All date/locale-dependent values are computed here on the server and
  // passed down as plain strings, so SSR and hydration always match.
  const today = new Date().toLocaleDateString("en-CA", {
    timeZone: DISPLAY_TIME_ZONE,
  });

  const items: TodoItem[] = withDue.map(({ task, due }) => {
    const isOverdue = !!due && due.day < today;

    let dueLabel: string | null = null;
    if (isOverdue) {
      const day = new Date(`${due.day}T00:00:00Z`).toLocaleDateString(locale, {
        day: "numeric",
        month: "short",
        timeZone: "UTC",
      });
      dueLabel = due.time ? `${day} ${due.time}` : day;
    } else if (due?.time) {
      dueLabel = due.time;
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
