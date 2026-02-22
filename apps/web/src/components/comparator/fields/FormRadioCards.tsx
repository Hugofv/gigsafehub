'use client';

import React from 'react';

interface RadioOption {
  value: string;
  label: string;
  icon?: React.ReactNode;
  description?: string;
}

interface FormRadioCardsProps {
  label: string;
  options: RadioOption[];
  value: string;
  onChange: (value: string) => void;
  error?: string;
  required?: boolean;
  columns?: 2 | 3 | 4;
  className?: string;
}

export default function FormRadioCards({
  label,
  options,
  value,
  onChange,
  error,
  required,
  columns = 3,
  className = '',
}: FormRadioCardsProps) {
  const gridCols = {
    2: 'grid-cols-2',
    3: 'grid-cols-2 sm:grid-cols-3',
    4: 'grid-cols-2 sm:grid-cols-4',
  };

  return (
    <div className={className}>
      <label className="block text-sm font-medium text-slate-700 mb-2">
        {label}
        {required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      <div className={`grid ${gridCols[columns]} gap-3`}>
        {options.map((opt) => (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all
              ${
                value === opt.value
                  ? 'border-navy-500 bg-navy-50 ring-2 ring-navy-500/20'
                  : 'border-slate-200 hover:border-slate-300 bg-white'
              }`}
          >
            {opt.icon && <div className="mb-2 text-2xl">{opt.icon}</div>}
            <span className={`text-sm font-medium ${value === opt.value ? 'text-navy-700' : 'text-slate-700'}`}>
              {opt.label}
            </span>
            {opt.description && (
              <span className="text-xs text-slate-500 mt-0.5 text-center">{opt.description}</span>
            )}
          </button>
        ))}
      </div>
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
}
