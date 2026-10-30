import type { APIRoute } from "astro";
import { getCollection } from "astro:content";
export const GET: APIRoute = async ({ site }) => {
  const articles = await getCollection("articles");
  const routes = [
    "/",
    "/learn",
    "/rules",
    "/scoring",
    "/cards",
    "/about",
    "/privacy",
    "/articles",
    ...articles.map((a) => `/articles/${a.id}`),
  ];
  const xml = `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${routes.map((path) => `<url><loc>${new URL(path, site).href.replaceAll("&", "&amp;")}</loc></url>`).join("")}</urlset>`;
  return new Response(xml, {
    headers: { "Content-Type": "application/xml; charset=utf-8" },
  });
};
