import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/

export default defineConfig(({ mode }) => {
  return {
    server: {
      port: 4049,
    },
    plugins: [react()],
    esbuild: {
      pure: mode === "production" ? ["console.log"] : [],
    },
    test: {
      environment: "jsdom",
      globals: true,
      setupFiles: "./src/test_setup/setup-tests.ts",
      coverage: {
        reporter: ["text", "json", "html"],
        all: true,
        reportsDirectory: "./test-coverage",
        exclude: [
          "coverage/**",
          "dist/**",
          "packages/*/test?(s)/**",
          "**/*.d.ts",
          "cypress/**",
          "test?(s)/**",
          "test?(-*).?(c|m)[jt]s?(x)",
          "**/*{.,-}{test,spec}.?(c|m)[jt]s?(x)",
          "**/__tests__/**",
          "**/{karma,rollup,webpack,vite,vitest,jest,ava,babel,nyc,cypress,tsup,build}.config.*",
          "**/.{eslint,mocha,prettier}rc.{?(c|m)js,yml}",
          "**/html_css_js_example/**",
          "**/test_setup/**",
        ],
      },
    },
  };
});
