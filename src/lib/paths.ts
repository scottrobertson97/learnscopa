/** Normalize a deploy path without coupling URL rules to a host or framework. */
export function normalizeBase(base = "/"): string {
  if (
    !base.startsWith("/") ||
    base.startsWith("//") ||
    /[?#\\]/.test(base) ||
    base.split("/").some((part) => part === "." || part === "..")
  ) {
    throw new Error(
      "BASE_PATH must be a root-relative path such as /learnscopa/.",
    );
  }
  const path = base.split("/").filter(Boolean).join("/");
  return path ? `/${path}/` : "/";
}

/** Internal pages use directory URLs; public files retain their extensions. */
export function prefixPath(path: string, base = "/"): string {
  if (!path.startsWith("/") || path.startsWith("//")) return path;
  const prefix = normalizeBase(base);
  const [, pathname = "/", suffix = ""] = path.match(/^([^?#]*)(.*)$/)!;
  const relative =
    prefix !== "/" && pathname.startsWith(prefix)
      ? pathname.slice(prefix.length)
      : pathname.replace(/^\/+/, "");
  const result = `${prefix}${relative}`;
  const lastSegment = relative.split("/").at(-1) ?? "";
  return `${result}${lastSegment && !lastSegment.includes(".") ? "/" : ""}${suffix}`;
}

export function stripBase(pathname: string, base = "/"): string {
  const prefix = normalizeBase(base).replace(/\/$/, "");
  const relative =
    prefix && (pathname === prefix || pathname.startsWith(`${prefix}/`))
      ? pathname.slice(prefix.length)
      : pathname;
  return relative.replace(/\/$/, "") || "/";
}
