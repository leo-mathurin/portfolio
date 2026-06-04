"use client";

import { useState, useTransition } from "react";
import { useTranslations } from "next-intl";
import { Check, Repeat2, Trash2 } from "lucide-react";
import { cn, parseMarkdownLinks } from "@/lib/utils";
import { completeTask, removeTask, uncompleteTask } from "./actions";

/**
 * Pre-computed, serializable view of a Todoist task. All date/locale
 * formatting happens on the server (see page.tsx) to avoid hydration
 * mismatches between the server and client environments.
 */
export interface TodoItem {
  id: string;
  content: string;
  /** Todoist API priority: 1 (normal) → 4 (urgent, "p1" in the app UI) */
  priority: number;
  isOverdue: boolean;
  isRecurring: boolean;
  dueLabel: string | null;
}

const PRIORITY_STYLES: Record<number, string> = {
  4: "border-red-500 text-red-500 hover:bg-red-500/10",
  3: "border-orange-400 text-orange-400 hover:bg-orange-400/10",
  2: "border-blue-500 text-blue-500 hover:bg-blue-500/10",
  1: "border-muted-foreground/40 text-muted-foreground hover:bg-muted",
};

function TaskItem({ task }: { task: TodoItem }) {
  const t = useTranslations();
  const [, startTransition] = useTransition();
  const [completed, setCompleted] = useState(false);
  const [deleted, setDeleted] = useState(false);

  if (deleted) return null;

  const toggle = () => {
    const next = !completed;
    setCompleted(next);
    startTransition(async () => {
      try {
        await (next ? completeTask(task.id) : uncompleteTask(task.id));
      } catch {
        setCompleted(!next);
      }
    });
  };

  const handleDelete = () => {
    if (!window.confirm(t("todos_delete_confirm", { content: task.content }))) {
      return;
    }
    setDeleted(true);
    startTransition(async () => {
      try {
        await removeTask(task.id);
      } catch {
        setDeleted(false);
      }
    });
  };

  return (
    <li className="group flex items-start gap-3 py-3">
      <button
        type="button"
        onClick={toggle}
        aria-label={completed ? t("todos_undo") : task.content}
        className={cn(
          "mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full border transition-colors",
          PRIORITY_STYLES[task.priority] ?? PRIORITY_STYLES[1],
          completed && "bg-muted-foreground/20",
        )}
      >
        <Check
          className={cn(
            "size-3 transition-opacity",
            completed ? "opacity-100" : "opacity-0 hover:opacity-100",
          )}
        />
      </button>

      <div className="min-w-0 flex-1">
        <p
          className={cn(
            "text-sm leading-relaxed",
            completed && "text-muted-foreground line-through",
          )}
        >
          {parseMarkdownLinks(task.content)}
        </p>
        {(task.dueLabel || task.isRecurring) && (
          <span
            className={cn(
              "mt-0.5 inline-flex items-center gap-1 text-xs",
              task.isOverdue && !completed
                ? "text-red-500"
                : "text-muted-foreground",
            )}
          >
            {task.dueLabel}
            {task.isRecurring && <Repeat2 className="size-3" />}
          </span>
        )}
      </div>

      {completed ? (
        <button
          type="button"
          onClick={toggle}
          className="shrink-0 text-xs text-muted-foreground underline-offset-2 hover:underline"
        >
          {t("todos_undo")}
        </button>
      ) : (
        <button
          type="button"
          onClick={handleDelete}
          aria-label={t("todos_delete")}
          className="shrink-0 text-muted-foreground/40 opacity-0 transition-opacity hover:text-red-500 focus-visible:opacity-100 group-hover:opacity-100"
        >
          <Trash2 className="size-4" />
        </button>
      )}
    </li>
  );
}

export function TaskList({ tasks }: { tasks: TodoItem[] }) {
  const t = useTranslations();

  if (tasks.length === 0) {
    return (
      <div className="rounded-md border p-4 text-sm text-muted-foreground">
        {t("todos_empty")}
      </div>
    );
  }

  return (
    <ul className="divide-y">
      {tasks.map((task) => (
        <TaskItem key={task.id} task={task} />
      ))}
    </ul>
  );
}
