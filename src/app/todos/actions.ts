"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import {
  closeTask,
  deleteTask,
  quickAddTask,
  reopenTask,
} from "@/lib/todoist";

async function requireAuth() {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("Unauthorized");
  }
}

export async function completeTask(id: string) {
  await requireAuth();
  await closeTask(id);
  // No revalidatePath here: the client keeps the task visible
  // (struck through) so it can offer an "undo" button.
}

export async function uncompleteTask(id: string) {
  await requireAuth();
  await reopenTask(id);
  revalidatePath("/todos");
}

export async function addTask(text: string) {
  await requireAuth();
  const trimmed = text.trim();
  if (!trimmed) return;
  await quickAddTask(trimmed);
  revalidatePath("/todos");
}

export async function removeTask(id: string) {
  await requireAuth();
  await deleteTask(id);
  revalidatePath("/todos");
}
