import { defineConfig } from 'orval';

export default defineConfig({
  bizilink: {
    input: {
      target: 'YOUR_SCHEMA_URL',
      override: {
        transformer: 'scripts/schema-transformer.js',
      },
    },
    output: {
      mode: 'split',
      target: 'src/services/api/generated',
      schemas: 'src/services/api/generated/model',
      client: 'react-query',
      httpClient: 'axios',
      mock: false,
      prettier: true,
      override: {
        mutator: {
          path: 'src/services/api/config/mutator.ts',
          name: 'mutator',
        },
        query: {
          useQuery: true,
          useMutation: true,
          signal: true,
        },
        operations: {
          // Add any specific operation overrides here if needed
        },
      },
    },
    hooks: {
      afterAllFilesWrite: 'prettier --write',
    },
  },
}); 