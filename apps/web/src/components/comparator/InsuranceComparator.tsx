'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import ComparatorProgress from './ComparatorProgress';
import ComparatorNavigation from './ComparatorNavigation';
import ComparisonResults from './ComparisonResults';
import StepGetStarted from './steps/StepGetStarted';
import StepPersonalInfo from './steps/StepPersonalInfo';
import StepVehicle from './steps/StepVehicle';
import StepDrivingProfile from './steps/StepDrivingProfile';
import StepCoverage from './steps/StepCoverage';
import StepReview from './steps/StepReview';
import { useLocalStorage } from './hooks/useLocalStorage';
import { ComparatorFormData, DEFAULT_FORM_DATA, STEPS, LeadSubmitResponse, Country } from './types';
import { getTranslations } from './translations';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

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

function getStepSchema(step: number, country: Country) {
  switch (step) {
    case 0:
      return yup.object({
        country: yup.string().required(),
        gigType: yup.string().required(),
        platforms: yup.array().of(yup.string().required()).min(1),
      });
    case 1:
      return yup.object({
        firstName: yup.string().required('Required'),
        lastName: yup.string().required('Required'),
        email: yup.string().email().required('Required'),
        phone: yup.string().required('Required'),
        dateOfBirth: yup.string().required('Required'),
        zipCode: yup.string().required('Required'),
      });
    case 2:
      return yup.object({
        vehicles: yup.array().of(vehicleSchema).min(1),
      });
    case 3:
      return yup.object({
        yearsLicensed: yup.string().required('Required'),
        hoursPerWeek: yup.string().required('Required'),
      });
    case 4:
      return yup.object({
        liabilityLimit: yup.string().required('Required'),
        deductiblePreference: yup.string().required('Required'),
      });
    case 5:
      return yup.object({
        termsAccepted: yup.boolean().oneOf([true]),
        privacyAccepted: yup.boolean().oneOf([true]),
      });
    default:
      return yup.object({});
  }
}

interface InsuranceComparatorProps {
  locale: string;
}

export default function InsuranceComparator({ locale }: InsuranceComparatorProps) {
  const t = getTranslations(locale);
  const { data: savedData, save, clear, loaded } = useLocalStorage<ComparatorFormData>(DEFAULT_FORM_DATA);
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitResult, setSubmitResult] = useState<LeadSubmitResponse | null>(null);

  const form = useForm<ComparatorFormData>({
    defaultValues: DEFAULT_FORM_DATA,
    mode: 'onBlur',
  });

  useEffect(() => {
    if (loaded && savedData !== DEFAULT_FORM_DATA) {
      form.reset(savedData);
    }
  }, [loaded]); // eslint-disable-line react-hooks/exhaustive-deps

  const saveProgress = useCallback(() => {
    save(form.getValues());
  }, [form, save]);

  const validateCurrentStep = async (): Promise<boolean> => {
    const values = form.getValues();
    const schema = getStepSchema(currentStep, values.country);
    try {
      await schema.validate(values, { abortEarly: false });
      return true;
    } catch (err) {
      if (err instanceof yup.ValidationError) {
        err.inner.forEach((e) => {
          if (e.path) {
            form.setError(e.path as any, { message: e.message });
          }
        });
      }
      return false;
    }
  };

  const handleNext = async () => {
    const valid = await validateCurrentStep();
    if (!valid) return;
    form.clearErrors();
    saveProgress();
    setCurrentStep((prev) => Math.min(prev + 1, STEPS.length - 1));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBack = () => {
    saveProgress();
    setCurrentStep((prev) => Math.max(prev - 1, 0));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const goToStep = (step: number) => {
    saveProgress();
    setCurrentStep(step);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async () => {
    const valid = await validateCurrentStep();
    if (!valid) return;

    setIsSubmitting(true);
    try {
      const values = form.getValues();
      const res = await fetch(`${API_URL}/api/leads`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Failed to submit');
      }

      const result: LeadSubmitResponse = await res.json();
      setSubmitResult(result);
      clear();
    } catch (err: any) {
      form.setError('root', { message: err.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitResult) {
    return (
      <ComparisonResults
        leadId={submitResult.id}
        initialDispatches={submitResult.dispatches}
        locale={locale}
        onRecompare={() => {
          setSubmitResult(null);
          setCurrentStep(4);
        }}
      />
    );
  }

  const isLastStep = currentStep === STEPS.length - 1;

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-navy-500">{t.title}</h1>
          <p className="text-slate-600 mt-2">{t.subtitle}</p>
        </div>

        <ComparatorProgress currentStep={currentStep} locale={locale} />

        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (isLastStep) handleSubmit();
          }}
          className="mt-8 bg-white rounded-2xl shadow-sm border border-slate-200 p-4 sm:p-6"
        >
          {form.formState.errors.root && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
              {form.formState.errors.root.message}
            </div>
          )}

          {currentStep === 0 && <StepGetStarted form={form} locale={locale} />}
          {currentStep === 1 && <StepPersonalInfo form={form} locale={locale} />}
          {currentStep === 2 && <StepVehicle form={form} locale={locale} />}
          {currentStep === 3 && <StepDrivingProfile form={form} locale={locale} />}
          {currentStep === 4 && <StepCoverage form={form} locale={locale} />}
          {currentStep === 5 && (
            <StepReview form={form} locale={locale} onGoToStep={goToStep} isSubmitting={isSubmitting} />
          )}

          <ComparatorNavigation
            currentStep={currentStep}
            totalSteps={STEPS.length}
            locale={locale}
            onBack={handleBack}
            onNext={handleNext}
            isLastStep={isLastStep}
            isSubmitting={isSubmitting}
          />
        </form>
      </div>
    </div>
  );
}
