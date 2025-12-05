import { fetchWithAuth } from './utils';
import type { Article } from './types';

export type SocialMediaPlatform = 'facebook' | 'instagram' | 'twitter';

export interface SocialMediaPostOptions {
  platforms: SocialMediaPlatform[];
  customMessage?: string;
}

export interface SocialMediaPostResult {
  platform: SocialMediaPlatform;
  success: boolean;
  postId?: string;
  error?: string;
}

export interface SocialMediaPostResponse {
  success: boolean;
  results: SocialMediaPostResult[];
}

export interface UploadImageResponse {
  success: boolean;
  url: string;
  key: string;
  bucket: string;
}

export const adminArticles = {
  getAll: (): Promise<Article[]> => fetchWithAuth('/api/admin/articles'),
  getById: (id: string): Promise<Article> => fetchWithAuth(`/api/admin/articles/${id}`),
  create: (data: Partial<Article>): Promise<Article> =>
    fetchWithAuth('/api/admin/articles', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: string, data: Partial<Article>): Promise<Article> =>
    fetchWithAuth(`/api/admin/articles/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: string): Promise<void> =>
    fetchWithAuth(`/api/admin/articles/${id}`, { method: 'DELETE' }).then(() => undefined),
  publishToSocialMedia: (id: string, options: SocialMediaPostOptions): Promise<SocialMediaPostResponse> =>
    fetchWithAuth(`/api/admin/articles/${id}/publish-social`, {
      method: 'POST',
      body: JSON.stringify(options),
    }),
  uploadImage: async (file: File, folder?: string, fileName?: string): Promise<UploadImageResponse> => {
    const formData = new FormData();
    formData.append('image', file);
    if (folder) formData.append('folder', folder);
    if (fileName) formData.append('fileName', fileName);

    // Get token using the same method as fetchWithAuth
    const token = typeof window !== 'undefined' ? localStorage.getItem('admin_token') : null;
    if (!token) {
      throw new Error('Not authenticated');
    }

    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
    const response = await fetch(`${apiUrl}/api/admin/upload/image`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        // Don't set Content-Type header - let browser set it with boundary for multipart/form-data
      },
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Failed to upload image' }));
      throw new Error(error.error || 'Failed to upload image');
    }

    return response.json();
  },
};

