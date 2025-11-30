import { fetchWithAuth } from './utils';
import type { Comparison } from './types';

export const adminComparisons = {
  getAll: (): Promise<Comparison[]> => fetchWithAuth('/api/admin/comparisons'),
  getById: (id: string): Promise<Comparison> => fetchWithAuth(`/api/admin/comparisons/${id}`),
  create: (data: Partial<Comparison>): Promise<Comparison> =>
    fetchWithAuth('/api/admin/comparisons', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: string, data: Partial<Comparison>): Promise<Comparison> =>
    fetchWithAuth(`/api/admin/comparisons/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: string): Promise<void> =>
    fetchWithAuth(`/api/admin/comparisons/${id}`, { method: 'DELETE' }).then(() => undefined),
};

