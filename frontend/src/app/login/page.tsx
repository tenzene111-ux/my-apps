'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useStore } from '@/lib/store';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useStore();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await login(form.email, form.password);
      router.push('/');
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-20">
      <h1 className="text-2xl font-bold text-center mb-8">Sign In</h1>
      {error && <div className="bg-red-50 text-red-600 p-3 rounded mb-4">{error}</div>}
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow space-y-4">
        <input type="email" placeholder="Email" required value={form.email}
          onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
          className="w-full border rounded px-3 py-2" />
        <input type="password" placeholder="Password" required value={form.password}
          onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
          className="w-full border rounded px-3 py-2" />
        <button type="submit" className="w-full bg-primary-600 text-white py-2 rounded font-semibold hover:bg-primary-700">
          Sign In
        </button>
      </form>
      <p className="text-center mt-4 text-gray-600">
        Don&apos;t have an account? <Link href="/register" className="text-primary-600 hover:underline">Register</Link>
      </p>
    </div>
  );
}
