# GigSafeHub Monorepo

Monorepo structure for GigSafeHub with Next.js web application and Express API, built with pnpm workspaces.

## 📁 Project Structure

```
gigsafehub/
├── apps/
│   ├── web/          # Next.js application (App Router)
│   └── api/          # Express API server
├── packages/
│   ├── ui/           # Shared React components
│   └── shared-types/ # Shared TypeScript types
├── .github/
│   ├── workflows/    # GitHub Actions CI/CD
│   └── dependabot.yml # Automated dependency updates
├── .husky/           # Git hooks (pre-commit, commit-msg)
└── package.json      # Root workspace configuration
```

## 🚀 Quick Start

### Prerequisites

- **Node.js** >= 18.0.0
- **pnpm** >= 8.0.0

Install pnpm if you don't have it:
```bash
npm install -g pnpm
```

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd gigsafehub
```

2. Install all dependencies:
```bash
pnpm install
```

3. Set up environment variables:
```bash
# Copy example files
cp apps/web/.env.example apps/web/.env.local
cp apps/api/.env.example apps/api/.env
```

4. Edit the environment files with your configuration (see [Environment Variables](#environment-variables) section).

### Development

Run both apps in development mode:
```bash
pnpm dev
```

Or run them separately:
```bash
# Web app only (http://localhost:3000)
pnpm dev:web

# API only (http://localhost:4000)
pnpm dev:api
```

### Building

Build all apps and packages:
```bash
pnpm build
```

Build specific apps:
```bash
pnpm build:web
pnpm build:api
```

### Production

Start the built applications:
```bash
# Build first
pnpm build

# Start API
cd apps/api
pnpm start

# Start Web (in another terminal)
cd apps/web
pnpm start
```

## 🔧 Environment Variables

### Web App (`apps/web/.env.local`)

```env
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:4000

# NextAuth Configuration (if using NextAuth)
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-here

# Analytics (optional)
NEXT_PUBLIC_ANALYTICS_ID=

# Node Environment
NODE_ENV=development
```

### API (`apps/api/.env`)

```env
# Server Configuration
PORT=4000
NODE_ENV=development

# JWT Configuration
JWT_SECRET=change-me-in-production-use-strong-random-secret

# CORS Configuration (comma-separated)
CORS_ORIGINS=http://localhost:3000,http://localhost:3001

# Database (optional - for future use)
DATABASE_URL=

# Logging
LOG_LEVEL=info

