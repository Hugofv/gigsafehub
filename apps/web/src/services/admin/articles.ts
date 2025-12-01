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
};

