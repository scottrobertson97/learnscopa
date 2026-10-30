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
    enabled: false,
    disclosure: "As an Amazon Associate I earn from qualifying purchases.",
    // Buying categories, not endorsements of unverified listings. Replace with verified products before linking.
    products: [
      {
        id: "napoletane",
        name: "A Neapolitan-pattern deck",
        deckType: "Napoletane · 40 cards",
        description:
          "A familiar southern Italian pattern with coins, cups, swords, and clubs. Look for a complete 40-card pack.",
        usefulness:
          "An approachable starting point if you want the Latin suits used in our lessons.",
      },
      {
        id: "siciliane",
        name: "A Sicilian-pattern deck",
        deckType: "Siciliane · 40 cards",
        description:
          "A distinct regional take on the same four Latin suits and ten ranks. Check the listing for the Sicilian pattern and card count.",
        usefulness:
          "A good choice if you enjoy discovering how the same game looks around Italy.",
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
