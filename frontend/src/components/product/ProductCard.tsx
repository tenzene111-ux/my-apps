'use client';

import Link from 'next/link';
import { useStore } from '@/lib/store';

interface ProductCardProps {
  product: {
    _id: string;
    title: string;
    price: number;
    compareAtPrice?: number;
    images: string[];
    rating: number;
    reviewCount: number;
    seller?: { sellerProfile?: { storeName?: string } };
    shipping?: { freeShipping?: boolean };
  };
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart, user } = useStore();
  const discount = product.compareAtPrice
    ? Math.round((1 - product.price / product.compareAtPrice) * 100)
    : 0;

  return (
    <div className="bg-white rounded-lg shadow hover:shadow-lg transition overflow-hidden group">
      <Link href={`/products/${product._id}`}>
        <div className="aspect-square bg-gray-100 relative overflow-hidden">
          {product.images[0] ? (
            <img src={`http://localhost:5000${product.images[0]}`} alt={product.title}
              className="w-full h-full object-cover group-hover:scale-105 transition" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">No Image</div>
          )}
          {discount > 0 && (
            <span className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded">-{discount}%</span>
          )}
        </div>
      </Link>

      <div className="p-3">
        <Link href={`/products/${product._id}`}>
          <h3 className="text-sm font-medium text-gray-800 line-clamp-2 hover:text-primary-600">{product.title}</h3>
        </Link>

        <div className="flex items-center gap-1 mt-1">
          <span className="text-yellow-400 text-sm">{'★'.repeat(Math.round(product.rating))}</span>
          <span className="text-xs text-gray-500">({product.reviewCount})</span>
        </div>

        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-lg font-bold text-primary-700">${product.price.toFixed(2)}</span>
          {product.compareAtPrice && (
            <span className="text-sm text-gray-400 line-through">${product.compareAtPrice.toFixed(2)}</span>
          )}
        </div>

        {product.shipping?.freeShipping && (
          <span className="text-xs text-green-600 font-medium">Free Shipping</span>
        )}

        {product.seller?.sellerProfile?.storeName && (
          <p className="text-xs text-gray-500 mt-1">{product.seller.sellerProfile.storeName}</p>
        )}

        {user && (
          <button onClick={() => addToCart(product._id)}
            className="mt-2 w-full bg-primary-600 text-white py-1.5 rounded text-sm hover:bg-primary-700">
            Add to Cart
          </button>
        )}
      </div>
    </div>
  );
}
