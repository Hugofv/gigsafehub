import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Page Not Found - GigSafeHub',
  description: 'The page you are looking for could not be found. Explore our insurance products, guides, and comparisons for gig economy workers.',
  robots: {
    index: false,
    follow: true,
  },
};

export default function GlobalNotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 flex items-center justify-center px-4 py-16">
      <div className="max-w-2xl w-full text-center">
        {/* 404 Number */}
        <div className="relative mb-8">
          <h1 className="text-9xl md:text-[12rem] font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-brand-600 via-blue-600 to-teal-600 animate-pulse">
            404
          </h1>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-64 h-64 md:w-96 md:h-96 rounded-full bg-gradient-to-r from-brand-200/20 via-blue-200/20 to-teal-200/20 blur-3xl animate-pulse"></div>
          </div>
        </div>

        {/* Title and Description */}
        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
          Page Not Found
        </h2>
        <p className="text-xl md:text-2xl text-slate-600 mb-2">
          Oops! The page you're looking for doesn't exist.
        </p>
        <p className="text-base md:text-lg text-slate-500 mb-8">
          The page may have been moved, removed, or the link may be incorrect.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/pt-BR"
            className="px-8 py-4 bg-gradient-to-r from-brand-600 to-blue-600 text-white font-semibold rounded-xl hover:from-brand-700 hover:to-blue-700 transition-all shadow-lg shadow-brand-500/30 hover:shadow-xl hover:shadow-brand-500/40 transform hover:scale-105 duration-200"
          >
            Go to Home (PT-BR)
          </Link>
          <Link
            href="/en-US"
            className="px-8 py-4 bg-white text-slate-700 font-semibold rounded-xl border-2 border-slate-300 hover:border-brand-400 hover:text-brand-600 hover:bg-brand-50 transition-all shadow-md hover:shadow-lg transform hover:scale-105 duration-200"
          >
            Go to Home (EN-US)
          </Link>
        </div>
      </div>
    </div>
  );
}

