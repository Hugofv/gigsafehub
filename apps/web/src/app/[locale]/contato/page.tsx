import { redirect } from 'next/navigation';

interface ContatoPageProps {
  params: Promise<{
    locale: string;
  }>;
}

export default async function ContatoPage({ params }: ContatoPageProps) {
  const { locale } = await params;
  // Redirect to contact page
  redirect(`/${locale}/contact`);
}
