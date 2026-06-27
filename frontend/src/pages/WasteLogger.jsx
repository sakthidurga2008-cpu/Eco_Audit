import { useState } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';

import { createWasteLog } from '../services/api.js';

const wasteTypes = ['Plastic', 'Organic', 'Paper', 'Metal', 'Glass', 'E-Waste', 'Other'];

export default function WasteLogger() {
  const [location, setLocation] = useState(null);
  const [locationError, setLocationError] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: '',
      mobile_number: '',
      items: [{ waste_type: 'Plastic', quantity_kg: '' }],
    },
  });

  const { fields, append, remove } = useFieldArray({ control, name: 'items' });

  const captureLocation = () => {
    setLocationError('');
    setMessage('');

    if (!navigator.geolocation) {
      setLocationError('Browser geolocation is not supported on this device.');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      () => {
        setLocation(null);
        setLocationError('Location permission is required before submission.');
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 },
    );
  };

  const onSubmit = async (values) => {
    setMessage('');

    if (!location) {
      setLocationError('Please capture browser geolocation before submitting.');
      return;
    }

    setSubmitting(true);
    try {
      await createWasteLog({
        ...values,
        latitude: location.latitude,
        longitude: location.longitude,
        items: values.items.map((item) => ({
          waste_type: item.waste_type,
          quantity_kg: Number(item.quantity_kg),
        })),
      });
      reset();
      setLocation(null);
      setMessage('Waste log submitted successfully.');
    } catch (error) {
      setMessage(error.response?.data?.detail || 'Unable to submit waste log.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="rounded-3xl border border-emerald-100 bg-white p-6 shadow-xl shadow-emerald-100 md:p-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-slate-900">Waste Entry Form</h1>
        <p className="mt-2 text-slate-600">Capture user, waste, and geolocation details.</p>
      </div>

      <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
        <div className="grid gap-5 md:grid-cols-2">
          <label className="block">
            <span className="font-medium text-slate-700">Name</span>
            <input className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-emerald-500" {...register('name', { required: 'Name is required' })} />
            {errors.name && <span className="text-sm text-red-600">{errors.name.message}</span>}
          </label>

          <label className="block">
            <span className="font-medium text-slate-700">Mobile Number</span>
            <input className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-emerald-500" {...register('mobile_number', { required: 'Mobile number is required', pattern: { value: /^\d{10}$/, message: 'Enter exactly 10 digits' } })} />
            {errors.mobile_number && <span className="text-sm text-red-600">{errors.mobile_number.message}</span>}
          </label>
        </div>

        <div>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-slate-900">Waste Details</h2>
            <button className="rounded-lg bg-emerald-100 px-4 py-2 text-sm font-semibold text-emerald-700 hover:bg-emerald-200" type="button" onClick={() => append({ waste_type: 'Plastic', quantity_kg: '' })}>
              Add Another Waste Type
            </button>
          </div>

          <div className="space-y-4">
            {fields.map((field, index) => (
              <div className="grid gap-4 rounded-2xl border border-slate-100 bg-slate-50 p-4 md:grid-cols-[1fr_1fr_auto]" key={field.id}>
                <label>
                  <span className="font-medium text-slate-700">Waste Type</span>
                  <select className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-emerald-500" {...register(`items.${index}.waste_type`, { required: true })}>
                    {wasteTypes.map((type) => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </label>
                <label>
                  <span className="font-medium text-slate-700">Quantity (Kg)</span>
                  <input type="number" step="0.01" min="0.01" className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-emerald-500" {...register(`items.${index}.quantity_kg`, { required: 'Quantity is required', min: { value: 0.01, message: 'Quantity must be greater than 0' } })} />
                  {errors.items?.[index]?.quantity_kg && <span className="text-sm text-red-600">{errors.items[index].quantity_kg.message}</span>}
                </label>
                <button className="self-end rounded-xl border border-red-200 px-4 py-3 font-semibold text-red-600 hover:bg-red-50 disabled:opacity-50" type="button" disabled={fields.length === 1} onClick={() => remove(index)}>
                  Remove
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-5">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">Browser Geolocation</h2>
              <p className="text-sm text-slate-600">The browser asks for permission, then sends latitude and longitude with the form.</p>
            </div>
            <button className="rounded-xl bg-emerald-600 px-5 py-3 font-semibold text-white hover:bg-emerald-700" type="button" onClick={captureLocation}>
              Capture Location
            </button>
          </div>
          {location && <p className="mt-3 text-sm text-emerald-700">Captured: {location.latitude.toFixed(6)}, {location.longitude.toFixed(6)}</p>}
          {locationError && <p className="mt-3 text-sm text-red-600">{locationError}</p>}
        </div>

        <button className="w-full rounded-xl bg-slate-900 px-6 py-4 font-semibold text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60" type="submit" disabled={submitting}>
          {submitting ? 'Submitting...' : 'Submit Waste Log'}
        </button>
        {message && <p className="text-center font-medium text-slate-700">{message}</p>}
      </form>
    </section>
  );
}
