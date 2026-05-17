import { defineConfig } from 'orval';

export default defineConfig({
  api: {
    input: process.env.API_URL ? `${process.env.API_URL}/docs-json` : 'http://localhost:5001/docs-json',
    output: {
      mode: 'tags-split',
      target: 'src/api/generated',
      client: 'react-query',
      httpClient: 'axios',
      override: {
        mutator: {
          path: 'src/lib/axios.ts',
          name: 'customInstance',
        },
      },
    },
  },
});
