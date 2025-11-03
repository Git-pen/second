'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, Trash2, Plus, Minus } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useCartStore } from '@/store/useCartStore';
import { formatPrice } from '@/lib/utils';
import toast from 'react-hot-toast';

export function CartDrawer() {
  const { cart, isOpen, closeCart, updateCartItem, removeFromCart } = useCartStore();

  const handleUpdateQuantity = async (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    try {
      await updateCartItem(itemId, newQuantity);
    } catch (error) {
      toast.error('Failed to update quantity');
    }
  };

  const handleRemove = async (itemId: string) => {
    try {
      await removeFromCart(itemId);
      toast.success('Item removed from cart');
    } catch (error) {
      toast.error('Failed to remove item');
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
            className="fixed inset-0 z-50 bg-black/50"
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25 }}
            className="fixed right-0 top-0 z-50 h-full w-full max-w-md bg-white shadow-xl dark:bg-gray-900"
          >
            <div className="flex h-full flex-col">
              <div className="flex items-center justify-between border-b p-4">
                <h2 className="text-xl font-semibold">Shopping Cart</h2>
                <button onClick={closeCart} className="text-gray-500 hover:text-gray-700">
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-4">
                {!cart || cart.items.length === 0 ? (
                  <div className="flex h-full items-center justify-center text-gray-500">
                    Your cart is empty
                  </div>
                ) : (
                  <div className="space-y-4">
                    {cart.items.map((item) => (
                      <div key={item.id} className="flex gap-4 rounded-lg border p-4">
                        <div className="relative h-20 w-20 overflow-hidden rounded-lg">
                          <Image
                            src={item.product.images[0]}
                            alt={item.product.title}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-medium line-clamp-1">{item.product.title}</h3>
                          <p className="text-sm text-primary-600">{formatPrice(item.product.price)}</p>
                          <div className="mt-2 flex items-center gap-2">
                            <button
                              onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                              className="rounded-full p-1 hover:bg-gray-100"
                            >
                              <Minus className="h-4 w-4" />
                            </button>
                            <span className="w-8 text-center">{item.quantity}</span>
                            <button
                              onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                              className="rounded-full p-1 hover:bg-gray-100"
                            >
                              <Plus className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleRemove(item.id)}
                              className="ml-auto text-red-500 hover:text-red-700"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {cart && cart.items.length > 0 && (
                <div className="border-t p-4">
                  <div className="mb-4 flex items-center justify-between text-lg font-semibold">
                    <span>Total:</span>
                    <span>{formatPrice(cart.total)}</span>
                  </div>
                  <Link
                    href="/checkout"
                    onClick={closeCart}
                    className="btn btn-primary w-full"
                  >
                    Proceed to Checkout
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
