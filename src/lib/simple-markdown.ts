/**
 * Simple markdown to HTML converter for basic markdown syntax.
 * Much lighter than react-markdown (~30KB saved).
 * Supports: links, bold, italic, code
 */
export function simpleMarkdownToHtml(markdown: string): string {
  return markdown
    // Convert markdown links [text](url) to HTML
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_match, text, url) => {
      const isExternal = /^https?:\/\//i.test(url);
      const externalAttrs = isExternal
        ? ' target="_blank" rel="noopener noreferrer"'
        : "";
      return `<a href="${url}" class="underline"${externalAttrs}>${text}</a>`;
    })
    // Convert bold **text** to HTML
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
    // Convert italic *text* to HTML (but not if it's part of bold)
    .replace(/(?<!\*)\*([^*]+)\*(?!\*)/g, "<em>$1</em>")
    // Convert inline code `text` to HTML
    .replace(/`([^`]+)`/g, "<code>$1</code>");
}

