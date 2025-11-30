import { fetchWithAuth } from './utils';
import type { Category } from './types';

export const adminCategories = {
  getAll: (): Promise<Category[]> => fetchWithAuth('/api/admin/categories'),
  getById: (id: string): Promise<Category> => fetchWithAuth(`/api/admin/categories/${id}`),
  create: (data: Partial<Category>): Promise<Category> =>
    fetchWithAuth('/api/admin/categories', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: string, data: Partial<Category>): Promise<Category> =>
    fetchWithAuth(`/api/admin/categories/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: string): Promise<void> =>
    fetchWithAuth(`/api/admin/categories/${id}`, { method: 'DELETE' }).then(() => undefined),
};

