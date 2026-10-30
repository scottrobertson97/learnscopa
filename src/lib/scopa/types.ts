export const SUITS = ["coins", "cups", "swords", "clubs"] as const;
export type Suit = (typeof SUITS)[number];
export type Rank = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;
export interface Card {
  readonly id: string;
  readonly suit: Suit;
  readonly rank: Rank;
}
export type Player = 0 | 1;
export interface PlayerState {
  hand: Card[];
  captured: Card[];
  sweeps: number;
}
export interface GameState {
  players: [PlayerState, PlayerState];
  table: Card[];
  stock: Card[];
  dealer: Player;
  turn: Player;
  lastCapturer: Player | null;
  finished: boolean;
}
export interface Move {
  cardId: string;
  captureIds: string[];
}
export const suitNames: Record<Suit, { english: string; italian: string }> = {
  coins: { english: "Coins", italian: "Denari" },
  cups: { english: "Cups", italian: "Coppe" },
  swords: { english: "Swords", italian: "Spade" },
  clubs: { english: "Clubs", italian: "Bastoni" },
};
export function rankName(rank: Rank): string {
  return (
    (
      { 1: "Ace", 8: "Fante", 9: "Cavallo", 10: "Re" } as Record<number, string>
    )[rank] ?? String(rank)
  );
}
export function cardLabel(card: Card): string {
  return `${rankName(card.rank)} of ${card.suit}, value ${card.rank}`;
}
