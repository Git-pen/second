'use client';

import { ThemeProvider } from 'next-themes';
import { useEffect } from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import { useCartStore } from '@/store/useCartStore';

export function Providers({ children }: { children: React.ReactNode }) {
  const fetchUser = useAuthStore((state) => state.fetchUser);
  const token = useAuthStore((state) => state.token);
  const fetchCart = useCartStore((state) => state.fetchCart);

  useEffect(() => {
    if (token) {
      fetchUser();
      fetchCart();
    }
  }, [token, fetchUser, fetchCart]);

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      {children}
    </ThemeProvider>
  );
}
