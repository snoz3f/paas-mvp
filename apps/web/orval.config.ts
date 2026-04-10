import { defineConfig } from 'orval';

export default defineConfig({
  api: {
    input: 'http://localhost:5001/docs-json',
    output: {
      mode: 'tags-split',
      target: 'src/api/generated',
      client: 'react-query',
      override: {
        mutator: {
          path: 'src/lib/axios.ts',
          name: 'customInstance',
        },
      },
    },
  },
});
