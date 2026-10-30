import { prefixPath } from "../src/lib/paths.ts";

/** Native Sätteri visitor: article links are correct before HTML leaves the build. */
export default function markdownBaseLinks(base) {
  return {
    name: "deployment-base-links",
    element: {
      filter: ["a", "img"],
      visit(node, ctx) {
        const property = node.tagName === "a" ? "href" : "src";
        const url = node.properties?.[property];
        if (typeof url === "string")
          ctx.setProperty(node, property, prefixPath(url, base));
      },
    },
  };
}
