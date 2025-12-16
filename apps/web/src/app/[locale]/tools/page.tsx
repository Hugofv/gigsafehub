import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import Link from 'next/link';

interface PageProps {
  params: Promise<{
    locale: string;
  }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;

  if (locale === 'pt-BR') {
    redirect('/pt-BR/ferramentas');
  }

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://gigsafehub.com';
  const canonicalUrl = `${baseUrl}/${locale}/tools`;

  return {
    title: 'Free Tools for Gig Workers',
    description: 'Free calculators and tools to help gig workers manage their finances, estimate income loss, and make smarter decisions about insurance and protection.',
    keywords: ['gig worker tools', 'freelancer calculator', 'income calculator', 'insurance tools', 'financial planning tools'],
    openGraph: {
      title: 'Free Tools for Gig Workers | GigSafeHub',
      description: 'Free calculators and tools designed for gig economy workers and freelancers.',
      type: 'website',
      url: canonicalUrl,
      siteName: 'GigSafeHub',
      locale: 'en_US',
    },
    alternates: {
      canonical: canonicalUrl,
      languages: {
        'en-US': `${baseUrl}/en-US/tools`,
        'pt-BR': `${baseUrl}/pt-BR/ferramentas`,
      },
    },
  };
}

const tools = [
  {
    id: 'loss-income-simulator',
    icon: '📊',
    gradient: 'from-orange-500 to-red-500',
    bgGlow: 'bg-orange-500/20',
  },
];

export default async function ToolsPage({ params }: PageProps) {
  const { locale } = await params;

  if (locale === 'pt-BR') {
    redirect('/pt-BR/ferramentas');
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-navy-900">
      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 -left-40 w-80 h-80 bg-orange-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Breadcrumbs */}
        <nav className="flex items-center space-x-2 text-sm mb-8">
          <Link href={`/${locale}`} className="text-slate-400 hover:text-white transition-colors">
            Home
          </Link>
          <span className="text-slate-600">/</span>
          <span className="text-white font-medium">Tools</span>
        </nav>

        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-teal-500/20 text-teal-400 text-sm font-medium mb-6">
            <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
            Free Tools
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-6 tracking-tight">
            Tools for <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-orange-400">Gig Workers</span>
          </h1>
          <p className="text-xl text-slate-300 leading-relaxed">
            Free calculators and tools to help you make smarter financial decisions and protect your income.
          </p>
        </div>

        {/* Tools Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Loss Income Simulator Card */}
          <Link
            href={`/${locale}/tools/loss-income-simulator`}
            className="group relative bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 p-8 hover:border-orange-500/50 transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:shadow-orange-500/10"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-red-500/10 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="relative">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center text-3xl mb-6 shadow-lg shadow-orange-500/30">
                📊
              </div>
              <h2 className="text-2xl font-bold text-white mb-3 group-hover:text-orange-400 transition-colors">
                Loss Income Simulator
              </h2>
              <p className="text-slate-400 mb-6">
                Calculate how much income you could lose without proper insurance coverage. See the real cost of being uninsured.
              </p>
              <div className="flex items-center text-orange-400 font-semibold">
                Try Now
                <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </div>
            </div>
          </Link>

          {/* Daily Profit Calculator Card */}
          <Link
            href={`/${locale}/tools/daily-profit-calculator`}
            className="group relative bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 p-8 hover:border-emerald-500/50 transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:shadow-emerald-500/10"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-teal-500/10 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="relative">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center text-3xl mb-6 shadow-lg shadow-emerald-500/30">
                💰
              </div>
              <h2 className="text-2xl font-bold text-white mb-3 group-hover:text-emerald-400 transition-colors">
                Daily Real Profit Calculator
              </h2>
              <p className="text-slate-400 mb-6">
                Discover how much you really earn per hour after deducting fuel, maintenance, fees, and other costs.
              </p>
              <div className="flex items-center text-emerald-400 font-semibold">
                Try Now
                <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </div>
            </div>
          </Link>

          {/* Coming Soon Card */}
          <div className="relative bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 p-8 opacity-60">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-500 flex items-center justify-center text-3xl mb-6">
              🛡️
            </div>
            <h2 className="text-2xl font-bold text-white mb-3">
              Insurance Cost Calculator
            </h2>
            <p className="text-slate-400 mb-6">
              Estimate your insurance costs based on your profession, location, and coverage needs.
            </p>
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-slate-700 text-slate-400 text-sm">
              Coming Soon
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

