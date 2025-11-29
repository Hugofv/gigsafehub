# API Server

Express API server with Prisma ORM and PostgreSQL.

## Prisma Setup

### 1. Configure Database

Copy `.env.example` to `.env` and update the `DATABASE_URL`:

```env
DATABASE_URL=postgresql://user:password@localhost:5432/gigsafehub?schema=public
SHADOW_DATABASE_URL=postgresql://user:password@localhost:5432/gigsafehub_shadow?schema=public
```

### 2. Generate Prisma Client

```bash
pnpm prisma:generate
```

### 3. Run Migrations

```bash
pnpm prisma:migrate
```

This will:
- Create the database if it doesn't exist
- Run all pending migrations
- Generate the Prisma Client

### 4. Seed Database (Optional)

```bash
pnpm prisma:seed
```

This will populate the database with sample data.

### 5. Open Prisma Studio (Optional)

```bash
pnpm prisma:studio
```

This opens a visual database browser at `http://localhost:5555`.

## Available Scripts

- `pnpm dev` - Start development server with hot reload
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm prisma:generate` - Generate Prisma Client
- `pnpm prisma:migrate` - Run database migrations
- `pnpm prisma:studio` - Open Prisma Studio
- `pnpm prisma:seed` - Seed database with sample data

## Database Schema

The Prisma schema is located at `prisma/schema.prisma`. Key models:

- **User** - Application users (admin/user roles)
- **FinancialProduct** - Financial products with pros, cons, and features
- **Article** - Blog articles with related products
- **InsuranceQuote** - Insurance quotes for users
- **Lead** - Lead tracking

## API Endpoints

- `GET /health` - Health check
- `GET /api/products` - List all products
- `GET /api/products/:id` - Get product by ID
- `GET /api/quotes` - List quotes
- `POST /api/quotes` - Create a quote
- `POST /api/auth/login` - User login
- `GET /api/auth/verify` - Verify JWT token
- `GET /docs` - API documentation (Swagger)

