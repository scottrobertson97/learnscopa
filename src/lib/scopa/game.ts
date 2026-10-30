import { createDeck, shuffle } from "./deck";
import { isLegalCapture } from "./captures";
import type { Card, GameState, Move, Player, PlayerState } from "./types";

export class InvalidOpeningError extends Error {}
const emptyPlayer = (): PlayerState => ({ hand: [], captured: [], sweeps: 0 });
export function deal(deck: readonly Card[], dealer: Player = 1): GameState {
  const expected = new Set(createDeck().map((c) => c.id));
  if (
    deck.length !== 40 ||
    new Set(deck.map((c) => c.id)).size !== 40 ||
    deck.some((c) => !expected.has(c.id) || c.id !== `${c.suit}-${c.rank}`)
  )
    throw new Error("A deal requires the 40 unique Scopa cards.");
  const stock = [...deck];
  const players: [PlayerState, PlayerState] = [emptyPlayer(), emptyPlayer()];
  const first: Player = dealer === 0 ? 1 : 0;
  for (let i = 0; i < 3; i++) {
    players[first].hand.push(stock.shift()!);
    players[dealer].hand.push(stock.shift()!);
  }
  const table = stock.splice(0, 4);
  if (table.filter((c) => c.rank === 10).length >= 3)
    throw new InvalidOpeningError(
      "Three or four kings on the opening table: shuffle and redeal.",
    );
  return {
    players,
    table,
    stock,
    dealer,
    turn: first,
    lastCapturer: null,
    finished: false,
  };
}
export function newDeal(dealer: Player = 1, random = Math.random): GameState {
  for (let attempt = 0; attempt < 100; attempt++) {
    try {
      return deal(shuffle(createDeck(), random), dealer);
    } catch (error) {
      if (!(error instanceof InvalidOpeningError)) throw error;
    }
  }
  throw new Error("Could not generate a valid opening after 100 shuffles.");
}
/** Immutable state transition. A capture choice is required when there is one. */
export function play(state: GameState, move: Move): GameState {
  if (state.finished) throw new Error("This deal is finished.");
  const current = state.players[state.turn];
  const played = current.hand.find((c) => c.id === move.cardId);
  if (!played) throw new Error("Card is not in the current player’s hand.");
  if (!isLegalCapture(played, state.table, move.captureIds))
    throw new Error(
      "Illegal capture: take a single match first, otherwise a valid sum. Capturing is mandatory.",
    );
  const next: GameState = {
    ...state,
    table: [...state.table],
    stock: [...state.stock],
    players: state.players.map((p) => ({
      hand: [...p.hand],
      captured: [...p.captured],
      sweeps: p.sweeps,
    })) as [PlayerState, PlayerState],
  };
  const player = next.players[state.turn];
  player.hand = player.hand.filter((c) => c.id !== played.id);
  const finalPlay =
    next.stock.length === 0 && next.players.every((p) => p.hand.length === 0);
  if (move.captureIds.length) {
    player.captured.push(
      played,
      ...next.table.filter((c) => move.captureIds.includes(c.id)),
    );
    next.table = next.table.filter((c) => !move.captureIds.includes(c.id));
    next.lastCapturer = state.turn;
    if (next.table.length === 0 && !finalPlay) player.sweeps++;
  } else next.table.push(played);
  next.turn = state.turn === 0 ? 1 : 0;
  if (next.players.every((p) => p.hand.length === 0)) {
    if (next.stock.length) {
      if (next.stock.length < 6) throw new Error("Incomplete stock.");
      const first: Player = next.dealer === 0 ? 1 : 0;
      for (let i = 0; i < 3; i++) {
        next.players[first].hand.push(next.stock.shift()!);
        next.players[next.dealer].hand.push(next.stock.shift()!);
      }
      next.turn = first;
    } else {
      if (next.table.length) {
        if (next.lastCapturer === null)
          throw new Error(
            "A finished deal with leftovers needs a last capturer.",
          );
        next.players[next.lastCapturer].captured.push(...next.table);
        next.table = [];
      }
      next.finished = true;
    }
  }
  return next;
}
