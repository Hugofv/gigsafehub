'use client';

import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { Car, Package, Truck } from 'lucide-react';
import FormRadioCards from '../fields/FormRadioCards';
import FormChips from '../fields/FormChips';
import { ComparatorFormData, Country, GigType } from '../types';
import { PLATFORMS } from '../constants';
import { getTranslations } from '../translations';

interface StepGetStartedProps {
  form: UseFormReturn<ComparatorFormData>;
  locale: string;
}

export default function StepGetStarted({ form, locale }: StepGetStartedProps) {
  const t = getTranslations(locale);
  const { watch, setValue, formState: { errors } } = form;
  const country = watch('country');
  const gigType = watch('gigType');
  const platforms = watch('platforms');

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-slate-900">{t.step1.title}</h2>
      </div>

      <FormRadioCards
        label={t.step1.countryLabel}
        options={[
          { value: 'US', label: 'United States', icon: <span>🇺🇸</span> },
          { value: 'BR', label: 'Brasil', icon: <span>🇧🇷</span> },
        ]}
        value={country}
        onChange={(val) => {
          setValue('country', val as Country, { shouldValidate: true });
          setValue('platforms', []);
        }}
        error={errors.country?.message}
        required
        columns={2}
      />

      <FormRadioCards
        label={t.step1.gigTypeLabel}
        options={[
          { value: 'rideshare', label: t.step1.rideshare, icon: <Car className="w-6 h-6" /> },
          { value: 'delivery', label: t.step1.delivery, icon: <Package className="w-6 h-6" /> },
          { value: 'both', label: t.step1.both, icon: <Truck className="w-6 h-6" /> },
        ]}
        value={gigType}
        onChange={(val) => setValue('gigType', val as GigType, { shouldValidate: true })}
        error={errors.gigType?.message}
        required
        columns={3}
      />

      <FormChips
        label={t.step1.platformsLabel}
        options={PLATFORMS[country] || PLATFORMS.US}
        selected={platforms}
        onChange={(val) => setValue('platforms', val, { shouldValidate: true })}
        error={errors.platforms?.message}
        required
      />
    </div>
  );
}
