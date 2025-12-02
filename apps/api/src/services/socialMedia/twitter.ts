import { TwitterApi } from 'twitter-api-v2';
import { config } from '../../config';

export interface TwitterPostOptions {
  text: string;
  imageUrl?: string;
  link?: string;
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

      // Verify credentials and permissions by checking account info
      try {
        const me = await rwClient.v2.me();
        console.log('Twitter API: Successfully authenticated as', me.data.username);
      } catch (authError: any) {
        console.error('Twitter API: Authentication check failed:', authError);
        // Continue anyway, the actual tweet will fail with a clearer error
      }

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

      // Post tweet - include link if provided
      // Twitter character limit is 280, but URLs are automatically shortened to ~23 chars
      let tweetText = options.text;
      if (options.link) {
        // Add link to the tweet
        // Twitter counts URLs as ~23 characters regardless of actual length
        const linkText = `\n\n${options.link}`;
        const maxTextLength = 280 - linkText.length - 3; // -3 for safety margin

        if (tweetText.length > maxTextLength) {
          // Truncate text to fit with link
          tweetText = tweetText.substring(0, maxTextLength - 3) + '...';
        }
        tweetText = tweetText + linkText;
      } else {
        // If no link, just truncate to 280 characters
        if (tweetText.length > 280) {
          tweetText = tweetText.substring(0, 277) + '...';
        }
      }

      const tweetOptions: any = {
        text: tweetText,
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
      // Log full error for debugging
      console.error('Twitter API Error:', {
        message: error.message,
        code: error.code,
        status: error.status,
        data: error.data,
        rateLimit: error.rateLimit,
        stack: error.stack,
      });

      // Extract more detailed error information from Twitter API
      let errorMessage = error.message || 'Failed to post to Twitter';
      let errorDetails = '';

      // Check for specific error types
      if (error.code === 403 || error.status === 403 || error.message?.includes('403')) {
        errorMessage = 'Twitter API returned 403 Forbidden';
        errorDetails = 'This usually means:\n' +
          '1. The access token does not have write permissions\n' +
          '2. The Twitter app does not have the required permissions (OAuth 1.0a)\n' +
          '3. The access token has expired or been revoked\n' +
          '4. The Twitter account associated with the token has restricted access\n' +
          '5. The app needs to be approved for Elevated or Academic Research access to post tweets\n\n' +
          'SOLUTION - How to fix:\n' +
          '1. Go to https://developer.twitter.com/en/portal/dashboard\n' +
          '2. Select your app and go to "Keys and tokens"\n' +
          '3. Under "Access Token and Secret", click "Regenerate"\n' +
          '4. Make sure the app has "Read and Write" permissions (not just "Read")\n' +
          '5. Copy the new Access Token and Access Token Secret to your .env file\n' +
          '6. Ensure your app has "Elevated" access level (not just "Essential")\n' +
          '7. If using OAuth 1.0a, the token must be generated with write permissions\n\n' +
          'Note: Essential tier apps CANNOT post tweets. You need Elevated or Academic Research access.';
      } else if (error.code === 401 || error.status === 401 || error.message?.includes('401')) {
        errorMessage = 'Twitter API returned 401 Unauthorized';
        errorDetails = 'This usually means:\n' +
          '1. Invalid API credentials (API_KEY, API_SECRET, ACCESS_TOKEN, ACCESS_TOKEN_SECRET)\n' +
          '2. The credentials have been revoked or expired\n' +
          '3. The credentials are incorrect or missing\n\n' +
          'Please verify your Twitter API credentials in the environment variables.';
      } else if (error.data) {
        // Twitter API v2 often returns error details in error.data
        if (error.data.detail) {
          errorDetails = error.data.detail;
        }
        if (error.data.title) {
          errorMessage = error.data.title;
        }
        if (error.data.errors && Array.isArray(error.data.errors)) {
          const errorMessages = error.data.errors.map((e: any) => e.message || e.detail).join(', ');
          if (errorMessages) {
            errorDetails = errorDetails ? `${errorDetails}\n\n${errorMessages}` : errorMessages;
          }
        }
      }

      // Check for rate limiting
      if (error.rateLimit) {
        errorDetails = errorDetails
          ? `${errorDetails}\n\nRate limit info: ${JSON.stringify(error.rateLimit)}`
          : `Rate limit exceeded. ${JSON.stringify(error.rateLimit)}`;
      }

      // Combine error message and details
      const fullError = errorDetails
        ? `${errorMessage}\n\n${errorDetails}`
        : errorMessage;

      // Add error code if available
      const errorCode = error.code || error.status;
      const finalError = errorCode
        ? `${fullError} (Code: ${errorCode})`
        : fullError;

      return {
        success: false,
        error: finalError,
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
