import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from '@/components/Providers';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { CartDrawer } from '@/components/CartDrawer';
import { Toaster } from 'react-hot-toast';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: 'NovaCart - Modern E-Commerce Platform',
  description: 'Shop the latest products with NovaCart. Fast shipping, secure payments, and excellent customer service.',
  keywords: ['ecommerce', 'shopping', 'online store', 'products'],
  authors: [{ name: 'NovaCart Team' }],
  openGraph: {
    type: 'website',
    title: 'NovaCart - Modern E-Commerce Platform',
    description: 'Shop the latest products with NovaCart',
    siteName: 'NovaCart',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.variable}>
        <Providers>
          <div className="flex min-h-screen flex-col">
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
          <CartDrawer />
          <Toaster position="top-right" />
        </Providers>
      </body>
    </html>
  );
}
