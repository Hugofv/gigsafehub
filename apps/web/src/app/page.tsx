import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'GigSafeHub - Insurance and Protection for Gig Economy Workers',
  description: 'Compare insurance, find financial protection and discover the best options for drivers, delivery workers, freelancers and digital nomads.',
  robots: {
    index: true,
    follow: true,
  },
};

// Root page redirect is now handled in middleware.ts with 301 status
// This component should never be reached, but kept for safety
export default function RootPage() {
  return null;
}
