import { postToFacebook, type FacebookPostOptions, type FacebookPostResult } from './facebook';
import { postToInstagram, type InstagramPostOptions, type InstagramPostResult } from './instagram';
import { postToTwitter, type TwitterPostOptions, type TwitterPostResult } from './twitter';
import { prisma } from '../../lib/prisma';
import { config } from '../../config';

export type SocialMediaPlatform = 'facebook' | 'instagram' | 'twitter';

export interface ArticlePostOptions {
  articleId: string;
  platforms: SocialMediaPlatform[];
  customMessage?: string;
}

export interface SocialMediaPostResult {
  platform: SocialMediaPlatform;
  success: boolean;
  postId?: string;
  error?: string;
}

/**
 * Post an article to multiple social media platforms
 */
export async function postArticleToSocialMedia(
  options: ArticlePostOptions
): Promise<SocialMediaPostResult[]> {
  // Fetch article from database
  const article = await prisma.article.findUnique({
    where: { id: options.articleId },
    include: { category: true },
  });

  if (!article) {
    throw new Error('Article not found');
  }

  // Build article URL - use canonicalUrl if available, otherwise build URL with category hierarchy
  // Always use production URL for social media posts (not localhost)
  const productionBaseUrl = 'https://gigsafehub.com';

  let articleUrl = article.canonicalUrl;

  // If no canonicalUrl, build URL using category hierarchy (same logic as SEO)
  if (!articleUrl) {
    // Determine locale from article
    const locale = article.locale === 'pt_BR' ? 'pt-BR' : article.locale === 'en_US' ? 'en-US' : 'pt-BR';

    // Get localized article slug
    const articleSlug = locale === 'pt-BR' && article.slugPt
      ? article.slugPt
      : locale === 'en-US' && article.slugEn
        ? article.slugEn
        : article.slug;

    // Fetch all active categories to build path (same as SEO)
    const categories = await prisma.category.findMany({
      where: { isActive: true },
      select: {
        id: true,
        parentId: true,
        slug: true,
        slugEn: true,
        slugPt: true,
      },
    });

    // Helper to build localized category path (same as SEO)
    const buildCategoryPath = (categoryId: string, allCats: typeof categories, locale: 'pt-BR' | 'en-US'): string[] => {
      const path: string[] = [];
      let current: (typeof categories)[0] | undefined = allCats.find((c) => c.id === categoryId);

      while (current) {
        const slug =
          locale === 'pt-BR' && current.slugPt
            ? current.slugPt
            : locale === 'en-US' && current.slugEn
            ? current.slugEn
            : current.slug;

        path.unshift(slug);

        if (current.parentId) {
          current = allCats.find((c) => c.id === current!.parentId);
        } else {
          current = undefined;
        }
      }

      return path;
    };

    // Build path with category hierarchy
    let path = `${productionBaseUrl}/${locale}`;

    // Prefer category from relation (article.category) when present
    const categoryIdFromRelation = article.category?.id;
    const categoryId =
      (typeof categoryIdFromRelation === 'string' && categoryIdFromRelation) ||
      (typeof article.categoryId === 'string' && article.categoryId) ||
      null;

    const categoryPathSegments =
      categoryId !== null ? buildCategoryPath(categoryId, categories, locale) : [];

    if (categoryPathSegments.length > 0) {
      // Category found and active: use full category path
      path += `/${categoryPathSegments.join('/')}`;
    } else {
      // Fallback to /articles when no active category is associated
      path += '/articles';
    }

    articleUrl = `${path}/${articleSlug}`;
  }

  // Normalize URL: replace localhost with production URL
  if (articleUrl.includes('localhost') || articleUrl.startsWith('http://localhost')) {
    articleUrl = articleUrl.replace(/https?:\/\/localhost:\d+/, productionBaseUrl);
  }

  // Build message/caption
  const defaultMessage = `${article.title}\n\n${article.excerpt}\n\nRead more: ${articleUrl}`;
  const message = options.customMessage || defaultMessage;

  // Get image URL and normalize it (replace localhost with production URL)
  let imageUrl = article.ogImage || article.imageUrl;
  if (imageUrl && (imageUrl.includes('localhost') || imageUrl.startsWith('http://localhost'))) {
    // If image URL is relative or uses localhost, convert to production URL
    if (imageUrl.startsWith('/')) {
      imageUrl = `${productionBaseUrl}${imageUrl}`;
    } else if (imageUrl.includes('localhost')) {
      imageUrl = imageUrl.replace(/https?:\/\/localhost:\d+/, productionBaseUrl);
    }
  }

  const results: SocialMediaPostResult[] = [];

  // Post to each platform
  for (const platform of options.platforms) {
    try {
      if (platform === 'facebook') {
        const result = await postToFacebook({
          message,
          link: articleUrl,
          imageUrl,
        });
        results.push({
          platform,
          success: result.success,
          postId: result.postId,
          error: result.error,
        });
      } else if (platform === 'instagram') {
        if (!imageUrl) {
          results.push({
            platform,
            success: false,
            error: 'Instagram requires an image. Please add an image to the article.',
          });
          continue;
        }
        const result = await postToInstagram({
          caption: message,
          imageUrl,
          link: articleUrl,
        });
        results.push({
          platform,
          success: result.success,
          postId: result.mediaId,
          error: result.error,
        });
      } else if (platform === 'twitter') {
        // Twitter has character limit, truncate if needed
        const twitterText = message.length > 280 ? message.substring(0, 277) + '...' : message;
        const result = await postToTwitter({
          text: twitterText,
          imageUrl,
        });
        results.push({
          platform,
          success: result.success,
          postId: result.tweetId,
          error: result.error,
        });
      }
    } catch (error: any) {
      results.push({
        platform,
        success: false,
        error: error.message || 'Unknown error occurred',
      });
    }
  }

  return results;
}
