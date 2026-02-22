'use client';

import React from 'react';

export default function QuoteCardSkeleton() {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 animate-pulse">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-12 h-12 bg-slate-200 rounded-lg" />
        <div className="flex-1">
          <div className="h-4 w-32 bg-slate-200 rounded mb-2" />
          <div className="h-3 w-20 bg-slate-200 rounded" />
        </div>
      </div>
      <div className="h-8 w-24 bg-slate-200 rounded mb-3" />
      <div className="space-y-2">
        <div className="h-3 w-full bg-slate-200 rounded" />
        <div className="h-3 w-3/4 bg-slate-200 rounded" />
        <div className="h-3 w-1/2 bg-slate-200 rounded" />
      </div>
      <div className="mt-4 h-10 bg-slate-200 rounded-lg" />
    </div>
  );
}
