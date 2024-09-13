import { defineConfig } from 'vitest/config'
import { loadEnv } from 'vite'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig(({ mode }) => ({
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src/', import.meta.url)),
    }
  },
  test: {
    env: loadEnv(mode, process.cwd(), ''),
    include: [
      '**/__tests__/**/*.?(c|m)[jt]s?(x)',
      '**/?(*.){test,spec}.?(c|m)[jt]s?(x)'
    ],
    coverage: {
      provider: 'v8'
    },
    poolOptions: {
      forks: {
        singleFork: true
      }
    }
  }
}))