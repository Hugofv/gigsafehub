'use client';

import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import FormInput from '../fields/FormInput';
import FormSelect from '../fields/FormSelect';
import FormStepper from '../fields/FormStepper';
import FormToggle from '../fields/FormToggle';
import { ComparatorFormData } from '../types';
import { CREDIT_TIERS, MARITAL_OPTIONS } from '../constants';
import { getTranslations } from '../translations';

interface StepDrivingProfileProps {
  form: UseFormReturn<ComparatorFormData>;
  locale: string;
}

export default function StepDrivingProfile({ form, locale }: StepDrivingProfileProps) {
  const t = getTranslations(locale);
  const { register, watch, setValue, formState: { errors } } = form;
  const country = watch('country');
  const maritalOpts = country === 'BR' ? MARITAL_OPTIONS.BR : MARITAL_OPTIONS.US;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-slate-900 text-center">{t.step4.title}</h2>

      <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-5">
        <h3 className="font-semibold text-slate-800">
          {locale === 'pt-BR' ? 'Histórico de Direção' : 'Driving History'}
        </h3>

        <FormInput
          label={t.step4.yearsLicensed}
          registration={register('yearsLicensed')}
          error={errors.yearsLicensed?.message}
          inputMode="numeric"
          placeholder="5"
          required
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <FormStepper
            label={t.step4.accidents}
            value={watch('accidentsLast5Years')}
            onChange={(val) => setValue('accidentsLast5Years', val)}
            max={5}
          />
          <FormStepper
            label={t.step4.violations}
            value={watch('violationsLast5Years')}
            onChange={(val) => setValue('violationsLast5Years', val)}
            max={5}
          />
        </div>

        {country === 'US' && (
          <FormToggle
            label={t.step4.sr22}
            checked={watch('sr22Required')}
            onChange={(val) => setValue('sr22Required', val)}
          />
        )}
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-5">
        <h3 className="font-semibold text-slate-800">
          {locale === 'pt-BR' ? 'Perfil de Trabalho' : 'Work Profile'}
        </h3>

        <FormInput
          label={t.step4.hoursPerWeek}
          registration={register('hoursPerWeek')}
          error={errors.hoursPerWeek?.message}
          inputMode="numeric"
          placeholder="30"
          required
        />

        <FormToggle
          label={t.step4.fullTime}
          checked={watch('fullTime')}
          onChange={(val) => setValue('fullTime', val)}
        />
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-5">
        <h3 className="font-semibold text-slate-800">
          {locale === 'pt-BR' ? 'Perfil Pessoal' : 'Personal Profile'}
        </h3>

        {country === 'US' && (
          <FormSelect
            label={t.step4.creditTier}
            registration={register('creditTier')}
            options={CREDIT_TIERS}
            placeholder="--"
          />
        )}

        <FormSelect
          label={t.step4.maritalStatus}
          registration={register('maritalStatus')}
          options={maritalOpts}
          placeholder="--"
        />

        <FormToggle
          label={t.step4.homeOwner}
          checked={watch('homeOwner')}
          onChange={(val) => setValue('homeOwner', val)}
        />
      </div>
    </div>
  );
}
