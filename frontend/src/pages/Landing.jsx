import { Link } from 'react-router-dom';

export default function Landing() {
  return (
    <section className="grid gap-8 py-12 md:grid-cols-[1.1fr_0.9fr] md:items-center">
      <div>
        <span className="rounded-full bg-emerald-100 px-4 py-2 text-sm font-semibold text-emerald-700">
          Community Waste Logger
        </span>
        <h1 className="mt-6 text-5xl font-bold tracking-tight text-slate-900">
          Record waste disposal activity with location-aware audits.
        </h1>
        <p className="mt-5 text-lg leading-8 text-slate-600">
          EcoAudit helps communities capture user details, waste categories, quantities, and browser geolocation in a SQLite-backed audit trail.
        </p>
        <div className="mt-8 flex flex-wrap gap-4">
          <Link className="rounded-xl bg-emerald-600 px-6 py-3 font-semibold text-white shadow-lg shadow-emerald-200 hover:bg-emerald-700" to="/log">
            Log Waste
          </Link>
          <Link className="rounded-xl border border-emerald-200 bg-white px-6 py-3 font-semibold text-emerald-700 hover:bg-emerald-50" to="/statistics">
            Statistics
          </Link>
        </div>
      </div>
      <div className="rounded-3xl border border-emerald-100 bg-white p-8 shadow-xl shadow-emerald-100">
        <h2 className="text-xl font-bold text-slate-900">What gets recorded?</h2>
        <ul className="mt-5 space-y-4 text-slate-600">
          <li>✓ Name and unique 10-digit mobile number</li>
          <li>✓ One or more waste types with quantity in kg</li>
          <li>✓ Browser latitude and longitude after user permission</li>
          <li>✓ Date-wise records for tables and charts</li>
        </ul>
      </div>
    </section>
  );
}
