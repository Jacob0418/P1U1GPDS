import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import { configDefaults } from 'vitest/config';

export default defineConfig({
  plugins: [
    tailwindcss(),
  ],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './vitest.setup.ts',
    exclude: [...configDefaults.exclude, 'node_modules']
  }
})