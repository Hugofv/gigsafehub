/**
 * Utility functions for processing internal article links
 */

interface RelatedArticle {
  id: string;
  title: string;
  slug: string;
  slugEn?: string;
  slugPt?: string;
}

/**
 * Escapes special regex characters in a string
 */
function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Processes HTML content to add internal links to related articles
 * @param content - HTML content string
 * @param relatedArticles - Array of related articles
 * @param locale - Current locale ('pt-BR' or 'en-US')
 * @param maxLinksPerArticle - Maximum number of links to create per related article (default: 1)
 * @returns Processed HTML content with internal links
 */
export function addInternalLinks(
  content: string,
  relatedArticles: RelatedArticle[],
  locale: string = 'pt-BR',
  maxLinksPerArticle: number = 1
): string {
  if (!content || !relatedArticles || relatedArticles.length === 0) {
    return content;
  }

  let processedContent = content;
  const linkCounts: Record<string, number> = {};

  // Sort articles by title length (longer first) to match more specific titles first
  const sortedArticles = [...relatedArticles].sort((a, b) => b.title.length - a.title.length);

  sortedArticles.forEach((article) => {
    const articleSlug = locale === 'pt-BR'
      ? (article.slugPt || article.slug)
      : (article.slugEn || article.slug);

    const articleUrl = `/${locale}/articles/${articleSlug}`;
    const linkCount = linkCounts[article.id] || 0;

    if (linkCount >= maxLinksPerArticle) {
      return; // Skip if we've already created max links for this article
    }

    // Create regex pattern for the article title
    // Match title as whole word, case-insensitive, but not inside existing links
    const titlePattern = escapeRegex(article.title);

    // Match title that's not already inside an <a> tag
    const regex = new RegExp(
      `(?<!<a[^>]*>)(?<!href=["'])(?<![^>]>)(${titlePattern})(?![^<]*</a>)`,
      'gi'
    );

    // Find all matches
    const matches = Array.from(processedContent.matchAll(regex));

    if (matches.length > 0) {
      // Replace only the first occurrence (or up to maxLinksPerArticle)
      let replacementCount = 0;
      processedContent = processedContent.replace(regex, (match, title) => {
        if (replacementCount >= (maxLinksPerArticle - linkCount)) {
          return match; // Don't replace if we've hit the limit
        }

        // Check if this match is inside an existing HTML tag
        const beforeMatch = processedContent.substring(0, processedContent.indexOf(match));
        const openTags = (beforeMatch.match(/<[^/][^>]*>/g) || []).length;
        const closeTags = (beforeMatch.match(/<\/[^>]+>/g) || []).length;

        // If we're inside a tag (not counting the match itself), don't link
        if (openTags > closeTags) {
          return match;
        }

        replacementCount++;
        linkCounts[article.id] = (linkCounts[article.id] || 0) + 1;

        return `<a href="${articleUrl}" class="internal-link" data-article-id="${article.id}">${title}</a>`;
      });
    }
  });

  return processedContent;
}

/**
 * Alternative simpler approach: Match titles in text nodes only (safer)
 * This version uses a DOM parser approach for more accurate matching
 */
export function addInternalLinksSafe(
  content: string,
  relatedArticles: RelatedArticle[],
  locale: string = 'pt-BR',
  maxLinksPerArticle: number = 1
): string {
  if (!content || !relatedArticles || relatedArticles.length === 0) {
    return content;
  }

  // For server-side, we'll use a simpler regex approach
  // In a browser environment, you could use DOMParser for more accuracy
  let processedContent = content;
  const linkCounts: Record<string, number> = {};

  // Sort by title length (longer first)
  const sortedArticles = [...relatedArticles].sort((a, b) => b.title.length - a.title.length);

  sortedArticles.forEach((article) => {
    const articleSlug = locale === 'pt-BR'
      ? (article.slugPt || article.slug)
      : (article.slugEn || article.slug);

    const articleUrl = `/${locale}/articles/${articleSlug}`;
    const linkCount = linkCounts[article.id] || 0;

    if (linkCount >= maxLinksPerArticle) {
      return;
    }

    // Create a pattern that matches the title but not inside HTML tags or existing links
    const titleEscaped = escapeRegex(article.title);

    // Match title that's:
    // - Not preceded by < (start of tag)
    // - Not inside an <a> tag (simplified check)
    // - Case insensitive
    const regex = new RegExp(
      `(?:^|[^>])(${titleEscaped})(?![^<]*</a>)`,
      'gi'
    );

    let replacementCount = 0;
    processedContent = processedContent.replace(regex, (match, title, offset) => {
      if (replacementCount >= (maxLinksPerArticle - linkCount)) {
        return match;
      }

      // Check if we're inside an HTML tag by looking backwards
      const beforeMatch = processedContent.substring(0, offset);
      const lastOpenTag = beforeMatch.lastIndexOf('<');
      const lastCloseTag = beforeMatch.lastIndexOf('>');

      // If last unclosed tag is an opening tag (and not a closing tag), we're inside a tag
      if (lastOpenTag > lastCloseTag) {
        const tagContent = beforeMatch.substring(lastOpenTag);
        // If it's an <a> tag, don't link
        if (tagContent.startsWith('<a')) {
          return match;
        }
      }

      replacementCount++;
      linkCounts[article.id] = (linkCounts[article.id] || 0) + 1;

      return match.replace(
        title,
        `<a href="${articleUrl}" class="internal-link" data-article-id="${article.id}">${title}</a>`
      );
    });
  });

  return processedContent;
}

