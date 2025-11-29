import React from 'react';
import CalculatorWidget from '@/components/CalculatorWidget';

export default function Calculator() {
  return (
    <div className="min-h-screen bg-slate-50 py-16 flex items-center justify-center">
      <div className="max-w-md w-full px-4">
        <div className="text-center mb-8">
            <h1 className="text-3xl font-extrabold text-slate-900">Free Quote Estimate</h1>
            <p className="text-slate-500 mt-2">Find out how little it costs to protect your gig business.</p>
        </div>
        <CalculatorWidget />
        <div className="mt-8 text-center text-sm text-slate-400">
            *Estimates are based on national averages and are not binding offers.
        </div>
      </div>
    </div>
  );
}

