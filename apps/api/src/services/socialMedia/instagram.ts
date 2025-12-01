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

  try {
    // Step 1: Create a container (media upload) for the image
    const createContainerParams = new URLSearchParams({
      image_url: options.imageUrl,
      caption: options.caption + (options.link ? `\n\nRead more: ${options.link}` : ''),
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
      return {
        success: false,
        error: containerData.error?.message || 'Failed to create Instagram media container',
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
