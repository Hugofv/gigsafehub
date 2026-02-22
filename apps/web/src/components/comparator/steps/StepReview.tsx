'use client';

import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { ChevronDown, ChevronUp, Shield, Lock } from 'lucide-react';
import { ComparatorFormData } from '../types';
import { getTranslations } from '../translations';

interface StepReviewProps {
  form: UseFormReturn<ComparatorFormData>;
  locale: string;
  onGoToStep: (step: number) => void;
  isSubmitting: boolean;
}

function ReviewSection({
  title,
  stepIndex,
  onEdit,
  editLabel,
  children,
}: {
  title: string;
  stepIndex: number;
  onEdit: (step: number) => void;
  editLabel: string;
  children: React.ReactNode;
}) {
  const [open, setOpen] = React.useState(true);

  return (
    <div className="border border-slate-200 rounded-xl overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-5 py-3 bg-slate-50 hover:bg-slate-100 transition-colors"
      >
        <span className="font-medium text-slate-800">{title}</span>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); onEdit(stepIndex); }}
            className="text-sm text-navy-500 hover:text-navy-700 font-medium"
          >
            {editLabel}
          </button>
          {open ? <ChevronUp className="w-4 h-4 text-slate-500" /> : <ChevronDown className="w-4 h-4 text-slate-500" />}
        </div>
      </button>
      {open && <div className="px-5 py-4 space-y-2 text-sm text-slate-600">{children}</div>}
    </div>
  );
}

function Field({ label, value }: { label: string; value: string | boolean | number | undefined }) {
  if (value === undefined || value === '') return null;
  const display = typeof value === 'boolean' ? (value ? '✓' : '✗') : String(value);
  return (
    <div className="flex justify-between">
      <span className="text-slate-500">{label}</span>
      <span className="text-slate-900 font-medium">{display}</span>
    </div>
  );
}

export default function StepReview({ form, locale, onGoToStep, isSubmitting }: StepReviewProps) {
  const t = getTranslations(locale);
  const { watch, setValue, formState: { errors } } = form;
  const data = watch();

  return (
    <div className="space-y-5">
      <h2 className="text-2xl font-bold text-slate-900 text-center">{t.step6.title}</h2>

      <ReviewSection title={t.steps.getStarted} stepIndex={0} onEdit={onGoToStep} editLabel={t.step6.edit}>
        <Field label={locale === 'pt-BR' ? 'País' : 'Country'} value={data.country} />
        <Field label={locale === 'pt-BR' ? 'Tipo' : 'Gig Type'} value={data.gigType} />
        <Field label={locale === 'pt-BR' ? 'Plataformas' : 'Platforms'} value={data.platforms.join(', ')} />
      </ReviewSection>

      <ReviewSection title={t.steps.personalInfo} stepIndex={1} onEdit={onGoToStep} editLabel={t.step6.edit}>
        <Field label={locale === 'pt-BR' ? 'Nome' : 'Name'} value={`${data.firstName} ${data.lastName}`} />
        <Field label="Email" value={data.email} />
        <Field label={locale === 'pt-BR' ? 'Telefone' : 'Phone'} value={data.phone} />
        <Field label={locale === 'pt-BR' ? 'CEP' : 'ZIP'} value={data.zipCode} />
      </ReviewSection>

      <ReviewSection title={t.steps.vehicle} stepIndex={2} onEdit={onGoToStep} editLabel={t.step6.edit}>
        {data.vehicles.map((v, i) => (
          <div key={i}>
            <Field
              label={`${t.step3.vehicleNum} ${i + 1}`}
              value={`${v.year} ${v.make} ${v.model}${v.trim ? ` ${v.trim}` : ''}`}
            />
            <Field label={locale === 'pt-BR' ? 'Uso' : 'Use'} value={v.primaryUse} />
          </div>
        ))}
      </ReviewSection>

      <ReviewSection title={t.steps.drivingProfile} stepIndex={3} onEdit={onGoToStep} editLabel={t.step6.edit}>
        <Field label={t.step4.yearsLicensed} value={data.yearsLicensed} />
        <Field label={t.step4.accidents} value={data.accidentsLast5Years} />
        <Field label={t.step4.violations} value={data.violationsLast5Years} />
        <Field label={t.step4.hoursPerWeek} value={data.hoursPerWeek} />
      </ReviewSection>

      <ReviewSection title={t.steps.coverage} stepIndex={4} onEdit={onGoToStep} editLabel={t.step6.edit}>
        <Field label={t.step5.currentInsured} value={data.currentInsured} />
        {data.currentInsured && <Field label={t.step5.currentProvider} value={data.currentProvider} />}
        <Field label={t.step5.liabilityLimit} value={data.liabilityLimit} />
        <Field label={t.step5.deductible} value={data.deductiblePreference} />
        <Field label={t.step5.fullCoverage} value={data.wantsFullCoverage} />
      </ReviewSection>

      <div className="space-y-3 pt-2">
        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={data.termsAccepted}
            onChange={(e) => setValue('termsAccepted', e.target.checked, { shouldValidate: true })}
            className="mt-0.5 w-4 h-4 rounded border-slate-300 text-navy-600 focus:ring-navy-500"
          />
          <span className="text-sm text-slate-700">{t.step6.termsAccepted}</span>
        </label>
        {errors.termsAccepted && <p className="text-sm text-red-600 ml-7">{t.validation.acceptTerms}</p>}

        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={data.privacyAccepted}
            onChange={(e) => setValue('privacyAccepted', e.target.checked, { shouldValidate: true })}
            className="mt-0.5 w-4 h-4 rounded border-slate-300 text-navy-600 focus:ring-navy-500"
          />
          <span className="text-sm text-slate-700">{t.step6.privacyAccepted}</span>
        </label>
        {errors.privacyAccepted && <p className="text-sm text-red-600 ml-7">{t.validation.acceptPrivacy}</p>}

        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={data.marketingOptIn}
            onChange={(e) => setValue('marketingOptIn', e.target.checked)}
            className="mt-0.5 w-4 h-4 rounded border-slate-300 text-navy-600 focus:ring-navy-500"
          />
          <span className="text-sm text-slate-700">{t.step6.marketingOptIn}</span>
        </label>
      </div>

      <div className="flex items-center justify-center gap-2 text-xs text-slate-500 pt-2">
        <Lock className="w-3.5 h-3.5" />
        <span>{t.step6.encrypted}</span>
        <Shield className="w-3.5 h-3.5" />
      </div>
    </div>
  );
}
