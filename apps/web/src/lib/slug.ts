/**
 * Utility functions for handling localized slugs
 */

export function getLocalizedSlug(
  slug: string | undefined,
  slugEn: string | undefined,
  slugPt: string | undefined,
  locale: string
): string {
  if (locale === 'pt-BR' && slugPt) {
    return slugPt;
  }
  if (locale === 'en-US' && slugEn) {
    return slugEn;
  }
  return slug || '';
}

export function generateSlug(text: string, locale: string = 'en-US'): string {
  // Remove accents and special characters
  const normalized = text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();

  // Replace spaces and special chars with hyphens
  const slug = normalized
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '');

  return slug;
}

