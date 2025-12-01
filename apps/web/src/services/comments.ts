const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

/**
 * Comment interface
 */
export interface Comment {
  id: string;
  articleId: string;
  name: string;
  email: string;
  message: string;
  isApproved: boolean;
  createdAt: string;
  updatedAt: string;
}

/**
 * Get comments for an article
 * Client-side version (for use in Client Components)
 */
export const getArticleComments = async (articleId: string): Promise<Comment[]> => {
  try {
    const response = await fetch(`${API_URL}/api/articles/${articleId}/comments`, {
      cache: 'no-store', // Always fetch fresh comments
    });

    if (!response.ok) {
      return [];
    }

    return response.json();
  } catch (error) {
    console.error('Error fetching comments:', error);
    return [];
  }
};

/**
 * Create a new comment for an article
 */
export const createComment = async (
  articleId: string,
  data: {
    name: string;
    email: string;
    message: string;
  }
): Promise<{ success: boolean; message: string; comment?: Comment }> => {
  try {
    const response = await fetch(`${API_URL}/api/articles/${articleId}/comments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to create comment');
    }

    return response.json();
  } catch (error: any) {
    console.error('Error creating comment:', error);
    throw error;
  }
};

