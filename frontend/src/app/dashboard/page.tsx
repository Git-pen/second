'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Package, Heart, Settings, LogOut } from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';
import api from '@/lib/api';
import { Order } from '@/types';
import { formatPrice, formatDate } from '@/lib/utils';

export default function DashboardPage() {
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      router.push('/auth/login');
      return;
    }
    fetchOrders();
  }, [user, router]);

  const fetchOrders = async () => {
    try {
      const response = await api.get('/orders?limit=5');
      setOrders(response.data.data.orders);
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50 py-8 dark:bg-gray-900">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="mb-8 text-4xl font-bold">My Dashboard</h1>

          <div className="grid gap-6 md:grid-cols-4">
            <div className="card">
              <div className="flex items-center gap-4">
                <div className="rounded-full bg-primary-100 p-3 dark:bg-primary-900">
                  <Package className="h-6 w-6 text-primary-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Orders</p>
                  <p className="text-2xl font-bold">{orders.length}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8">
            <h2 className="mb-4 text-2xl font-semibold">Recent Orders</h2>
            {loading ? (
              <div className="card">Loading...</div>
            ) : orders.length === 0 ? (
              <div className="card">
                <p className="text-gray-600 dark:text-gray-400">No orders yet</p>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((order) => (
                  <div key={order.id} className="card">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold">Order #{order.id.slice(0, 8)}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {formatDate(order.createdAt)}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">{formatPrice(order.totalAmount)}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {order.status}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
