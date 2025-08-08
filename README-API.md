# API Integration Guide

This boilerplate uses [Orval](https://orval.dev/) for API integration, which automatically generates type-safe API clients from your OpenAPI/Swagger specifications.

## Setup

1. Configure your API schema in `orval.config.ts`:

```typescript
import { defineConfig } from 'orval';

export default defineConfig({
  api: {
    input: {
      target: 'YOUR_API_SCHEMA_URL',
      // Or use a local file:
      // target: './api-schema.json',
    },
    output: {
      mode: 'tags-split',
      target: 'src/services/api/generated',
      schemas: 'src/services/api/generated/model',
      client: 'react-query',
      override: {
        mutator: {
          path: './src/services/api/config/mutator.ts',
          name: 'customInstance',
        },
      },
    },
  },
});
```

## Generate API Client

```bash
# Generate API clients from schema
pnpm generate:api

# Organize generated files (optional)
pnpm organize:api
```

## Usage

The generated API clients are automatically configured with:

- ✅ React Query hooks for data fetching
- ✅ TypeScript types for request/response
- ✅ Axios instance with interceptors
- ✅ Error handling
- ✅ Authentication header injection

Example usage:

```typescript
import { useGetUsers, useCreateUser } from '@/services/api/generated';

// Query hook
const { data: users, isLoading } = useGetUsers();

// Mutation hook
const { mutate: createUser } = useCreateUser();

// Use in component
createUser({ name: 'John Doe' });
```

## Customization

### API Client Configuration

The base API client is configured in `src/services/api/config/index.ts`:

- Base URL from environment variables
- Authentication header injection
- Error handling
- Response transformation

### Custom Axios Instance

You can customize the Axios instance in `src/services/api/config/mutator.ts`:

```typescript
import baseClient from './index';

export const customInstance = <T>(): Promise<T> => {
  return baseClient.request<T>({
    // Your custom configuration
  });
};
```

## File Organization

```
src/services/api/
├── config/           # API client configuration
├── generated/        # Generated API clients (git-ignored)
└── index.ts         # API service exports
```

## Best Practices

1. Never modify generated files directly
2. Keep API schema up-to-date
3. Use environment variables for API URLs
4. Handle errors appropriately
5. Add proper TypeScript types
6. Use React Query features for caching
