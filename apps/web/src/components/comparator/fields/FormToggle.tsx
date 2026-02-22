'use client';

import React from 'react';

interface FormToggleProps {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  description?: string;
  error?: string;
  disabled?: boolean;
  className?: string;
}

export default function FormToggle({
  label,
  checked,
  onChange,
  description,
  error,
  disabled,
  className = '',
}: FormToggleProps) {
  return (
    <div className={className}>
      <button
        type="button"
        disabled={disabled}
        onClick={() => onChange(!checked)}
        className="flex items-center justify-between w-full group"
      >
        <div className="text-left">
          <span className="text-sm font-medium text-slate-700 group-hover:text-slate-900">{label}</span>
          {description && <p className="text-xs text-slate-500 mt-0.5">{description}</p>}
        </div>
        <div
          className={`relative inline-flex h-6 w-11 shrink-0 rounded-full transition-colors duration-200
            ${checked ? 'bg-navy-500' : 'bg-slate-300'}
            ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
        >
          <span
            className={`inline-block h-5 w-5 rounded-full bg-white shadow-sm transform transition-transform duration-200 mt-0.5
              ${checked ? 'translate-x-5 ml-0.5' : 'translate-x-0.5'}`}
          />
        </div>
      </button>
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
}
