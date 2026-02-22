'use client';

import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import FormInput from '../fields/FormInput';
import FormSelect from '../fields/FormSelect';
import { ComparatorFormData } from '../types';
import { US_STATES, BR_STATES } from '../constants';
import { getTranslations } from '../translations';

interface StepPersonalInfoProps {
  form: UseFormReturn<ComparatorFormData>;
  locale: string;
}

export default function StepPersonalInfo({ form, locale }: StepPersonalInfoProps) {
  const t = getTranslations(locale);
  const { register, watch, formState: { errors } } = form;
  const country = watch('country');
  const states = country === 'BR' ? BR_STATES : US_STATES;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-slate-900 text-center">{t.step2.title}</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FormInput
          label={t.step2.firstName}
          registration={register('firstName')}
          error={errors.firstName?.message}
          placeholder={country === 'BR' ? 'João' : 'John'}
          required
        />
        <FormInput
          label={t.step2.lastName}
          registration={register('lastName')}
          error={errors.lastName?.message}
          placeholder={country === 'BR' ? 'Silva' : 'Smith'}
          required
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FormInput
          label={t.step2.email}
          registration={register('email')}
          error={errors.email?.message}
          type="email"
          inputMode="email"
          placeholder="email@example.com"
          required
        />
        <FormInput
          label={t.step2.phone}
          registration={register('phone')}
          error={errors.phone?.message}
          type="tel"
          inputMode="tel"
          placeholder={country === 'BR' ? '(11) 99999-9999' : '(555) 555-5555'}
          required
        />
      </div>

      <FormInput
        label={t.step2.dateOfBirth}
        registration={register('dateOfBirth')}
        error={errors.dateOfBirth?.message}
        type="date"
        required
      />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <FormInput
          label={t.step2.zipCode}
          registration={register('zipCode')}
          error={errors.zipCode?.message}
          inputMode="numeric"
          maxLength={country === 'BR' ? 9 : 5}
          placeholder={country === 'BR' ? '01310-100' : '90210'}
          required
        />
        <FormInput
          label={t.step2.city}
          registration={register('city')}
          error={errors.city?.message}
          placeholder={country === 'BR' ? 'São Paulo' : 'Los Angeles'}
        />
        <FormSelect
          label={t.step2.state}
          registration={register('state')}
          options={states}
          error={errors.state?.message}
          placeholder={country === 'BR' ? 'Selecione' : 'Select'}
        />
      </div>
    </div>
  );
}
