import React, { useEffect, useMemo, useState } from 'react';
import { Search, Plus, Minus, ShoppingCart } from 'lucide-react';

const ProductBrowser = ({ onAdd }) => {
  const [q, setQ] = useState('');
  const [cart, setCart] = useState({});
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError('');
      try {
        const base = import.meta.env.VITE_BACKEND_URL;
        const res = await fetch(`${base}/products`);
        if (!res.ok) throw new Error(`Failed to load products (${res.status})`);
        const data = await res.json();
        setProducts(Array.isArray(data) ? data : []);
      } catch (err) {
        setError(err.message || 'Unable to fetch products');
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const results = useMemo(() => {
    const t = q.trim().toLowerCase();
    if (!t) return products;
    return products.filter((p) => (p.name || '').toLowerCase().includes(t));
  }, [q, products]);

  const inc = (id) => setCart((c) => ({ ...c, [id]: (c[id] || 0) + 1 }));
  const dec = (id) => setCart((c) => ({ ...c, [id]: Math.max(0, (c[id] || 0) - 1) }));

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

      {loading && (
        <div className="text-sm text-slate-600 dark:text-slate-300">Loading products…</div>
      )}
      {error && (
        <div className="text-sm text-rose-600">{error}</div>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {results.map((p) => {
          const id = p._id || p.id;
          return (
            <div key={id} className="group rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm hover:shadow-md transition">
              <div className="aspect-video overflow-hidden">
                <img src={p.image || 'https://images.unsplash.com/photo-1585386959984-a41552231641?q=80&w=1600&auto=format&fit=crop'} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
              </div>
              <div className="p-3 space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium text-slate-900 dark:text-white">{p.name}</h3>
                  <span className="text-blue-600 font-semibold">${(p.price || 0).toFixed(2)}</span>
                </div>
                <div className="text-xs text-slate-500">In stock: {p.stock ?? 0}</div>
                <div className="flex items-center justify-between pt-1">
                  <div className="inline-flex items-center gap-2 rounded-xl bg-slate-100 dark:bg-slate-800 p-1">
                    <button onClick={() => dec(id)} className="p-1 rounded-lg hover:bg-white/70 dark:hover:bg-slate-700">
                      <Minus size={16} />
                    </button>
                    <span className="w-6 text-center text-slate-800 dark:text-slate-100">{cart[id] || 0}</span>
                    <button onClick={() => inc(id)} className="p-1 rounded-lg hover:bg-white/70 dark:hover:bg-slate-700">
                      <Plus size={16} />
                    </button>
                  </div>
                  <button onClick={() => onAdd({ [id]: (cart[id] || 0) + 1 })} className="text-sm text-blue-600 hover:underline">
                    Quick add
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default ProductBrowser;
