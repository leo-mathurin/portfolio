"use client";

import { useState, useTransition } from "react";
import { useTranslations } from "next-intl";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { addTask } from "./actions";

export function AddTaskForm() {
  const t = useTranslations();
  const [text, setText] = useState("");
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = text.trim();
    if (!trimmed || isPending) return;
    startTransition(async () => {
      await addTask(trimmed);
      setText("");
    });
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-2">
      <Input
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder={t("todos_add_placeholder")}
        disabled={isPending}
        className="flex-1"
      />
      <Button
        type="submit"
        size="icon"
        variant="outline"
        disabled={isPending || !text.trim()}
        aria-label={t("todos_add")}
      >
        <Plus className="size-4" />
      </Button>
    </form>
  );
}
