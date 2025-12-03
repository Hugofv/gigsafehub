import { GoogleGenerativeAI } from '@google/generative-ai';
import { config } from '../../config';

export interface GeneratePostOptions {
  title: string;
  excerpt: string;
  category?: string;
  locale?: 'pt_BR' | 'en_US' | 'Both';
  platform: 'facebook' | 'instagram' | 'twitter';
  articleUrl: string;
}

export interface GeneratedPost {
  message: string;
  hashtags: string[];
}

/**
 * Generate an engaging social media post using Gemini AI
 */
export async function generateSocialMediaPost(
  options: GeneratePostOptions
): Promise<GeneratedPost> {
  const { geminiApiKey } = config.google;

  if (!geminiApiKey) {
    throw new Error('Gemini API key not configured. Please set GEMINI_API_KEY in environment variables.');
  }

  const genAI = new GoogleGenerativeAI(geminiApiKey);
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

  // Determine language based on locale
  const language = options.locale === 'en_US' ? 'English' :
                   options.locale === 'pt_BR' ? 'Portuguese' :
                   'Portuguese'; // Default to Portuguese for 'Both'

  // Platform-specific constraints
  const platformConstraints: Record<string, string> = {
    twitter: 'Maximum 280 characters (URLs count as ~23 chars). Be concise and impactful.',
    facebook: 'Maximum 500 characters. Can be more descriptive.',
    instagram: 'Maximum 2200 characters. Can include more details and emojis.',
  };

  const constraint = platformConstraints[options.platform] || platformConstraints.facebook;

  // Build prompt
  const prompt = `You are a social media expert creating engaging posts for a financial/gig economy platform called GigSafeHub.

Article Information:
- Title: ${options.title}
- Excerpt/Description: ${options.excerpt}
${options.category ? `- Category: ${options.category}` : ''}
- Language: ${language}
- Platform: ${options.platform}
- Article URL: ${options.articleUrl}

Requirements:
1. Create an engaging, attention-grabbing post that encourages clicks and engagement
2. Write in ${language}
3. ${constraint}
4. Include 5-10 relevant, high-engagement hashtags at the end
5. Make it conversational and compelling
6. Include a call-to-action
7. For Instagram: Use emojis strategically (2-3 max)
8. For Twitter: Be very concise, focus on the hook
9. For Facebook: Can be more informative and detailed

IMPORTANT:
- Do NOT include the article URL in the message (it will be added separately)
- Do NOT include "Read more:" or similar phrases
- Focus on the value proposition and why someone should read the article
- Use hashtags that are trending and relevant to gig economy, freelancing, insurance, financial security, or the specific topic

CRITICAL: You MUST respond with ONLY valid JSON in this exact format (no markdown, no code blocks, no explanations):
{
  "message": "Your engaging post text here",
  "hashtags": ["#hashtag1", "#hashtag2", "#hashtag3"]
}

Do NOT include markdown code blocks. Return ONLY the raw JSON object.`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Parse JSON response (remove markdown code blocks if present)
    let jsonText = text.trim();

    // Remove markdown code blocks if present (handle various formats)
    jsonText = jsonText
      .replace(/^```json\s*/i, '')
      .replace(/^```\s*/, '')
      .replace(/\s*```\s*$/, '')
      .trim();

    // Try to extract JSON if it's embedded in text
    const jsonMatch = jsonText.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      jsonText = jsonMatch[0];
    }

    const parsed = JSON.parse(jsonText) as GeneratedPost;

    // Validate response structure
    if (!parsed.message || !Array.isArray(parsed.hashtags)) {
      throw new Error('Invalid response format from AI');
    }

    // Combine message and hashtags
    const hashtagsText = parsed.hashtags.join(' ');
    const fullMessage = `${parsed.message}\n\n${hashtagsText}`;

    // For Twitter, ensure we stay within character limits
    if (options.platform === 'twitter') {
      const maxLength = 280;
      const urlLength = 23; // Twitter counts URLs as ~23 chars
      const availableLength = maxLength - urlLength - 10; // 10 chars safety margin

      if (fullMessage.length > availableLength) {
        // Truncate message but keep hashtags
        const messageLength = availableLength - hashtagsText.length - 2; // -2 for \n\n
        const truncatedMessage = parsed.message.substring(0, messageLength - 3) + '...';
        return {
          message: `${truncatedMessage}\n\n${hashtagsText}`,
          hashtags: parsed.hashtags,
        };
      }
    }

    return {
      message: fullMessage,
      hashtags: parsed.hashtags,
    };
  } catch (error: any) {
    console.error('Error generating social media post with Gemini:', error);

    // Fallback to default message if AI fails
    const defaultMessage = `${options.title}\n\n${options.excerpt}`;
    const defaultHashtags = options.locale === 'en_US'
      ? ['#GigEconomy', '#Freelancing', '#FinancialSecurity', '#Insurance', '#GigWorkers']
      : ['#EconomiaGig', '#Freelancer', '#SegurancaFinanceira', '#Seguro', '#TrabalhadoresGig'];

    return {
      message: defaultMessage,
      hashtags: defaultHashtags,
    };
  }
}

