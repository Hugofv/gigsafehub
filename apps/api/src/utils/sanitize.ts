import { JSDOM } from 'jsdom';

// Create window object first before importing DOMPurify
// Using jsdom v24 which is compatible with CommonJS
const { window } = new JSDOM('').window;

// Set global window for DOMPurify (it checks for global window)
(global as any).window = window;

// Now import DOMPurify after window is set
// eslint-disable-next-line @typescript-eslint/no-require-imports
const DOMPurify = require('dompurify');

// Initialize DOMPurify with jsdom's window
const purify = DOMPurify(window);

/**
 * Configuration for DOMPurify
 * Allows common HTML tags and attributes while removing dangerous content
 */
const sanitizeConfig = {
  ALLOWED_TAGS: [
    'p', 'br', 'strong', 'em', 'u', 's', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
    'ul', 'ol', 'li', 'blockquote', 'code', 'pre', 'a', 'img',
    'table', 'thead', 'tbody', 'tr', 'th', 'td',
    'div', 'span', 'section', 'article', 'header', 'footer',
    'b', 'i', 'small', 'sub', 'sup', 'mark', 'del', 'ins',
  ],
  ALLOWED_ATTR: [
    'href', 'title', 'alt', 'src', 'width', 'height',
    'class', 'id', 'style', 'target', 'rel',
    'colspan', 'rowspan', 'scope',
  ],
  ALLOWED_URI_REGEXP: /^(?:(?:(?:f|ht)tps?|mailto|tel|callto|sms|cid|xmpp|data):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i,
  ALLOW_DATA_ATTR: false,
  // Allow style attribute but sanitize it
  ALLOW_UNKNOWN_PROTOCOLS: false,
  // Remove dangerous protocols
  FORBID_TAGS: ['script', 'iframe', 'object', 'embed', 'form', 'input', 'button'],
  FORBID_ATTR: ['onerror', 'onload', 'onclick', 'onmouseover', 'onfocus', 'onblur'],
  // Sanitize style attribute
  SAFE_FOR_TEMPLATES: false,
  // Keep relative URLs
  KEEP_CONTENT: true,
};

/**
 * Sanitize HTML content to prevent XSS attacks
 * @param content - HTML content to sanitize
 * @returns Sanitized HTML content
 */
export function sanitizeHtml(content: string): string {
  if (!content || typeof content !== 'string') {
    return '';
  }

  try {
    // Sanitize the content
    const sanitized = purify.sanitize(content, sanitizeConfig);
    return sanitized;
  } catch (error) {
    console.error('Error sanitizing HTML:', error);
    // If sanitization fails, return empty string or escape the content
    // For safety, we'll return empty string
    return '';
  }
}

/**
 * Sanitize plain text (removes all HTML)
 * @param text - Text content to sanitize
 * @returns Plain text without HTML
 */
export function sanitizeText(text: string): string {
  if (!text || typeof text !== 'string') {
    return '';
  }

  try {
    // Remove all HTML tags
    const sanitized = purify.sanitize(text, { ALLOWED_TAGS: [] });
    return sanitized.trim();
  } catch (error) {
    console.error('Error sanitizing text:', error);
    return text.replace(/<[^>]*>/g, '').trim();
  }
}

/**
 * Sanitize article content specifically
 * Allows more formatting options for article content
 */
export function sanitizeArticleContent(content: string): string {
  if (!content || typeof content !== 'string') {
    return '';
  }

  const articleConfig = {
    ...sanitizeConfig,
    // Allow more tags for rich content
    ALLOWED_TAGS: [
      ...sanitizeConfig.ALLOWED_TAGS,
      'figure', 'figcaption', 'hr', 'dl', 'dt', 'dd',
      'abbr', 'address', 'cite', 'q', 'time', 'var',
    ],
    // Allow data attributes for some elements (like images with data-src)
    ALLOW_DATA_ATTR: true,
  };

  try {
    const sanitized = purify.sanitize(content, articleConfig);
    return sanitized;
  } catch (error) {
    console.error('Error sanitizing article content:', error);
    return '';
  }
}

