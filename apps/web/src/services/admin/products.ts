import { fetchWithAuth } from './utils';
import type { Product } from './types';

export const adminProducts = {
  getAll: (): Promise<Product[]> => fetchWithAuth('/api/admin/products'),
  getById: (id: string): Promise<Product> => fetchWithAuth(`/api/admin/products/${id}`),
  create: (data: Partial<Product>): Promise<Product> =>
    fetchWithAuth('/api/admin/products', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: string, data: Partial<Product>): Promise<Product> =>
    fetchWithAuth(`/api/admin/products/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: string): Promise<void> =>
    fetchWithAuth(`/api/admin/products/${id}`, { method: 'DELETE' }).then(() => undefined),
};

