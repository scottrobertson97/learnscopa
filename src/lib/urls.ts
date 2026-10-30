import { prefixPath, stripBase } from "./paths";
export const href = (path: string): string =>
  prefixPath(path, import.meta.env.BASE_URL);
export const routePath = (pathname: string): string =>
  stripBase(pathname, import.meta.env.BASE_URL);
export const absoluteUrl = (path: string, site: URL | undefined): URL =>
  new URL(href(path), site);
