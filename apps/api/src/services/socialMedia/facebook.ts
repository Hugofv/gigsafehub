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

  if (!pageAccessToken || !pageId) {
    return {
      success: false,
      error: 'Facebook credentials not configured. Please set FACEBOOK_PAGE_ACCESS_TOKEN and FACEBOOK_PAGE_ID',
    };
  }

  try {
    // First, upload image if provided (required for link posts with images)
    let attachedMediaId: string | undefined;
    if (options.imageUrl) {
      try {
        const imageUploadResponse = await fetch(
          `https://graph.facebook.com/v23.0/${pageId}/photos?url=${encodeURIComponent(options.imageUrl)}&published=false&access_token=${pageAccessToken}`,
          {
            method: 'POST',
          }
        );

        if (imageUploadResponse.ok) {
          const imageData = (await imageUploadResponse.json()) as FacebookImageResponse;
          attachedMediaId = imageData.id;
        }
      } catch (error) {
        console.error('Error uploading image to Facebook:', error);
        // Continue without image if upload fails
      }
    }

    // Post to Facebook Page
    const params = new URLSearchParams({
      message: options.message,
      link: options.link,
      access_token: pageAccessToken,
    });

    if (attachedMediaId) {
      params.append('attached_media', JSON.stringify([{ media_fbid: attachedMediaId }]));
    }

    const response = await fetch(`https://graph.facebook.com/v23.0/${pageId}/feed`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params.toString(),
    });

    const data = (await response.json()) as FacebookPostResponse;

    if (!response.ok) {
      return {
        success: false,
        error: data.error?.message || 'Failed to post to Facebook',
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
