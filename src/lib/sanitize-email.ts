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
