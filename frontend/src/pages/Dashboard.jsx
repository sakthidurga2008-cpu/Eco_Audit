import { useEffect, useState } from 'react';
import { Bar, BarChart, CartesianGrid, Cell, Legend, Line, LineChart, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

import { getLogs, getLogsByDate, getStatistics, getStatisticsByDate } from '../services/api.js';

const colors = ['#059669', '#65a30d', '#0d9488', '#84cc16', '#14b8a6', '#22c55e', '#a3e635'];

export default function Dashboard() {
  const [selectedDate, setSelectedDate] = useState('');
  const [logs, setLogs] = useState([]);
  const [statistics, setStatistics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadDashboard = async (date) => {
    setLoading(true);
    setError('');
    try {
      const [logsResponse, statsResponse] = await Promise.all([
        date ? getLogsByDate(date) : getLogs(),
        date ? getStatisticsByDate(date) : getStatistics(),
      ]);
      setLogs(logsResponse.data);
      setStatistics(statsResponse.data);
    } catch {
      setError('Unable to load statistics. Make sure the backend is running.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard(selectedDate);
  }, [selectedDate]);

  if (loading) {
    return <p className="rounded-2xl bg-white p-6 text-slate-600 shadow">Loading statistics...</p>;
  }

  return (
    <section className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Audit Dashboard</h1>
          <p className="mt-2 text-slate-600">View date-wise and overall waste statistics.</p>
        </div>
        <label className="block">
          <span className="font-medium text-slate-700">Choose Date</span>
          <input className="mt-2 rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-emerald-500" type="date" value={selectedDate} onChange={(event) => setSelectedDate(event.target.value)} />
        </label>
      </div>

      {error && <p className="rounded-xl bg-red-50 p-4 text-red-700">{error}</p>}

      {statistics && (
        <>
          <div className="grid gap-4 md:grid-cols-3">
            <StatCard label="Total Logs" value={statistics.total_logs} />
            <StatCard label="Total Users" value={statistics.total_users} />
            <StatCard label="Total Quantity" value={`${statistics.total_quantity_kg.toFixed(2)} kg`} />
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <ChartCard title="Waste Type Totals">
              <ResponsiveContainer height={300} width="100%">
                <BarChart data={statistics.waste_type_totals}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="waste_type" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="total_quantity_kg" fill="#059669" name="Quantity Kg" />
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>

            <ChartCard title="Waste Split">
              <ResponsiveContainer height={300} width="100%">
                <PieChart>
                  <Pie data={statistics.waste_type_totals} dataKey="total_quantity_kg" nameKey="waste_type" outerRadius={100} label>
                    {statistics.waste_type_totals.map((entry, index) => (
                      <Cell fill={colors[index % colors.length]} key={entry.waste_type} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </ChartCard>
          </div>

          <ChartCard title="Daily Quantity Trend">
            <ResponsiveContainer height={300} width="100%">
              <LineChart data={statistics.daily_totals}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line dataKey="total_quantity_kg" name="Quantity Kg" stroke="#059669" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </ChartCard>
        </>
      )}

      <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-lg shadow-emerald-100">
        <div className="border-b border-slate-100 p-5">
          <h2 className="text-xl font-bold text-slate-900">Data Table</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-600">
              <tr>
                <th className="px-5 py-3">Date</th>
                <th className="px-5 py-3">Name</th>
                <th className="px-5 py-3">Mobile</th>
                <th className="px-5 py-3">Location</th>
                <th className="px-5 py-3">Waste Items</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log) => (
                <tr className="border-t border-slate-100" key={log.id}>
                  <td className="px-5 py-4">{new Date(log.created_at).toLocaleString()}</td>
                  <td className="px-5 py-4">{log.user.name}</td>
                  <td className="px-5 py-4">{log.user.mobile_number}</td>
                  <td className="px-5 py-4">{log.latitude.toFixed(4)}, {log.longitude.toFixed(4)}</td>
                  <td className="px-5 py-4">{log.items.map((item) => `${item.waste_type}: ${item.quantity_kg} kg`).join(', ')}</td>
                </tr>
              ))}
              {logs.length === 0 && (
                <tr>
                  <td className="px-5 py-8 text-center text-slate-500" colSpan="5">No records found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

function StatCard({ label, value }) {
  return (
    <div className="rounded-2xl border border-emerald-100 bg-white p-6 shadow-lg shadow-emerald-100">
      <p className="text-sm font-medium text-slate-500">{label}</p>
      <p className="mt-2 text-3xl font-bold text-emerald-700">{value}</p>
    </div>
  );
}

function ChartCard({ title, children }) {
  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-lg shadow-emerald-100">
      <h2 className="mb-4 text-xl font-bold text-slate-900">{title}</h2>
      {children}
    </div>
  );
}
