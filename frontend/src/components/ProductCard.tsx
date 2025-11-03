'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ShoppingCart, Heart } from 'lucide-react';
import { Product } from '@/types';
import { formatPrice } from '@/lib/utils';
import { useCartStore } from '@/store/useCartStore';
import toast from 'react-hot-toast';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const addToCart = useCartStore((state) => state.addToCart);

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    try {
      await addToCart(product.id);
      toast.success('Added to cart!');
    } catch (error) {
      toast.error('Failed to add to cart');
    }
  };

  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="card group overflow-hidden"
    >
      <Link href={`/product/${product.id}`}>
        <div className="relative mb-4 aspect-square overflow-hidden rounded-lg bg-gray-100">
          <Image
            src={product.images[0] || '/placeholder.png'}
            alt={product.title}
            fill
            className="object-cover transition-transform group-hover:scale-110"
          />
          {product.comparePrice && product.comparePrice > product.price && (
            <div className="absolute right-2 top-2 rounded-full bg-red-500 px-2 py-1 text-xs font-semibold text-white">
              Save {Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)}%
            </div>
          )}
        </div>
        <h3 className="mb-2 font-semibold line-clamp-2">{product.title}</h3>
        <p className="mb-2 text-sm text-gray-600 line-clamp-2 dark:text-gray-400">
          {product.description}
        </p>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-lg font-bold text-primary-600">{formatPrice(product.price)}</p>
            {product.comparePrice && (
              <p className="text-sm text-gray-500 line-through">{formatPrice(product.comparePrice)}</p>
            )}
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleAddToCart}
              className="btn btn-primary p-2"
            >
              <ShoppingCart className="h-4 w-4" />
            </button>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
