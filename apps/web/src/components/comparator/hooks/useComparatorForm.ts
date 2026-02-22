'use client';

import { useMemo } from 'react';
import { useForm, UseFormReturn } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { ComparatorFormData, DEFAULT_FORM_DATA, Country } from '../types';

const vehicleSchema = yup.object({
  year: yup.string().required('Required'),
  make: yup.string().required('Required'),
  model: yup.string().required('Required'),
  trim: yup.string().default(''),
  ownership: yup.string().required('Required'),
  primaryUse: yup.string().required('Required'),
  annualMileage: yup.string().default(''),
  garageType: yup.string().default(''),
  hasAntiTheft: yup.boolean().default(false),
});

function createStepSchemas(country: Country) {
  const step1 = yup.object({
    country: yup.string().required(),
    gigType: yup.string().required(),
    platforms: yup.array().of(yup.string().required()).min(1, 'Select at least one platform'),
  });

  const step2 = yup.object({
    firstName: yup.string().required('Required'),
    lastName: yup.string().required('Required'),
    email: yup.string().email('Invalid email').required('Required'),
    phone: yup.string().required('Required'),
    dateOfBirth: yup.string().required('Required'),
    zipCode: yup.string().required('Required')
      .test('zip-format', 'Invalid format', (val) => {
        if (!val) return false;
        return country === 'US' ? /^\d{5}$/.test(val) : /^\d{8}$/.test(val.replace('-', ''));
      }),
  });

  const step3 = yup.object({
    vehicles: yup.array().of(vehicleSchema).min(1, 'Add at least one vehicle'),
  });

  const step4 = yup.object({
    yearsLicensed: yup.string().required('Required'),
    accidentsLast5Years: yup.number().min(0).required(),
    violationsLast5Years: yup.number().min(0).required(),
    hoursPerWeek: yup.string().required('Required'),
  });

  const step5 = yup.object({
    currentInsured: yup.boolean().required(),
    liabilityLimit: yup.string().required('Required'),
    deductiblePreference: yup.string().required('Required'),
  });

  const step6 = yup.object({
    termsAccepted: yup.boolean().oneOf([true], 'Required'),
    privacyAccepted: yup.boolean().oneOf([true], 'Required'),
  });

  return [step1, step2, step3, step4, step5, step6] as const;
}

export function useComparatorForm(
  defaultValues: ComparatorFormData = DEFAULT_FORM_DATA,
  currentStep: number = 0,
  country: Country = 'US',
): UseFormReturn<ComparatorFormData> {
  const schemas = useMemo(() => createStepSchemas(country), [country]);
  const currentSchema = schemas[currentStep] || schemas[0];

  return useForm<ComparatorFormData>({
    resolver: yupResolver(currentSchema as yup.ObjectSchema<any>),
    defaultValues,
    mode: 'onBlur',
  });
}
