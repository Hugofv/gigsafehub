# Project Structure

## Monorepo Overview

This is a pnpm workspace monorepo containing:

- **2 Apps**: Next.js web app and Express API
- **2 Packages**: Shared UI components and TypeScript types

## Directory Structure

```
gigsafehub/
├── apps/
│   ├── api/                    # Express API server
│   │   ├── src/
│   │   │   ├── index.ts        # Entry point
│   │   │   ├── config.ts       # Configuration
│   │   │   ├── middleware/     # Express middleware
│   │   │   ├── routes/         # API routes
│   │   │   └── swagger.ts      # OpenAPI/Swagger config
│   │   ├── jest.config.js      # Jest configuration
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   └── web/                    # Next.js application
│       ├── src/
│       │   ├── app/            # Next.js App Router
│       │   │   ├── page.tsx    # Home page
│       │   │   ├── layout.tsx  # Root layout
│       │   │   └── globals.css # Global styles
│       │   └── middleware.ts   # Next.js middleware
│       ├── jest.config.js      # Jest configuration
│       ├── next.config.js      # Next.js configuration
│       ├── tailwind.config.js  # Tailwind CSS config
│       ├── package.json
│       └── tsconfig.json
│
├── packages/
│   ├── shared-types/           # Shared TypeScript types
│   │   ├── src/
│   │   │   └── index.ts        # Type exports
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   └── ui/                     # Shared React components
│       ├── src/
│       │   ├── Button.tsx      # Button component
│       │   ├── Header.tsx     # Header component
│       │   └── index.tsx       # Component exports
│       ├── package.json
│       └── tsconfig.json
│
├── .github/
│   ├── workflows/
│   │   ├── ci.yml              # CI/CD pipeline
│   │   └── codeql.yml          # Security scanning
│   └── dependabot.yml          # Dependency updates
│
├── .husky/                     # Git hooks
│   ├── pre-commit              # Runs lint-staged
│   └── commit-msg              # Validates commit messages
│
├── package.json                # Root workspace config
├── pnpm-workspace.yaml         # pnpm workspace config
├── tsconfig.json               # Root TypeScript config
├── .eslintrc.cjs              # ESLint configuration
├── .prettierrc.json           # Prettier configuration
├── commitlint.config.js       # Commitlint configuration
├── .lintstagedrc.json         # Lint-staged configuration
├── README.md                   # Main documentation
├── SETUP.md                    # Setup instructions
├── SECURITY.md                 # Security policy
└── nginx.conf.example         # NGINX config (optional)
```

## Key Files

### Root Configuration
- `package.json` - Workspace scripts and dev dependencies
- `pnpm-workspace.yaml` - pnpm workspace definition
- `tsconfig.json` - Base TypeScript configuration

### Code Quality
- `.eslintrc.cjs` - ESLint rules
- `.prettierrc.json` - Prettier formatting rules
- `.lintstagedrc.json` - Pre-commit linting rules
- `commitlint.config.js` - Commit message validation

### CI/CD
- `.github/workflows/ci.yml` - Main CI pipeline
- `.github/workflows/codeql.yml` - Security scanning
- `.github/dependabot.yml` - Automated dependency updates

### Git Hooks
- `.husky/pre-commit` - Runs lint-staged before commits
- `.husky/commit-msg` - Validates commit message format

## Package Dependencies

### Workspace Dependencies
All apps and packages use workspace protocol (`workspace:*`) for internal dependencies:
- `@gigsafehub/types` - Shared TypeScript types
- `@gigsafehub/ui` - Shared React components

### External Dependencies
- **Web**: Next.js, React, Tailwind CSS
- **API**: Express, Helmet, CORS, Zod, Pino
- **UI**: React (peer dependency)
- **Types**: None (pure TypeScript)

## Build Output

- `apps/web/.next/` - Next.js build output
- `apps/api/dist/` - Compiled TypeScript
- `packages/ui/dist/` - Built UI components
- `packages/shared-types/dist/` - Compiled types

## Environment Files

- `apps/web/.env.local` - Web app environment variables
- `apps/api/.env` - API environment variables
- `.env.example` files are provided as templates

## Testing

- `apps/web/src/app/__tests__/` - Web app tests
- `apps/api/src/routes/__tests__/` - API tests
- Jest configuration in each app's `jest.config.js`

