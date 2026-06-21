import sanitizeHtml from "sanitize-html";

// A constrained inline-style allowlist: enough to keep email layout/colours
// legible without letting arbitrary CSS through. Values are regex-validated.
const COLOR = /^(#(0x)?[0-9a-f]+|rgba?\([^)]*\)|hsla?\([^)]*\)|[a-z-]+)$/i;
const LENGTH = /^[\d.]+(px|em|rem|%|pt|vw|vh)?$/i;

const allowedStyles: sanitizeHtml.IOptions["allowedStyles"] = {
  "*": {
    color: [COLOR],
    "background-color": [COLOR],
    "text-align": [/^(left|right|center|justify)$/],
    "font-weight": [/^(normal|bold|bolder|lighter|\d{3})$/],
    "font-style": [/^(normal|italic|oblique)$/],
    "font-size": [LENGTH],
    "font-family": [/^[\w\s",'-]+$/],
    "text-decoration": [/^[\w\s-]+$/],
    width: [LENGTH],
    "max-width": [LENGTH],
    height: [LENGTH],
    margin: [LENGTH],
    padding: [LENGTH],
  },
};

/**
 * Sanitizes untrusted email HTML for inline rendering.
 *
 * Strips scripts, event handlers, and embedded frames/objects while keeping the
 * formatting, tables, links, and images real emails rely on. Remote images are
 * allowed by design (tracking pixels will fire on open); links are forced to
 * open in a new tab with a safe rel. This is the single trust boundary between
 * the Missive API and the DOM — its output is safe for dangerouslySetInnerHTML.
 */
export function sanitizeEmailHtml(html: string): string {
  return sanitizeHtml(html, {
    allowedTags: sanitizeHtml.defaults.allowedTags.concat([
      "img",
      "table",
      "thead",
      "tbody",
      "tfoot",
      "tr",
      "td",
      "th",
      "caption",
      "colgroup",
      "col",
      "center",
      "font",
      "u",
      "s",
      "span",
      "div",
    ]),
    // Drop these entirely, contents and all.
    nonTextTags: ["style", "script", "textarea", "option", "noscript", "title"],
    disallowedTagsMode: "discard",
    allowedAttributes: {
      "*": ["style", "align", "valign", "dir", "lang", "title"],
      a: ["href", "name", "target", "rel"],
      img: ["src", "alt", "width", "height"],
      table: ["width", "cellpadding", "cellspacing", "border", "bgcolor"],
      td: ["width", "height", "colspan", "rowspan", "bgcolor"],
      th: ["width", "height", "colspan", "rowspan", "bgcolor"],
      tr: ["bgcolor"],
      font: ["color", "face", "size"],
      col: ["span", "width"],
    },
    allowedStyles,
    // mailto/tel/etc. for links; http/https/data for images (inline images
    // arrive as data URIs). Note: no "javascript:" — it is never on this list.
    allowedSchemes: ["http", "https", "mailto", "tel"],
    allowedSchemesByTag: { img: ["http", "https", "data"] },
    allowProtocolRelative: false,
    transformTags: {
      a: (tagName, attribs) => ({
        tagName,
        attribs: {
          ...attribs,
          target: "_blank",
          rel: "noopener noreferrer nofollow",
        },
      }),
    },
  });
}

// Structural markers that mail clients wrap quoted/forwarded history in. These
// are matched against the *raw* body before sanitization strips class/id, so
// the boundary survives. Index points at the opening tag → a clean split point.
const QUOTE_MARKERS: RegExp[] = [
  /<div[^>]+class="[^"]*gmail_quote(_container)?[^"]*"/i, // Gmail
  /<blockquote[^>]+type="cite"/i, // Apple Mail, Thunderbird, generic
  /<div[^>]+id="(divRplyFwdMsg|appendonsend)"/i, // Outlook (web/desktop)
  /<div[^>]+style="[^"]*border-top:\s*solid/i, // Outlook reply separator
  /<div[^>]+class="[^"]*(protonmail_quote|yahoo_quoted|moz-cite-prefix|zmail_extra|OutlookMessageHeader)[^"]*"/i,
  /<hr[^>]+id="[^"]*stopSpelling/i, // Outlook
];

// Plain-text attribution lines ("On … wrote:" / "Le … a écrit :" / separators).
// Restricted to a single text node (no tags inside) to avoid false positives.
const ATTRIBUTION =
  /(On\s[^<]{1,200}?\swrote:|Le\s[^<]{1,200}?\s[aà]\s[ée]crit\s*:|-{2,}\s*(Original Message|Forwarded message|Message d'origine)\s*-{2,}|_{5,})/i;

function textContent(html: string): string {
  return html
    .replace(/<[^>]*>/g, "")
    .replace(/&nbsp;/gi, " ")
    .replace(/&[a-z]+;/gi, "")
    .trim();
}

/**
 * Finds where quoted reply history begins and splits the raw body there.
 * Returns the earliest of: any structural quote marker, or an attribution line
 * that is followed by a blockquote (so a stray "… wrote:" in prose is ignored).
 */
export function splitQuotedReply(rawHtml: string): {
  main: string;
  quoted: string | null;
} {
  if (!rawHtml) return { main: "", quoted: null };

  let cut = -1;
  for (const marker of QUOTE_MARKERS) {
    const match = marker.exec(rawHtml);
    if (match && (cut === -1 || match.index < cut)) cut = match.index;
  }

  const attribution = ATTRIBUTION.exec(rawHtml);
  if (
    attribution &&
    (cut === -1 || attribution.index < cut) &&
    /<blockquote/i.test(rawHtml.slice(attribution.index))
  ) {
    cut = attribution.index;
  }

  if (cut <= 0) return { main: rawHtml, quoted: null };
  return { main: rawHtml.slice(0, cut), quoted: rawHtml.slice(cut) };
}

/**
 * Sanitizes an email body and separates the quoted reply history so the UI can
 * collapse it behind a "•••" toggle. Falls back to a single sanitized body if
 * splitting would leave the visible part (or the quoted part) empty.
 */
export function splitAndSanitizeEmail(rawHtml: string): {
  html: string;
  quotedHtml: string | null;
} {
  const source = rawHtml ?? "";
  const { main, quoted } = splitQuotedReply(source);

  if (!quoted) return { html: sanitizeEmailHtml(source), quotedHtml: null };

  const html = sanitizeEmailHtml(main);
  // Don't hide everything: if the trim removed all visible text, render in full.
  if (!textContent(html)) {
    return { html: sanitizeEmailHtml(source), quotedHtml: null };
  }

  const quotedHtml = sanitizeEmailHtml(quoted);
  if (!textContent(quotedHtml)) return { html, quotedHtml: null };

  return { html, quotedHtml };
}
