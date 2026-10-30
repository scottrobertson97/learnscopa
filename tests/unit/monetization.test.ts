import { expect, it } from "vitest";
import {
  adsEnabled,
  adsenseVerificationId,
  type AdsenseConfig,
} from "../../src/config/monetization";

// Synthetic test data, never placed in the site configuration or published HTML.
const fixture: AdsenseConfig = {
  publisherId: `ca-pub-${"1".repeat(16)}`,
  verificationEnabled: true,
  enabled: false,
  consentApproved: false,
  placements: {},
};
it("can verify ownership before ads, slot IDs, or consent integration are enabled", () => {
  expect(adsenseVerificationId(fixture)).toBe(fixture.publisherId);
  expect(adsEnabled(fixture)).toBe(false);
});
it("does not publish a missing, invalid, or disabled verification ID", () => {
  for (const publisherId of ["", "pub-123", "ca-pub-123", "<script>"]) {
    expect(adsenseVerificationId({ ...fixture, publisherId })).toBe(null);
  }
  expect(
    adsenseVerificationId({ ...fixture, verificationEnabled: false }),
  ).toBe(null);
});
it("keeps ad serving gated independently from verification", () => {
  const active = {
    ...fixture,
    enabled: true,
    consentApproved: true,
    placements: { "article-end": "42" },
  };
  expect(adsEnabled(active)).toBe(true);
  expect(adsEnabled({ ...active, consentApproved: false })).toBe(false);
  expect(adsEnabled({ ...active, enabled: false })).toBe(false);
  expect(adsEnabled({ ...active, publisherId: "" })).toBe(false);
  expect(adsEnabled({ ...active, placements: {} })).toBe(false);
  expect(adsEnabled({ ...active, verificationEnabled: false })).toBe(true);
});
