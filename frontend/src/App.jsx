import { Link, Route, Routes } from 'react-router-dom';

import Dashboard from './pages/Dashboard.jsx';
import Landing from './pages/Landing.jsx';
import WasteLogger from './pages/WasteLogger.jsx';

export default function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-lime-50 to-white">
      <nav className="border-b border-emerald-100 bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <Link to="/" className="text-2xl font-bold text-emerald-700">
            EcoAudit
          </Link>
          <div className="flex gap-3 text-sm font-medium text-slate-700">
            <Link className="rounded-full px-4 py-2 hover:bg-emerald-100" to="/log">
              Log Waste
            </Link>
            <Link className="rounded-full px-4 py-2 hover:bg-emerald-100" to="/statistics">
              Statistics
            </Link>
          </div>
        </div>
      </nav>

      <main className="mx-auto max-w-6xl px-4 py-8">
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/log" element={<WasteLogger />} />
          <Route path="/statistics" element={<Dashboard />} />
        </Routes>
      </main>
    </div>
  );
}
