'use client';

import React from 'react';
import { UseFormRegisterReturn } from 'react-hook-form';

interface FormSelectProps {
  label: string;
  registration: UseFormRegisterReturn;
  options: { value: string; label: string }[];
  error?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
}

export default function FormSelect({
  label,
  registration,
  options,
  error,
  placeholder,
  required,
  disabled,
  className = '',
}: FormSelectProps) {
  return (
    <div className={className}>
      <label className="block text-sm font-medium text-slate-700 mb-1.5">
        {label}
        {required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      <select
        disabled={disabled}
        {...registration}
        className={`w-full px-4 py-2.5 border rounded-lg text-slate-900 bg-white
          focus:ring-2 focus:ring-navy-500 focus:border-transparent transition-colors
          disabled:bg-slate-50 disabled:text-slate-500
          ${error ? 'border-red-300 focus:ring-red-500' : 'border-slate-300'}`}
      >
        {placeholder && (
          <option value="">{placeholder}</option>
        )}
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
}
