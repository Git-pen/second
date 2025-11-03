# NovaCart Deployment Guide

## Prerequisites

- Node.js 20+
- Docker & Docker Compose
- PostgreSQL 16
- Redis 7
- Domain name (for production)
- Accounts for:
  - Stripe (payments)
  - AWS S3 or Cloudinary (image storage)
  - Resend (email)
  - Neon/Supabase (managed PostgreSQL)
  - Upstash (managed Redis)

## Local Development

### 1. Clone and Setup

```bash
git clone <repository-url>
cd novacart

# Copy environment files
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env.local

# Edit the .env files with your credentials
```

### 2. Start with Docker Compose

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### 3. Manual Setup (Without Docker)

**Backend:**
```bash
cd backend

# Install dependencies
npm install

# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma migrate dev

# Seed database
npm run prisma:seed

# Start development server
npm run dev
```

**Frontend:**
```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

## Production Deployment

### Option 1: Deploy to Vercel (Frontend) + Render/Railway (Backend)

#### Backend Deployment (Render)

1. **Create Render Account** at https://render.com

2. **Create PostgreSQL Database:**
   - Go to Dashboard → New → PostgreSQL
   - Save the connection string

3. **Create Redis Instance:**
   - Use Upstash at https://upstash.com
   - Create new database
   - Save connection URL

4. **Create Web Service:**
   - Connect GitHub repository
   - Configure:
     ```
     Name: novacart-backend
     Environment: Node
     Build Command: cd backend && npm install && npx prisma generate && npm run build
     Start Command: cd backend && npx prisma migrate deploy && npm start
     ```

5. **Add Environment Variables:**
   ```
   NODE_ENV=production
   PORT=5000
   DATABASE_URL=<your-neon-postgres-url>
   REDIS_URL=<your-upstash-redis-url>
   JWT_SECRET=<generate-random-secret>
   NEXTAUTH_SECRET=<generate-random-secret>
   STRIPE_SECRET_KEY=<your-stripe-secret>
   STRIPE_WEBHOOK_SECRET=<your-stripe-webhook-secret>
   AWS_ACCESS_KEY_ID=<your-aws-key>
   AWS_SECRET_ACCESS_KEY=<your-aws-secret>
   AWS_REGION=us-east-1
   AWS_S3_BUCKET=<your-bucket-name>
   RESEND_API_KEY=<your-resend-key>
   FRONTEND_URL=<your-vercel-url>
   MEILISEARCH_HOST=<meilisearch-cloud-url>
   MEILISEARCH_API_KEY=<meilisearch-key>
   OPENAI_API_KEY=<your-openai-key>
   GOOGLE_CLIENT_ID=<your-google-client-id>
   GOOGLE_CLIENT_SECRET=<your-google-client-secret>
   GITHUB_CLIENT_ID=<your-github-client-id>
   GITHUB_CLIENT_SECRET=<your-github-client-secret>
   ```

6. **Deploy:**
   - Click "Create Web Service"
   - Wait for deployment
   - Note your backend URL

#### Frontend Deployment (Vercel)

1. **Create Vercel Account** at https://vercel.com

2. **Import Project:**
   - Click "New Project"
   - Import from GitHub
   - Select `novacart` repository
   - Set Root Directory to `frontend`

3. **Configure Build:**
   ```
   Framework Preset: Next.js
   Build Command: npm run build
   Output Directory: .next
   Install Command: npm install
   ```

4. **Add Environment Variables:**
   ```
   NEXT_PUBLIC_API_URL=<your-render-backend-url>
   NEXT_PUBLIC_SOCKET_URL=<your-render-backend-url>
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=<your-stripe-publishable-key>
   NEXTAUTH_URL=<your-vercel-url>
   NEXTAUTH_SECRET=<same-as-backend>
   GOOGLE_CLIENT_ID=<same-as-backend>
   GOOGLE_CLIENT_SECRET=<same-as-backend>
   GITHUB_CLIENT_ID=<same-as-backend>
   GITHUB_CLIENT_SECRET=<same-as-backend>
   ```

5. **Deploy:**
   - Click "Deploy"
   - Wait for build
   - Access your site

### Option 2: Deploy with Railway

1. **Create Railway Account** at https://railway.app

2. **Deploy Backend:**
   ```bash
   # Install Railway CLI
   npm i -g @railway/cli

   # Login
   railway login

   # Initialize project
   cd backend
   railway init

   # Add services
   railway add --service postgres
   railway add --service redis

   # Deploy
   railway up
   ```

3. **Deploy Frontend:**
   - Use Vercel as described above

### Option 3: Self-Hosted with Docker

1. **Prepare Server:**
   ```bash
   # Install Docker
   curl -fsSL https://get.docker.com -o get-docker.sh
   sh get-docker.sh

   # Install Docker Compose
   sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
   sudo chmod +x /usr/local/bin/docker-compose
   ```

2. **Clone Repository:**
   ```bash
   git clone <repository-url>
   cd novacart
   ```

3. **Configure Environment:**
   ```bash
   cp backend/.env.example backend/.env
   cp frontend/.env.example frontend/.env.local
   # Edit with production values
   ```

4. **Deploy:**
   ```bash
   docker-compose -f docker-compose.yml up -d --build
   ```

5. **Setup Nginx Reverse Proxy:**
   ```nginx
   # /etc/nginx/sites-available/novacart
   server {
       listen 80;
       server_name novacart.com;

       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }

       location /api {
           proxy_pass http://localhost:5000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

6. **Setup SSL with Certbot:**
   ```bash
   sudo apt install certbot python3-certbot-nginx
   sudo certbot --nginx -d novacart.com -d www.novacart.com
   ```

## Database Migrations

### Production Migrations

```bash
# Backend directory
cd backend

# Generate migration
npx prisma migrate dev --name migration_name

# Deploy to production
npx prisma migrate deploy

# If using Docker
docker-compose exec backend npx prisma migrate deploy
```

## Monitoring & Maintenance

### Health Checks

**Backend Health:**
```bash
curl https://api.novacart.com/api/health
```

**Database Connection:**
```bash
# In backend directory
npx prisma db push --skip-generate
```

### Logs

**Docker Logs:**
```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend
docker-compose logs -f frontend
```

**Railway Logs:**
```bash
railway logs
```

**Render Logs:**
- View in Render Dashboard

### Backup Database

```bash
# PostgreSQL backup
pg_dump $DATABASE_URL > backup_$(date +%Y%m%d).sql

# Restore
psql $DATABASE_URL < backup_20240101.sql
```

## Scaling

### Horizontal Scaling

**Backend:**
- Deploy multiple instances behind load balancer
- Use Redis for session storage
- Configure sticky sessions for Socket.io

**Database:**
- Use connection pooling
- Consider read replicas
- Use Prisma connection pooling

### Caching Strategy

- Redis for session data
- Redis for cart data
- MeiliSearch for product search
- CDN for static assets

## Security Checklist

- [ ] Use HTTPS everywhere
- [ ] Set secure environment variables
- [ ] Enable CORS properly
- [ ] Rate limit API endpoints
- [ ] Sanitize user inputs
- [ ] Use Helmet.js for security headers
- [ ] Keep dependencies updated
- [ ] Regular security audits
- [ ] Backup database regularly
- [ ] Monitor error logs
- [ ] Use strong JWT secrets
- [ ] Validate Stripe webhook signatures

## Troubleshooting

### Backend Won't Start

1. Check environment variables
2. Verify database connection
3. Check Prisma schema
4. Review error logs

### Frontend Build Fails

1. Clear `.next` cache
2. Check environment variables
3. Verify API connectivity
4. Review build logs

### Database Connection Issues

1. Check DATABASE_URL format
2. Verify network access
3. Check connection limits
4. Review Prisma connection pooling

### Stripe Webhook Issues

1. Verify webhook secret
2. Check webhook URL
3. Test with Stripe CLI
4. Review webhook logs

## Performance Optimization

1. **Enable Caching:**
   - Redis for API responses
   - CDN for static assets
   - Browser caching headers

2. **Database Optimization:**
   - Add indexes
   - Optimize queries
   - Use connection pooling

3. **Image Optimization:**
   - Use Next.js Image component
   - Compress images
   - Use WebP format

4. **Code Splitting:**
   - Lazy load components
   - Dynamic imports
   - Route-based code splitting

## Monitoring Services

Recommended monitoring tools:
- **Sentry** - Error tracking
- **LogRocket** - Session replay
- **DataDog** - Infrastructure monitoring
- **Uptime Robot** - Uptime monitoring
- **New Relic** - Application performance

## Support

For deployment issues:
1. Check logs first
2. Review environment variables
3. Verify all services are running
4. Check API documentation
5. Open GitHub issue

---

**Last Updated:** 2024
**Version:** 1.0.0
