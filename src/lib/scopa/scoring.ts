import { SUITS, type Card, type Player, type Rank } from "./types";

export const PRIMIERA: Record<Rank, number> = {
  1: 16,
  2: 12,
  3: 13,
  4: 14,
  5: 15,
  6: 18,
  7: 21,
  8: 10,
  9: 10,
  10: 10,
};
export function primiera(cards: readonly Card[]): number | null {
  const best = SUITS.map((suit) =>
    Math.max(
      0,
      ...cards.filter((c) => c.suit === suit).map((c) => PRIMIERA[c.rank]),
    ),
  );
  return best.includes(0) ? null : best.reduce((sum, n) => sum + n, 0);
}
export interface ScoreInput {
  captured: readonly Card[];
  sweeps: number;
}
export interface ScoreCategory {
  name: string;
  values: [number | null, number | null];
  winner: Player | null;
}
export interface DealScore {
  categories: ScoreCategory[];
  totals: [number, number];
}
function winner(a: number | null, b: number | null): Player | null {
  if (a === b) return null;
  if (a === null) return 1;
  if (b === null) return 0;
  return a > b ? 0 : 1;
}
export function scoreDeal(
  players: readonly [ScoreInput, ScoreInput],
): DealScore {
  if (players.some((p) => !Number.isInteger(p.sweeps) || p.sweeps < 0))
    throw new Error("Sweeps must be non-negative integers.");
  const category = (
    name: string,
    fn: (p: ScoreInput) => number | null,
  ): ScoreCategory => {
    const values: [number | null, number | null] = [
      fn(players[0]),
      fn(players[1]),
    ];
    return { name, values, winner: winner(...values) };
  };
  const categories = [
    category("Most cards", (p) => p.captured.length),
    category(
      "Most coins",
      (p) => p.captured.filter((c) => c.suit === "coins").length,
    ),
    category("Settebello", (p) =>
      Number(p.captured.some((c) => c.suit === "coins" && c.rank === 7)),
    ),
    category("Primiera", (p) => primiera(p.captured)),
  ];
  // No settebello owner (e.g. a partial teaching state) means no category point.
  const totals: [number, number] = [players[0].sweeps, players[1].sweeps];
  for (const c of categories) if (c.winner !== null) totals[c.winner]++;
  return { categories, totals };
}
/** Score at the end of a deal; tied leaders play another deal. */
export function matchWinner(
  totals: readonly [number, number],
  target = 11,
): Player | null {
  if (totals[0] === totals[1] || Math.max(...totals) < target) return null;
  return totals[0] > totals[1] ? 0 : 1;
}
