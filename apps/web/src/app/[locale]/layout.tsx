import { I18nProvider } from '@/contexts/I18nContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function LocaleLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <I18nProvider>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow">
          {children}
        </main>
        <Footer />
      </div>
    </I18nProvider>
  );
}

