'use client';

import Link from 'next/link';
import { useStore } from '@/lib/store';
import { api } from '@/lib/api';
import { useState } from 'react';

export default function CartPage() {
  const { cart, updateCartItem, removeFromCart, user } = useStore();
  const [checkingOut, setCheckingOut] = useState(false);

  const subtotal = cart.reduce((sum, item) => sum + (item.product?.price || 0) * item.quantity, 0);
  const shipping = subtotal > 50 ? 0 : 9.99;
  const tax = subtotal * 0.1;
  const total = subtotal + shipping + tax;

  const handleCheckout = async () => {
    if (!user) return;
    setCheckingOut(true);
    try {
      await api.post('/orders', {
        shippingAddress: user,
        paymentMethod: 'card',
        shippingCost: shipping,
      });
      window.location.href = '/orders';
    } catch {
      setCheckingOut(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-bold mb-4">Your Cart is Empty</h1>
        <Link href="/products" className="text-primary-600 hover:underline">Continue Shopping</Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Shopping Cart ({cart.length} items)</h1>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {cart.map((item) => (
            <div key={item.product?._id} className="bg-white rounded-lg shadow p-4 flex gap-4">
              <div className="w-24 h-24 bg-gray-100 rounded shrink-0">
                {item.product?.images?.[0] && (
                  <img src={`http://localhost:5000${item.product.images[0]}`} alt="" className="w-full h-full object-cover rounded" />
                )}
              </div>
              <div className="flex-1">
                <Link href={`/products/${item.product?._id}`} className="font-medium hover:text-primary-600">
                  {item.product?.title}
                </Link>
                <p className="text-lg font-bold text-primary-700 mt-1">${item.product?.price?.toFixed(2)}</p>
                <div className="flex items-center gap-4 mt-2">
                  <div className="flex items-center border rounded">
                    <button onClick={() => updateCartItem(item.product?._id, item.quantity - 1)} className="px-2 py-1 hover:bg-gray-100">-</button>
                    <span className="px-3 py-1 border-x">{item.quantity}</span>
                    <button onClick={() => updateCartItem(item.product?._id, item.quantity + 1)} className="px-2 py-1 hover:bg-gray-100">+</button>
                  </div>
                  <button onClick={() => removeFromCart(item.product?._id)} className="text-red-500 text-sm hover:underline">Remove</button>
                </div>
              </div>
              <div className="text-right font-bold">
                ${((item.product?.price || 0) * item.quantity).toFixed(2)}
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-lg shadow p-6 h-fit">
          <h2 className="text-lg font-bold mb-4">Order Summary</h2>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between"><span>Subtotal</span><span>${subtotal.toFixed(2)}</span></div>
            <div className="flex justify-between"><span>Shipping</span><span>{shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}</span></div>
            <div className="flex justify-between"><span>Tax</span><span>${tax.toFixed(2)}</span></div>
            <hr className="my-2" />
            <div className="flex justify-between text-lg font-bold"><span>Total</span><span>${total.toFixed(2)}</span></div>
          </div>
          {subtotal < 50 && (
            <p className="text-sm text-green-600 mt-2">Add ${(50 - subtotal).toFixed(2)} more for free shipping!</p>
          )}
          <button onClick={handleCheckout} disabled={checkingOut}
            className="w-full mt-4 bg-accent-500 text-white py-3 rounded-lg font-semibold hover:bg-accent-600 disabled:opacity-50">
            {checkingOut ? 'Processing...' : 'Proceed to Checkout'}
          </button>
        </div>
      </div>
    </div>
  );
}
