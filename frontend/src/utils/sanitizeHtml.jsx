import DOMPurify from "dompurify";

const sanitizeHtml = (html) => {
  return DOMPurify.sanitize(html || "", {
    ALLOWED_TAGS: ["p", "br", "strong", "em", "ul", "ol", "li", "span"],
    ALLOWED_ATTR: ["style"],
  });
};

export default sanitizeHtml;
