# Kyrant Wears Backend

E-commerce backend for Kyrant Wears clothing brand & designer platform built with Node.js, Express, and Supabase.

## Features

- JWT Authentication via Supabase Auth
- Role-based access control (buyer, designer, admin)
- Product management with image storage
- Order processing with payment integration
- Profile management
- Row Level Security (RLS) enforced on all tables

## Tech Stack

- Node.js 20+ (ESM)
- Express.js
- Supabase (Postgres + Auth + Storage + Realtime)
- JWT verification with jose
- Zod for validation
- CORS and Helmet for security

## Project Structure

```
Backend/
├── index.js                 # Main entry point
├── package.json             # Dependencies and scripts
├── .env.example             # Environment variables template
├── src/
│   ├── config/
│   │   └── supabase.js      # Supabase client configurations
│   ├── middleware/
│   │   └── auth.js          # JWT authentication middleware
│   ├── routes/
│   │   ├── auth.js          # Authentication routes
│   │   ├── products.js      # Product CRUD operations
│   │   ├── orders.js        # Order management
│   │   └── profiles.js      # User profile management
│   └── utils/
└── README.md                # This file
```

## Setup

1. Clone the repository and navigate to the Backend directory.

2. Install dependencies:
   ```bash
   npm install
   ```

3. Copy the environment variables:
   ```bash
   cp .env.example .env
   ```

4. Fill in your Supabase credentials in `.env`:
   - `SUPABASE_URL`: Your Supabase project URL
   - `SUPABASE_ANON_KEY`: Your Supabase anon key
   - `SUPABASE_SERVICE_ROLE_KEY`: Your Supabase service role key (keep secret!)
   - `SUPABASE_JWT_SECRET`: Your Supabase JWT secret for token verification

5. Ensure your Supabase database has the required tables and RLS policies set up.

## Running the Server

### Development
```bash
npm run dev
```

### Production
```bash
npm start
```

The server will run on port 3000(http://localhost:3000) by default (configurable via `PORT` env var).

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Create new user account (public)
  - Request Body: `{ "email": "user@example.com", "password": "password123", "role": "buyer", "full_name": "John Doe" }`
  - Response: `{ "message": "Account created successfully", "user": { "id": "uuid", "email": "user@example.com", "role": "buyer" } }`
- `POST /api/auth/create-user` - Create user account (admin only)
  - Request Body: `{ "email": "user@example.com", "password": "password123", "role": "designer", "full_name": "Jane Smith" }`
  - Response: `{ "message": "User created successfully", "user": { "id": "uuid", "email": "user@example.com", "role": "designer" } }`
- `GET /api/auth/me` - Get current user profile (authenticated)
  - Response: `{ "id": "uuid", "role": "buyer", "full_name": "John Doe", "bio": "...", "avatar_url": "..." }`

### Products
- `GET /api/products` - Get all active products (public)
- `GET /api/products/my` - Get designer's own products (designers only)
- `POST /api/products` - Create new product (designers only)
- `PUT /api/products/:id` - Update product (product owner only)
- `DELETE /api/products/:id` - Delete product (product owner or admin)

### Orders
- `GET /api/orders` - Get user's orders (authenticated)
- `POST /api/orders` - Create new order (buyers only)
- `PATCH /api/orders/:id/status` - Update order status (admin only)

### Profiles
- `GET /api/profiles` - Get all designers (public)
- `GET /api/profiles/:id` - Get profile by ID (public)
- `PUT /api/profiles` - Update own profile (authenticated)

### Health Check
- `GET /health` - Server health check

## Authentication

All protected routes require a Bearer token in the Authorization header:
```
Authorization: Bearer <jwt_token>
```

Tokens are issued by Supabase Auth and verified server-side using the jose library.

## Roles and Permissions

- **Buyer**: Can view products, place orders, manage own profile
- **Designer**: All buyer permissions + create/update/delete own products
- **Admin**: All permissions + update order statuses + create user accounts

## Database Schema

The backend assumes the following tables exist in Supabase:

- `profiles` (id, role, full_name, bio, avatar_url)
- `products` (id, designer_id, name, description, price, category_id, images, status)
- `categories` (id, name)
- `orders` (id, buyer_id, total, shipping_address, status)
- `order_items` (id, order_id, product_id, quantity, price)
- `payments` (id, order_id, amount, status, payment_method)
- `carts` (session-based or user-based cart items)

Ensure RLS policies are set up to enforce proper access control.

## Security

- JWT tokens are verified on every request
- Row Level Security (RLS) is enforced on all database operations
- Service role key is never exposed to the client
- CORS and Helmet middleware for additional security
- Input validation with Zod schemas

## Testing

Run tests with:
```bash
npm test
```

## Deployment

1. Set environment variables in your deployment platform
2. Run `npm start` in production
3. Ensure database migrations are applied if needed

## Contributing

1. Follow the existing code style
2. Add tests for new features
3. Update documentation as needed
4. Ensure all dependencies are approved before adding new ones

## License

ISC
