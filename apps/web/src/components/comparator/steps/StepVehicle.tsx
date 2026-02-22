'use client';

import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { Plus, Trash2 } from 'lucide-react';
import FormInput from '../fields/FormInput';
import FormSelect from '../fields/FormSelect';
import FormRadioCards from '../fields/FormRadioCards';
import FormToggle from '../fields/FormToggle';
import FormChips from '../fields/FormChips';
import { ComparatorFormData, DEFAULT_VEHICLE } from '../types';
import {
  VEHICLE_YEARS, OWNERSHIP_OPTIONS, PRIMARY_USE_OPTIONS,
  MILEAGE_PRESETS, GARAGE_OPTIONS,
} from '../constants';
import { getTranslations } from '../translations';

interface StepVehicleProps {
  form: UseFormReturn<ComparatorFormData>;
  locale: string;
}

export default function StepVehicle({ form, locale }: StepVehicleProps) {
  const t = getTranslations(locale);
  const { register, watch, setValue, formState: { errors } } = form;
  const country = watch('country');
  const vehicles = watch('vehicles');

  const addVehicle = () => {
    setValue('vehicles', [...vehicles, { ...DEFAULT_VEHICLE }]);
  };

  const removeVehicle = (index: number) => {
    if (vehicles.length <= 1) return;
    setValue('vehicles', vehicles.filter((_, i) => i !== index));
  };

  const ownershipOpts = country === 'BR' ? OWNERSHIP_OPTIONS.BR : OWNERSHIP_OPTIONS.US;
  const useOpts = country === 'BR' ? PRIMARY_USE_OPTIONS.BR : PRIMARY_USE_OPTIONS.US;
  const garageOpts = country === 'BR' ? GARAGE_OPTIONS.BR : GARAGE_OPTIONS.US;
  const mileagePresets = MILEAGE_PRESETS[country] || MILEAGE_PRESETS.US;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-slate-900 text-center">{t.step3.title}</h2>

      {vehicles.map((vehicle, idx) => (
        <div key={idx} className="bg-white rounded-xl border border-slate-200 p-5 space-y-5">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-slate-800">
              {t.step3.vehicleNum} {idx + 1}
            </h3>
            {vehicles.length > 1 && (
              <button
                type="button"
                onClick={() => removeVehicle(idx)}
                className="text-sm text-red-500 hover:text-red-700 flex items-center gap-1"
              >
                <Trash2 className="w-4 h-4" /> {t.step3.removeVehicle}
              </button>
            )}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <FormSelect
              label={t.step3.year}
              registration={register(`vehicles.${idx}.year`)}
              options={VEHICLE_YEARS}
              placeholder="--"
              error={errors.vehicles?.[idx]?.year?.message}
              required
            />
            <FormInput
              label={t.step3.make}
              registration={register(`vehicles.${idx}.make`)}
              error={errors.vehicles?.[idx]?.make?.message}
              placeholder="Toyota"
              required
            />
            <FormInput
              label={t.step3.model}
              registration={register(`vehicles.${idx}.model`)}
              error={errors.vehicles?.[idx]?.model?.message}
              placeholder="Corolla"
              required
            />
            <FormInput
              label={t.step3.trim}
              registration={register(`vehicles.${idx}.trim`)}
              placeholder="SE"
            />
          </div>

          <FormRadioCards
            label={t.step3.ownership}
            options={ownershipOpts.map((o) => ({ value: o.value, label: o.label }))}
            value={vehicle.ownership}
            onChange={(val) => setValue(`vehicles.${idx}.ownership`, val, { shouldValidate: true })}
            error={errors.vehicles?.[idx]?.ownership?.message}
            required
            columns={3}
          />

          <FormRadioCards
            label={t.step3.primaryUse}
            options={useOpts.map((o) => ({ value: o.value, label: o.label }))}
            value={vehicle.primaryUse}
            onChange={(val) => setValue(`vehicles.${idx}.primaryUse`, val, { shouldValidate: true })}
            error={errors.vehicles?.[idx]?.primaryUse?.message}
            required
            columns={4}
          />

          <div>
            <FormInput
              label={t.step3.annualMileage}
              registration={register(`vehicles.${idx}.annualMileage`)}
              inputMode="numeric"
              placeholder="15000"
            />
            <div className="flex flex-wrap gap-2 mt-2">
              {mileagePresets.map((p) => (
                <button
                  key={p.value}
                  type="button"
                  onClick={() => setValue(`vehicles.${idx}.annualMileage`, p.value)}
                  className={`text-xs px-2.5 py-1 rounded-full border transition-colors
                    ${vehicle.annualMileage === p.value
                      ? 'border-navy-500 bg-navy-50 text-navy-700'
                      : 'border-slate-200 text-slate-600 hover:border-slate-300'
                    }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormSelect
              label={t.step3.garageType}
              registration={register(`vehicles.${idx}.garageType`)}
              options={garageOpts}
              placeholder="--"
            />
            <FormToggle
              label={t.step3.antiTheft}
              checked={vehicle.hasAntiTheft}
              onChange={(val) => setValue(`vehicles.${idx}.hasAntiTheft`, val)}
              className="pt-6"
            />
          </div>
        </div>
      ))}

      <button
        type="button"
        onClick={addVehicle}
        className="w-full py-3 border-2 border-dashed border-slate-300 rounded-xl text-slate-600
          hover:border-navy-400 hover:text-navy-600 transition-colors flex items-center justify-center gap-2"
      >
        <Plus className="w-5 h-5" /> {t.step3.addVehicle}
      </button>
    </div>
  );
}
