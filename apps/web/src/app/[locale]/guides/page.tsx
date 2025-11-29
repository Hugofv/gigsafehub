import React from 'react';

async function Guides({ params }: { params: { locale: string } }) {
  // This will fetch guides from API
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

  // For now, return a placeholder
  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-slate-900 mb-4">
            {params.locale === 'pt-BR' ? 'Guias' : 'Guides'}
          </h1>
          <p className="text-xl text-slate-500 max-w-2xl mx-auto">
            {params.locale === 'pt-BR'
              ? 'Guias completos sobre seguros para trabalhadores da economia gig'
              : 'Complete guides on insurance for gig economy workers'}
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Guides will be loaded here */}
        </div>
      </div>
    </div>
  );
}

export default Guides;

