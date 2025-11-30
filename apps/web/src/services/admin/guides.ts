import { fetchWithAuth } from './utils';
import type { Guide } from './types';

export const adminGuides = {
  getAll: (): Promise<Guide[]> => fetchWithAuth('/api/admin/guides'),
  getById: (id: string): Promise<Guide> => fetchWithAuth(`/api/admin/guides/${id}`),
  create: (data: Partial<Guide>): Promise<Guide> =>
    fetchWithAuth('/api/admin/guides', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: string, data: Partial<Guide>): Promise<Guide> =>
    fetchWithAuth(`/api/admin/guides/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: string): Promise<void> =>
    fetchWithAuth(`/api/admin/guides/${id}`, { method: 'DELETE' }).then(() => undefined),
};

