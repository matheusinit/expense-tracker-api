import { defineConfig } from 'vitest/config'
import { loadEnv } from 'vite'

export default defineConfig(({ mode }) => ({
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