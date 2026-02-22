'use client';

import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import FormInput from '../fields/FormInput';
import FormSelect from '../fields/FormSelect';
import FormToggle from '../fields/FormToggle';
import { ComparatorFormData } from '../types';
import { LIABILITY_OPTIONS, DEDUCTIBLE_OPTIONS } from '../constants';
import { getTranslations } from '../translations';

interface StepCoverageProps {
  form: UseFormReturn<ComparatorFormData>;
  locale: string;
}

export default function StepCoverage({ form, locale }: StepCoverageProps) {
  const t = getTranslations(locale);
  const { register, watch, setValue, formState: { errors } } = form;
  const country = watch('country');
  const currentInsured = watch('currentInsured');

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-slate-900 text-center">{t.step5.title}</h2>

      <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-5">
        <FormToggle
          label={t.step5.currentInsured}
          checked={currentInsured}
          onChange={(val) => setValue('currentInsured', val)}
        />

        {currentInsured && (
          <FormInput
            label={t.step5.currentProvider}
            registration={register('currentProvider')}
            placeholder={country === 'BR' ? 'Ex: Porto Seguro' : 'Ex: State Farm'}
          />
        )}

        <FormSelect
          label={t.step5.liabilityLimit}
          registration={register('liabilityLimit')}
          options={LIABILITY_OPTIONS[country] || LIABILITY_OPTIONS.US}
          error={errors.liabilityLimit?.message}
          placeholder="--"
          required
        />

        <FormSelect
          label={t.step5.deductible}
          registration={register('deductiblePreference')}
          options={DEDUCTIBLE_OPTIONS[country] || DEDUCTIBLE_OPTIONS.US}
          error={errors.deductiblePreference?.message}
          placeholder="--"
          required
        />

        <FormToggle
          label={t.step5.fullCoverage}
          description={t.step5.fullCoverageDesc}
          checked={watch('wantsFullCoverage')}
          onChange={(val) => setValue('wantsFullCoverage', val)}
        />
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-5">
        <h3 className="font-semibold text-slate-800">{t.step5.countryDetails}</h3>

        {country === 'US' && (
          <>
            <FormInput
              label={t.step5.ssnLast4}
              registration={register('ssnLast4')}
              inputMode="numeric"
              maxLength={4}
              placeholder="1234"
              sensitive
            />
            <FormToggle
              label={t.step5.military}
              checked={watch('militaryStatus')}
              onChange={(val) => setValue('militaryStatus', val)}
            />
          </>
        )}

        {country === 'BR' && (
          <>
            <FormInput
              label={t.step5.cpf}
              registration={register('cpf')}
              inputMode="numeric"
              maxLength={14}
              placeholder="000.000.000-00"
              sensitive
            />
            <FormInput
              label={t.step5.cnh}
              registration={register('cnhNumber')}
              inputMode="numeric"
              placeholder="00000000000"
              sensitive
            />
          </>
        )}
      </div>
    </div>
  );
}
