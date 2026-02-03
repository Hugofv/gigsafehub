import { fetchWithAuth } from './utils';

export const adminSeo = {
  submitToIndexNow: async (submitSitemap = true): Promise<{
    success: boolean;
    submitted?: number;
    statusCode?: number;
    endpoint?: string;
    error?: string;
  }> => {
    return fetchWithAuth('/api/admin/indexnow/submit', {
      method: 'POST',
      body: JSON.stringify({ submitSitemap }),
    });
  },
};
