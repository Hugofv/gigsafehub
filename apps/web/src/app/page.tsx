import { Metadata } from 'next';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
  title: 'GigSafeHub - Insurance and Protection for Gig Economy Workers',
  description: 'Compare insurance, find financial protection and discover the best options for drivers, delivery workers, freelancers and digital nomads.',
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootPage() {
  redirect('/pt-BR');
}
