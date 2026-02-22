import { ProviderAdapter } from './types';
import { MockProviderAdapter } from './adapters/mock.adapter';

const adapterRegistry = new Map<string, ProviderAdapter>();

export function getAdapter(partnerId: string, partnerName: string): ProviderAdapter {
  if (adapterRegistry.has(partnerId)) {
    return adapterRegistry.get(partnerId)!;
  }

  // Default to mock adapter for all partners in development
  const adapter = new MockProviderAdapter(partnerName, 0.1);
  adapterRegistry.set(partnerId, adapter);
  return adapter;
}

export function registerAdapter(partnerId: string, adapter: ProviderAdapter) {
  adapterRegistry.set(partnerId, adapter);
}
