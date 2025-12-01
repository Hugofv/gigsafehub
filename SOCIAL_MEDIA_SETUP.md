# Social Media Integration Setup Guide

This guide explains how to set up and configure the social media publishing features for articles.

## Overview

The application supports publishing articles directly to:
- **Facebook** (via Facebook Graph API v23.0)
- **Instagram** (via Instagram Graph API v23.0)
- **Twitter/X** (via Twitter API v2)

## Prerequisites

1. Developer accounts on the platforms you want to integrate
2. Facebook Page and Instagram Business Account (for Instagram posting)
3. Twitter Developer Account (for Twitter/X posting)

## Configuration

Add the following environment variables to your `apps/api/.env` file:

### Facebook Configuration

```env
# Facebook Page Access Token
FACEBOOK_PAGE_ACCESS_TOKEN=your_facebook_page_access_token

# Facebook Page ID
FACEBOOK_PAGE_ID=your_facebook_page_id
```

**How to get Facebook credentials:**

1. Go to [Facebook Developers](https://developers.facebook.com/)
2. Create a new app or select an existing one
3. Add the "Pages" product to your app
4. Go to **Settings > Basic** and note your App ID and App Secret
5. Generate a Page Access Token:
   - Go to **Tools > Graph API Explorer**
   - Select your app and add permissions: `pages_manage_posts`, `pages_read_engagement`, `public_profile`
   - Click "Generate Access Token" and follow the prompts
   - Go to **Tools > Access Token Tool** and extend the token (it will be long-lived)
6. Find your Page ID:
   - Go to your Facebook Page
   - Click "About" section
   - The Page ID is listed there

### Instagram Configuration

```env
# Instagram Business Account Access Token
INSTAGRAM_ACCESS_TOKEN=your_instagram_access_token

# Instagram Business Account ID
INSTAGRAM_BUSINESS_ACCOUNT_ID=your_instagram_business_account_id
```

**How to get Instagram credentials:**

1. **Note:** You need a Facebook Page connected to your Instagram Business Account
2. Follow the Facebook setup steps above first
3. Connect your Instagram Business Account to your Facebook Page:
   - In Facebook, go to your Page Settings
   - Click "Instagram" in the left sidebar
   - Connect your Instagram account
4. Get Instagram Business Account ID:
   - Use Graph API Explorer: `GET /me?fields=instagram_business_account`
   - Or use: `GET /{page-id}?fields=instagram_business_account`
5. The access token is the same as your Facebook Page Access Token

**Important:** Instagram Graph API has restrictions:
- Only works with Instagram Business or Creator accounts
- Requires a Facebook Page to be linked
- Images must be publicly accessible URLs
- Posting requires proper permissions

### Twitter/X Configuration

```env
# Twitter API Credentials (OAuth 1.0a)
TWITTER_API_KEY=your_twitter_api_key
TWITTER_API_SECRET=your_twitter_api_secret
TWITTER_ACCESS_TOKEN=your_twitter_access_token
TWITTER_ACCESS_TOKEN_SECRET=your_twitter_access_token_secret

# Optional: Bearer Token (for read operations only, cannot be used for posting)
TWITTER_BEARER_TOKEN=your_twitter_bearer_token
```

**How to get Twitter credentials:**

1. Go to [Twitter Developer Portal](https://developer.twitter.com/)
2. Create a new project and app (or use existing)
3. Set up OAuth 1.0a:
   - In your app settings, go to "Keys and tokens"
   - Generate API Key and Secret
   - Generate Access Token and Secret
   - Ensure "Read and Write" permissions are enabled
4. Note: Bearer Tokens can only read, not post. You need OAuth 1.0a credentials for posting.

### Base URL Configuration

Make sure your base URL is set correctly:

```env
# API config (apps/api/.env)
BASE_URL=https://yourdomain.com

# Or in development:
BASE_URL=http://localhost:3000
```

## Features

### Publishing Articles

1. Go to the Admin Articles page (`/admin/articles`)
2. Each article has three social media buttons:
   - **Facebook** (blue button)
   - **Instagram** (purple/pink gradient button)
   - **X/Twitter** (light blue button)
3. Click any button to publish the article to that platform
4. The post will include:
   - Article title
   - Article excerpt
   - Article link
   - Article image (if available)

### Custom Messages

You can customize the message by providing a `customMessage` parameter when calling the API. Otherwise, a default message will be generated.

### Image Requirements

- **Facebook**: Images are optional but recommended
- **Instagram**: Images are **required**. Posts without images will fail.
- **Twitter/X**: Images are optional but recommended

## API Endpoint

The social media publishing endpoint:

```
POST /api/admin/articles/:id/publish-social
```

**Request Body:**
```json
{
  "platforms": ["facebook", "instagram", "twitter"],
  "customMessage": "Optional custom message"
}
```

**Response:**
```json
{
  "success": true,
  "results": [
    {
      "platform": "facebook",
      "success": true,
      "postId": "123456789"
    },
    {
      "platform": "instagram",
      "success": false,
      "error": "Instagram requires an image"
    }
  ]
}
```

## Troubleshooting

### Facebook Issues

- **"Invalid access token"**: Make sure your token is a long-lived Page Access Token, not a short-lived User Access Token
- **"Page not found"**: Verify your Page ID is correct
- **Permission errors**: Ensure your app has `pages_manage_posts` permission

### Instagram Issues

- **"Requires Instagram Business Account"**: Your Instagram account must be a Business or Creator account
- **"Image URL not accessible"**: The image URL must be publicly accessible (not behind authentication)
- **"Account not connected"**: Make sure your Instagram account is connected to your Facebook Page

### Twitter Issues

- **"Authentication failed"**: Check that all four credentials (API Key, Secret, Access Token, Secret) are correct
- **"Read-only permissions"**: Ensure your app has "Read and Write" permissions, not just "Read"
- **Character limit**: Messages are automatically truncated to 280 characters for Twitter

## Security Notes

1. **Never commit credentials to version control**
2. Store all tokens securely in environment variables
3. Rotate tokens regularly
4. Use different credentials for development and production
5. Consider using a secrets management service (AWS Secrets Manager, etc.)

## Rate Limits

Be aware of platform rate limits:

- **Facebook**: 600 requests per 600 seconds per user
- **Instagram**: 200 requests per hour per user
- **Twitter**: 300 tweets per 3 hours (varies by account type)

## Support

For more information:
- [Facebook Graph API Documentation](https://developers.facebook.com/docs/graph-api)
- [Instagram Graph API Documentation](https://developers.facebook.com/docs/instagram-api)
- [Twitter API v2 Documentation](https://developer.twitter.com/en/docs/twitter-api)

