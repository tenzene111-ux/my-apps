'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useStore } from '@/lib/store';

export default function RegisterPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { register } = useStore();
  const [form, setForm] = useState({
    name: '', email: '', password: '', confirmPassword: '',
    role: searchParams.get('role') || 'buyer'
  });
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (form.password !== form.confirmPassword) { setError('Passwords do not match'); return; }
    try {
      await register(form.name, form.email, form.password, form.role);
      router.push('/');
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-20">
      <h1 className="text-2xl font-bold text-center mb-8">Create Account</h1>
      {error && <div className="bg-red-50 text-red-600 p-3 rounded mb-4">{error}</div>}
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow space-y-4">
        <input type="text" placeholder="Full Name" required value={form.name}
          onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
          className="w-full border rounded px-3 py-2" />
        <input type="email" placeholder="Email" required value={form.email}
          onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
          className="w-full border rounded px-3 py-2" />
        <input type="password" placeholder="Password (min 6 chars)" required value={form.password}
          onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
          className="w-full border rounded px-3 py-2" />
        <input type="password" placeholder="Confirm Password" required value={form.confirmPassword}
          onChange={e => setForm(f => ({ ...f, confirmPassword: e.target.value }))}
          className="w-full border rounded px-3 py-2" />
        <div className="flex gap-4">
          <label className={`flex-1 p-3 border rounded-lg text-center cursor-pointer ${form.role === 'buyer' ? 'border-primary-500 bg-primary-50' : ''}`}>
            <input type="radio" name="role" value="buyer" checked={form.role === 'buyer'}
              onChange={e => setForm(f => ({ ...f, role: e.target.value }))} className="sr-only" />
            <div className="font-medium">Buyer</div>
            <div className="text-xs text-gray-500">Shop products</div>
          </label>
          <label className={`flex-1 p-3 border rounded-lg text-center cursor-pointer ${form.role === 'seller' ? 'border-primary-500 bg-primary-50' : ''}`}>
            <input type="radio" name="role" value="seller" checked={form.role === 'seller'}
              onChange={e => setForm(f => ({ ...f, role: e.target.value }))} className="sr-only" />
            <div className="font-medium">Seller</div>
            <div className="text-xs text-gray-500">Sell products</div>
          </label>
        </div>
        <button type="submit" className="w-full bg-primary-600 text-white py-2 rounded font-semibold hover:bg-primary-700">
          Create Account
        </button>
      </form>
      <p className="text-center mt-4 text-gray-600">
        Already have an account? <Link href="/login" className="text-primary-600 hover:underline">Sign In</Link>
      </p>
    </div>
  );
}
