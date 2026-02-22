'use client';

import React from 'react';
import { ArrowLeft, ArrowRight, Loader2, Search } from 'lucide-react';
import { getTranslations } from './translations';

interface ComparatorNavigationProps {
  currentStep: number;
  totalSteps: number;
  locale: string;
  onBack: () => void;
  onNext: () => void;
  isLastStep: boolean;
  isSubmitting: boolean;
}

export default function ComparatorNavigation({
  currentStep,
  totalSteps,
  locale,
  onBack,
  onNext,
  isLastStep,
  isSubmitting,
}: ComparatorNavigationProps) {
  const t = getTranslations(locale);

  return (
    <div className="sticky bottom-0 bg-white/95 backdrop-blur-sm border-t border-slate-200 px-4 py-3 -mx-4 sm:-mx-6 mt-6">
      <div className="flex items-center justify-between max-w-2xl mx-auto">
        <button
          type="button"
          onClick={onBack}
          disabled={currentStep === 0}
          className="flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-slate-600
            hover:text-slate-900 disabled:opacity-0 disabled:pointer-events-none transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          {t.nav.back}
        </button>

        {isLastStep ? (
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex items-center gap-2 px-8 py-2.5 bg-orange-500 text-white rounded-lg
              font-medium hover:bg-orange-600 disabled:opacity-60 disabled:cursor-not-allowed
              transition-colors shadow-sm"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                {t.step6.submitting}
              </>
            ) : (
              <>
                <Search className="w-4 h-4" />
                {t.step6.submit}
              </>
            )}
          </button>
        ) : (
          <button
            type="button"
            onClick={onNext}
            className="flex items-center gap-2 px-6 py-2.5 bg-navy-500 text-white rounded-lg
              font-medium hover:bg-navy-600 transition-colors shadow-sm"
          >
            {t.nav.next}
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}
