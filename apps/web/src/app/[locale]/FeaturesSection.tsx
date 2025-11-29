'use client';

import React from 'react';

const FeaturesSection: React.FC = () => {
  const features = [
    {
      icon: '🔍',
      title: 'Unbiased Reviews',
      description: 'In-depth analysis of financial products with real user data and expert insights',
    },
    {
      icon: '📊',
      title: 'Smart Comparisons',
      description: 'Side-by-side comparisons to help you find the best product for your needs',
    },
    {
      icon: '🛡️',
      title: 'Safety Scores',
      description: 'Our proprietary scoring system evaluates product safety and reliability',
    },
    {
      icon: '💰',
      title: 'Price Transparency',
      description: 'Clear fee structures and pricing information with no hidden costs',
    },
    {
      icon: '📚',
      title: 'Expert Guides',
      description: 'Comprehensive guides written by financial experts for gig workers',
    },
    {
      icon: '⚡',
      title: 'Quick Quotes',
      description: 'Get instant insurance quotes tailored to your profession and location',
    },
  ];

  return (
    <div className="bg-white py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
            Everything You Need to{' '}
            <span className="bg-gradient-to-r from-brand-600 to-blue-600 bg-clip-text text-transparent">
              Protect Your Gig
            </span>
          </h2>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Comprehensive tools and insights to help freelancers make informed financial decisions
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, idx) => (
            <div
              key={idx}
              className="group p-8 rounded-2xl bg-gradient-to-br from-white to-slate-50 border border-slate-200 hover:border-brand-300 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
            >
              <div className="text-4xl mb-4 transform group-hover:scale-110 transition-transform">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">{feature.title}</h3>
              <p className="text-slate-600 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FeaturesSection;

