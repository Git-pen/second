'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, ShoppingBag, Truck, Shield, Zap } from 'lucide-react';
import api from '@/lib/api';
import { Product } from '@/types';
import { ProductCard } from '@/components/ProductCard';

export default function HomePage() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFeaturedProducts();
  }, []);

  const fetchFeaturedProducts = async () => {
    try {
      const response = await api.get('/products?featured=true&limit=8');
      setFeaturedProducts(response.data.data.products);
    } catch (error) {
      console.error('Failed to fetch featured products:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      <section className="relative bg-gradient-to-br from-primary-600 to-primary-800 py-20 text-white">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mx-auto max-w-3xl text-center"
          >
            <h1 className="mb-6 text-5xl font-bold md:text-6xl">
              Welcome to NovaCart
            </h1>
            <p className="mb-8 text-xl text-primary-100">
              Discover amazing products at unbeatable prices. Fast shipping, secure payments, and exceptional service.
            </p>
            <Link
              href="/products"
              className="btn btn-primary inline-flex items-center gap-2 bg-white text-primary-600 hover:bg-primary-50"
            >
              Start Shopping
              <ArrowRight className="h-5 w-5" />
            </Link>
          </motion.div>
        </div>
      </section>

      <section className="py-16">
        <div className="container-custom">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: ShoppingBag, title: 'Wide Selection', description: 'Thousands of products to choose from' },
              { icon: Truck, title: 'Fast Shipping', description: 'Free delivery on orders over $50' },
              { icon: Shield, title: 'Secure Payment', description: 'Your data is safe and encrypted' },
              { icon: Zap, title: 'Quick Support', description: '24/7 customer service available' },
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="card text-center"
              >
                <feature.icon className="mx-auto mb-4 h-12 w-12 text-primary-600" />
                <h3 className="mb-2 text-lg font-semibold">{feature.title}</h3>
                <p className="text-gray-600 dark:text-gray-400">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-gray-50 py-16 dark:bg-gray-900">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mb-12 text-center"
          >
            <h2 className="mb-4 text-4xl font-bold">Featured Products</h2>
            <p className="text-gray-600 dark:text-gray-400">
              Check out our hand-picked selection of trending products
            </p>
          </motion.div>

          {loading ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="card animate-pulse">
                  <div className="mb-4 h-48 bg-gray-200 dark:bg-gray-700"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}

          <div className="mt-12 text-center">
            <Link href="/products" className="btn btn-primary">
              View All Products
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
