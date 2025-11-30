import React from 'react';

async function FAQ({ params }: { params: Promise<{ locale: string }> }) {
  // This will fetch FAQs from API
  const { locale } = await params;

  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-slate-900 mb-4">
            {locale === 'pt-BR' ? 'Perguntas Frequentes' : 'Frequently Asked Questions'}
          </h1>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
          {/* FAQs will be loaded here */}
          <p className="text-slate-500 text-center">
            {locale === 'pt-BR' ? 'Carregando perguntas frequentes...' : 'Loading FAQs...'}
          </p>
        </div>
      </div>
    </div>
  );
}

export default FAQ;

