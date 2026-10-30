export interface Recommendation {
  id: string;
  name: string;
  deckType: string;
  description: string;
  usefulness: string;
  image?: {
    src: string;
    alt: string;
    width: number;
    height: number;
    licenseNote: string;
  };
  affiliateUrl?: string;
}
export interface AdsenseConfig {
  enabled: boolean;
  publisherId: string;
  verificationEnabled: boolean;
  consentApproved: boolean;
  placements: Record<string, string>;
}
export const monetization: {
  affiliate: {
    enabled: boolean;
    disclosure: string;
    products: Recommendation[];
  };
  adsense: AdsenseConfig;
} = {
  affiliate: {
    enabled: true,
    disclosure: "As an Amazon Associate I earn from qualifying purchases.",
    // Listing identities checked October 30, 2026. Do not add scraped prices, ratings, or seller images.
    products: [
      {
        id: "napoletane",
        name: "Modiano Napoletane 97/25",
        deckType: "Napoletane · 40 cards",
        description:
          "A Neapolitan-pattern deck with the coins, cups, swords, and clubs used in our lessons. The linked listing is for one 40-card deck.",
        usefulness:
          "Choose this pattern if you want to begin with the southern Italian suits introduced in the tutorial.",
        affiliateUrl: "https://www.amazon.com/dp/B001KPU996?tag=learnscopa-20",
      },
      {
        id: "siciliane",
        name: "Modiano Sicilian Scopa playing cards",
        deckType: "Siciliane · 40 cards",
        description:
          "A Sicilian-pattern deck for Scopa, with the same four Latin suits and ten ranks per suit. Its illustrations offer another regional way to read the cards.",
        usefulness:
          "Choose this pattern if Sicilian cards are familiar to your family, or you would like to explore a different regional design.",
        affiliateUrl: "https://www.amazon.com/dp/B000FH6GZQ?tag=learnscopa-20",
      },
    ],
  },
  adsense: {
    enabled: false,
    publisherId: "ca-pub-2075641468239843",
    // A verification meta tag makes no ad requests and can precede account approval.
    verificationEnabled: true,
    consentApproved: false,
    placements: { "article-end": "", "rules-end": "" },
  },
};
export function affiliateLink(product: Recommendation): string | null {
  if (!monetization.affiliate.enabled || !product.affiliateUrl) return null;
  try {
    const url = new URL(product.affiliateUrl);
    const amazonHost =
      /(^|\.)amazon\.(com|co\.uk|it|de|fr|es|ca|com\.au|co\.jp)$/.test(
        url.hostname,
      ) || url.hostname === "amzn.to";
    return url.protocol === "https:" && amazonHost ? url.href : null;
  } catch {
    return null;
  }
}
export function adsenseVerificationId(
  config: AdsenseConfig = monetization.adsense,
): string | null {
  return config.verificationEnabled &&
    /^ca-pub-\d{16}$/.test(config.publisherId)
    ? config.publisherId
    : null;
}
export function adsEnabled(
  config: AdsenseConfig = monetization.adsense,
): boolean {
  return (
    config.enabled &&
    config.consentApproved &&
    /^ca-pub-\d{16}$/.test(config.publisherId) &&
    Object.values(config.placements).some((slot) => /^\d+$/.test(slot))
  );
}
