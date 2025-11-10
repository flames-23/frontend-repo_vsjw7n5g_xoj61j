import React, { useEffect, useMemo, useState } from 'react';
import { CheckCircle2, Loader2 } from 'lucide-react';

const mockProgressStream = (onUpdate) => {
  let step = 0;
  const id = setInterval(() => {
    step += 1;
    onUpdate(step);
    if (step >= 100) clearInterval(id);
  }, 200);
  return () => clearInterval(id);
};

const OrderTracker = ({ order }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!order) return;
    setProgress(0);
    const stop = mockProgressStream((p) => setProgress(Math.min(100, p)));
    return stop;
  }, [order]);

  const status = useMemo(() => {
    if (!order) return 'No active order';
    if (progress >= 100) return 'Ready for pickup';
    const total = Object.values(order).reduce((a, b) => a + b, 0);
    const current = Math.ceil((progress / 100) * total);
    return `Dispensing item ${Math.min(current, total)} of ${total}…`;
  }, [order, progress]);

  return (
    <section className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-slate-900 dark:text-white">Order Tracking</h3>
        {progress >= 100 ? (
          <CheckCircle2 className="text-emerald-500" />
        ) : (
          <Loader2 className="animate-spin text-blue-600" />
        )}
      </div>
      <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-blue-600 to-cyan-500 transition-all"
          style={{ width: `${progress}%` }}
        />
      </div>
      <div className="text-sm text-slate-600 dark:text-slate-300">{status}</div>
    </section>
  );
};

export default OrderTracker;
