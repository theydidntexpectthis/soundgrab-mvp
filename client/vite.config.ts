import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    {
      name: 'typescript-skip-errors',
      // Skip TypeScript errors during build
      handleHotUpdate({ file, server }) {
        if (file.endsWith('.ts') || file.endsWith('.tsx')) {
          return [];
        }
      },
    }
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
      "@shared": path.resolve(__dirname, "../shared"),
    },
  },
  build: {
    outDir: "dist",
    emptyOutDir: true,
    // Skip TypeScript type checking during build
    rollupOptions: {
      onwarn(warning, warn) {
        if (warning.code === 'TYPESCRIPT_ERROR') return;
        warn(warning);
      },
    },
  },
  esbuild: {
    // Skip TypeScript type checking during build
    tsconfigRaw: JSON.stringify({
      compilerOptions: {
        target: "esnext",
        module: "esnext",
        moduleResolution: "node",
        jsx: "preserve",
        skipLibCheck: true,
        noEmitOnError: false,
        strict: false,
        noImplicitAny: false
      }
    })
  }
});
