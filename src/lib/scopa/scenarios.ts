import { createDeck } from "./deck";
import type { ScoreInput } from "./scoring";

const yours = new Set([
  "coins-1",
  "coins-3",
  "coins-4",
  "coins-5",
  "coins-6",
  "coins-7",
  "cups-1",
  "cups-2",
  "cups-3",
  "cups-4",
  "cups-5",
  "cups-7",
  "cups-8",
  "cups-9",
  "swords-1",
  "swords-2",
  "swords-3",
  "swords-7",
  "swords-8",
  "clubs-1",
  "clubs-2",
  "clubs-5",
  "clubs-6",
]);
/** A complete, disjoint 40-card scoring example shared by the guide and tutorial. */
export const workedDeal: [ScoreInput, ScoreInput] = [
  { captured: createDeck().filter((c) => yours.has(c.id)), sweeps: 2 },
  { captured: createDeck().filter((c) => !yours.has(c.id)), sweeps: 1 },
];
