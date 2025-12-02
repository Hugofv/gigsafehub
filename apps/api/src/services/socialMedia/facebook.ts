import { config } from '../../config';

export interface FacebookPostOptions {
  message: string;
  link: string;
  imageUrl?: string;
}

export interface FacebookPostResult {
  success: boolean;
  postId?: string;
  error?: string;
}

interface FacebookImageResponse {
  id?: string;
  error?: {
    message: string;
    type: string;
    code: number;
  };
}

interface FacebookPostResponse {
  id?: string;
  error?: {
    message: string;
    type: string;
    code: number;
  };
}

/**
 * Post an article to Facebook Page
 */
export async function postToFacebook(options: FacebookPostOptions): Promise<FacebookPostResult> {
  const { pageAccessToken, pageId } = config.socialMedia.facebook;
  const { accessToken: instagramAccessToken } = config.socialMedia.instagram;

  if (!pageAccessToken || !pageId) {
    return {
      success: false,
      error: 'Facebook credentials not configured. Please set FACEBOOK_PAGE_ACCESS_TOKEN and FACEBOOK_PAGE_ID',
    };
  }

  if (!instagramAccessToken) {
    return {
      success: false,
      error: 'Instagram access token not configured. Please set INSTAGRAM_ACCESS_TOKEN (used as Authorization header for Facebook)',
    };
  }

  // Validate and normalize link URL
  const productionBaseUrl = 'https://gigsafehub.com';
  let linkUrl = options.link;

  // Replace localhost with production URL
  if (linkUrl.includes('localhost') || linkUrl.startsWith('http://localhost')) {
    linkUrl = linkUrl.replace(/https?:\/\/localhost:\d+/, productionBaseUrl);
  }

  if (!linkUrl.startsWith('http://') && !linkUrl.startsWith('https://')) {
    // If relative URL, make it absolute using production URL
    linkUrl = `${productionBaseUrl}${linkUrl.startsWith('/') ? '' : '/'}${linkUrl}`;
  }

  // Validate link URL format
  try {
    new URL(linkUrl);
  } catch (error) {
    return {
      success: false,
      error: `Invalid link URL format: ${options.link}. Please provide a valid absolute URL.`,
    };
  }

  // Validate and normalize image URL if provided
  let imageUrl: string | undefined = options.imageUrl;
  if (imageUrl) {
    // Replace localhost with production URL
    if (imageUrl.includes('localhost') || imageUrl.startsWith('http://localhost')) {
      imageUrl = imageUrl.replace(/https?:\/\/localhost:\d+/, productionBaseUrl);
    }

    // Ensure image URL is absolute and accessible
    if (!imageUrl.startsWith('http://') && !imageUrl.startsWith('https://')) {
      // If relative URL, make it absolute using production URL
      imageUrl = `${productionBaseUrl}${imageUrl.startsWith('/') ? '' : '/'}${imageUrl}`;
    }

    // Validate image URL format
    try {
      new URL(imageUrl);
    } catch (error) {
      return {
        success: false,
        error: `Invalid image URL format: ${options.imageUrl}. Please provide a valid absolute URL.`,
      };
    }

    // Validate that the URL points to an image (non-blocking - Facebook API will validate too)
    try {
      const imageResponse = await fetch(imageUrl, { method: 'HEAD' });
      const contentType = imageResponse.headers.get('content-type');

      if (!contentType || !contentType.startsWith('image/')) {
        // Warn but don't block - Facebook API will validate and return a better error
        console.warn(`Warning: Image URL may not be valid (content-type: ${contentType || 'unknown'}). URL: ${imageUrl}`);
      }

      if (!imageResponse.ok) {
        // Warn but don't block - Facebook API will validate and return a better error
        console.warn(`Warning: Image URL returned HTTP ${imageResponse.status}. URL: ${imageUrl}`);
      }
    } catch (error: any) {
      // Warn but don't block - Facebook API will validate and return a better error
      console.warn(`Warning: Could not validate image URL: ${error.message}. URL: ${imageUrl}`);
    }
  }

  try {
    // First, upload image if provided (required for link posts with images)
    let attachedMediaId: string | undefined;
    if (imageUrl) {
      try {
        const imageUploadResponse = await fetch(
          `https://graph.facebook.com/v23.0/${pageId}/photos?url=${encodeURIComponent(imageUrl)}&published=false&access_token=${pageAccessToken}`,
          {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${instagramAccessToken}`,
            },
          }
        );

        const imageData = (await imageUploadResponse.json()) as FacebookImageResponse;

        if (imageUploadResponse.ok) {
          attachedMediaId = imageData.id;
        } else {
          // Log error but continue - we can post without image
          const errorMsg = imageData.error?.message || 'Failed to upload image';
          console.warn(`Facebook image upload failed: ${errorMsg}. URL: ${imageUrl}`);
          // Don't return error here - continue to post without image
        }
      } catch (error) {
        console.error('Error uploading image to Facebook:', error);
        // Continue without image if upload fails
      }
    }

    // Post to Facebook Page
    const params = new URLSearchParams({
      message: options.message,
      link: linkUrl,
      access_token: pageAccessToken,
    });

    if (attachedMediaId) {
      params.append('attached_media', JSON.stringify([{ media_fbid: attachedMediaId }]));
    }

    const response = await fetch(`https://graph.facebook.com/v23.0/${pageId}/feed`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Bearer ${instagramAccessToken}`,
      },
      body: params.toString(),
    });

    const data = (await response.json()) as FacebookPostResponse;

    if (!response.ok) {
      const errorMessage = data.error?.message || 'Failed to post to Facebook';
      const errorCode = data.error?.code;
      const errorType = data.error?.type;

      // Provide more detailed error message
      let detailedError = errorMessage;
      if (errorCode === 1500 || errorMessage.includes('url') || errorMessage.includes('invalid')) {
        detailedError = `${errorMessage}. Please check the URLs provided:\n- Link URL: ${linkUrl}\n- Image URL: ${imageUrl || 'not provided'}\n\nEnsure both URLs are valid, absolute URLs (starting with http:// or https://) and are publicly accessible.`;
      } else if (errorMessage.includes('media') || errorMessage.includes('image') || errorMessage.includes('photo')) {
        detailedError = `${errorMessage}. Please ensure the image URL (${imageUrl || 'not provided'}) is publicly accessible and points to a valid image file (JPG, PNG, etc.).`;
      }

      return {
        success: false,
        error: detailedError + (errorCode ? ` (Code: ${errorCode}, Type: ${errorType})` : ''),
      };
    }

    return {
      success: true,
      postId: data.id,
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || 'Failed to post to Facebook',
    };
  }
}
