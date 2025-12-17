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
    title: 'Free Tools for Rideshare & Delivery Drivers | GigSafeHub',
    description: 'Free calculators and tools for Uber, Lyft, DoorDash, and Instacart drivers. Calculate real profit, hidden costs, monthly goals, and more. Understand your true earnings today.',
    keywords: [
      'rideshare driver tools',
      'uber driver calculator',
      'lyft driver calculator',
      'doordash driver calculator',
      'instacart shopper calculator',
      'real profit calculator',
      'driver hidden costs',
      'how much do uber drivers make',
      'freelancer calculator',
      'gig worker tools',
      'free driver tools',
      'driver financial planning',
      'income simulator',
      'break even calculator driver',
    ],
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    openGraph: {
      title: 'Free Tools for Rideshare & Delivery Drivers | GigSafeHub',
      description: 'Free calculators for Uber, Lyft, DoorDash drivers. Discover your real earnings!',
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

// Tool data for structured data and relationships
const tools = [
  {
    id: 'loss-income-simulator',
    name: 'Loss Income Simulator',
    description: 'Calculate how much income you could lose without proper insurance.',
    related: ['daily-profit-calculator', 'break-even-calculator'],
  },
  {
    id: 'daily-profit-calculator',
    name: 'Daily Real Profit Calculator',
    description: 'Discover how much you really earn per hour after all costs.',
    related: ['hidden-costs-calculator', 'cost-per-trip-calculator'],
  },
  {
    id: 'monthly-goal-simulator',
    name: 'Monthly Goal Simulator',
    description: 'Set your goal and find out how many hours and trips you need.',
    related: ['daily-profit-calculator', 'driver-budget-simulator'],
  },
  {
    id: 'hidden-costs-calculator',
    name: 'Hidden Costs Calculator',
    description: 'Discover invisible costs like depreciation and wear.',
    related: ['cost-per-trip-calculator', 'fuel-calculator'],
  },
  {
    id: 'cost-per-trip-calculator',
    name: 'Cost per Trip Calculator',
    description: 'How much does each trip cost? Find out if it\'s worth accepting.',
    related: ['fuel-calculator', 'daily-profit-calculator'],
  },
  {
    id: 'fuel-calculator',
    name: 'Fuel Calculator',
    description: 'Compare gas prices and save on fuel.',
    related: ['cost-per-trip-calculator', 'hidden-costs-calculator'],
  },
  {
    id: 'break-even-calculator',
    name: 'Break-Even Calculator',
    description: 'Find out how much you need to earn to cover all costs.',
    related: ['driver-budget-simulator', 'daily-profit-calculator'],
  },
  {
    id: 'driver-budget-simulator',
    name: 'Complete Budget Simulator',
    description: 'Build your complete budget with all costs included.',
    related: ['break-even-calculator', 'monthly-goal-simulator'],
  },
];

export default async function ToolsPage({ params }: PageProps) {
  const { locale } = await params;

  if (locale === 'pt-BR') {
    redirect('/pt-BR/ferramentas');
  }

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://gigsafehub.com';

  // ItemList structured data for the tool collection
  const itemListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Free Tools for Rideshare & Delivery Drivers',
    description: 'Collection of free calculators and tools for Uber, Lyft, DoorDash, and other gig workers.',
    numberOfItems: tools.length,
    itemListElement: tools.map((tool, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: tool.name,
      description: tool.description,
      url: `${baseUrl}/${locale}/tools/${tool.id}`,
    })),
  };

  // BreadcrumbList structured data
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: `${baseUrl}/${locale}`,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Tools',
        item: `${baseUrl}/${locale}/tools`,
      },
    ],
  };

  // FAQ structured data
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'Are these tools really free?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes, all our calculators and tools are 100% free. No signup required, no personal data collected, and you can use them as many times as you want.',
        },
      },
      {
        '@type': 'Question',
        name: 'Who are these tools for?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'These tools were created for rideshare drivers (Uber, Lyft), delivery drivers (DoorDash, Instacart, Grubhub), freelancers, and any independent worker who wants to better understand their earnings and costs.',
        },
      },
      {
        '@type': 'Question',
        name: 'How do I calculate my real profit as an Uber driver?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Use our Daily Real Profit Calculator. Enter your gross earnings, fuel costs, maintenance, and fees. The tool automatically calculates your real hourly profit.',
        },
      },
      {
        '@type': 'Question',
        name: 'What costs do rideshare drivers often forget?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'The most forgotten costs are: vehicle depreciation (your car loses value with every mile), tire wear, oil changes, brake pads, car insurance, and health insurance. Use our Hidden Costs Calculator to discover all of them.',
        },
      },
      {
        '@type': 'Question',
        name: 'How do I know if a trip is worth accepting?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Use our Cost per Trip Calculator. Enter the distance, your fuel consumption, and the trip fare. The tool shows if the trip is profitable or if you\'ll lose money.',
        },
      },
    ],
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-navy-900">
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 -left-40 w-80 h-80 bg-orange-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Breadcrumbs */}
        <nav className="flex items-center space-x-2 text-sm mb-8" aria-label="Breadcrumb">
          <Link href={`/${locale}`} className="text-slate-400 hover:text-white transition-colors">
            Home
          </Link>
          <span className="text-slate-600" aria-hidden="true">/</span>
          <span className="text-white font-medium" aria-current="page">Tools</span>
        </nav>

        {/* Header */}
        <header className="text-center max-w-4xl mx-auto mb-16">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-teal-500/20 text-teal-400 text-sm font-medium mb-6">
            <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
            100% Free
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-6 tracking-tight">
            Free Tools for{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-orange-400">
              Rideshare Drivers
            </span>
          </h1>
          <p className="text-xl text-slate-300 leading-relaxed mb-8">
            We created practical tools to help Uber, Lyft, DoorDash, and Instacart drivers understand their real earnings, discover hidden costs, and make smarter financial decisions.
          </p>
          <div className="flex flex-wrap justify-center gap-3 text-sm">
            <span className="px-3 py-1.5 bg-white/10 rounded-full text-slate-300">
              <svg className="w-4 h-4 inline mr-1.5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              No signup required
            </span>
            <span className="px-3 py-1.5 bg-white/10 rounded-full text-slate-300">
              <svg className="w-4 h-4 inline mr-1.5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              100% free
            </span>
            <span className="px-3 py-1.5 bg-white/10 rounded-full text-slate-300">
              <svg className="w-4 h-4 inline mr-1.5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Instant results
            </span>
          </div>
        </header>

        {/* Tools Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Loss Income Simulator Card */}
          <Link
            href={`/${locale}/tools/loss-income-simulator`}
            className="group relative bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 p-8 hover:border-orange-500/50 transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:shadow-orange-500/10"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-red-500/10 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="relative">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center mb-6 shadow-lg shadow-orange-500/30">
                <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
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
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center mb-6 shadow-lg shadow-emerald-500/30">
                <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
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

          {/* Monthly Goal Simulator Card */}
          <Link
            href={`/${locale}/tools/monthly-goal-simulator`}
            className="group relative bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 p-8 hover:border-purple-500/50 transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:shadow-purple-500/10"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-violet-500/10 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="relative">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-violet-500 flex items-center justify-center mb-6 shadow-lg shadow-purple-500/30">
                <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-white mb-3 group-hover:text-purple-400 transition-colors">
                Monthly Goal Simulator
              </h2>
              <p className="text-slate-400 mb-6">
                Set your income goal and discover how many hours, days, and trips you need to reach it.
              </p>
              <div className="flex items-center text-purple-400 font-semibold">
                Try Now
                <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </div>
            </div>
          </Link>

          {/* Hidden Costs Calculator Card */}
          <Link
            href={`/${locale}/tools/hidden-costs-calculator`}
            className="group relative bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 p-8 hover:border-rose-500/50 transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:shadow-rose-500/10"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-rose-500/10 to-pink-500/10 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="relative">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-rose-500 to-pink-500 flex items-center justify-center mb-6 shadow-lg shadow-rose-500/30">
                <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-white mb-3 group-hover:text-rose-400 transition-colors">
                Hidden Costs Calculator
              </h2>
              <p className="text-slate-400 mb-6">
                Discover hidden costs like depreciation, maintenance, and wear that you might be overlooking.
              </p>
              <div className="flex items-center text-rose-400 font-semibold">
                Try Now
                <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </div>
            </div>
          </Link>

          {/* Cost per Trip Calculator Card */}
          <Link
            href={`/${locale}/tools/cost-per-trip-calculator`}
            className="group relative bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 p-8 hover:border-cyan-500/50 transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:shadow-cyan-500/10"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-teal-500/10 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="relative">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500 to-teal-500 flex items-center justify-center mb-6 shadow-lg shadow-cyan-500/30">
                <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-white mb-3 group-hover:text-cyan-400 transition-colors">
                Cost per Trip Calculator
              </h2>
              <p className="text-slate-400 mb-6">
                How much does each trip cost? Find out if it's worth accepting based on fuel, wear and fees.
              </p>
              <div className="flex items-center text-cyan-400 font-semibold">
                Try Now
                <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </div>
            </div>
          </Link>

          {/* Fuel Calculator Card */}
          <Link
            href={`/${locale}/tools/fuel-calculator`}
            className="group relative bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 p-8 hover:border-amber-500/50 transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:shadow-amber-500/10"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 to-orange-500/10 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="relative">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center mb-6 shadow-lg shadow-amber-500/30">
                <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-white mb-3 group-hover:text-amber-400 transition-colors">
                Fuel Calculator
              </h2>
              <p className="text-slate-400 mb-6">
                Compare gas vs ethanol and find out which fuel is more economical for you.
              </p>
              <div className="flex items-center text-amber-400 font-semibold">
                Try Now
                <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </div>
            </div>
          </Link>

          {/* Break-Even Calculator Card */}
          <Link
            href={`/${locale}/tools/break-even-calculator`}
            className="group relative bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 p-8 hover:border-blue-500/50 transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:shadow-blue-500/10"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-indigo-500/10 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="relative">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center mb-6 shadow-lg shadow-blue-500/30">
                <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-white mb-3 group-hover:text-blue-400 transition-colors">
                Break-Even Calculator
              </h2>
              <p className="text-slate-400 mb-6">
                How much revenue do you need to cover all costs? Find your break-even point.
              </p>
              <div className="flex items-center text-blue-400 font-semibold">
                Try Now
                <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </div>
            </div>
          </Link>

          {/* Driver Budget Simulator Card */}
          <Link
            href={`/${locale}/tools/driver-budget-simulator`}
            className="group relative bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 p-8 hover:border-violet-500/50 transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:shadow-violet-500/10"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-violet-500/10 to-purple-500/10 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="relative">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-500 flex items-center justify-center mb-6 shadow-lg shadow-violet-500/30">
                <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-white mb-3 group-hover:text-violet-400 transition-colors">
                Complete Budget Simulator
              </h2>
              <p className="text-slate-400 mb-6">
                Build your complete budget: fixed, variable and personal costs. Know how much you need to earn.
              </p>
              <div className="flex items-center text-violet-400 font-semibold">
                Try Now
                <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </div>
            </div>
          </Link>
        </div>

        {/* Tool Relationships Section */}
        <section className="mt-20">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
              Tools That Work Together
            </h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
              Use our tools together to get a complete picture of your financial situation as a rideshare or delivery driver.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Relationship 1 */}
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-white font-semibold mb-2">If you used the Daily Profit Calculator...</h3>
                  <p className="text-slate-400 text-sm mb-3">
                    You'll also love the Hidden Costs Calculator to discover expenses you might be forgetting.
                  </p>
                  <Link
                    href={`/${locale}/tools/hidden-costs-calculator`}
                    className="inline-flex items-center text-emerald-400 text-sm font-medium hover:text-emerald-300 transition-colors"
                  >
                    Try it now
                    <svg className="w-4 h-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>
              </div>
            </div>

            {/* Relationship 2 */}
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-violet-500 flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-white font-semibold mb-2">If you used the Monthly Goal Simulator...</h3>
                  <p className="text-slate-400 text-sm mb-3">
                    Complete your analysis with the Budget Simulator to know exactly how much you need to earn.
                  </p>
                  <Link
                    href={`/${locale}/tools/driver-budget-simulator`}
                    className="inline-flex items-center text-purple-400 text-sm font-medium hover:text-purple-300 transition-colors"
                  >
                    Try it now
                    <svg className="w-4 h-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>
              </div>
            </div>

            {/* Relationship 3 */}
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-white font-semibold mb-2">If you used the Cost per Trip Calculator...</h3>
                  <p className="text-slate-400 text-sm mb-3">
                    The Fuel Calculator will help you save even more on each trip.
                  </p>
                  <Link
                    href={`/${locale}/tools/fuel-calculator`}
                    className="inline-flex items-center text-cyan-400 text-sm font-medium hover:text-cyan-300 transition-colors"
                  >
                    Try it now
                    <svg className="w-4 h-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>
              </div>
            </div>

            {/* Relationship 4 */}
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-white font-semibold mb-2">If you used the Break-Even Calculator...</h3>
                  <p className="text-slate-400 text-sm mb-3">
                    The Loss Income Simulator shows how much you could lose if you stop working.
                  </p>
                  <Link
                    href={`/${locale}/tools/loss-income-simulator`}
                    className="inline-flex items-center text-blue-400 text-sm font-medium hover:text-blue-300 transition-colors"
                  >
                    Try it now
                    <svg className="w-4 h-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="mt-20">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
              Get answers to common questions about our tools and how they can help you.
            </p>
          </div>

          <div className="max-w-3xl mx-auto space-y-4">
            <details className="group bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 overflow-hidden">
              <summary className="flex items-center justify-between p-6 cursor-pointer list-none">
                <h3 className="text-white font-semibold pr-4">Are these tools really free?</h3>
                <svg className="w-5 h-5 text-slate-400 group-open:rotate-180 transition-transform flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <div className="px-6 pb-6 text-slate-300">
                Yes, all our calculators and tools are 100% free. No signup required, no personal data collected, and you can use them as many times as you want. Our mission is to help rideshare and delivery drivers have better clarity about their finances.
              </div>
            </details>

            <details className="group bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 overflow-hidden">
              <summary className="flex items-center justify-between p-6 cursor-pointer list-none">
                <h3 className="text-white font-semibold pr-4">Who are these tools for?</h3>
                <svg className="w-5 h-5 text-slate-400 group-open:rotate-180 transition-transform flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <div className="px-6 pb-6 text-slate-300">
                These tools were created for rideshare drivers (Uber, Lyft), delivery drivers (DoorDash, Instacart, Grubhub), freelancers, and any independent worker who wants to better understand their earnings and costs. If you work for yourself, these calculators are for you.
              </div>
            </details>

            <details className="group bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 overflow-hidden">
              <summary className="flex items-center justify-between p-6 cursor-pointer list-none">
                <h3 className="text-white font-semibold pr-4">How do I calculate my real profit as an Uber driver?</h3>
                <svg className="w-5 h-5 text-slate-400 group-open:rotate-180 transition-transform flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <div className="px-6 pb-6 text-slate-300">
                Use our <Link href={`/${locale}/tools/daily-profit-calculator`} className="text-emerald-400 hover:underline">Daily Real Profit Calculator</Link>. Enter your gross earnings, fuel costs, maintenance, and fees. The tool automatically calculates your real hourly profit, letting you know exactly how much you're making.
              </div>
            </details>

            <details className="group bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 overflow-hidden">
              <summary className="flex items-center justify-between p-6 cursor-pointer list-none">
                <h3 className="text-white font-semibold pr-4">What costs do rideshare drivers often forget?</h3>
                <svg className="w-5 h-5 text-slate-400 group-open:rotate-180 transition-transform flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <div className="px-6 pb-6 text-slate-300">
                The most forgotten costs are: vehicle depreciation (your car loses value with every mile), tire wear, oil changes, brake pads, car insurance, and health insurance. Use our <Link href={`/${locale}/tools/hidden-costs-calculator`} className="text-rose-400 hover:underline">Hidden Costs Calculator</Link> to discover all these invisible expenses.
              </div>
            </details>

            <details className="group bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 overflow-hidden">
              <summary className="flex items-center justify-between p-6 cursor-pointer list-none">
                <h3 className="text-white font-semibold pr-4">How do I know if a trip is worth accepting?</h3>
                <svg className="w-5 h-5 text-slate-400 group-open:rotate-180 transition-transform flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <div className="px-6 pb-6 text-slate-300">
                Use our <Link href={`/${locale}/tools/cost-per-trip-calculator`} className="text-cyan-400 hover:underline">Cost per Trip Calculator</Link>. Enter the distance, your fuel consumption, and the trip fare. The tool shows if the trip is profitable or if you'll lose money, helping you make smarter decisions.
              </div>
            </details>
          </div>
        </section>

        {/* Bottom CTA */}
        <section className="mt-20 text-center">
          <div className="bg-gradient-to-r from-teal-500/20 to-orange-500/20 backdrop-blur-sm rounded-3xl border border-white/10 p-8 md:p-12">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
              Start Using Now
            </h2>
            <p className="text-slate-300 mb-8 max-w-2xl mx-auto">
              Choose a tool and discover valuable insights about your earnings in less than 2 minutes. No signup, no hassle.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href={`/${locale}/tools/daily-profit-calculator`}
                className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-semibold rounded-xl hover:opacity-90 transition-opacity"
              >
                Calculate my real profit
              </Link>
              <Link
                href={`/${locale}/tools/hidden-costs-calculator`}
                className="px-6 py-3 bg-white/10 text-white font-semibold rounded-xl hover:bg-white/20 transition-colors"
              >
                Discover hidden costs
              </Link>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}

