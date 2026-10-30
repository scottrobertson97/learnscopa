import { loadEnv } from "vite";
const env = loadEnv("production", process.cwd(), "");
const value = process.env.SITE_URL || env.SITE_URL || process.env.CF_PAGES_URL;
if (
  !value ||
  !value.startsWith("https://") ||
  new URL(value).pathname !== "/"
) {
  console.error(
    "Set SITE_URL to your actual HTTPS origin before a public build.",
  );
  process.exit(1);
}
