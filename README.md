# BiziLink - Next.js 15 Production Boilerplate

[![Next.js](https://img.shields.io/badge/Next.js-15.4.4-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-v4-38bdf8)](https://tailwindcss.com/)
[![React Query](https://img.shields.io/badge/React%20Query-5.83.0-ff4154)](https://tanstack.com/query)
[![Orval](https://img.shields.io/badge/Orval-API%20Generation-green)](https://orval.dev/)

> A modern, production-ready Next.js 15 boilerplate with automated API generation, TypeScript, TailwindCSS v4, internationalization, and advanced developer tools.

## 📋 Table of Contents

- [🚀 Features](#-features)
- [🛠 Quick Start](#-quick-start)
- [🎯 API Generation](#-api-generation)
- [🔧 Developer Tools](#-developer-tools)
- [🌍 Internationalization](#-internationalization)
- [📂 Project Structure](#-project-structure)
- [🎨 Styling](#-styling)
- [📊 State Management](#-state-management)
- [🔍 Environment Variables](#-environment-variables)
- [📜 Available Scripts](#-available-scripts)
- [🚀 Deployment](#-deployment)
- [🤝 Contributing](#-contributing)

## 🚀 Features

### Core Framework

- ⚡ **Next.js 15.4.4** - Latest version with App Router and React 19
- 🎨 **TailwindCSS v4** - Latest version with new PostCSS plugin
- 📝 **TypeScript** - Full type safety with strict configuration
- 🌍 **next-intl v4** - Complete internationalization support

### API & Data Management

- 🔄 **Orval Integration** - Automated API client generation from OpenAPI schemas
- 🧪 **React Query v5** - Advanced server state management with caching
- 🎯 **Axios** - HTTP client with custom interceptors and error handling
- 🔧 **Smart Mutators** - Custom API layer with camelCase transformation

### Form & Validation

- 📊 **React Hook Form** - Performant forms with minimal re-renders
- ✅ **Yup Validation** - Schema-based form validation
- 📤 **React Dropzone** - Advanced file upload handling

### UI & Visualization

- 🎭 **Headless UI** - Accessible, unstyled UI components
- 📈 **Chart.js + Lightweight Charts** - Comprehensive data visualization
- 🗃️ **React Table v8** - Powerful table management
- 🍞 **React Toastify** - Toast notifications
- 🎨 **Auto-animate** - Smooth animations and transitions

### Developer Experience

- 🔧 **ESLint + Prettier** - Code formatting and linting
- 🛠️ **Custom CLI Tools** - Interactive project management
- 📜 **Schema Transformation** - Automated API schema processing
- 🔄 **API Organization** - Smart API file organization and structure

## 🛠 Quick Start

### Prerequisites

- **Node.js** 18.x or later
- **pnpm** (recommended) - 50% faster than npm/yarn

### Installation

1. **Clone and install dependencies:**

   ```bash
   git clone <repository-url>
   cd nextjs-boilerplate
   pnpm install
   ```

2. **Set up environment variables:**

   ```bash
   cp .env.example .env.local
   # Edit .env.local with your configuration
   ```

3. **Generate API clients (if using external API):**

   ```bash
   pnpm generate:api
   ```

4. **Start development server:**

   ```bash
   pnpm dev
   ```

   🌐 Open [http://localhost:4100](http://localhost:4100) in your browser.

## 🎯 API Generation

BiziLink includes powerful API generation capabilities using **Orval**:

### Automatic Client Generation

```bash
# Generate API clients from OpenAPI schema
pnpm generate:api

# Organize generated API files
pnpm organize:api
```

### Configuration

The API generation is configured in `orval.config.ts`:

```typescript
// Generates React Query hooks from OpenAPI schema
input: 'YOUR_API_SCHEMA_URL';
output: 'src/services/api/generated';
client: 'react-query';
httpClient: 'axios';
```

### Features

- ✅ **React Query Integration** - Auto-generated hooks for queries and mutations
- ✅ **TypeScript Types** - Full type safety for all API operations
- ✅ **Custom Mutators** - Advanced request/response transformation
- ✅ **Error Handling** - Centralized error handling with proper typing
- ✅ **Schema Transformation** - Custom schema processing and normalization

### Usage Example

```typescript
// Auto-generated hook usage
import { useGetUserProfile } from '@/services/api/generated';

function ProfileComponent() {
  const { data, isLoading, error } = useGetUserProfile();

  if (isLoading) return <Loading />;
  if (error) return <Error message={error.message} />;

  return <Profile user={data} />;
}
```

## 🔧 Developer Tools

### Interactive CLI

BiziLink includes a powerful CLI for project management:

```bash
# Launch interactive CLI
pnpm runs
```

**CLI Features:**

- 🚀 Development server management
- 🔄 API generation and organization
- 🧹 Code formatting and linting
- 📦 Build and deployment tools
- 🔍 Project analysis and insights

### API Layer Features

**Advanced Request/Response Handling:**

```typescript
// Custom error handling
baseClient.interceptors.response.use(
  (response) => ({
    type: 'success',
    data: mapKeysDeep(response.data), // Auto camelCase conversion
    // ... other properties
  }),
  (error) => {
    // Centralized error handling for 400, 401, 403, 404, 413
    throw customErrorResponse;
  },
);
```

**Smart Configuration:**

- 🔐 **Auto-authentication** - Automatic JWT token handling
- 🐪 **CamelCase Transform** - Automatic snake_case to camelCase conversion
- ⏱️ **Request Timeout** - Configurable timeout (20s default)
- 🔄 **Request Interceptors** - Custom request modification

## 🌍 Internationalization

Complete i18n setup with next-intl v4:

### Current Configuration

- **Default locale:** English (en)
- **URL structure:** `/en/dashboard`, `/en/profile`
- **Message files:** `public/messages/`
- **Automatic detection** with fallbacks

### Adding New Languages

1. **Update locale constants:**

   ```typescript
   // src/constants/local.ts
   export const locales = ['en', 'es', 'fr'] as const;
   ```

2. **Create message files:**

   ```bash
   touch public/messages/es.json
   touch public/messages/fr.json
   ```

3. **Update middleware:**

   ```typescript
   // middleware.ts
   matcher: ['/', '/(en|es|fr)/:path*'];
   ```

### Usage Example

```typescript
import { useTranslations } from 'next-intl';

export default function Component() {
  const t = useTranslations('Dashboard');

  return <h1>{t('welcome')}</h1>;
}
```

## 📂 Project Structure

```
bizilink/
├── 📁 public/
│   └── 📁 messages/              # i18n translation files
│       ├── en.json
│       └── [locale].json
├── 📁 scripts/                   # Developer tools & automation
│   ├── cli.js                   # Interactive CLI tool
│   ├── organize-api.js          # API organization script
│   └── schema-transformer.js    # Schema transformation utilities
├── 📁 src/
│   ├── 📁 app/                  # Next.js App Router
│   │   ├── 📁 [locale]/         # Locale-based routing
│   │   │   ├── 📁 auth/         # Authentication pages
│   │   │   ├── 📁 dashboard/    # Dashboard pages
│   │   │   ├── layout.tsx       # Locale layout
│   │   │   └── page.tsx         # Home page
│   │   ├── layout.tsx           # Root layout
│   │   ├── globals.css          # Global styles
│   │   └── page.tsx             # Root page
│   ├── 📁 components/
│   │   ├── 📁 core/             # Core layout components
│   │   ├── 📁 shared/           # Reusable components
│   │   └── 📁 pages/            # Page-specific components
│   ├── 📁 constants/            # App-wide constants
│   ├── 📁 hooks/                # Custom React hooks
│   ├── 📁 i18n/                 # Internationalization config
│   ├── 📁 services/
│   │   ├── 📁 api/
│   │   │   ├── 📁 config/       # API configuration & interceptors
│   │   │   ├── 📁 generated/    # Auto-generated API clients
│   │   │   └── index.ts
│   │   ├── 📁 lib/              # External service configurations
│   │   └── 📁 providers/        # React context providers
│   └── 📁 utils/                # Utility functions
├── middleware.ts                # Next.js middleware (i18n)
├── orval.config.ts             # API generation configuration
├── next.config.ts              # Next.js configuration
├── tailwind.config.ts          # TailwindCSS configuration
└── tsconfig.json               # TypeScript configuration
```

## 🎨 Styling

### TailwindCSS v4 Configuration

- ✅ **Latest TailwindCSS v4** with PostCSS plugin
- ✅ **Responsive design** utilities
- ✅ **Dark mode ready** (easily configurable)
- ✅ **Custom fonts** - Cairo font family included
- ✅ **Component variants** with class variance authority

### Custom Utilities

```typescript
// tailwind-merge integration for conditional classes
import { cn } from '@/utils/cn';

<div className={cn('base-classes', condition && 'conditional-classes')} />;
```

## 📊 State Management

### React Query Configuration

```typescript
// Optimized React Query setup
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      cacheTime: 1000 * 60 * 10, // 10 minutes
      retry: 3,
      refetchOnWindowFocus: false,
    },
  },
});
```

### Form State with React Hook Form

```typescript
// Type-safe form handling
const form = useForm<FormData>({
  resolver: yupResolver(validationSchema),
  defaultValues: {
    // ...
  },
});
```

## 🔍 Environment Variables

Create `.env.local` for local development:

```bash
# API Configuration
NEXT_PUBLIC_BASE_URL=http://localhost:3000
NEXT_PUBLIC_API_URL=http://localhost:3000/api/v1

# Authentication
NEXT_PUBLIC_JWT_SECRET=your-secret-key

# Development
NEXT_PUBLIC_DEV_MODE=true

# Optional: Analytics
NEXT_PUBLIC_GA_ID=your-ga-id
```

## 📜 Available Scripts

### Development

```bash
pnpm dev          # Start development server (port 4100)
pnpm build        # Build for production
pnpm start        # Start production server (port 4100)
```

### Code Quality

```bash
pnpm lint         # Run ESLint with auto-fix
pnpm format       # Check code formatting
pnpm format:fix   # Fix code formatting
```

### API Management

```bash
pnpm generate:api # Generate API clients from OpenAPI
pnpm organize:api # Organize generated API files
```

### Development Tools

```bash
pnpm runs         # Launch interactive CLI
```

## 🚀 Deployment

### Docker Support

```dockerfile
# Multi-stage build optimized for production
FROM node:18-alpine AS builder
# ... build steps
FROM node:18-alpine AS runner
# ... runtime setup
```

### Deployment Commands

```bash
# Production build
pnpm build

# Docker build
docker build -t your-app-name .

# Docker run
docker run -p 3000:3000 your-app-name
```

## 🤝 Contributing

### Development Workflow

1. **Fork the repository**
2. **Create a feature branch:** `git checkout -b feature/amazing-feature`
3. **Make your changes** following the project structure
4. **Run tests and linting:** `pnpm lint && pnpm format`
5. **Commit your changes:** `git commit -m 'Add amazing feature'`
6. **Push to the branch:** `git push origin feature/amazing-feature`
7. **Open a Pull Request**

### Guidelines

- 🧩 **Components:** Place reusable components in `src/components/shared/`
- 📄 **Pages:** Page-specific components go in `src/components/pages/`
- 🔌 **APIs:** API calls should use generated clients in `src/services/api/generated/`
- 🏷️ **Types:** Define TypeScript types close to their usage
- ⚙️ **Constants:** App-wide constants in `src/constants/`

### Code Style

- Use **TypeScript** for all new files
- Follow **ESLint** and **Prettier** configurations
- Write **meaningful commit messages**
- Add **tests** for new functionality

## 📄 License

MIT License - feel free to use this boilerplate for your projects!

---

<div align="center">

**Built with ❤️ using Next.js 15, TypeScript, TailwindCSS v4, and Orval with recipe of ARTA**

</div>
