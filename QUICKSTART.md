# NovaCart - Quick Start Guide

## 🚀 Getting Started in 5 Minutes

### Prerequisites
- Node.js 20+
- Docker & Docker Compose (recommended)

### Option 1: Docker Compose (Easiest)

```bash
# 1. Clone the repository
git clone <repository-url>
cd novacart

# 2. Copy environment files
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env.local

# 3. Start all services
docker-compose up -d

# 4. Wait for services to start (30-60 seconds)
docker-compose logs -f

# 5. Access the application
# Frontend: http://localhost:3000
# Backend API: http://localhost:5000
```

### Option 2: Manual Setup

**Terminal 1 - Start Infrastructure:**
```bash
docker-compose up postgres redis meilisearch
```

**Terminal 2 - Backend:**
```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your values

npx prisma generate
npx prisma migrate dev
npx prisma db seed

npm run dev
```

**Terminal 3 - Frontend:**
```bash
cd frontend
npm install
cp .env.example .env.local
# Edit .env.local with your values

npm run dev
```

## 📋 Default Credentials

### Admin Account
- **Email:** admin@novacart.com
- **Password:** Admin123!

### Regular User
- **Email:** user@example.com
- **Password:** User123!

## 🔧 Configuration

### Backend (.env)
Minimum required configuration:
```env
DATABASE_URL=postgresql://novacart:novacart123@localhost:5432/novacart
REDIS_URL=redis://localhost:6379
JWT_SECRET=your-secret-key-change-this
NEXTAUTH_SECRET=your-nextauth-secret-change-this
```

### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXTAUTH_SECRET=your-nextauth-secret-change-this
```

## 🧪 Testing the Application

1. **Create Account:**
   - Go to http://localhost:3000/auth/register
   - Sign up with your email

2. **Browse Products:**
   - Visit http://localhost:3000/products
   - Filter, search, and sort products

3. **Add to Cart:**
   - Click on a product
   - Add to cart
   - View cart drawer

4. **Checkout (Test Mode):**
   - Use Stripe test card: 4242 4242 4242 4242
   - Any future expiry date
   - Any 3-digit CVC

5. **Admin Dashboard:**
   - Login as admin
   - Visit http://localhost:3000/admin
   - Manage products, orders, users

## 📚 Key Features

✅ User authentication (JWT + OAuth)
✅ Product catalog with search & filters
✅ Shopping cart with real-time updates
✅ Stripe checkout integration
✅ Order management
✅ Product reviews & ratings
✅ Wishlist
✅ Admin dashboard
✅ Responsive design
✅ Dark mode support
✅ Email notifications
✅ Real-time features (Socket.io)

## 🔗 Important URLs

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:5000
- **API Health:** http://localhost:5000/api/health
- **Prisma Studio:** Run `npx prisma studio` in backend directory
- **MeiliSearch:** http://localhost:7700

## 🐛 Troubleshooting

### Backend won't start
```bash
# Check if Postgres is running
docker-compose ps

# Reset database
cd backend
npx prisma migrate reset
npx prisma db seed
```

### Frontend build errors
```bash
cd frontend
rm -rf .next node_modules
npm install
npm run dev
```

### Port already in use
```bash
# Find and kill process
lsof -ti:3000 | xargs kill -9  # Frontend
lsof -ti:5000 | xargs kill -9  # Backend
```

## 📖 Documentation

- **API Documentation:** [API_DOCUMENTATION.md](./API_DOCUMENTATION.md)
- **Deployment Guide:** [DEPLOYMENT.md](./DEPLOYMENT.md)
- **Full README:** [README.md](./README.md)

## 🎯 Next Steps

1. **Customize Branding:**
   - Update logo and colors in `frontend/tailwind.config.ts`
   - Modify company info in `frontend/src/components/Footer.tsx`

2. **Add Products:**
   - Login as admin
   - Navigate to admin dashboard
   - Add your products

3. **Configure Payments:**
   - Get Stripe keys from https://stripe.com
   - Add to backend/.env and frontend/.env.local
   - Test with Stripe test cards

4. **Setup Email:**
   - Get Resend API key from https://resend.com
   - Add to backend/.env
   - Test welcome and order emails

5. **Deploy to Production:**
   - Follow [DEPLOYMENT.md](./DEPLOYMENT.md)
   - Use Vercel for frontend
   - Use Render/Railway for backend

## 💡 Tips

- Use Prisma Studio to view/edit database records
- Check Docker logs for debugging: `docker-compose logs -f`
- Use browser DevTools Network tab to debug API calls
- Enable Redux DevTools for state debugging
- Review `.env.example` files for all configuration options

## 🆘 Need Help?

- Check the logs: `docker-compose logs -f`
- Review the README.md for detailed information
- Check API_DOCUMENTATION.md for endpoint details
- Open an issue on GitHub

## ⚡ Pro Tips

1. **Fast Restart:**
   ```bash
   docker-compose restart backend frontend
   ```

2. **Fresh Start:**
   ```bash
   docker-compose down -v
   docker-compose up -d
   ```

3. **View Logs:**
   ```bash
   docker-compose logs -f backend  # Backend only
   docker-compose logs -f frontend # Frontend only
   ```

4. **Database GUI:**
   ```bash
   cd backend && npx prisma studio
   ```

5. **Test API:**
   ```bash
   curl http://localhost:5000/api/health
   ```

---

Happy coding! 🎉
