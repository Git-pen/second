# NovaCart - Modern E-Commerce Platform

A production-ready, full-stack e-commerce application built with Next.js 14, Express 5, TypeScript, Prisma, and PostgreSQL.

## 🚀 Features

- **Modern Stack**: Next.js 14 (App Router), React 18, TypeScript, TailwindCSS, Framer Motion
- **Authentication**: NextAuth with Credentials, Google, and GitHub OAuth
- **Payments**: Stripe integration with webhooks
- **Real-time**: Socket.io for live cart updates
- **Search**: MeiliSearch integration
- **AI Assistant**: OpenAI-powered chat widget
- **Storage**: AWS S3/Cloudinary for images
- **Cache**: Redis for sessions and cart data
- **Email**: Resend API for transactional emails
- **Testing**: Jest, Supertest, Playwright
- **Docker**: Fully containerized application
- **CI/CD**: GitHub Actions pipeline
- **PWA**: Progressive Web App support
- **i18n**: Multi-language support
- **Admin Dashboard**: Analytics, inventory, user management

## 📁 Project Structure

```
novacart/
├── backend/         # Express API backend
├── frontend/        # Next.js frontend
├── docker-compose.yml
└── README.md
```

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 14 with App Router
- **UI**: React 18, TailwindCSS, Framer Motion
- **Auth**: NextAuth.js
- **State**: React Context + Hooks
- **Forms**: React Hook Form + Zod
- **HTTP**: Axios
- **Real-time**: Socket.io Client

### Backend
- **Runtime**: Node.js 20
- **Framework**: Express 5
- **ORM**: Prisma
- **Database**: PostgreSQL 16
- **Cache**: Redis
- **Search**: MeiliSearch
- **Storage**: AWS S3
- **Email**: Resend
- **Payments**: Stripe
- **Real-time**: Socket.io

## 🚀 Quick Start

### Prerequisites

- Node.js 20+
- Docker & Docker Compose
- PostgreSQL 16 (or use Docker)
- Redis (or use Docker)

### 1. Clone the repository

```bash
git clone <repository-url>
cd novacart
```

### 2. Set up environment variables

**Backend** (`backend/.env`):
```bash
cp backend/.env.example backend/.env
# Edit backend/.env with your values
```

**Frontend** (`frontend/.env.local`):
```bash
cp frontend/.env.example frontend/.env.local
# Edit frontend/.env.local with your values
```

### 3. Install dependencies

```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

### 4. Set up the database

```bash
cd backend
npx prisma generate
npx prisma migrate dev --name init
npx prisma db seed
```

### 5. Run the application

**Option A: Using Docker Compose (Recommended)**

```bash
# From project root
docker-compose up --build
```

Access:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000
- API Docs: http://localhost:5000/api-docs

**Option B: Run services individually**

```bash
# Terminal 1: Start PostgreSQL and Redis
docker-compose up postgres redis meilisearch

# Terminal 2: Backend
cd backend
npm run dev

# Terminal 3: Frontend
cd frontend
npm run dev
```

## 📝 Database Migrations

```bash
cd backend

# Create a new migration
npx prisma migrate dev --name migration_name

# Apply migrations
npx prisma migrate deploy

# Generate Prisma Client
npx prisma generate

# Open Prisma Studio
npx prisma studio
```

## 🧪 Testing

### Backend Tests
```bash
cd backend
npm run test           # Run all tests
npm run test:watch     # Watch mode
npm run test:coverage  # Coverage report
```

### Frontend Tests
```bash
cd frontend
npm run test           # Unit tests
npm run test:e2e       # E2E tests with Playwright
```

## 🔧 Development

### Code Quality

```bash
# Linting
npm run lint

# Type checking
npm run type-check

# Formatting
npm run format
```

### API Documentation

API documentation is available at `http://localhost:5000/api-docs` when running the backend.

## 🐳 Docker Deployment

### Build images

