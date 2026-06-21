import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-gray-800 text-gray-300 mt-12">
      <div className="max-w-7xl mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <h3 className="text-white text-lg font-bold mb-3">MyMarket</h3>
          <p className="text-sm">Your trusted marketplace for everything. Buy and sell with confidence.</p>
        </div>
        <div>
          <h4 className="text-white font-semibold mb-3">Shop</h4>
          <div className="flex flex-col gap-2 text-sm">
            <Link href="/products" className="hover:text-white">All Products</Link>
            <Link href="/products?sort=popular" className="hover:text-white">Best Sellers</Link>
            <Link href="/products?sort=newest" className="hover:text-white">New Arrivals</Link>
          </div>
        </div>
        <div>
          <h4 className="text-white font-semibold mb-3">Sell</h4>
          <div className="flex flex-col gap-2 text-sm">
            <Link href="/register?role=seller" className="hover:text-white">Become a Seller</Link>
            <Link href="/dashboard" className="hover:text-white">Seller Dashboard</Link>
          </div>
        </div>
        <div>
          <h4 className="text-white font-semibold mb-3">Support</h4>
          <div className="flex flex-col gap-2 text-sm">
            <Link href="/help" className="hover:text-white">Help Center</Link>
            <Link href="/contact" className="hover:text-white">Contact Us</Link>
          </div>
        </div>
      </div>
      <div className="border-t border-gray-700 py-4 text-center text-sm">
        &copy; {new Date().getFullYear()} MyMarket. All rights reserved.
      </div>
    </footer>
  );
}
