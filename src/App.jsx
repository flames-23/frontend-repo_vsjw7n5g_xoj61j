import React, { useEffect, useMemo, useState } from 'react';
import Header from './components/Header';
import ProductBrowser from './components/ProductBrowser';
import OrderTracker from './components/OrderTracker';
import AdminDashboard from './components/AdminDashboard';
import AuthPanel from './components/AuthPanel';
import Spline from '@splinetool/react-spline';

const App = () => {
  const [role, setRole] = useState('customer');
  const [order, setOrder] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const saved = localStorage.getItem('user');
    if (saved) setUser(JSON.parse(saved));
  }, []);

  const onAuth = (u) => {
    setUser(u);
    if (u && u.email) localStorage.setItem('user_email', u.email);
    localStorage.setItem('user', JSON.stringify(u));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('user_email');
  };

  const addToOrder = (items) => {
    if (!items) return;
    const merged = { ...(order || {}) };
    Object.entries(items).forEach(([id, qty]) => {
      if (!qty) return;
      merged[id] = (merged[id] || 0) + qty;
    });
    setOrder(merged);
  };

  const totalItems = useMemo(() => (order ? Object.values(order).reduce((a, b) => a + b, 0) : 0), [order]);

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950">
      <div className="fixed inset-0 opacity-70 pointer-events-none" aria-hidden>
        <Spline scene="https://prod.spline.design/9gB3y4lF2m9cQeYz/scene.splinecode" style={{ width: '100%', height: '100%' }} />
      </div>

      <Header role={role} onRoleChange={setRole} />

      <main className="relative z-10 max-w-6xl mx-auto px-4 py-6 space-y-6">
        {!user ? (
          <AuthPanel onAuth={onAuth} />
        ) : (
          <div className="flex items-center justify-between rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 py-2">
            <div className="text-sm text-slate-700 dark:text-slate-200">Signed in as <span className="font-semibold">{user.email}</span></div>
            <button onClick={logout} className="text-sm text-blue-600">Log out</button>
          </div>
        )}

        {role === 'customer' ? (
          <>
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Browse & Order</h2>
              <div className="text-sm text-slate-600 dark:text-slate-300">Items in order: <span className="font-semibold">{totalItems}</span></div>
            </div>
            <ProductBrowser onAdd={addToOrder} />
            {totalItems > 0 && <OrderTracker order={order} />}
          </>
        ) : (
          <AdminDashboard />
        )}
      </main>
    </div>
  );
};

export default App;
