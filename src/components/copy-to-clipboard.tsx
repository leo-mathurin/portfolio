"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";

export default function CopyToClipboard({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
    } catch (error) {
      console.error("Error copying to clipboard", error);
    } finally {
      setTimeout(() => {
        setCopied(false);
      }, 2000);
    }
  };

  return (
    <button
      onClick={copyToClipboard}
      className="z-10 py-2 px-2 rounded-md bg-neutral-200/50 dark:bg-neutral-800/50 backdrop-blur-sm hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors text-neutral-600 dark:text-neutral-300 hover:text-neutral-800 dark:hover:text-neutral-100 h-8"
      aria-label="Copy code to clipboard"
      title={copied ? "Copied!" : "Copy code"}
    >
      {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
    </button>
  );
}
