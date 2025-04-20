import DOMPurify from "dompurify";

const sanitizeHtml = (html) => {
  return DOMPurify.sanitize(html || "", {
    ALLOWED_TAGS: [
      "p",
      "br",
      "strong",
      "em",
      "ul",
      "ol",
      "li",
      "span",
      "div",
      "h1",
      "h2",
      "h3",
      "h4",
      "h5",
      "h6",
      "table",
      "tr",
      "td",
      "th",
      "thead",
      "tbody",
      "img",
      "a",
      "blockquote",
      "code",
      "pre",
    ],
    ALLOWED_ATTR: ["style", "class", "id", "src", "alt", "href", "target"],
  });
};

export default sanitizeHtml;
