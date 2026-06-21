'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { useStore } from '@/lib/store';

export default function DashboardPage() {
  const { user } = useStore();
  const [products, setProducts] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: '', description: '', price: '', category: 'Electronics', stock: '', brand: '' });

  useEffect(() => {
    if (user?.role === 'seller' || user?.role === 'admin') {
      api.get('/products?seller=me').then(d => setProducts(d.products)).catch(() => {});
      api.get('/orders/seller').then(setOrders).catch(() => {});
    }
  }, [user]);

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const product = await api.post('/products', {
        ...form,
        price: Number(form.price),
        stock: Number(form.stock),
      });
      setProducts([product, ...products]);
      setShowForm(false);
      setForm({ title: '', description: '', price: '', category: 'Electronics', stock: '', brand: '' });
    } catch {}
  };

  if (!user || (user.role !== 'seller' && user.role !== 'admin')) {
    return <div className="max-w-7xl mx-auto px-4 py-20 text-center">Seller access required.</div>;
  }

  const totalRevenue = orders.reduce((sum, o) => sum + (o.total || 0), 0);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Seller Dashboard</h1>
        <button onClick={() => setShowForm(!showForm)}
          className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700">
          + Add Product
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Products', value: products.length },
          { label: 'Orders', value: orders.length },
          { label: 'Revenue', value: `$${totalRevenue.toFixed(2)}` },
          { label: 'Avg Rating', value: products.length ? (products.reduce((s, p) => s + p.rating, 0) / products.length).toFixed(1) : '0' },
        ].map(stat => (
          <div key={stat.label} className="bg-white rounded-lg shadow p-6 text-center">
            <p className="text-gray-500 text-sm">{stat.label}</p>
            <p className="text-2xl font-bold mt-1">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Add product form */}
      {showForm && (
        <form onSubmit={handleAddProduct} className="bg-white rounded-lg shadow p-6 mb-8 grid md:grid-cols-2 gap-4">
          <input type="text" placeholder="Product Title" required value={form.title}
            onChange={e => setForm(f => ({ ...f, title: e.target.value }))} className="border rounded px-3 py-2" />
          <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))} className="border rounded px-3 py-2">
            {['Electronics', 'Fashion', 'Home & Garden', 'Sports', 'Toys', 'Automotive', 'Books', 'Health'].map(c => (
              <option key={c}>{c}</option>
            ))}
          </select>
          <input type="number" placeholder="Price" required value={form.price} step="0.01"
            onChange={e => setForm(f => ({ ...f, price: e.target.value }))} className="border rounded px-3 py-2" />
          <input type="number" placeholder="Stock" required value={form.stock}
            onChange={e => setForm(f => ({ ...f, stock: e.target.value }))} className="border rounded px-3 py-2" />
          <input type="text" placeholder="Brand" value={form.brand}
            onChange={e => setForm(f => ({ ...f, brand: e.target.value }))} className="border rounded px-3 py-2" />
          <textarea placeholder="Description" required value={form.description}
            onChange={e => setForm(f => ({ ...f, description: e.target.value }))} className="border rounded px-3 py-2 md:col-span-2" />
          <div className="md:col-span-2 flex gap-3">
            <button type="submit" className="bg-primary-600 text-white px-6 py-2 rounded hover:bg-primary-700">Save Product</button>
            <button type="button" onClick={() => setShowForm(false)} className="border px-6 py-2 rounded hover:bg-gray-50">Cancel</button>
          </div>
        </form>
      )}

      {/* Products list */}
      <h2 className="text-xl font-bold mb-4">Your Products</h2>
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-left">
            <tr>
              <th className="p-3">Product</th>
              <th className="p-3">Price</th>
              <th className="p-3">Stock</th>
              <th className="p-3">Sold</th>
              <th className="p-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {products.map(p => (
              <tr key={p._id} className="border-t hover:bg-gray-50">
                <td className="p-3 font-medium">{p.title}</td>
                <td className="p-3">${p.price.toFixed(2)}</td>
                <td className="p-3">{p.stock}</td>
                <td className="p-3">{p.totalSold}</td>
                <td className="p-3"><span className={`px-2 py-1 rounded text-xs ${p.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100'}`}>{p.status}</span></td>
              </tr>
            ))}
            {products.length === 0 && <tr><td colSpan={5} className="p-8 text-center text-gray-500">No products yet</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
