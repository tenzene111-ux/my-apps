'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { api } from '@/lib/api';
import { useStore } from '@/lib/store';

export default function ProductDetailPage() {
  const { id } = useParams();
  const { addToCart, user } = useStore();
  const [product, setProduct] = useState<any>(null);
  const [reviews, setReviews] = useState<any[]>([]);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [reviewForm, setReviewForm] = useState({ rating: 5, title: '', comment: '' });

  useEffect(() => {
    api.get(`/products/${id}`).then(setProduct).catch(() => {});
    api.get(`/reviews/product/${id}`).then(d => setReviews(d.reviews)).catch(() => {});
  }, [id]);

  const submitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const review = await api.post('/reviews', { productId: id, ...reviewForm });
      setReviews([review, ...reviews]);
      setReviewForm({ rating: 5, title: '', comment: '' });
    } catch {}
  };

  if (!product) return <div className="max-w-7xl mx-auto px-4 py-20 text-center">Loading...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="grid md:grid-cols-2 gap-8">
        {/* Images */}
        <div>
          <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden mb-4">
            {product.images[selectedImage] ? (
              <img src={`http://localhost:5000${product.images[selectedImage]}`} alt={product.title}
                className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">No Image</div>
            )}
          </div>
          {product.images.length > 1 && (
            <div className="flex gap-2">
              {product.images.map((img: string, i: number) => (
                <button key={i} onClick={() => setSelectedImage(i)}
                  className={`w-16 h-16 rounded border-2 overflow-hidden ${i === selectedImage ? 'border-primary-500' : 'border-gray-200'}`}>
                  <img src={`http://localhost:5000${img}`} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Details */}
        <div>
          <h1 className="text-2xl font-bold mb-2">{product.title}</h1>
          <div className="flex items-center gap-2 mb-4">
            <span className="text-yellow-400">{'★'.repeat(Math.round(product.rating))}</span>
            <span className="text-gray-500">({product.reviewCount} reviews)</span>
            <span className="text-gray-400">|</span>
            <span className="text-gray-500">{product.totalSold} sold</span>
          </div>

          <div className="flex items-baseline gap-3 mb-4">
            <span className="text-3xl font-bold text-primary-700">${product.price.toFixed(2)}</span>
            {product.compareAtPrice && (
              <span className="text-xl text-gray-400 line-through">${product.compareAtPrice.toFixed(2)}</span>
            )}
          </div>

          {product.shipping?.freeShipping && (
            <div className="text-green-600 font-medium mb-4">Free Shipping</div>
          )}

          <p className="text-gray-600 mb-6">{product.description}</p>

          {product.stock > 0 ? (
            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center border rounded">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="px-3 py-2 hover:bg-gray-100">-</button>
                <span className="px-4 py-2 border-x">{quantity}</span>
                <button onClick={() => setQuantity(Math.min(product.stock, quantity + 1))} className="px-3 py-2 hover:bg-gray-100">+</button>
              </div>
              <span className="text-gray-500 text-sm">{product.stock} available</span>
            </div>
          ) : (
            <div className="text-red-500 font-semibold mb-6">Out of Stock</div>
          )}

          {user && product.stock > 0 && (
            <button onClick={() => addToCart(product._id, quantity)}
              className="w-full bg-primary-600 text-white py-3 rounded-lg font-semibold text-lg hover:bg-primary-700">
              Add to Cart
            </button>
          )}

          {product.seller && (
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <p className="font-medium">Sold by: {product.seller.sellerProfile?.storeName || product.seller.name}</p>
              {product.seller.sellerProfile?.rating > 0 && (
                <p className="text-sm text-gray-500">Seller Rating: {product.seller.sellerProfile.rating.toFixed(1)} / 5</p>
              )}
            </div>
          )}

          {product.specifications && (
            <div className="mt-6">
              <h3 className="font-semibold mb-2">Specifications</h3>
              <dl className="grid grid-cols-2 gap-2 text-sm">
                {Object.entries(product.specifications).map(([key, val]) => (
                  <div key={key} className="contents">
                    <dt className="text-gray-500">{key}</dt>
                    <dd>{String(val)}</dd>
                  </div>
                ))}
              </dl>
            </div>
          )}
        </div>
      </div>

      {/* Reviews */}
      <section className="mt-12">
        <h2 className="text-xl font-bold mb-6">Customer Reviews</h2>

        {user && (
          <form onSubmit={submitReview} className="bg-white p-6 rounded-lg shadow mb-8">
            <h3 className="font-semibold mb-4">Write a Review</h3>
            <div className="flex gap-2 mb-4">
              {[1, 2, 3, 4, 5].map(n => (
                <button key={n} type="button" onClick={() => setReviewForm(f => ({ ...f, rating: n }))}
                  className={`text-2xl ${n <= reviewForm.rating ? 'text-yellow-400' : 'text-gray-300'}`}>★</button>
              ))}
            </div>
            <input type="text" placeholder="Review title" value={reviewForm.title}
              onChange={e => setReviewForm(f => ({ ...f, title: e.target.value }))}
              className="w-full border rounded px-3 py-2 mb-3" />
            <textarea placeholder="Your review..." value={reviewForm.comment}
              onChange={e => setReviewForm(f => ({ ...f, comment: e.target.value }))}
              className="w-full border rounded px-3 py-2 mb-3 h-24" />
            <button type="submit" className="bg-primary-600 text-white px-6 py-2 rounded hover:bg-primary-700">Submit Review</button>
          </form>
        )}

        <div className="space-y-4">
          {reviews.map((r: any) => (
            <div key={r._id} className="bg-white p-4 rounded-lg shadow">
              <div className="flex items-center gap-2 mb-2">
                <span className="font-medium">{r.user?.name}</span>
                <span className="text-yellow-400">{'★'.repeat(r.rating)}</span>
                <span className="text-gray-400 text-sm">{new Date(r.createdAt).toLocaleDateString()}</span>
              </div>
              {r.title && <p className="font-medium">{r.title}</p>}
              <p className="text-gray-600">{r.comment}</p>
            </div>
          ))}
          {reviews.length === 0 && <p className="text-gray-500">No reviews yet.</p>}
        </div>
      </section>
    </div>
  );
}
