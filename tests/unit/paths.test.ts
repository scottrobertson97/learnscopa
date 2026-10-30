import { expect, it } from "vitest";
import { normalizeBase, prefixPath, stripBase } from "../../src/lib/paths";

it("supports root and project deployments, directory URLs, queries and anchors", () => {
  expect(prefixPath("/learn")).toBe("/learn/");
  expect(prefixPath("/", "/learnscopa")).toBe("/learnscopa/");
  expect(prefixPath("/rules#scoring", "/learnscopa/")).toBe(
    "/learnscopa/rules/#scoring",
  );
  expect(prefixPath("/cards?print=1", "/learnscopa/")).toBe(
    "/learnscopa/cards/?print=1",
  );
  expect(prefixPath("/images/social-card.png", "/learnscopa/")).toBe(
    "/learnscopa/images/social-card.png",
  );
  expect(prefixPath("/learnscopa/rules/", "/learnscopa/")).toBe(
    "/learnscopa/rules/",
  );
  expect(stripBase("/learnscopa/rules/", "/learnscopa/")).toBe("/rules");
  expect(stripBase("/learnscopa/", "/learnscopa/")).toBe("/");
});
it("preserves external, protocol-relative, relative, and fragment links", () => {
  for (const path of [
    "https://www.pagat.com/fishing/scopa.html",
    "//example.org/file",
    "#main",
    "mailto:test@example.org",
    "../cards/",
  ])
    expect(prefixPath(path, "/learnscopa/")).toBe(path);
});
it("rejects a URL or parent-directory traversal as a deployment base", () => {
  for (const base of [
    "https://example.org",
    "//example.org",
    "/../",
    "/cards?x=1",
  ])
    expect(() => normalizeBase(base)).toThrow();
});
