import type { ReactNode } from 'react';
import LocaleLayoutClient from './LocaleLayoutClient';

interface LocaleLayoutProps {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}

// Force dynamic rendering to ensure metadata is always generated
export const dynamic = 'force-dynamic';
export const revalidate = 0;
// Force Node.js runtime to disable metadata streaming
export const runtime = 'nodejs';

export default async function LocaleLayout({
  children,
  params,
}: LocaleLayoutProps) {
  const { locale } = await params;

  return <LocaleLayoutClient>{children}</LocaleLayoutClient>;
}

