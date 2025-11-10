import React, { useEffect, useState } from 'react';
import { Bell, Moon, Sun, Settings, Wifi, Bluetooth } from 'lucide-react';

const Header = ({ role, onRoleChange }) => {
  const [dark, setDark] = useState(false);
  const [connectedWifi, setConnectedWifi] = useState(false);
  const [connectedBt, setConnectedBt] = useState(false);
  const [notif, setNotif] = useState(false);

  useEffect(() => {
    if (dark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [dark]);

  useEffect(() => {
    const t = setTimeout(() => setNotif(true), 2500);
    return () => clearTimeout(t);
  }, []);

  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-white/70 dark:bg-slate-900/60 border-b border-slate-200/60 dark:border-slate-800">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 shadow-lg" />
          <div className="leading-tight">
            <div className="text-slate-900 dark:text-white font-semibold tracking-tight">AeroShelf</div>
            <div className="text-xs text-slate-500 dark:text-slate-400">Smart Inventory & Dispensing</div>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-3 text-sm">
          <div className="flex rounded-xl p-1 bg-slate-100 dark:bg-slate-800">
            <button
              className={`px-3 py-1.5 rounded-lg transition ${
                role === 'customer' ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow' : 'text-slate-600 dark:text-slate-300'
              }`}
              onClick={() => onRoleChange('customer')}
            >
              Customer
            </button>
            <button
              className={`px-3 py-1.5 rounded-lg transition ${
                role === 'admin' ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow' : 'text-slate-600 dark:text-slate-300'
              }`}
              onClick={() => onRoleChange('admin')}
            >
              Admin
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setConnectedWifi((v) => !v)}
              title="Wi‑Fi"
              className={`p-2 rounded-lg border transition ${
                connectedWifi
                  ? 'border-blue-500 text-blue-600 bg-blue-50 dark:bg-blue-500/10'
                  : 'border-slate-200 dark:border-slate-700 text-slate-500'
              }`}
            >
              <Wifi size={18} />
            </button>
            <button
              onClick={() => setConnectedBt((v) => !v)}
              title="Bluetooth"
              className={`p-2 rounded-lg border transition ${
                connectedBt
                  ? 'border-blue-500 text-blue-600 bg-blue-50 dark:bg-blue-500/10'
                  : 'border-slate-200 dark:border-slate-700 text-slate-500'
              }`}
            >
              <Bluetooth size={18} />
            </button>

            <button
              onClick={() => setDark((v) => !v)}
              className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200"
              aria-label="Toggle dark mode"
            >
              {dark ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            <button className="relative p-2 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200">
              <Bell size={18} />
              {notif && <span className="absolute -top-1 -right-1 h-2.5 w-2.5 bg-blue-500 rounded-full" />}
            </button>

            <button className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200">
              <Settings size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile role switch */}
      <div className="sm:hidden px-4 pb-3">
        <div className="flex rounded-xl p-1 bg-slate-100 dark:bg-slate-800 w-full">
          <button
            className={`flex-1 px-3 py-1.5 rounded-lg transition ${
              role === 'customer' ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow' : 'text-slate-600 dark:text-slate-300'
            }`}
            onClick={() => onRoleChange('customer')}
          >
            Customer
          </button>
          <button
            className={`flex-1 px-3 py-1.5 rounded-lg transition ${
              role === 'admin' ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow' : 'text-slate-600 dark:text-slate-300'
            }`}
            onClick={() => onRoleChange('admin')}
          >
            Admin
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
