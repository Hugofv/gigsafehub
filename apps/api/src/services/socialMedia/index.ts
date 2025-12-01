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

  // Build article URL - use canonicalUrl if available, otherwise build URL with locale
  const baseUrl = config.baseUrl;
  const articleUrl = article.canonicalUrl || (() => {
    // Determine locale from article
    const locale = article.locale === 'pt_BR' ? 'pt-BR' : article.locale === 'en_US' ? 'en-US' : 'pt-BR';
    const articleSlug = locale === 'pt-BR' && article.slugPt
      ? article.slugPt
      : locale === 'en-US' && article.slugEn
        ? article.slugEn
        : article.slug;
    return `${baseUrl}/${locale}/articles/${articleSlug}`;
  })();

  // Build message/caption
  const defaultMessage = `${article.title}\n\n${article.excerpt}\n\nRead more: ${articleUrl}`;
  const message = options.customMessage || defaultMessage;

  // Get image URL
  const imageUrl = article.ogImage || article.imageUrl;

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
