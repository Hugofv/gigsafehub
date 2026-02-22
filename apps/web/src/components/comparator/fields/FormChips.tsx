'use client';

import React from 'react';
import { Check } from 'lucide-react';

interface ChipOption {
  value: string;
  label: string;
  icon?: React.ReactNode;
}

interface FormChipsProps {
  label: string;
  options: ChipOption[];
  selected: string[];
  onChange: (selected: string[]) => void;
  error?: string;
  required?: boolean;
  className?: string;
}

export default function FormChips({
  label,
  options,
  selected,
  onChange,
  error,
  required,
  className = '',
}: FormChipsProps) {
  const toggle = (value: string) => {
    if (selected.includes(value)) {
      onChange(selected.filter((v) => v !== value));
    } else {
      onChange([...selected, value]);
    }
  };

  return (
    <div className={className}>
      <label className="block text-sm font-medium text-slate-700 mb-2">
        {label}
        {required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      <div className="flex flex-wrap gap-2">
        {options.map((opt) => {
          const isSelected = selected.includes(opt.value);
          return (
            <button
              key={opt.value}
              type="button"
              onClick={() => toggle(opt.value)}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium
                border transition-all
                ${
                  isSelected
                    ? 'border-navy-500 bg-navy-50 text-navy-700'
                    : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                }`}
            >
              {isSelected && <Check className="w-3.5 h-3.5" />}
              {opt.icon && <span>{opt.icon}</span>}
              {opt.label}
            </button>
          );
        })}
      </div>
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
}
