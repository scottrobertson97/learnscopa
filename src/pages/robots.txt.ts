import type { APIRoute } from "astro";
import { absoluteUrl } from "../lib/urls";
export const GET: APIRoute = ({ site }) =>
  new Response(
    `User-agent: *\n${__PUBLIC_SITE_CONFIGURED__ ? "Allow: /" : "Disallow: /"}\nSitemap: ${absoluteUrl("/sitemap.xml", site).href}\n`,
    { headers: { "Content-Type": "text/plain; charset=utf-8" } },
  );
