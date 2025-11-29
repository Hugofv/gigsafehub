'use client';

import React, { useState } from 'react';
import Link from 'next/link';

const CalculatorWidget: React.FC = () => {
  const [profession, setProfession] = useState('');
  const [zip, setZip] = useState('');
  const [calculating, setCalculating] = useState(false);
  const [result, setResult] = useState<number | null>(null);

  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault();
    setCalculating(true);
    // Mock Calculation
    setTimeout(() => {
      setResult(29 + Math.floor(Math.random() * 20)); // Random price $29-$49
      setCalculating(false);
    }, 1500);
  };

  return (
    <div className="bg-brand-900 rounded-xl p-6 text-white shadow-xl">
      <h3 className="text-xl font-bold mb-2">Gig Insurance Cost Calculator</h3>
      <p className="text-brand-200 text-sm mb-6">Get a rough estimate for your General Liability policy in seconds.</p>

      {!result ? (
        <form onSubmit={handleCalculate} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-brand-300 mb-1">Profession</label>
            <select
              required
              value={profession}
              onChange={(e) => setProfession(e.target.value)}
              className="w-full bg-brand-800 border border-brand-700 rounded-lg p-2.5 text-white focus:ring-2 focus:ring-brand-500 outline-none"
            >
              <option value="">Select Profession...</option>
              <option value="consultant">Consultant</option>
              <option value="handyman">Handyman</option>
              <option value="driver">Rideshare Driver</option>
              <option value="photographer">Photographer</option>
              <option value="developer">Web Developer</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-brand-300 mb-1">Zip Code</label>
            <input
              required
              type="text"
              pattern="[0-9]{5}"
              value={zip}
              onChange={(e) => setZip(e.target.value)}
              placeholder="e.g. 90210"
              className="w-full bg-brand-800 border border-brand-700 rounded-lg p-2.5 text-white focus:ring-2 focus:ring-brand-500 outline-none"
            />
          </div>
          <button
            type="submit"
            disabled={calculating}
            className="w-full bg-brand-500 hover:bg-brand-400 text-white font-bold py-3 rounded-lg transition-colors shadow-lg shadow-brand-500/30 disabled:opacity-75 disabled:cursor-not-allowed mt-2"
          >
            {calculating ? 'Calculating...' : 'Calculate Quote'}
          </button>
        </form>
      ) : (
        <div className="text-center py-4 animate-fade-in">
          <p className="text-brand-300 text-sm">Estimated Monthly Cost</p>
          <div className="text-5xl font-extrabold text-white my-3">${result}</div>
          <p className="text-xs text-brand-400 mb-6">For $1M General Liability</p>
          <button
            onClick={() => setResult(null)}
            className="text-sm text-brand-300 hover:text-white underline"
          >
            Start Over
          </button>
          <div className="mt-6 pt-6 border-t border-brand-800">
             <Link href="/compare" className="block w-full py-2 bg-white text-brand-900 font-bold rounded hover:bg-brand-50 transition">
                Compare Providers
             </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default CalculatorWidget;

