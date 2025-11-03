'use client';

import Link from 'next/link';
import { Facebook, Twitter, Instagram, Github } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-900">
      <div className="container-custom py-12">
        <div className="grid gap-8 md:grid-cols-4">
          <div>
            <h3 className="mb-4 text-lg font-bold">NovaCart</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Your trusted e-commerce platform for quality products and exceptional service.
            </p>
            <div className="mt-4 flex gap-4">
              <a href="#" className="text-gray-600 hover:text-primary-600">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-600 hover:text-primary-600">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-600 hover:text-primary-600">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-600 hover:text-primary-600">
                <Github className="h-5 w-5" />
              </a>
            </div>
          </div>
          <div>
            <h4 className="mb-4 font-semibold">Shop</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/products">All Products</Link></li>
              <li><Link href="/categories">Categories</Link></li>
              <li><Link href="/products?featured=true">Featured</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="mb-4 font-semibold">Support</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/contact">Contact Us</Link></li>
              <li><Link href="/faq">FAQ</Link></li>
              <li><Link href="/shipping">Shipping Info</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="mb-4 font-semibold">Legal</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/privacy">Privacy Policy</Link></li>
              <li><Link href="/terms">Terms of Service</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-8 border-t border-gray-200 pt-8 text-center text-sm text-gray-600 dark:border-gray-800">
          © {new Date().getFullYear()} NovaCart. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
