import { defineConfig } from "astro/config";
import { loadEnv } from "vite";
import { normalizeBase } from "./src/lib/paths.ts";
import { satteri } from "@astrojs/markdown-satteri";
import markdownBaseLinks from "./scripts/markdown-base-links.mjs";

const env = loadEnv(process.env.NODE_ENV ?? "production", process.cwd(), "");
const origin = process.env.SITE_URL || env.SITE_URL || process.env.CF_PAGES_URL;
const base = normalizeBase(process.env.BASE_PATH || env.BASE_PATH || "/");
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
  base,
  output: "static",
  trailingSlash: "ignore",
  markdown: { processor: satteri({ hastPlugins: [markdownBaseLinks(base)] }) },
  vite: {
    define: { __PUBLIC_SITE_CONFIGURED__: JSON.stringify(Boolean(origin)) },
  },
  devToolbar: { enabled: false },
});
