import { TwitterApi } from 'twitter-api-v2';
import { config } from '../../config';

export interface TwitterPostOptions {
  text: string;
  imageUrl?: string;
}

export interface TwitterPostResult {
  success: boolean;
  tweetId?: string;
  error?: string;
}

/**
 * Post an article to Twitter/X
 */
export async function postToTwitter(options: TwitterPostOptions): Promise<TwitterPostResult> {
  const { apiKey, apiSecret, accessToken, accessTokenSecret, bearerToken } = config.socialMedia.twitter;

  // Try using OAuth 1.0a (App-only or User context) first
  if (apiKey && apiSecret && accessToken && accessTokenSecret) {
    try {
      const client = new TwitterApi({
        appKey: apiKey,
        appSecret: apiSecret,
        accessToken: accessToken,
        accessSecret: accessTokenSecret,
      });

      const rwClient = client.readWrite;

      let mediaId: string | undefined;

      // Upload image if provided
      if (options.imageUrl) {
        // Validate and normalize image URL
        const productionBaseUrl = 'https://gigsafehub.com';
        let imageUrl = options.imageUrl;

        // Replace localhost with production URL
        if (imageUrl.includes('localhost') || imageUrl.startsWith('http://localhost')) {
          imageUrl = imageUrl.replace(/https?:\/\/localhost:\d+/, productionBaseUrl);
        }

        // Ensure image URL is absolute and accessible
        if (!imageUrl.startsWith('http://') && !imageUrl.startsWith('https://')) {
          // If relative URL, make it absolute using production URL
          imageUrl = `${productionBaseUrl}${imageUrl.startsWith('/') ? '' : '/'}${imageUrl}`;
        }

        // Validate that the URL points to an image (non-blocking - Twitter API will validate too)
        try {
          const imageValidationResponse = await fetch(imageUrl, { method: 'HEAD' });
          const contentType = imageValidationResponse.headers.get('content-type');

          if (!contentType || !contentType.startsWith('image/')) {
            // Warn but don't block - Twitter API will validate and return a better error
            console.warn(`Warning: Image URL may not be valid (content-type: ${contentType || 'unknown'}). URL: ${imageUrl}`);
          }

          if (!imageValidationResponse.ok) {
            // Warn but don't block - Twitter API will validate and return a better error
            console.warn(`Warning: Image URL returned HTTP ${imageValidationResponse.status}. URL: ${imageUrl}`);
          }
        } catch (error: any) {
          // Warn but don't block - Twitter API will validate and return a better error
          console.warn(`Warning: Could not validate image URL: ${error.message}. URL: ${imageUrl}`);
        }

        try {
          // Download image
          const imageResponse = await fetch(imageUrl);
          if (imageResponse.ok) {
            const imageBuffer = Buffer.from(await imageResponse.arrayBuffer());

            // Upload media
            const mediaIdResponse = await rwClient.v1.uploadMedia(imageBuffer, {
              mimeType: imageResponse.headers.get('content-type') || 'image/jpeg',
            });
            mediaId = mediaIdResponse;
          }
        } catch (error: any) {
          console.error('Error uploading image to Twitter:', error);
          // Continue without image if upload fails, but provide better error message
          if (error.message) {
            console.error(`Twitter image upload error details: ${error.message}. URL: ${imageUrl}`);
          }
        }
      }

      // Post tweet
      const tweetOptions: any = {
        text: options.text,
      };

      if (mediaId) {
        tweetOptions.media = {
          media_ids: [mediaId],
        };
      }

      const tweet = await rwClient.v2.tweet(tweetOptions);

      return {
        success: true,
        tweetId: tweet.data.id,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to post to Twitter',
      };
    }
  }

  // Fallback: Try Bearer Token (read-only, won't work for posting)
  if (bearerToken) {
    return {
      success: false,
      error: 'Bearer token can only be used for read operations. Please configure OAuth 1.0a credentials (API_KEY, API_SECRET, ACCESS_TOKEN, ACCESS_TOKEN_SECRET)',
    };
  }

  return {
    success: false,
    error: 'Twitter credentials not configured. Please set TWITTER_API_KEY, TWITTER_API_SECRET, TWITTER_ACCESS_TOKEN, and TWITTER_ACCESS_TOKEN_SECRET',
  };
}