```bash
# Backend
docker build -t novacart-backend ./backend

# Frontend
docker build -t novacart-frontend ./frontend
```

### Run with Docker Compose

```bash
docker-compose up -d
```

## ☁️ Production Deployment

### Frontend (Vercel)

1. Push code to GitHub
2. Import project in Vercel
3. Set environment variables
4. Deploy

### Backend (Render/Railway)

1. Create new Web Service
2. Connect GitHub repository
3. Set build command: `cd backend && npm install && npx prisma generate`
4. Set start command: `cd backend && npm start`
5. Add environment variables
6. Deploy

### Database (Neon Postgres)

1. Create new project at https://neon.tech
2. Copy connection string
3. Update `DATABASE_URL` in backend environment

### Redis (Upstash)

1. Create new database at https://upstash.com
2. Copy connection URL
3. Update `REDIS_URL` in backend environment

## 🔑 Environment Variables

### Backend (.env)

```env
NODE_ENV=development
PORT=5000
DATABASE_URL=postgresql://user:password@localhost:5432/novacart
REDIS_URL=redis://localhost:6379
JWT_SECRET=your-jwt-secret
NEXTAUTH_SECRET=your-nextauth-secret

# Stripe
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# AWS S3
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key
AWS_REGION=us-east-1
AWS_S3_BUCKET=novacart-assets

# Email (Resend)
RESEND_API_KEY=re_...

# OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret

# MeiliSearch
MEILISEARCH_HOST=http://localhost:7700
MEILISEARCH_API_KEY=your-api-key

# OpenAI
OPENAI_API_KEY=sk-...
```

### Frontend (.env.local)

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
NEXT_PUBLIC_SOCKET_URL=http://localhost:5000
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-nextauth-secret

# OAuth (same as backend)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret
```

## 🎯 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/me` - Get current user

### Products
- `GET /api/products` - List products (with filters & pagination)
- `GET /api/products/:id` - Get product details
- `POST /api/products` - Create product (admin)
- `PUT /api/products/:id` - Update product (admin)
- `DELETE /api/products/:id` - Delete product (admin)

### Cart
- `GET /api/cart` - Get user cart
- `POST /api/cart` - Add item to cart
- `PUT /api/cart/:id` - Update cart item
- `DELETE /api/cart/:id` - Remove cart item
- `DELETE /api/cart` - Clear cart

### Orders
- `GET /api/orders` - List user orders
- `GET /api/orders/:id` - Get order details
- `POST /api/orders/checkout` - Create Stripe checkout session
- `POST /api/orders/webhook` - Stripe webhook handler

### Reviews
- `GET /api/reviews/:productId` - Get product reviews
- `POST /api/reviews` - Create review
- `PUT /api/reviews/:id` - Update review
- `DELETE /api/reviews/:id` - Delete review

### Admin
- `GET /api/admin/analytics` - Get analytics data
- `GET /api/admin/users` - List users
- `PUT /api/admin/users/:id` - Update user
- `DELETE /api/admin/users/:id` - Delete user
- `GET /api/admin/inventory` - Inventory management

### Wishlist
- `GET /api/wishlist` - Get user wishlist
- `POST /api/wishlist` - Add to wishlist
- `DELETE /api/wishlist/:id` - Remove from wishlist

## 📊 Default Users (Seeded)

### Admin
- **Email**: admin@novacart.com
- **Password**: Admin123!

### Regular User
- **Email**: user@example.com
- **Password**: User123!

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit changes: `git commit -am 'Add feature'`
4. Push to branch: `git push origin feature-name`
5. Submit a Pull Request

## 📄 License

MIT License - see LICENSE file for details

## 🙏 Acknowledgments

- Next.js team for the amazing framework
- Prisma for the excellent ORM
- Stripe for payment processing
- All open-source contributors

## 📞 Support

For issues and questions, please open a GitHub issue.

---

Built with ❤️ using NovaCart
