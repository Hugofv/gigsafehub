'use client';

import React from 'react';
import { Check } from 'lucide-react';
import { STEPS, StepId } from './types';
import { getTranslations } from './translations';

interface ComparatorProgressProps {
  currentStep: number;
  locale: string;
}

export default function ComparatorProgress({ currentStep, locale }: ComparatorProgressProps) {
  const t = getTranslations(locale);

  return (
    <div className="w-full">
      {/* Mobile: simple bar */}
      <div className="sm:hidden">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-slate-700">
            {t.steps[STEPS[currentStep] as StepId]}
          </span>
          <span className="text-sm text-slate-500">
            {currentStep + 1} / {STEPS.length}
          </span>
        </div>
        <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-navy-500 rounded-full transition-all duration-500"
            style={{ width: `${((currentStep + 1) / STEPS.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Desktop: step labels */}
      <div className="hidden sm:flex items-center justify-between">
        {STEPS.map((step, idx) => {
          const isCompleted = idx < currentStep;
          const isCurrent = idx === currentStep;

          return (
            <React.Fragment key={step}>
              <div className="flex flex-col items-center gap-1.5">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all
                    ${isCompleted ? 'bg-navy-500 text-white' : ''}
                    ${isCurrent ? 'bg-navy-500 text-white ring-4 ring-navy-100' : ''}
                    ${!isCompleted && !isCurrent ? 'bg-slate-200 text-slate-500' : ''}`}
                >
                  {isCompleted ? <Check className="w-4 h-4" /> : idx + 1}
                </div>
                <span
                  className={`text-xs font-medium whitespace-nowrap
                    ${isCurrent ? 'text-navy-700' : 'text-slate-500'}`}
                >
                  {t.steps[step as StepId]}
                </span>
              </div>
              {idx < STEPS.length - 1 && (
                <div className={`flex-1 h-0.5 mx-2 ${idx < currentStep ? 'bg-navy-500' : 'bg-slate-200'}`} />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}
