import type { Card, Move } from "./types";

/** Exact matches always outrank sums. Each returned choice contains table cards only. */
export function legalCaptures(played: Card, table: readonly Card[]): Card[][] {
  const matches = table.filter((c) => c.rank === played.rank);
  if (matches.length) return matches.map((c) => [c]);
  const result: Card[][] = [];
  function visit(start: number, sum: number, selected: Card[]): void {
    if (sum === played.rank) {
      if (selected.length > 1) result.push(selected);
      return;
    }
    for (let i = start; i < table.length; i++) {
      const next = table[i]!;
      if (sum + next.rank <= played.rank)
        visit(i + 1, sum + next.rank, [...selected, next]);
    }
  }
  visit(0, 0, []);
  return result;
}
export function sameSelection(
  a: readonly string[],
  b: readonly string[],
): boolean {
  return (
    a.length === b.length &&
    new Set(a).size === a.length &&
    a.every((id) => b.includes(id))
  );
}
export function isLegalCapture(
  played: Card,
  table: readonly Card[],
  ids: readonly string[],
): boolean {
  const options = legalCaptures(played, table);
  return options.length === 0
    ? ids.length === 0
    : options.some((option) =>
        sameSelection(
          ids,
          option.map((c) => c.id),
        ),
      );
}
export function legalMoves(
  hand: readonly Card[],
  table: readonly Card[],
): Move[] {
  return hand.flatMap((c) => {
    const options = legalCaptures(c, table);
    return options.length
      ? options.map((option) => ({
          cardId: c.id,
          captureIds: option.map((t) => t.id),
        }))
      : [{ cardId: c.id, captureIds: [] }];
  });
}
