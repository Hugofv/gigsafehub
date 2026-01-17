'use client';

import React, { useState, useMemo } from 'react';
import { FAQItem } from './faqData';

interface FAQClientProps {
  faqs: FAQItem[];
  locale: string;
}

export default function FAQClient({ faqs, locale }: FAQClientProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Get unique categories from FAQs
  const categories = useMemo(() => {
    const cats = faqs
      .map(faq => faq.category)
      .filter((cat): cat is string => !!cat);
    return ['all', ...Array.from(new Set(cats))];
  }, [faqs]);

  // Filter FAQs based on search query and category
  const filteredFAQs = useMemo(() => {
    return faqs.filter(faq => {
      const matchesSearch =
        !searchQuery ||
        faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory =
        selectedCategory === 'all' ||
        faq.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [faqs, searchQuery, selectedCategory]);

  const isPtBr = locale === 'pt-BR';

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-4">
            {isPtBr ? 'Perguntas Frequentes' : 'Frequently Asked Questions'}
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            {isPtBr
              ? 'Encontre respostas para as dúvidas mais comuns sobre seguros para trabalhadores da gig economy'
              : 'Find answers to the most common questions about insurance for gig economy workers'}
          </p>
        </div>

        {/* Search and Filter */}
        <div className="mb-8 space-y-4">
          {/* Search Bar */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <svg
                className="h-5 w-5 text-slate-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={isPtBr ? 'Buscar perguntas...' : 'Search questions...'}
              className="w-full pl-12 pr-4 py-3 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent text-slate-900 placeholder-slate-400"
            />
          </div>

          {/* Category Filter */}
          {categories.length > 1 && (
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => {
                    setSelectedCategory(category);
                    setOpenIndex(null);
                  }}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    selectedCategory === category
                      ? 'bg-brand-600 text-white'
                      : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-300'
                  }`}
                >
                  {category === 'all'
                    ? isPtBr
                      ? 'Todas'
                      : 'All'
                    : category}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Results Count */}
        {filteredFAQs.length > 0 && (
          <div className="mb-6 text-slate-600">
            {isPtBr ? (
              <>Encontradas <strong>{filteredFAQs.length}</strong> {filteredFAQs.length === 1 ? 'pergunta' : 'perguntas'}</>
            ) : (
              <>Found <strong>{filteredFAQs.length}</strong> {filteredFAQs.length === 1 ? 'question' : 'questions'}</>
            )}
          </div>
        )}

        {/* FAQ List */}
        {filteredFAQs.length > 0 ? (
          <div className="space-y-4">
            {filteredFAQs.map((faq, index) => (
              <div
                key={faq.id}
                className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-shadow"
              >
                <button
                  onClick={() => setOpenIndex(openIndex === index ? null : index)}
                  className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-slate-50 transition-colors"
                  aria-expanded={openIndex === index}
                >
                  <h3 className="font-semibold text-slate-900 text-lg pr-4">
                    {faq.question}
                  </h3>
                  <svg
                    className={`w-6 h-6 text-slate-400 flex-shrink-0 transition-transform ${
                      openIndex === index ? 'rotate-180' : ''
                    }`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>
                {openIndex === index && (
                  <div className="px-6 pb-5 text-slate-700 leading-relaxed border-t border-slate-100 pt-4">
                    <div className="prose prose-slate max-w-none">
                      {faq.answer.split('\n').map((paragraph, pIndex) => (
                        <p key={pIndex} className="mb-3 last:mb-0">
                          {paragraph}
                        </p>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-12 text-center">
            <svg
              className="mx-auto h-12 w-12 text-slate-400 mb-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">
              {isPtBr ? 'Nenhuma pergunta encontrada' : 'No questions found'}
            </h3>
            <p className="text-slate-600">
              {isPtBr
                ? 'Tente ajustar sua busca ou filtro para encontrar o que procura.'
                : 'Try adjusting your search or filter to find what you\'re looking for.'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
