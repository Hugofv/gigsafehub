'use client';

import React, { useCallback, useRef, useState } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { Loader2, CheckCircle2 } from 'lucide-react';
import FormInput from '../fields/FormInput';
import FormSelect from '../fields/FormSelect';
import { ComparatorFormData } from '../types';
import { US_STATES, BR_STATES } from '../constants';
import { getTranslations } from '../translations';

interface ViaCepResponse {
  cep: string;
  logradouro: string;
  complemento: string;
  bairro: string;
  localidade: string;
  uf: string;
  erro?: boolean;
}

interface StepPersonalInfoProps {
  form: UseFormReturn<ComparatorFormData>;
  locale: string;
}

export default function StepPersonalInfo({ form, locale }: StepPersonalInfoProps) {
  const t = getTranslations(locale);
  const { register, watch, setValue, formState: { errors } } = form;
  const country = watch('country');
  const states = country === 'BR' ? BR_STATES : US_STATES;

  const [cepStatus, setCepStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  const lookupCep = useCallback(async (rawCep: string) => {
    const digits = rawCep.replace(/\D/g, '');
    if (digits.length !== 8) {
      setCepStatus('idle');
      return;
    }

    setCepStatus('loading');
    try {
      const res = await fetch(`https://viacep.com.br/ws/${digits}/json/`);
      const data: ViaCepResponse = await res.json();

      if (data.erro) {
        setCepStatus('error');
        return;
      }

      setValue('city', data.localidade, { shouldValidate: true });
      setValue('state', data.uf, { shouldValidate: true });
      setCepStatus('success');
    } catch {
      setCepStatus('error');
    }
  }, [setValue]);

  const handleCepChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;

    if (country !== 'BR') return;
    if (debounceRef.current) clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(() => {
      lookupCep(raw);
    }, 500);
  }, [country, lookupCep]);

  const zipRegistration = register('zipCode');

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
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">
            {t.step2.zipCode}
            <span className="text-red-500 ml-0.5">*</span>
          </label>
          <div className="relative">
            <input
              type="text"
              inputMode="numeric"
              maxLength={country === 'BR' ? 9 : 5}
              placeholder={country === 'BR' ? '01310-100' : '90210'}
              {...zipRegistration}
              onChange={(e) => {
                zipRegistration.onChange(e);
                handleCepChange(e);
              }}
              className={`w-full px-4 py-2.5 border rounded-lg text-slate-900 placeholder:text-slate-400
                focus:ring-2 focus:ring-navy-500 focus:border-transparent transition-colors
                ${errors.zipCode ? 'border-red-300 focus:ring-red-500' : 'border-slate-300'}
                ${cepStatus === 'loading' ? 'pr-10' : ''}`}
            />
            {country === 'BR' && cepStatus === 'loading' && (
              <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-navy-500 animate-spin" />
            )}
            {country === 'BR' && cepStatus === 'success' && (
              <CheckCircle2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-green-500" />
            )}
          </div>
          {errors.zipCode && <p className="mt-1 text-sm text-red-600">{errors.zipCode.message}</p>}
          {country === 'BR' && cepStatus === 'error' && (
            <p className="mt-1 text-xs text-amber-600">
              CEP não encontrado. Preencha manualmente.
            </p>
          )}
          {country === 'BR' && cepStatus === 'idle' && (
            <p className="mt-1 text-xs text-slate-500">
              Digite o CEP para preencher automaticamente
            </p>
          )}
        </div>
        <FormInput
          label={t.step2.city}
          registration={register('city')}
          error={errors.city?.message}
          placeholder={country === 'BR' ? 'São Paulo' : 'Los Angeles'}
          disabled={country === 'BR' && cepStatus === 'loading'}
        />
        <FormSelect
          label={t.step2.state}
          registration={register('state')}
          options={states}
          error={errors.state?.message}
          placeholder={country === 'BR' ? 'Selecione' : 'Select'}
          disabled={country === 'BR' && cepStatus === 'loading'}
        />
      </div>
    </div>
  );
}
