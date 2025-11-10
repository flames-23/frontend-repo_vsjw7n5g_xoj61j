import React, { useEffect, useMemo, useState } from 'react';
import { Search, Plus, Minus, ShoppingCart } from 'lucide-react';

const sampleProducts = [
  { id: 'p1', name: 'Energy Drink', price: 2.99, stock: 18, image: 'https://images.unsplash.com/photo-1560689189-65b6ed6228e7?ixid=M3w3OTkxMTl8MHwxfHNlYXJjaHwxfHxFbmVyZ3klMjBEcmlua3xlbnwwfDB8fHwxNzYyNzUxNzU1fDA&ixlib=rb-4.1.0&w=1600&auto=format&fit=crop&q=80' },
  { id: 'p2', name: 'Protein Bar', price: 1.49, stock: 42, image: 'https://images.unsplash.com/photo-1560689189-65b6ed6228e7?ixid=M3w3OTkxMTl8MHwxfHNlYXJjaHwxfHxFbmVyZ3klMjBEcmlua3xlbnwwfDB8fHwxNzYyNzUxNzU1fDA&ixlib=rb-4.1.0&w=1600&auto=format&fit=crop&q=80' },
  { id: 'p3', name: 'Pain Relief', price: 4.99, stock: 12, image: 'https://images.unsplash.com/photo-1560689189-65b6ed6228e7?ixid=M3w3OTkxMTl8MHwxfHNlYXJjaHwxfHxFbmVyZ3klMjBEcmlua3xlbnwwfDB8fHwxNzYyNzUxNzU1fDA&ixlib=rb-4.1.0&w=1600&auto=format&fit=crop&q=80' },
  { id: 'p4', name: 'Electrolyte Water', price: 1.99, stock: 30, image: 'https://images.unsplash.com/photo-1560689189-65b6ed6228e7?ixid=M3w3OTkxMTl8MHwxfHNlYXJjaHwxfHxFbmVyZ3klMjBEcmlua3xlbnwwfDB8fHwxNzYyNzUxNzU1fDA&ixlib=rb-4.1.0&w=1600&auto=format&fit=crop&q=80' },
];

const ProductBrowser = ({ onAdd }) => {
  const [q, setQ] = useState('');
  const [cart, setCart] = useState({});

  const results = useMemo(() => {
    const t = q.trim().toLowerCase();
    if (!t) return sampleProducts;
    return sampleProducts.filter(p => p.name.toLowerCase().includes(t));
  }, [q]);

  const inc = (id) => setCart(c => ({ ...c, [id]: (c[id] || 0) + 1 }));
  const dec = (id) => setCart(c => ({ ...c, [id]: Math.max(0, (c[id] || 0) - 1) }));

  useEffect(() => {
    const listener = (e) => {
      if (e.key === 'Enter') onAdd(cart);
    };
    window.addEventListener('keydown', listener);
    return () => window.removeEventListener('keydown', listener);
  }, [cart, onAdd]);

  return (
    <section className="space-y-4">
      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search products..."
            className="w-full pl-10 pr-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <button
          onClick={() => onAdd(cart)}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-br from-blue-600 to-cyan-500 text-white shadow hover:shadow-md transition"
        >
          <ShoppingCart size={18} /> Add to Order
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {results.map((p) => (
          <div key={p.id} className="group rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm hover:shadow-md transition">
            <div className="aspect-video overflow-hidden">
              <img src={p.image} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
            </div>
            <div className="p-3 space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="font-medium text-slate-900 dark:text-white">{p.name}</h3>
                <span className="text-blue-600 font-semibold">${p.price.toFixed(2)}</span>
              </div>
              <div className="text-xs text-slate-500">In stock: {p.stock}</div>
              <div className="flex items-center justify-between pt-1">
                <div className="inline-flex items-center gap-2 rounded-xl bg-slate-100 dark:bg-slate-800 p-1">
                  <button onClick={() => dec(p.id)} className="p-1 rounded-lg hover:bg-white/70 dark:hover:bg-slate-700">
                    <Minus size={16} />
                  </button>
                  <span className="w-6 text-center text-slate-800 dark:text-slate-100">{cart[p.id] || 0}</span>
                  <button onClick={() => inc(p.id)} className="p-1 rounded-lg hover:bg-white/70 dark:hover:bg-slate-700">
                    <Plus size={16} />
                  </button>
                </div>
                <button onClick={() => onAdd({ [p.id]: (cart[p.id] || 0) + 1 })} className="text-sm text-blue-600 hover:underline">
                  Quick add
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ProductBrowser;
