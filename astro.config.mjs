import { defineConfig } from "astro/config";
import { loadEnv } from "vite";

const env = loadEnv(process.env.NODE_ENV ?? "production", process.cwd(), "");
const origin = process.env.SITE_URL || env.SITE_URL || process.env.CF_PAGES_URL;
if (
  origin &&
  (!/^https?:\/\//.test(origin) || new URL(origin).pathname !== "/")
) {
  throw new Error(
    "SITE_URL must be an absolute HTTP(S) origin without a path.",
  );
}

export default defineConfig({
  site: origin || "http://localhost:4321",
  output: "static",
  trailingSlash: "never",
  vite: {
    define: { __PUBLIC_SITE_CONFIGURED__: JSON.stringify(Boolean(origin)) },
  },
  devToolbar: { enabled: false },
});
