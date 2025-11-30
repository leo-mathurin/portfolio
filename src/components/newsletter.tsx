"use client";

import { useState } from "react";
import { z } from "zod";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";
import { useTranslation } from "@/lib/translations";

export function Newsletter() {
  const { t, language } = useTranslation();
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Create schema with translated error message
  const emailSchema = z.email(
    language === "fr" ? "Adresse email invalide" : "Invalid email address",
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    // Validate email with zod
    const validationResult = emailSchema.safeParse(email);
    if (!validationResult.success) {
      setError(
        validationResult.error.issues[0]?.message ||
          (language === "fr"
            ? "Adresse email invalide"
            : "Invalid email address"),
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
          throw new Error(t("newsletter_already_subscribed"));
        }
        throw new Error(data.error || t("newsletter_error"));
      }

      setIsSubmitted(true);
      setEmail("");
      setTimeout(() => setIsSubmitted(false), 3000);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : t("newsletter_error");
      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const placeholder = language === "fr" ? "votre@email.com" : "your@email.com";
  const buttonText = language === "fr" ? "S'abonner" : "Subscribe";

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
                ? language === "fr"
                  ? "Envoi..."
                  : "Subscribing..."
                : isSubmitted
                  ? language === "fr"
                    ? "Abonné!"
                    : "Subscribed!"
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
