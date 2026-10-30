import type { APIRoute } from "astro";
export const GET: APIRoute = ({ site }) =>
  new Response(
    `User-agent: *\n${__PUBLIC_SITE_CONFIGURED__ ? "Allow: /" : "Disallow: /"}\nSitemap: ${new URL("/sitemap.xml", site).href}\n`,
    { headers: { "Content-Type": "text/plain; charset=utf-8" } },
  );
