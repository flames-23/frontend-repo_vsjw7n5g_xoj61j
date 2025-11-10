import React, { useEffect, useMemo, useState } from 'react';
import { Activity, AlertTriangle, Battery, Cpu, Radio, Play, Square } from 'lucide-react';

const AdminDashboard = () => {
  const [cells, setCells] = useState([]);
  const [stream, setStream] = useState(true);
  const [error, setError] = useState('');

  // Load shelves (auto-seeded by backend)
  useEffect(() => {
    const load = async () => {
      try {
        const base = import.meta.env.VITE_BACKEND_URL;
        const res = await fetch(`${base}/shelves`);
        if (!res.ok) throw new Error(`Failed to fetch shelves (${res.status})`);
        const data = await res.json();
        setCells(data);
      } catch (e) {
        setError(e.message || 'Unable to load shelves');
      }
    };
    load();
  }, []);

  // Simulate sensor value drift locally while streaming
  useEffect(() => {
    if (!stream) return;
    const id = setInterval(() => {
      setCells((prev) => prev.map((c) => ({
        ...c,
        sensor_value: typeof c.sensor_value === 'number' ? Math.max(0, Math.min(100, c.sensor_value + (Math.random() > 0.5 ? 1 : -1))) : c.sensor_value,
      })));
    }, 1500);
    return () => clearInterval(id);
  }, [stream]);

  const lowStock = useMemo(() => (cells || []).filter((c) => (c.stock ?? 0) <= 2).map((c) => c.cell_code), [cells]);

  const toggleMotor = async (cell_code) => {
    try {
      const base = import.meta.env.VITE_BACKEND_URL;
      const res = await fetch(`${base}/shelves/${cell_code}/motor`, { method: 'POST' });
      if (!res.ok) throw new Error('Failed to toggle motor');
      const updated = await res.json();
      setCells((prev) => prev.map((c) => (c.cell_code === cell_code ? updated : c)));
    } catch (e) {
      setError(e.message || 'Action failed');
    }
  };

  return (
    <section className="space-y-4">
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-slate-900 dark:text-white">Operator Console</h3>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setStream(true)}
              className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border ${
                stream ? 'border-blue-500 text-blue-600' : 'border-slate-300 dark:border-slate-700'
              }`}
            >
              <Play size={16} /> Live
            </button>
            <button
              onClick={() => setStream(false)}
              className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border ${
                !stream ? 'border-blue-500 text-blue-600' : 'border-slate-300 dark:border-slate-700'
              }`}
            >
              <Square size={16} /> Pause
            </button>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3">
          <StatCard icon={<Activity className="text-blue-600" />} label="System" value="Online" />
          <StatCard icon={<Battery className="text-emerald-500" />} label="UPS" value="94%" />
          <StatCard icon={<Cpu className="text-slate-500" />} label="Edge CPU" value="28%" />
          <StatCard icon={<Radio className="text-cyan-500" />} label="MQTT" value="Connected" />
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4">
        <div className="flex items-center justify-between mb-3">
          <h4 className="font-semibold text-slate-900 dark:text-white">Shelf Map</h4>
          {error && <span className="text-sm text-rose-600">{error}</span>}
        </div>
        <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-10 gap-2">
          {cells.map((cell) => (
            <button
              key={cell.cell_code}
              onClick={() => toggleMotor(cell.cell_code)}
              className={`relative aspect-square rounded-xl border p-2 text-left transition overflow-hidden ${
                (cell.stock ?? 0) === 0
                  ? 'border-rose-300/60 bg-rose-50 dark:bg-rose-500/10'
                  : (cell.stock ?? 0) <= 2
                  ? 'border-amber-300/60 bg-amber-50 dark:bg-amber-500/10'
                  : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900'
              }`}
              title={`Cell ${cell.cell_code}`}
            >
              <div className="text-xs font-medium text-slate-600 dark:text-slate-300">{cell.cell_code}</div>
              <div className="mt-1 text-lg font-semibold text-slate-900 dark:text-white">{cell.stock ?? 0}</div>
              {cell.motor_active && <div className="absolute inset-0 bg-blue-500/10 animate-pulse" />}
            </button>
          ))}
        </div>

        {lowStock.length > 0 && (
          <div className="mt-4 inline-flex items-center gap-2 text-amber-600 bg-amber-50 dark:bg-amber-500/10 px-3 py-2 rounded-xl">
            <AlertTriangle size={16} /> Low stock: {lowStock.join(', ')}
          </div>
        )}
      </div>
    </section>
  );
};

const StatCard = ({ icon, label, value }) => (
  <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-3 flex items-center gap-3">
    <div className="h-9 w-9 rounded-lg bg-slate-100 dark:bg-slate-800 grid place-items-center">{icon}</div>
    <div className="leading-tight">
      <div className="text-xs text-slate-500">{label}</div>
      <div className="font-semibold text-slate-900 dark:text-white">{value}</div>
    </div>
  </div>
);

export default AdminDashboard;
