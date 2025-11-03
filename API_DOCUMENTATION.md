# NovaCart API Documentation

## Base URL
```
Development: http://localhost:5000/api
Production: https://api.novacart.com/api
```

## Authentication

All authenticated endpoints require a Bearer token in the Authorization header:
```
Authorization: Bearer <token>
```

## Endpoints

### Authentication

#### Register User
```http
POST /auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "Password123!"
}

Response: 201 Created
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": { ... },
    "token": "jwt-token"
  }
}
```

#### Login
```http
POST /auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "Password123!"
}

Response: 200 OK
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": { ... },
    "token": "jwt-token"
  }
}
```

#### Get Current User
```http
GET /auth/me
Authorization: Bearer <token>

Response: 200 OK
{
  "success": true,
  "data": {
    "user": { ... }
  }
}
```

### Products

#### List Products
```http
GET /products?page=1&limit=12&category=Electronics&sortBy=price&order=asc

Response: 200 OK
{
  "success": true,
  "data": {
    "products": [ ... ],
    "pagination": {
      "page": 1,
      "limit": 12,
      "total": 100,
      "pages": 9
    }
  }
}
```

#### Get Product
```http
GET /products/:id

Response: 200 OK
{
  "success": true,
  "data": {
    "product": { ... },
    "relatedProducts": [ ... ]
  }
}
```

#### Create Product (Admin)
```http
POST /products
Authorization: Bearer <admin-token>
Content-Type: application/json

{
  "title": "Product Name",
  "description": "Product description",
  "price": 99.99,
  "stock": 100,
  "category": "Electronics",
  "images": ["url1", "url2"]
}

Response: 201 Created
```

#### Update Product (Admin)
```http
PUT /products/:id
Authorization: Bearer <admin-token>
Content-Type: application/json

{
  "price": 89.99,
  "stock": 150
}

Response: 200 OK
```

#### Delete Product (Admin)
```http
DELETE /products/:id
Authorization: Bearer <admin-token>

Response: 200 OK
```

### Cart

#### Get Cart
```http
GET /cart
Authorization: Bearer <token>

Response: 200 OK
{
  "success": true,
  "data": {
    "cart": {
      "items": [ ... ],
      "total": 299.99,
      "itemCount": 3
    }
  }
}
```

#### Add to Cart
```http
POST /cart
Authorization: Bearer <token>
Content-Type: application/json

{
  "productId": "uuid",
  "quantity": 2
}

Response: 201 Created
```

#### Update Cart Item
```http
PUT /cart/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "quantity": 3
}

Response: 200 OK
```

#### Remove from Cart
```http
DELETE /cart/:id
Authorization: Bearer <token>

Response: 200 OK
```

### Orders

#### List Orders
```http
GET /orders?page=1&limit=10&status=PROCESSING
Authorization: Bearer <token>

Response: 200 OK
{
  "success": true,
  "data": {
    "orders": [ ... ],
    "pagination": { ... }
  }
}
```

#### Get Order
```http
GET /orders/:id
Authorization: Bearer <token>

Response: 200 OK
```

#### Create Checkout Session
```http
POST /orders/checkout
Authorization: Bearer <token>
Content-Type: application/json

{
  "shippingAddressId": "uuid"
}

Response: 200 OK
{
  "success": true,
  "data": {
    "sessionId": "stripe-session-id",
    "url": "https://checkout.stripe.com/..."
  }
}
```

#### Stripe Webhook
```http
POST /orders/webhook
Stripe-Signature: signature
Content-Type: application/json

[Stripe event payload]

Response: 200 OK
```

### Reviews

#### Get Product Reviews
```http
GET /reviews/product/:productId?page=1&limit=10

Response: 200 OK
{
  "success": true,
  "data": {
    "reviews": [ ... ],
    "pagination": { ... }
  }
}
```

#### Create Review
```http
POST /reviews
Authorization: Bearer <token>
Content-Type: application/json

{
  "productId": "uuid",
  "rating": 5,
  "comment": "Great product!"
}

Response: 201 Created
```

### Wishlist

#### Get Wishlist
```http
GET /wishlist
Authorization: Bearer <token>

Response: 200 OK
```

#### Add to Wishlist
```http
POST /wishlist
Authorization: Bearer <token>
Content-Type: application/json

{
  "productId": "uuid"
}

Response: 201 Created
```

### Admin

#### Get Analytics
```http
GET /admin/analytics
Authorization: Bearer <admin-token>

Response: 200 OK
{
  "success": true,
  "data": {
    "overview": {
      "totalUsers": 1000,
      "totalProducts": 500,
      "totalOrders": 2500,
      "totalRevenue": 125000
    },
    "recentOrders": [ ... ],
    "topProducts": [ ... ],
    "salesByMonth": [ ... ]
  }
}
```

#### Get All Users
```http
GET /admin/users?page=1&limit=20&search=john
Authorization: Bearer <admin-token>

Response: 200 OK
```

#### Get Inventory
```http
GET /admin/inventory?lowStock=true
Authorization: Bearer <admin-token>

Response: 200 OK
```

## Error Responses

All error responses follow this format:
```json
{
  "success": false,
  "message": "Error message describing what went wrong"
}
```

### Common HTTP Status Codes

- `200` - OK: Request successful
- `201` - Created: Resource created successfully
- `400` - Bad Request: Invalid request data
- `401` - Unauthorized: Authentication required or failed
- `403` - Forbidden: Insufficient permissions
- `404` - Not Found: Resource not found
- `409` - Conflict: Resource already exists
- `500` - Internal Server Error: Server error

## Rate Limiting

API requests are limited to 100 requests per 15 minutes per IP address.

When rate limit is exceeded:
```json
{
  "success": false,
  "message": "Too many requests from this IP, please try again later."
}
```

## Pagination

Paginated endpoints accept these query parameters:
- `page` - Page number (default: 1)
- `limit` - Items per page (default: varies by endpoint)

Pagination response format:
```json
{
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 100,
    "pages": 10
  }
}
```