# Git Commit (for health check)
GIT_COMMIT=
```

### ⚠️ Security Note

**Never commit `.env` files!** Always use:
- GitHub Secrets (for CI/CD)
- AWS Secrets Manager
- Azure Key Vault
- HashiCorp Vault
- Or similar secret management services

See [SECURITY.md](./SECURITY.md) for more details.

## 📝 Available Scripts

### Root Level

- `pnpm dev` - Run both web and API in development mode
- `pnpm dev:web` - Run only the web app
- `pnpm dev:api` - Run only the API
- `pnpm build` - Build all apps and packages
- `pnpm build:web` - Build only the web app
- `pnpm build:api` - Build only the API
- `pnpm lint` - Lint all packages
- `pnpm lint:fix` - Fix linting issues
- `pnpm test` - Run all tests
- `pnpm type-check` - Type check all packages
- `pnpm clean` - Remove all node_modules and build artifacts

### App-Specific Scripts

Each app has its own scripts defined in their `package.json` files.

## 🧪 Testing

Run tests:
```bash
pnpm test
```

Run tests in watch mode:
```bash
pnpm test:watch
```

## 🏗️ Architecture

### Apps

#### Web (`apps/web`)
- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Features**:
  - Server-side rendering (SSR)
  - Server Components
  - Security headers (CSP, HSTS, etc.)
  - Cookie security configuration

#### API (`apps/api`)
- **Framework**: Express.js
- **Language**: TypeScript
- **Features**:
  - Security middleware (Helmet, CORS, rate limiting)
  - Input validation with Zod
  - Structured logging with Pino
  - OpenAPI/Swagger documentation
  - JWT authentication (placeholder)

### Packages

#### UI (`packages/ui`)
- Shared React components
- Built with tsup
- Exported as ES modules and CommonJS

#### Shared Types (`packages/shared-types`)
- TypeScript types shared between web and API
- Compiled to JavaScript with type definitions

## 🔒 Security Features

### Web App
- Security headers (CSP, HSTS, X-Frame-Options, etc.)
- Secure cookies configuration
- X-Powered-By header removed
- Middleware for additional security

### API
- Helmet for security headers
- CORS with whitelist
- Rate limiting
- Input sanitization (XSS, NoSQL injection)
- Body size limits
- JWT authentication
- Request logging

## 🚢 Deployment

### Vercel (Web App)

1. Connect your repository to Vercel
2. Set environment variables in Vercel dashboard
3. Configure build settings:
   - **Framework Preset**: Next.js
   - **Root Directory**: `apps/web`
   - **Build Command**: `pnpm build`
   - **Install Command**: `pnpm install --frozen-lockfile`

### Render / Railway / AWS (API)

1. Set environment variables in your platform
2. Configure build and start commands:
   - **Build Command**: `cd apps/api && pnpm build`
   - **Start Command**: `cd apps/api && pnpm start`
   - **Install Command**: `pnpm install --frozen-lockfile`

### NGINX (Optional)

For production deployments, you can use NGINX as a reverse proxy. See `nginx.conf.example` for configuration.

**Note**: NGINX is optional. The apps can be deployed independently without it.

## 🔄 CI/CD

GitHub Actions workflows are configured in `.github/workflows/ci.yml`:

- **Lint**: Runs ESLint on all packages
- **Type Check**: Validates TypeScript types
- **Test**: Runs Jest tests
- **Build**: Builds all apps and packages
- **Security**: Runs npm audit and CodeQL scanning

## 📦 Dependencies

### Dependency Management
- Uses `pnpm` workspaces for monorepo management
- Dependabot configured for automatic updates
- All dependencies are locked in `pnpm-lock.yaml`

### Adding Dependencies

```bash
# Add to root
pnpm add -w <package>

# Add to specific app/package
pnpm --filter web add <package>
pnpm --filter api add <package>
pnpm --filter ui add <package>
```

## 🛠️ Development Tools

### Code Quality
- **ESLint**: Code linting
- **Prettier**: Code formatting
- **TypeScript**: Type checking
- **Husky**: Git hooks
- **Commitlint**: Conventional commits

### Git Hooks
- **pre-commit**: Runs lint-staged (ESLint + Prettier)
- **commit-msg**: Validates commit messages (Conventional Commits)

### Commit Convention

We use [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: add new feature
fix: fix bug
docs: update documentation
style: formatting changes
refactor: code refactoring
test: add tests
chore: maintenance tasks
```

## 📊 Observability

### Logging
- API uses Pino for structured logging
- Log levels configurable via `LOG_LEVEL` environment variable
- Pretty printing in development mode

### Health Checks
- API: `GET /health` - Returns service health status
- Web: Consumes API health endpoint on homepage

### Metrics (Future)
- Prometheus metrics endpoint can be added at `/metrics`
- Integration with APM tools (Sentry, Datadog) recommended

## 🐛 Troubleshooting

### Port Already in Use
If ports 3000 or 4000 are already in use:
- Web: Set `PORT` environment variable or modify `apps/web/package.json`
- API: Set `PORT` environment variable in `apps/api/.env`

### Build Errors
1. Clean and reinstall:
   ```bash
   pnpm clean
   pnpm install
   ```

2. Rebuild packages:
   ```bash
   pnpm --filter shared-types build
   pnpm --filter ui build
   ```

### Type Errors
Run type checking:
```bash
pnpm type-check
```

## 📚 Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Express.js Documentation](https://expressjs.com/)
- [pnpm Workspaces](https://pnpm.io/workspaces)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)

## 🤝 Contributing

1. Create a feature branch
2. Make your changes
3. Run `pnpm lint` and `pnpm test`
4. Commit using conventional commits
5. Push and create a pull request

## 📄 License

[Your License Here]

## 🔗 Links

- API Documentation: `http://localhost:4000/docs` (when API is running)
- Health Check: `http://localhost:4000/health`

---

For security concerns, see [SECURITY.md](./SECURITY.md).
