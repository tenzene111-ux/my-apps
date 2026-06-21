'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import ProductCard from '@/components/product/ProductCard';

export default function HomePage() {
  const [featured, setFeatured] = useState([]);
  const [trending, setTrending] = useState([]);

  useEffect(() => {
    api.get('/products?sort=popular&limit=8').then(d => setFeatured(d.products)).catch(() => {});
    api.get('/products?sort=newest&limit=8').then(d => setTrending(d.products)).catch(() => {});
  }, []);

  const categories = [
    { name: 'Electronics', icon: '💻', color: 'bg-blue-100' },
    { name: 'Fashion', icon: '👗', color: 'bg-pink-100' },
    { name: 'Home & Garden', icon: '🏡', color: 'bg-green-100' },
    { name: 'Sports', icon: '⚽', color: 'bg-orange-100' },
    { name: 'Toys', icon: '🎮', color: 'bg-purple-100' },
    { name: 'Automotive', icon: '🚗', color: 'bg-red-100' },
    { name: 'Books', icon: '📚', color: 'bg-yellow-100' },
    { name: 'Health', icon: '💊', color: 'bg-teal-100' },
  ];

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-r from-primary-700 to-primary-500 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-4">Welcome to MyMarket</h1>
          <p className="text-xl mb-8 text-gray-200">Discover millions of products from trusted sellers worldwide</p>
          <div className="flex gap-4 justify-center">
            <Link href="/products" className="bg-accent-500 hover:bg-accent-600 px-8 py-3 rounded-lg font-semibold text-lg">
              Start Shopping
            </Link>
            <Link href="/register?role=seller" className="border-2 border-white hover:bg-white hover:text-primary-700 px-8 py-3 rounded-lg font-semibold text-lg">
              Sell on MyMarket
            </Link>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold mb-6">Shop by Category</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
          {categories.map(cat => (
            <Link key={cat.name} href={`/products?category=${cat.name}`}
              className={`${cat.color} rounded-xl p-4 text-center hover:shadow-lg transition`}>
              <div className="text-3xl mb-2">{cat.icon}</div>
              <div className="text-sm font-medium text-gray-700">{cat.name}</div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured */}
      {featured.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Best Sellers</h2>
            <Link href="/products?sort=popular" className="text-primary-600 hover:underline">View All</Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {featured.map((p: any) => <ProductCard key={p._id} product={p} />)}
          </div>
        </section>
      )}

      {/* Trending */}
      {trending.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">New Arrivals</h2>
            <Link href="/products?sort=newest" className="text-primary-600 hover:underline">View All</Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {trending.map((p: any) => <ProductCard key={p._id} product={p} />)}
          </div>
        </section>
      )}

      {/* Seller CTA */}
      <section className="bg-gray-100 py-16 mt-8">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Start Selling Today</h2>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Join thousands of sellers and reach millions of buyers. Easy setup, powerful tools, and dedicated support.
          </p>
          <Link href="/register?role=seller" className="bg-primary-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary-700">
            Create Seller Account
          </Link>
        </div>
      </section>
    </div>
  );
}
