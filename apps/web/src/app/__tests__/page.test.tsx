import { render, screen } from '@testing-library/react';
import Home from '../page';

// Mock fetch
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: async () => ({ status: 'ok', uptime: 1000 }),
  })
) as jest.Mock;

describe('Home Page', () => {
  it('renders the title', async () => {
    const page = await Home();
    const { container } = render(page);
    expect(container).toHaveTextContent('GigSafeHub');
  });
});

