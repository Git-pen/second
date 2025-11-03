'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import api from '@/lib/api';
import { Product } from '@/types';
import { ProductCard } from '@/components/ProductCard';

export default function ProductsPage() {
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [sortBy, setSortBy] = useState('createdAt');
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, [selectedCategory, sortBy, search]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (selectedCategory) params.append('category', selectedCategory);
      if (sortBy) params.append('sortBy', sortBy);
      if (search) params.append('search', search);

      const response = await api.get(`/products?${params.toString()}`);
      setProducts(response.data.data.products);
    } catch (error) {
      console.error('Failed to fetch products:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await api.get('/products/categories');
      setCategories(response.data.data.categories.map((c: any) => c.category));
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 dark:bg-gray-900">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="mb-4 text-4xl font-bold">All Products</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Discover our complete collection of products
          </p>
        </motion.div>

        <div className="mb-8 flex flex-wrap gap-4">
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input flex-1"
          />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="input"
          >
            <option value="">All Categories</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="input"
          >
            <option value="createdAt">Newest</option>
            <option value="price">Price: Low to High</option>
            <option value="rating">Highest Rated</option>
          </select>
        </div>

        {loading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="card animate-pulse">
                <div className="mb-4 h-48 bg-gray-200 dark:bg-gray-700"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700"></div>
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="py-16 text-center">
            <p className="text-gray-600 dark:text-gray-400">No products found</p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
