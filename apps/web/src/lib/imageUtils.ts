/**
 * Normalizes image URLs for Next.js Image component
 * - Relative paths must start with "/"
 * - Absolute URLs must have http:// or https://
 */
export function normalizeImageUrl(url: string | null | undefined): string {
  if (!url) {
    return '/placeholder.png';
  }

  // If it's already an absolute URL (http:// or https://), return as is
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }

  // If it's a relative path, ensure it starts with "/"
  if (url.startsWith('/')) {
    return url;
  }

  // If it doesn't start with "/", add it
  return `/${url}`;
}

