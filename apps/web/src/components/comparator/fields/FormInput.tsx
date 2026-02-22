'use client';

import React from 'react';
import { UseFormRegisterReturn } from 'react-hook-form';
import { Lock } from 'lucide-react';

interface FormInputProps {
  label: string;
  registration: UseFormRegisterReturn;
  error?: string;
  type?: string;
  placeholder?: string;
  prefix?: string;
  sensitive?: boolean;
  required?: boolean;
  inputMode?: 'text' | 'numeric' | 'decimal' | 'tel' | 'email';
  maxLength?: number;
  disabled?: boolean;
  className?: string;
}

export default function FormInput({
  label,
  registration,
  error,
  type = 'text',
  placeholder,
  prefix,
  sensitive,
  required,
  inputMode,
  maxLength,
  disabled,
  className = '',
}: FormInputProps) {
  return (
    <div className={className}>
      <label className="block text-sm font-medium text-slate-700 mb-1.5">
        {label}
        {required && <span className="text-red-500 ml-0.5">*</span>}
        {sensitive && <Lock className="inline w-3.5 h-3.5 ml-1.5 text-slate-400" />}
      </label>
      <div className="relative">
        {prefix && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-sm pointer-events-none">
            {prefix}
          </span>
        )}
        <input
          type={type}
          inputMode={inputMode}
          maxLength={maxLength}
          disabled={disabled}
          placeholder={placeholder}
          {...registration}
          className={`w-full px-4 py-2.5 border rounded-lg text-slate-900 placeholder:text-slate-400
            focus:ring-2 focus:ring-navy-500 focus:border-transparent transition-colors
            disabled:bg-slate-50 disabled:text-slate-500
            ${prefix ? 'pl-8' : ''}
            ${error ? 'border-red-300 focus:ring-red-500' : 'border-slate-300'}`}
        />
      </div>
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
}
