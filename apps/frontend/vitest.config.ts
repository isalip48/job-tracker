// vitest.config.ts

import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import { resolve } from "path";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",          // simulate a browser environment
    globals: true,                 // no need to import describe/it/expect
    setupFiles: ["./tests/setup.ts"],
  },
  resolve: {
    alias: {
      "@": resolve(__dirname, "."),  // mirrors the @ alias in tsconfig
    },
  },
});