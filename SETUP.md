# Setup Instructions

## Initial Setup

1. **Install pnpm globally** (if not already installed):
   ```bash
   npm install -g pnpm
   ```

2. **Install dependencies**:
   ```bash
   pnpm install
   ```

3. **Set up environment variables**:
   ```bash
   # Web app
   cp apps/web/.env.example apps/web/.env.local
   
   # API
   cp apps/api/.env.example apps/api/.env
   ```

4. **Edit environment files**:
   - Open `apps/web/.env.local` and configure `NEXT_PUBLIC_API_URL`
   - Open `apps/api/.env` and configure `JWT_SECRET` and `CORS_ORIGINS`

5. **Build shared packages** (required before running apps):
   ```bash
   pnpm --filter shared-types build
   pnpm --filter ui build
   ```

6. **Start development servers**:
   ```bash
   pnpm dev
   ```

## Local Development Setup

### Option 1: Using localhost (Default)

The apps are configured to use:
- Web: `http://localhost:3000`
- API: `http://localhost:4000`

No additional configuration needed.

### Option 2: Using api.localhost

If you want to use `api.localhost:4000` for the API:

1. **Edit `/etc/hosts`** (requires admin access):
   ```bash
   sudo nano /etc/hosts
   ```

2. **Add this line**:
   ```
   127.0.0.1 api.localhost
   ```

3. **Update `apps/web/.env.local`**:
   ```env
   NEXT_PUBLIC_API_URL=http://api.localhost:4000
   ```

4. **Update `apps/api/.env`**:
   ```env
   CORS_ORIGINS=http://localhost:3000,http://api.localhost:4000
   ```

## Troubleshooting

### Port Already in Use

If port 3000 or 4000 is already in use:

**For Web:**
```bash
# Set PORT environment variable
PORT=3001 pnpm dev:web
```

**For API:**
Edit `apps/api/.env`:
```env
PORT=4001
```

### Build Errors

If you encounter build errors:

1. Clean everything:
   ```bash
   pnpm clean
   ```

2. Reinstall dependencies:
   ```bash
   pnpm install
   ```

3. Rebuild packages:
   ```bash
   pnpm --filter shared-types build
   pnpm --filter ui build
   ```

### Type Errors

If TypeScript shows errors:

1. Run type check:
   ```bash
   pnpm type-check
   ```

2. Ensure packages are built:
   ```bash
   pnpm --filter shared-types build
   pnpm --filter ui build
   ```

### Module Not Found Errors

If you see "Cannot find module '@gigsafehub/ui'" or similar:

1. Ensure packages are built:
   ```bash
   pnpm --filter shared-types build
   pnpm --filter ui build
   ```

2. Restart the development server

## First Run Checklist

- [ ] pnpm installed globally
- [ ] Dependencies installed (`pnpm install`)
- [ ] Environment files created from `.env.example`
- [ ] Environment variables configured
- [ ] Shared packages built
- [ ] Development servers start without errors
- [ ] Web app accessible at http://localhost:3000
- [ ] API accessible at http://localhost:4000
- [ ] API health check works: http://localhost:4000/health
- [ ] API docs accessible: http://localhost:4000/docs

## Next Steps

After successful setup:

1. Review the [README.md](./README.md) for more information
2. Check [SECURITY.md](./SECURITY.md) for security best practices
3. Start developing!

