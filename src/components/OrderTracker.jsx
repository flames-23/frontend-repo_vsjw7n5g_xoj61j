import React, { useEffect, useMemo, useState } from 'react';
import { CheckCircle2, Loader2 } from 'lucide-react';

const OrderTracker = ({ order }) => {
  const [progress, setProgress] = useState(0);
  const [orderId, setOrderId] = useState(null);
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');

  // Create order when items change
  useEffect(() => {
    const createOrder = async () => {
      if (!order) return;
      setProgress(0);
      setError('');
      setStatus('');
      try {
        const items = Object.entries(order).map(([product_id, quantity]) => ({ product_id, quantity }));
        const base = import.meta.env.VITE_BACKEND_URL;
        const res = await fetch(`${base}/orders`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ user_email: localStorage.getItem('user_email') || 'guest@example.com', items }),
        });
        if (!res.ok) throw new Error(`Failed to create order (${res.status})`);
        const data = await res.json();
        setOrderId(data._id || data.id);
      } catch (err) {
        setError(err.message || 'Unable to create order');
      }
    };
    createOrder();
  }, [order]);

  // Poll order progress
  useEffect(() => {
    if (!orderId) return;
    const base = import.meta.env.VITE_BACKEND_URL;
    const iv = setInterval(async () => {
      try {
        const res = await fetch(`${base}/orders/${orderId}`);
        if (!res.ok) throw new Error('Failed to fetch order');
        const data = await res.json();
        setProgress(data.progress ?? 0);
        setStatus(data.status || '');
      } catch (e) {
        // Non-fatal: keep polling
      }
    }, 1000);
    return () => clearInterval(iv);
  }, [orderId]);

  const subtitle = useMemo(() => {
    if (error) return error;
    if (!order) return 'No active order';
    if (status) return status;
    const total = Object.values(order).reduce((a, b) => a + b, 0);
    const current = Math.ceil((progress / 100) * total);
    return `Dispensing item ${Math.min(current, total)} of ${total}…`;
  }, [order, progress, error, status]);

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
      <div className="text-sm text-slate-600 dark:text-slate-300">{subtitle}</div>
    </section>
  );
};

export default OrderTracker;
