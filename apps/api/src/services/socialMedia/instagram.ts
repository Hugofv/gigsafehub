import { config } from '../../config';

export interface InstagramPostOptions {
  caption: string;
  imageUrl: string;
  link?: string;
}

export interface InstagramPostResult {
  success: boolean;
  mediaId?: string;
  error?: string;
}

interface InstagramContainerResponse {
  id?: string;
  error?: {
    message: string;
    type: string;
    code: number;
  };
}

interface InstagramPublishResponse {
  id?: string;
  error?: {
    message: string;
    type: string;
    code: number;
  };
}

/**
 * Post an article to Instagram Business Account
 * Note: Instagram Graph API requires a valid image URL that is publicly accessible
 */
export async function postToInstagram(options: InstagramPostOptions): Promise<InstagramPostResult> {
  const { accessToken, businessAccountId } = config.socialMedia.instagram;

  if (!accessToken || !businessAccountId) {
    return {
      success: false,
      error: 'Instagram credentials not configured. Please set INSTAGRAM_ACCESS_TOKEN and INSTAGRAM_BUSINESS_ACCOUNT_ID',
    };
  }

  // Validate image URL
  if (!options.imageUrl) {
    return {
      success: false,
      error: 'Image URL is required for Instagram posts',
    };
  }

  // Ensure image URL is absolute and accessible
  const productionBaseUrl = 'https://gigsafehub.com';
  let imageUrl = options.imageUrl;

  // Replace localhost with production URL
  if (imageUrl.includes('localhost') || imageUrl.startsWith('http://localhost')) {
    imageUrl = imageUrl.replace(/https?:\/\/localhost:\d+/, productionBaseUrl);
  }

  if (!imageUrl.startsWith('http://') && !imageUrl.startsWith('https://')) {
    // If relative URL, make it absolute using production URL
    imageUrl = `${productionBaseUrl}${imageUrl.startsWith('/') ? '' : '/'}${imageUrl}`;
  }

  // Validate that the URL points to an image (non-blocking - Instagram API will validate too)
  try {
    const imageResponse = await fetch(imageUrl, { method: 'HEAD' });
    const contentType = imageResponse.headers.get('content-type');

    if (!contentType || !contentType.startsWith('image/')) {
      // Warn but don't block - Instagram API will validate and return a better error
      console.warn(`Warning: Image URL may not be valid (content-type: ${contentType || 'unknown'}). URL: ${imageUrl}`);
    }

    if (!imageResponse.ok) {
      // Warn but don't block - Instagram API will validate and return a better error
      console.warn(`Warning: Image URL returned HTTP ${imageResponse.status}. URL: ${imageUrl}`);
    }
  } catch (error: any) {
    // Warn but don't block - Instagram API will validate and return a better error
    console.warn(`Warning: Could not validate image URL: ${error.message}. URL: ${imageUrl}`);
  }

  try {
    // Build caption with text and optional link
    const caption = options.caption + (options.link ? `\n\nRead more: ${options.link}` : '');

    // Step 1: Create a container (media upload) for the image
    const createContainerParams = new URLSearchParams({
      image_url: imageUrl,
      caption: caption,
      access_token: accessToken,
    });

    const containerResponse = await fetch(
      `https://graph.facebook.com/v23.0/${businessAccountId}/media`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: createContainerParams.toString(),
      }
    );

    const containerData = (await containerResponse.json()) as InstagramContainerResponse;

    if (!containerResponse.ok) {
      const errorMessage = containerData.error?.message || 'Failed to create Instagram media container';
      const errorCode = containerData.error?.code;
      const errorType = containerData.error?.type;

      // Provide more detailed error message
      let detailedError = errorMessage;
      if (errorMessage.includes('media type') || errorMessage.includes('photo or video')) {
        detailedError = `${errorMessage}. Please ensure the image URL (${imageUrl}) is publicly accessible and points to a valid image file (JPG, PNG, etc.).`;
      }

      return {
        success: false,
        error: detailedError + (errorCode ? ` (Code: ${errorCode}, Type: ${errorType})` : ''),
      };
    }

    const containerId = containerData.id;

    if (!containerId) {
      return {
        success: false,
        error: 'Failed to create Instagram media container: No container ID returned',
      };
    }

    // Step 2: Publish the container
    const publishParams = new URLSearchParams({
      creation_id: containerId,
      access_token: accessToken,
    });

    const publishResponse = await fetch(
      `https://graph.facebook.com/v23.0/${businessAccountId}/media_publish`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: publishParams.toString(),
      }
    );

    const publishData = (await publishResponse.json()) as InstagramPublishResponse;

    if (!publishResponse.ok) {
      return {
        success: false,
        error: publishData.error?.message || 'Failed to publish Instagram post',
      };
    }

    return {
      success: true,
      mediaId: publishData.id,
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || 'Failed to post to Instagram',
    };
  }
}
