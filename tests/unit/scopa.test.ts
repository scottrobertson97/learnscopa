import { describe, expect, it } from "vitest";
import { card, createDeck, shuffle } from "../../src/lib/scopa/deck";
import {
  isLegalCapture,
  legalCaptures,
  legalMoves,
} from "../../src/lib/scopa/captures";
import {
  deal,
  InvalidOpeningError,
  newDeal,
  play,
} from "../../src/lib/scopa/game";
import { matchWinner, primiera, scoreDeal } from "../../src/lib/scopa/scoring";
import { SUITS, type GameState, type Rank } from "../../src/lib/scopa/types";
import { workedDeal } from "../../src/lib/scopa/scenarios";

const c = (rank: Rank) => card("cups", rank);
const state = (table = [c(5)], final = false): GameState => ({
  players: [
    { hand: [card("coins", 5)], captured: [], sweeps: 0 },
    { hand: final ? [] : [c(9)], captured: [], sweeps: 0 },
  ],
  table,
  stock: [],
  turn: 0,
  dealer: 1,
  lastCapturer: null,
  finished: false,
});
describe("deck", () => {
  it("has 40 unique cards, 10 per suit", () => {
    const deck = createDeck();
    expect(new Set(deck.map((c) => c.id)).size).toBe(40);
    for (const suit of SUITS)
      expect(deck.filter((c) => c.suit === suit)).toHaveLength(10);
  });
  it("shuffles without changing the input or losing cards", () => {
    const deck = createDeck();
    const shuffled = shuffle(deck, () => 0.3);
    expect(new Set(shuffled.map((c) => c.id))).toEqual(
      new Set(deck.map((c) => c.id)),
    );
    expect(shuffled).not.toEqual(deck);
    expect(deck[0]).toEqual(card("coins", 1));
  });
});
describe("captures", () => {
  it("finds a single match and prioritizes it over sums", () => {
    expect(legalCaptures(card("coins", 5), [c(5), c(3), c(2)])).toEqual([
      [c(5)],
    ]);
  });
  it("allows a choice of equal single cards, never both", () => {
    const table = [c(5), card("swords", 5)];
    expect(legalCaptures(card("coins", 5), table)).toHaveLength(2);
    expect(
      isLegalCapture(
        card("coins", 5),
        table,
        table.map((c) => c.id),
      ),
    ).toBe(false);
  });
  it("returns every valid combination including three-card sums", () => {
    const table = [c(1), c(2), c(3), c(4), c(5)];
    expect(
      legalCaptures(c(7), table).map((set) => set.map((c) => c.rank)),
    ).toEqual([
      [1, 2, 4],
      [2, 5],
      [3, 4],
    ]);
  });
  it("requires captures and rejects duplicate selections", () => {
    expect(isLegalCapture(card("coins", 5), [c(5)], [])).toBe(false);
    expect(isLegalCapture(card("coins", 5), [c(5)], ["cups-5", "cups-5"])).toBe(
      false,
    );
    expect(() =>
      play(state(), { cardId: "coins-5", captureIds: [] }),
    ).toThrow();
  });
  it("generates drop moves only when no capture exists", () => {
    expect(legalMoves([c(1), c(5)], [card("coins", 5)])).toEqual([
      { cardId: "cups-1", captureIds: [] },
      { cardId: "cups-5", captureIds: ["coins-5"] },
    ]);
  });
  it("leaves a card on the table when no capture exists", () => {
    const next = play(state([c(6)]), { cardId: "coins-5", captureIds: [] });
    expect(next.table.map((c) => c.id)).toEqual(["cups-6", "coins-5"]);
  });
});
describe("dealing and turns", () => {
  it("deals alternately, three each, then four to the table", () => {
    const game = deal(createDeck());
    expect(game.players[0].hand.map((c) => c.rank)).toEqual([1, 3, 5]);
    expect(game.players[1].hand.map((c) => c.rank)).toEqual([2, 4, 6]);
    expect(game.table).toHaveLength(4);
    expect(game.stock).toHaveLength(30);
    expect(game.turn).toBe(0);
  });
  it("rejects an opening of three kings", () => {
    const deck = createDeck();
    const kings = deck.filter((c) => c.rank === 10);
    const rest = deck.filter((c) => c.rank !== 10);
    const opening = [
      ...rest.slice(0, 6),
      ...kings.slice(0, 3),
      rest[6]!,
      ...rest.slice(7),
      kings[3]!,
    ];
    expect(() => deal(opening)).toThrow(InvalidOpeningError);
  });
  it("rejects invalid decks", () =>
    expect(() => deal(Array(40).fill(c(1)))).toThrow());
  it("counts a sweep, captures the played card, and leaves the input unchanged", () => {
    const before = state();
    const next = play(before, { cardId: "coins-5", captureIds: ["cups-5"] });
    expect(next.players[0].sweeps).toBe(1);
    expect(next.players[0].captured).toHaveLength(2);
    expect(before.players[0].hand).toHaveLength(1);
    expect(before.table).toHaveLength(1);
  });
  it("does not score a sweep on the final play of the deal", () => {
    const next = play(state([c(5)], true), {
      cardId: "coins-5",
      captureIds: ["cups-5"],
    });
    expect(next.players[0].sweeps).toBe(0);
    expect(next.finished).toBe(true);
  });
  it("awards leftovers to the last capturing player with no extra sweep", () => {
    const before = state([c(6)], true);
    before.lastCapturer = 1;
    const next = play(before, { cardId: "coins-5", captureIds: [] });
    expect(next.players[1].captured.map((c) => c.id)).toEqual([
      "cups-6",
      "coins-5",
    ]);
    expect(next.players[1].sweeps).toBe(0);
    expect(next.table).toHaveLength(0);
  });
  it("redeals three per player without adding table cards", () => {
    const before = state([c(5)], true);
    before.stock = createDeck()
      .filter((c) => !["coins-5", "cups-5"].includes(c.id))
      .slice(0, 6);
    const next = play(before, { cardId: "coins-5", captureIds: ["cups-5"] });
    expect(next.players.map((p) => p.hand.length)).toEqual([3, 3]);
    expect(next.table).toHaveLength(0);
    expect(next.finished).toBe(false);
    expect(next.players[0].sweeps).toBe(1);
  });
  it("plays whole deals with 40 conserved cards, correct redeals and final ownership", () => {
    for (let run = 0; run < 15; run++) {
      let game = newDeal();
      let turns = 0;
      while (!game.finished) {
        const move = legalMoves(game.players[game.turn].hand, game.table)[0]!;
        game = play(game, move);
        const all = [
          ...game.stock,
          ...game.table,
          ...game.players.flatMap((p) => [...p.hand, ...p.captured]),
        ];
        expect(new Set(all.map((c) => c.id)).size).toBe(40);
        expect(all).toHaveLength(40);
        if (++turns > 36) throw new Error("Too many turns");
      }
      expect(turns).toBe(36);
      expect(game.players.flatMap((p) => p.captured)).toHaveLength(40);
    }
  });
});
describe("scoring", () => {
  it("does not award most cards, most coins, or primiera on a tie", () => {
    const deck = createDeck();
    const result = scoreDeal([
      {
        captured: deck.filter((c) => ["coins", "cups"].includes(c.suit)),
        sweeps: 0,
      },
      {
        captured: deck.filter((c) => ["clubs", "swords"].includes(c.suit)),
        sweeps: 0,
      },
    ]);
    expect(result.categories[0]!.winner).toBe(null);
    const tied = scoreDeal([
      { captured: [card("coins", 1)], sweeps: 0 },
      { captured: [card("coins", 2)], sweeps: 0 },
    ]);
    expect(tied.categories[1]!.winner).toBe(null);
  });
  it("awards the settebello exactly one point", () => {
    const result = scoreDeal([
      { captured: [card("coins", 7)], sweeps: 0 },
      { captured: [c(7)], sweeps: 0 },
    ]);
    expect(result.categories[2]!.winner).toBe(0);
    expect(result.totals).toEqual([2, 0]);
  });
  it("uses the highest primiera card of each suit", () => {
    expect(primiera([...SUITS.map((s) => card(s, 7)), card("coins", 10)])).toBe(
      84,
    );
    expect(primiera(SUITS.map((s) => card(s, 1)))).toBe(64);
  });
  it("requires all four suits", () => {
    expect(primiera([card("coins", 7), c(7), card("clubs", 7)])).toBe(null);
  });
  it("handles primiera ties and one qualified player", () => {
    const first = [card("coins", 7), c(7), card("swords", 6), card("clubs", 6)];
    const second = [
      card("coins", 6),
      c(6),
      card("swords", 7),
      card("clubs", 7),
    ];
    expect(
      scoreDeal([
        { captured: first, sweeps: 0 },
        { captured: second, sweeps: 0 },
      ]).categories[3]!.winner,
    ).toBe(null);
    expect(
      scoreDeal([
        { captured: first, sweeps: 0 },
        { captured: [c(1)], sweeps: 0 },
      ]).categories[3]!.winner,
    ).toBe(0);
  });
  it("computes the complete worked example", () => {
    const result = scoreDeal(workedDeal);
    expect(result.categories.map((c) => c.values)).toEqual([
      [23, 17],
      [6, 4],
      [1, 0],
      [81, 69],
    ]);
    expect(result.totals).toEqual([6, 1]);
  });
  it("finishes at 11 after scoring a deal, and extends ties", () => {
    expect(matchWinner([10, 9])).toBe(null);
    expect(matchWinner([11, 11])).toBe(null);
    expect(matchWinner([12, 11])).toBe(0);
  });
});
