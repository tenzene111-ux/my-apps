'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useStore } from '@/lib/store';

export default function Navbar() {
  const { user, cart, logout } = useStore();
  const [search, setSearch] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (search.trim()) window.location.href = `/products?search=${encodeURIComponent(search)}`;
  };

  return (
    <nav className="bg-primary-700 text-white sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center h-16 gap-4">
          <Link href="/" className="text-2xl font-bold shrink-0">MyMarket</Link>

          <form onSubmit={handleSearch} className="flex-1 max-w-2xl">
            <div className="flex">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search products..."
                className="w-full px-4 py-2 rounded-l-lg text-gray-900 focus:outline-none"
              />
              <button type="submit" className="bg-accent-500 px-6 py-2 rounded-r-lg hover:bg-accent-600 font-semibold">
                Search
              </button>
            </div>
          </form>

          <div className="flex items-center gap-4">
            <Link href="/cart" className="relative hover:text-gray-200">
              Cart
              {cart.length > 0 && (
                <span className="absolute -top-2 -right-3 bg-accent-500 text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {cart.length}
                </span>
              )}
            </Link>

            {user ? (
              <div className="relative">
                <button onClick={() => setMenuOpen(!menuOpen)} className="hover:text-gray-200">
                  {user.name}
                </button>
                {menuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white text-gray-800 rounded-lg shadow-lg py-2">
                    <Link href="/orders" className="block px-4 py-2 hover:bg-gray-100" onClick={() => setMenuOpen(false)}>My Orders</Link>
                    <Link href="/messages" className="block px-4 py-2 hover:bg-gray-100" onClick={() => setMenuOpen(false)}>Messages</Link>
                    {(user.role === 'seller' || user.role === 'admin') && (
                      <Link href="/dashboard" className="block px-4 py-2 hover:bg-gray-100" onClick={() => setMenuOpen(false)}>Dashboard</Link>
                    )}
                    {user.role === 'admin' && (
                      <Link href="/admin" className="block px-4 py-2 hover:bg-gray-100" onClick={() => setMenuOpen(false)}>Admin</Link>
                    )}
                    <button onClick={() => { logout(); setMenuOpen(false); }} className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-red-600">
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex gap-2">
                <Link href="/login" className="hover:text-gray-200">Login</Link>
                <Link href="/register" className="bg-accent-500 px-4 py-1 rounded hover:bg-accent-600">Register</Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Category bar */}
      <div className="bg-primary-600 border-t border-primary-500">
        <div className="max-w-7xl mx-auto px-4 flex gap-6 py-2 text-sm overflow-x-auto">
          {['Electronics', 'Fashion', 'Home & Garden', 'Sports', 'Toys', 'Automotive', 'Books', 'Health'].map(cat => (
            <Link key={cat} href={`/products?category=${cat}`} className="whitespace-nowrap hover:text-accent-500">
              {cat}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
