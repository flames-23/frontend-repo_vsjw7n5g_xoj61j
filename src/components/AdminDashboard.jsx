import React, { useEffect, useMemo, useState } from 'react';
import { Activity, AlertTriangle, Battery, Cpu, Radio, Play, Square } from 'lucide-react';

const cells = Array.from({ length: 20 }, (_, i) => `A${i + 1}`);

const AdminDashboard = () => {
  const [sensorData, setSensorData] = useState(() =>
    Object.fromEntries(cells.map((k) => [k, { stock: Math.floor(Math.random() * 12), motor: false }]))
  );
  const [stream, setStream] = useState(true);

  useEffect(() => {
    if (!stream) return;
    const id = setInterval(() => {
      setSensorData((prev) => {
        const k = cells[Math.floor(Math.random() * cells.length)];
        const next = { ...prev };
        next[k] = { ...next[k], stock: Math.max(0, next[k].stock + (Math.random() > 0.5 ? 1 : -1)) };
        return next;
      });
    }, 1200);
    return () => clearInterval(id);
  }, [stream]);

  const lowStock = useMemo(() => Object.entries(sensorData).filter(([_, v]) => v.stock <= 2).map(([k]) => k), [sensorData]);

  const toggleMotor = (cell) => setSensorData((s) => ({ ...s, [cell]: { ...s[cell], motor: !s[cell].motor } }));

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
        <h4 className="font-semibold text-slate-900 dark:text-white mb-3">Shelf Map</h4>
        <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-10 gap-2">
          {cells.map((cell) => {
            const info = sensorData[cell];
            return (
              <button
                key={cell}
                onClick={() => toggleMotor(cell)}
                className={`relative aspect-square rounded-xl border p-2 text-left transition overflow-hidden ${
                  info.stock === 0
                    ? 'border-rose-300/60 bg-rose-50 dark:bg-rose-500/10'
                    : info.stock <= 2
                    ? 'border-amber-300/60 bg-amber-50 dark:bg-amber-500/10'
                    : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900'
                }`}
                title={`Cell ${cell}`}
              >
                <div className="text-xs font-medium text-slate-600 dark:text-slate-300">{cell}</div>
                <div className="mt-1 text-lg font-semibold text-slate-900 dark:text-white">{info.stock}</div>
                {info.motor && <div className="absolute inset-0 bg-blue-500/10 animate-pulse" />}
              </button>
            );
          })}
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
