"use client";

import { useEffect } from "react";

const COPY_ICON_SVG =
  '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"></rect><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"></path></svg>';

const CHECK_ICON_SVG =
  '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M20 6 9 17l-5-5"></path></svg>';

function findCodeTextFromButton(button: HTMLElement): string | null {
  const wrapper = button.closest(".code-block-wrapper") as HTMLElement | null;
  if (!wrapper) return null;
  const codeEl = wrapper.querySelector("pre code") as HTMLElement | null;
  return codeEl?.textContent ?? null;
}

async function writeToClipboard(text: string) {
  if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text);
    return;
  }

  // Fallback for older browsers
  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.setAttribute("readonly", "true");
  textarea.style.position = "fixed";
  textarea.style.left = "-9999px";
  textarea.style.top = "0";
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand("copy");
  document.body.removeChild(textarea);
}

export function BlogCopyButtonsClient() {
  useEffect(() => {
    const onClick = async (event: MouseEvent) => {
      const target = event.target as HTMLElement | null;
      if (!target) return;

      const button = target.closest(".copy-code-button") as HTMLElement | null;
      if (!button) return;

      const codeText = findCodeTextFromButton(button);
      if (!codeText) return;

      const originalHtml = button.innerHTML;
      try {
        await writeToClipboard(codeText);
        button.innerHTML = CHECK_ICON_SVG;
      } catch {
        // Keep the existing icon on error
      } finally {
        window.setTimeout(() => {
          button.innerHTML = originalHtml || COPY_ICON_SVG;
        }, 2000);
      }
    };

    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  return null;
}
