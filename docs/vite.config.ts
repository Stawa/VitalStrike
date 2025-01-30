import { vitePlugin as remix } from "@remix-run/dev";
import { defineConfig } from "vite";
import { copyFileSync } from "node:fs";
import { join } from "node:path";
import tsconfigPaths from "vite-tsconfig-paths";

declare module "@remix-run/node" {
  interface Future {
    v3_singleFetch: true;
  }
}

export default defineConfig({
  base: "/VitalStrike/",
  plugins: [
    remix({
      ssr: false,
      buildDirectory: "dist",
      basename: "/VitalStrike/",
      future: {
        v3_fetcherPersist: true,
        v3_relativeSplatPath: true,
        v3_throwAbortReason: true,
        v3_singleFetch: true,
        v3_lazyRouteDiscovery: true,
      },
      buildEnd(args) {
        if (!args.viteConfig.isProduction) return;
        const buildPath = args.viteConfig.build.outDir;
        copyFileSync(
          join(buildPath, "index.html"),
          join(buildPath, "404.html")
        );
      },
    }),
    tsconfigPaths(),
  ],
  server: {
    port: 5173,
    host: true,
  },
  build: {
    manifest: true,
  },
});
