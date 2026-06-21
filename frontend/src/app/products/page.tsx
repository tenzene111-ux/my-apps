'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { api } from '@/lib/api';
import ProductCard from '@/components/product/ProductCard';

export default function ProductsPage() {
  const searchParams = useSearchParams();
  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState(searchParams.get('sort') || 'newest');
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });

  const search = searchParams.get('search') || '';
  const category = searchParams.get('category') || '';

  useEffect(() => {
    const params = new URLSearchParams();
    if (search) params.set('search', search);
    if (category) params.set('category', category);
    if (sort) params.set('sort', sort);
    if (priceRange.min) params.set('minPrice', priceRange.min);
    if (priceRange.max) params.set('maxPrice', priceRange.max);
    params.set('page', String(page));

    api.get(`/products?${params}`).then(data => {
      setProducts(data.products);
      setTotal(data.total);
    }).catch(() => {});
  }, [search, category, sort, page, priceRange.min, priceRange.max]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">
            {category || search ? `Results for "${category || search}"` : 'All Products'}
          </h1>
          <p className="text-gray-500">{total} products found</p>
        </div>
        <select value={sort} onChange={e => setSort(e.target.value)}
          className="border rounded-lg px-3 py-2">
          <option value="newest">Newest</option>
          <option value="popular">Most Popular</option>
          <option value="rating">Highest Rated</option>
          <option value="price_asc">Price: Low to High</option>
          <option value="price_desc">Price: High to Low</option>
        </select>
      </div>

      <div className="flex gap-8">
        {/* Filters sidebar */}
        <div className="w-56 shrink-0 hidden md:block">
          <div className="bg-white rounded-lg p-4 shadow">
            <h3 className="font-semibold mb-3">Price Range</h3>
            <div className="flex gap-2">
              <input type="number" placeholder="Min" value={priceRange.min}
                onChange={e => setPriceRange(p => ({ ...p, min: e.target.value }))}
                className="w-full border rounded px-2 py-1 text-sm" />
              <input type="number" placeholder="Max" value={priceRange.max}
                onChange={e => setPriceRange(p => ({ ...p, max: e.target.value }))}
                className="w-full border rounded px-2 py-1 text-sm" />
            </div>

            <h3 className="font-semibold mt-4 mb-3">Categories</h3>
            {['Electronics', 'Fashion', 'Home & Garden', 'Sports', 'Toys', 'Books'].map(cat => (
              <a key={cat} href={`/products?category=${cat}`}
                className={`block py-1 text-sm hover:text-primary-600 ${category === cat ? 'text-primary-600 font-medium' : 'text-gray-600'}`}>
                {cat}
              </a>
            ))}
          </div>
        </div>

        {/* Product grid */}
        <div className="flex-1">
          {products.length > 0 ? (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {products.map((p: any) => <ProductCard key={p._id} product={p} />)}
            </div>
          ) : (
            <div className="text-center py-20 text-gray-500">No products found</div>
          )}
        </div>
      </div>
    </div>
  );
}
