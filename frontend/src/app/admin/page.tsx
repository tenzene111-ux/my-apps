'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { useStore } from '@/lib/store';

export default function AdminPage() {
  const { user } = useStore();
  const [stats, setStats] = useState<any>({});
  const [users, setUsers] = useState<any[]>([]);
  const [tab, setTab] = useState('overview');

  useEffect(() => {
    if (user?.role === 'admin') {
      api.get('/admin/stats').then(setStats).catch(() => {});
      api.get('/admin/users').then(d => setUsers(d.users)).catch(() => {});
    }
  }, [user]);

  if (!user || user.role !== 'admin') {
    return <div className="max-w-7xl mx-auto px-4 py-20 text-center">Admin access required.</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>

      <div className="flex gap-4 mb-8">
        {['overview', 'users', 'orders'].map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-4 py-2 rounded-lg font-medium ${tab === t ? 'bg-primary-600 text-white' : 'bg-gray-100 hover:bg-gray-200'}`}>
            {t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>

      {tab === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            { label: 'Total Users', value: stats.users || 0 },
            { label: 'Total Products', value: stats.products || 0 },
            { label: 'Total Orders', value: stats.orders || 0 },
            { label: 'Total Revenue', value: `$${(stats.revenue || 0).toFixed(2)}` },
          ].map(s => (
            <div key={s.label} className="bg-white rounded-lg shadow p-6 text-center">
              <p className="text-gray-500 text-sm">{s.label}</p>
              <p className="text-3xl font-bold mt-2">{s.value}</p>
            </div>
          ))}
        </div>
      )}

      {tab === 'users' && (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-left">
              <tr>
                <th className="p-3">Name</th>
                <th className="p-3">Email</th>
                <th className="p-3">Role</th>
                <th className="p-3">Joined</th>
              </tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u._id} className="border-t hover:bg-gray-50">
                  <td className="p-3 font-medium">{u.name}</td>
                  <td className="p-3">{u.email}</td>
                  <td className="p-3">
                    <span className={`px-2 py-1 rounded text-xs ${u.role === 'admin' ? 'bg-red-100 text-red-700' : u.role === 'seller' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100'}`}>
                      {u.role}
                    </span>
                  </td>
                  <td className="p-3 text-gray-500">{new Date(u.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
