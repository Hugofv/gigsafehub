'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Search, X, ChevronDown, PenLine } from 'lucide-react';

interface FormAutocompleteProps {
  label: string;
  options: string[];
  value: string;
  onChange: (value: string) => void;
  error?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  allowCustom?: boolean;
  customLabel?: string;
  className?: string;
}

export default function FormAutocomplete({
  label,
  options,
  value,
  onChange,
  error,
  placeholder,
  required,
  disabled,
  allowCustom = true,
  customLabel = 'Other...',
  className = '',
}: FormAutocompleteProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [isCustomMode, setIsCustomMode] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const isCustomValue = value !== '' && !options.includes(value);

  useEffect(() => {
    if (isCustomValue && value) {
      setIsCustomMode(true);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const filtered = query
    ? options.filter((o) => o.toLowerCase().includes(query.toLowerCase()))
    : options;

  const handleSelect = useCallback((val: string) => {
    onChange(val);
    setQuery('');
    setOpen(false);
    setIsCustomMode(false);
  }, [onChange]);

  const handleCustomMode = useCallback(() => {
    setIsCustomMode(true);
    setOpen(false);
    setQuery('');
    onChange('');
    setTimeout(() => inputRef.current?.focus(), 50);
  }, [onChange]);

  const handleCustomChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  const exitCustomMode = () => {
    setIsCustomMode(false);
    onChange('');
  };

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
        setQuery('');
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (isCustomMode) {
    return (
      <div className={className}>
        <label className="block text-sm font-medium text-slate-700 mb-1.5">
          {label}
          {required && <span className="text-red-500 ml-0.5">*</span>}
        </label>
        <div className="relative">
          <div className="flex gap-1.5">
            <div className="relative flex-1">
              <PenLine className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
              <input
                ref={inputRef}
                type="text"
                value={value}
                onChange={handleCustomChange}
                placeholder={placeholder}
                disabled={disabled}
                className={`w-full pl-9 pr-4 py-2.5 border rounded-lg text-slate-900 placeholder:text-slate-400
                  focus:ring-2 focus:ring-navy-500 focus:border-transparent transition-colors
                  ${error ? 'border-red-300' : 'border-slate-300'}`}
              />
            </div>
            <button
              type="button"
              onClick={exitCustomMode}
              className="px-3 py-2.5 border border-slate-300 rounded-lg text-slate-500 hover:bg-slate-50
                hover:text-slate-700 transition-colors shrink-0"
              title="Back to list"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <p className="mt-1 text-xs text-slate-400">
            {customLabel}
          </p>
        </div>
        {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
      </div>
    );
  }

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <label className="block text-sm font-medium text-slate-700 mb-1.5">
        {label}
        {required && <span className="text-red-500 ml-0.5">*</span>}
      </label>

      <button
        type="button"
        disabled={disabled}
        onClick={() => setOpen(!open)}
        className={`w-full flex items-center justify-between px-4 py-2.5 border rounded-lg text-left
          bg-white transition-colors disabled:bg-slate-50 disabled:text-slate-500
          ${error ? 'border-red-300' : open ? 'border-navy-500 ring-2 ring-navy-500/20' : 'border-slate-300'}
          ${!value ? 'text-slate-400' : 'text-slate-900'}`}
      >
        <span className="truncate">{value || placeholder || 'Select...'}</span>
        <ChevronDown className={`w-4 h-4 text-slate-400 shrink-0 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="absolute z-50 mt-1 w-full bg-white border border-slate-200 rounded-lg shadow-lg max-h-64 overflow-hidden">
          <div className="p-2 border-b border-slate-100 sticky top-0 bg-white">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={placeholder || 'Search...'}
                className="w-full pl-8 pr-3 py-2 text-sm border border-slate-200 rounded-md
                  focus:ring-1 focus:ring-navy-500 focus:border-navy-500 outline-none"
                autoFocus
              />
            </div>
          </div>
          <div className="overflow-y-auto max-h-48">
            {filtered.length === 0 && !allowCustom && (
              <div className="px-3 py-2 text-sm text-slate-500">No results found</div>
            )}
            {filtered.map((opt) => (
              <button
                key={opt}
                type="button"
                onClick={() => handleSelect(opt)}
                className={`w-full text-left px-3 py-2 text-sm hover:bg-navy-50 transition-colors
                  ${opt === value ? 'bg-navy-50 text-navy-700 font-medium' : 'text-slate-700'}`}
              >
                {opt}
              </button>
            ))}
            {allowCustom && (
              <button
                type="button"
                onClick={handleCustomMode}
                className="w-full text-left px-3 py-2 text-sm text-navy-600 font-medium
                  hover:bg-navy-50 transition-colors border-t border-slate-100 flex items-center gap-2"
              >
                <PenLine className="w-3.5 h-3.5" />
                {customLabel}
              </button>
            )}
          </div>
        </div>
      )}

      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
}
