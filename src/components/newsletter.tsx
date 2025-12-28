"use client";

import { useState } from "react";
import { z } from "zod";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";
import { useTranslations } from "next-intl";

export function Newsletter() {
  const t = useTranslations();
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Create schema with translated error message
  const emailSchema = z.email(t("newsletter_invalid_email"));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    // Validate email with zod
    const validationResult = emailSchema.safeParse(email);
    if (!validationResult.success) {
      setError(
        validationResult.error.issues[0]?.message ||
          t("newsletter_invalid_email"),
      );
      return;
    }

    setError(null);
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/newsletter", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        // Handle specific error cases
        if (response.status === 409) {
          setError(t("newsletter_already_subscribed"));
          setIsSubmitting(false);
          return;
        }
        let errorMessage = t("newsletter_error");
        if (data.error) {
          errorMessage = data.error;
        }
        setError(errorMessage);
        setIsSubmitting(false);
        return;
      }

      setIsSubmitted(true);
      setEmail("");
      setTimeout(() => setIsSubmitted(false), 3000);
      setIsSubmitting(false);
    } catch (err) {
      let errorMessage = t("newsletter_error");
      if (err instanceof Error) {
        errorMessage = err.message;
      }
      setError(errorMessage);
      setIsSubmitting(false);
    }
  };

  const placeholder = t("newsletter_placeholder");
  const buttonText = t("newsletter_subscribe");

  return (
    <div className="max-w-[450px] mx-auto">
      <p className="text-center text-balance text-lg mb-6">
        {t("newsletter_title")}
      </p>
      <form onSubmit={handleSubmit}>
        <InputGroup className="h-12 bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800">
          <InputGroupInput
            type="email"
            placeholder={placeholder}
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setError(null);
            }}
            required
            disabled={isSubmitting || isSubmitted}
            className="text-neutral-900 dark:text-neutral-300 placeholder:text-neutral-500 dark:placeholder:text-neutral-500"
          />
          <InputGroupAddon align="inline-end">
            <InputGroupButton
              type="submit"
              size="sm"
              variant="default"
              disabled={isSubmitting || isSubmitted}
              className="bg-black text-white hover:bg-neutral-800 dark:bg-white dark:text-black dark:hover:bg-neutral-100"
            >
              {isSubmitting
                ? t("newsletter_subscribing")
                : isSubmitted
                  ? t("newsletter_subscribed")
                  : buttonText}
            </InputGroupButton>
          </InputGroupAddon>
        </InputGroup>
        {error && (
          <p className="mt-2 text-sm text-red-500 dark:text-red-400">{error}</p>
        )}
      </form>
    </div>
  );
}
