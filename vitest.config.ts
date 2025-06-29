import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    cache: {
      dir: './__tests__/.cache',
    },
    setupFiles: ['./vitest.setup.ts'],
    environment: 'jsdom',
    deps: {},
    environmentOptions: {
      jsdom: {
        resources: 'usable',
      },
    },
    reporters: ['junit', 'json', 'default', 'html'], //'verbose', 'minimal'
    outputFile: {
      junit: './__tests__/reports/junit-report.xml',
      json: './__tests__/reports/json-report.json',
      html: './__tests__/reports/html/index.html',
    },
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'lcov', 'clover'],
      reportsDirectory: './__tests__/coverage',
      // enabled: true,
    },
    include: [
      'imports/**/*.{test,spec}.{ts,tsx}',
      'client/**/*.{test,spec}.{ts,tsx}',
      'server/**/*.{test,spec}.{ts}',
    ],
  },
});
