import { SUITS, type Card, type Rank, type Suit } from "./types";

export function card(suit: Suit, rank: Rank): Card {
  if (!SUITS.includes(suit) || !Number.isInteger(rank) || rank < 1 || rank > 10)
    throw new Error("Invalid card.");
  return { id: `${suit}-${rank}`, suit, rank };
}
export function createDeck(): Card[] {
  return SUITS.flatMap((suit) =>
    Array.from({ length: 10 }, (_, i) => card(suit, (i + 1) as Rank)),
  );
}
export function shuffle(deck: readonly Card[], random = Math.random): Card[] {
  const copy = [...deck];
  for (let i = copy.length - 1; i > 0; i--) {
    const value = random();
    if (value < 0 || value >= 1 || !Number.isFinite(value))
      throw new Error("Random source must return a value in [0, 1).");
    const j = Math.floor(value * (i + 1));
    [copy[i], copy[j]] = [copy[j]!, copy[i]!];
  }
  return copy;
}
