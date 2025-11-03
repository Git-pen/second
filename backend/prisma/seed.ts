import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  const adminPassword = await bcrypt.hash('Admin123!', 10);
  const userPassword = await bcrypt.hash('User123!', 10);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@novacart.com' },
    update: {},
    create: {
      email: 'admin@novacart.com',
      name: 'Admin User',
      passwordHash: adminPassword,
      role: 'ADMIN',
      emailVerified: true,
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=admin',
    },
  });

  const user = await prisma.user.upsert({
    where: { email: 'user@example.com' },
    update: {},
    create: {
      email: 'user@example.com',
      name: 'John Doe',
      passwordHash: userPassword,
      role: 'USER',
      emailVerified: true,
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=john',
    },
  });

  console.log('✅ Users created:', { admin: admin.email, user: user.email });

  const categories = ['Electronics', 'Clothing', 'Books', 'Home & Garden', 'Sports', 'Toys'];

  const products = [
    {
      title: 'Wireless Noise-Cancelling Headphones',
      slug: 'wireless-noise-cancelling-headphones',
      description: 'Premium over-ear headphones with active noise cancellation, 30-hour battery life, and premium sound quality. Perfect for travel, work, and leisure.',
      price: 299.99,
      comparePrice: 399.99,
      stock: 50,
      category: 'Electronics',
      images: [
        'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800',
        'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=800',
      ],
      rating: 4.5,
      reviewCount: 128,
      featured: true,
      tags: ['wireless', 'audio', 'premium'],
    },
    {
      title: 'Smart Watch Pro 2024',
      slug: 'smart-watch-pro-2024',
      description: 'Advanced smartwatch with health tracking, GPS, water resistance, and 7-day battery life. Track your fitness goals and stay connected.',
      price: 399.99,
      comparePrice: 499.99,
      stock: 30,
      category: 'Electronics',
      images: [
        'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800',
        'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=800',
      ],
      rating: 4.7,
      reviewCount: 89,
      featured: true,
      tags: ['smartwatch', 'fitness', 'health'],
    },
    {
      title: 'Premium Leather Backpack',
      slug: 'premium-leather-backpack',
      description: 'Handcrafted genuine leather backpack with laptop compartment. Perfect for professionals and travelers. Water-resistant and durable.',
      price: 149.99,
      comparePrice: 199.99,
      stock: 25,
      category: 'Clothing',
      images: [
        'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800',
        'https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?w=800',
      ],
      rating: 4.8,
      reviewCount: 45,
      featured: false,
      tags: ['leather', 'backpack', 'premium'],
    },
    {
      title: 'Ergonomic Office Chair',
      slug: 'ergonomic-office-chair',
      description: 'Professional ergonomic office chair with lumbar support, adjustable armrests, and breathable mesh back. Designed for all-day comfort.',
      price: 249.99,
      stock: 15,
      category: 'Home & Garden',
      images: [
        'https://images.unsplash.com/photo-1580480055273-228ff5388ef8?w=800',
      ],
      rating: 4.6,
      reviewCount: 67,
      featured: true,
      tags: ['office', 'ergonomic', 'furniture'],
    },
    {
      title: 'Bestselling Mystery Novel Collection',
      slug: 'mystery-novel-collection',
      description: 'Collection of 5 bestselling mystery novels from award-winning authors. Perfect for mystery lovers and book clubs.',
      price: 49.99,
      comparePrice: 79.99,
      stock: 100,
      category: 'Books',
      images: [
        'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=800',
      ],
      rating: 4.4,
      reviewCount: 234,
      featured: false,
      tags: ['books', 'mystery', 'collection'],
    },
    {
      title: 'Yoga Mat Pro with Carrying Strap',
      slug: 'yoga-mat-pro',
      description: 'Non-slip, eco-friendly yoga mat with extra cushioning. Includes carrying strap and alignment markers. Perfect for yoga and pilates.',
      price: 39.99,
      stock: 80,
      category: 'Sports',
      images: [
        'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=800',
      ],
      rating: 4.3,
      reviewCount: 56,
      featured: false,
      tags: ['yoga', 'fitness', 'eco-friendly'],
    },
    {
      title: 'Mechanical Gaming Keyboard RGB',
      slug: 'mechanical-gaming-keyboard-rgb',
      description: 'Professional mechanical keyboard with customizable RGB lighting, programmable keys, and tactile switches. Perfect for gaming and typing.',
      price: 129.99,
      comparePrice: 179.99,
      stock: 40,
      category: 'Electronics',
      images: [
        'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800',
      ],
      rating: 4.7,
      reviewCount: 112,
      featured: true,
      tags: ['gaming', 'keyboard', 'rgb'],
    },
    {
      title: 'Stainless Steel Water Bottle 32oz',
      slug: 'stainless-steel-water-bottle',
      description: 'Insulated stainless steel water bottle keeps drinks cold for 24 hours or hot for 12 hours. Leak-proof and BPA-free.',
      price: 24.99,
      stock: 150,
      category: 'Sports',
      images: [
        'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=800',
      ],
      rating: 4.5,
      reviewCount: 89,
      featured: false,
      tags: ['water bottle', 'insulated', 'eco-friendly'],
    },
    {
      title: 'Building Blocks Creative Set 1000 Pieces',
      slug: 'building-blocks-creative-set',
      description: 'Creative building blocks set with 1000 colorful pieces. Encourages creativity and problem-solving skills. Compatible with major brands.',
      price: 59.99,
      stock: 60,
      category: 'Toys',
      images: [
        'https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=800',
      ],
      rating: 4.8,
      reviewCount: 145,
      featured: false,
      tags: ['toys', 'creative', 'educational'],
    },
    {
      title: '4K Ultra HD Webcam',
      slug: '4k-ultra-hd-webcam',
      description: 'Professional 4K webcam with auto-focus, built-in microphone, and adjustable tripod. Perfect for streaming, video calls, and content creation.',
      price: 89.99,
      comparePrice: 129.99,
      stock: 35,
      category: 'Electronics',
      images: [
        'https://images.unsplash.com/photo-1614624532983-4ce03382d63d?w=800',
      ],
      rating: 4.6,
      reviewCount: 78,
      featured: true,
      tags: ['webcam', '4k', 'streaming'],
    },
  ];

  for (const product of products) {
    await prisma.product.upsert({
      where: { slug: product.slug },
      update: {},
      create: product,
    });
  }

  console.log(`✅ ${products.length} products created`);

  const sampleProducts = await prisma.product.findMany({ take: 3 });

  if (sampleProducts.length > 0) {
    await prisma.review.createMany({
      data: [
        {
          userId: user.id,
          productId: sampleProducts[0].id,
          rating: 5,
          comment: 'Absolutely love this product! Exceeded my expectations in every way.',
        },
        {
          userId: admin.id,
          productId: sampleProducts[0].id,
          rating: 4,
          comment: 'Great quality and fast shipping. Highly recommend!',
        },
      ],
      skipDuplicates: true,
    });

    console.log('✅ Sample reviews created');
  }

  await prisma.address.create({
    data: {
      userId: user.id,
      fullName: 'John Doe',
      street: '123 Main Street',
      city: 'San Francisco',
      state: 'CA',
      zipCode: '94102',
      country: 'United States',
      phone: '+1 (555) 123-4567',
      isDefault: true,
    },
  });

  console.log('✅ Sample address created');

  console.log('🎉 Database seeding completed successfully!');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error('❌ Error seeding database:', e);
    await prisma.$disconnect();
    process.exit(1);
  });
