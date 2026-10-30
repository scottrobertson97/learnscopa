import {
  cardLabel,
  rankName,
  suitNames,
  type Card,
  type Suit,
} from "../../lib/scopa/types";

const colors: Record<Suit, string> = {
  coins: "#b47b24",
  cups: "#a73f31",
  swords: "#315f69",
  clubs: "#315440",
};
// Small original stroke glyphs keep visual indices as artwork, with one clear spoken label on the card.
const glyphs: Record<string, string> = {
  A: "M0 8 2.5 0 5 8M1 5H4",
  B: "M0 8V0H2.5Q6 0 4 4Q7 8 2.5 8Z M0 4H3",
  C: "M5 1Q0-2 0 4T5 7",
  D: "M0 0V8H2Q6 8 6 4T2 0Z",
  E: "M5 0H0V8H5M0 4H4",
  F: "M0 8V0H5M0 4H4",
  I: "M0 0H4M2 0V8M0 8H4",
  L: "M0 0V8H5",
  N: "M0 8V0L5 8V0",
  O: "M2.5 0Q0 0 0 4T2.5 8Q5 8 5 4T2.5 0Z",
  P: "M0 8V0H3Q6 0 5 2T3 4H0",
  R: "M0 8V0H3Q6 0 5 2T3 4H0M3 4 6 8",
  S: "M5 1Q0-2 0 2Q0 4 3 4T5 6Q5 10 0 7",
  T: "M0 0H6M3 0V8",
  V: "M0 0 2.5 8 5 0",
  "2": "M0 2Q0-1 3 0T4 4L0 8H5",
  "3": "M0 1Q5-2 5 2Q5 4 2 4Q5 4 5 6T0 7",
  "4": "M4 8V0L0 5H6",
  "5": "M5 0H0V4Q5 2 5 6T0 7",
  "6": "M5 1Q0-2 0 5Q0 9 3 8T5 5Q5 2 0 5",
  "7": "M0 0H5L1 8",
};
function lettering(
  text: string,
  x: number,
  y: number,
  scale: number,
  color: string,
): string {
  return `<g transform="translate(${x} ${y}) scale(${scale})" fill="none" stroke="${color}" stroke-width=".85" stroke-linecap="round" stroke-linejoin="round">${[...text].map((letter, i) => `<path transform="translate(${i * 8} 0)" d="${glyphs[letter] ?? ""}"/>`).join("")}</g>`;
}
/** Original vector motifs, drawn for Learn Scopa. No commercial deck artwork. */
export function suitArt(suit: Suit): string {
  switch (suit) {
    case "coins":
      return '<circle r="12" fill="#d6ad51" stroke="#805c25" stroke-width="1.3"/><circle r="8.8" fill="none" stroke="#805c25" stroke-width=".8"/><path d="M0-7 2-2 7 0 2 2 0 7-2 2-7 0-2-2Z" fill="#805c25"/><circle r="2" fill="#f5e6bc"/>';
    case "cups":
      return '<path d="M-10-10H10L8 2Q6 8 0 8T-8 2Z" fill="#b44b35" stroke="#743728" stroke-width="1.2"/><path d="M-10-7Q-18-8-13 1L-7 4M10-7Q18-8 13 1L7 4M0 8V14M-7 15H7" fill="none" stroke="#b47b24" stroke-width="2.5"/><path d="M-7-7H7M-5-3H5" stroke="#f2ce7d" stroke-width="1.2"/>';
    case "swords":
      return '<path d="M0-19 4-11 2 8H-2L-4-11Z" fill="#8aadae" stroke="#315f69" stroke-width="1.2"/><path d="M0-14V7" stroke="#ecede2"/><path d="M-8 8Q0 4 8 8M0 8V18" fill="none" stroke="#b47b24" stroke-width="3"/><circle cy="19" r="2.5" fill="#b47b24"/>';
    case "clubs":
      return '<path d="M-2 16-7-13Q-6-19-2-16L6-13 3 16Z" fill="#49734b" stroke="#2c4c36" stroke-width="1.2"/><path d="M0 12-3-12M-3-5-10-9M-1 1 8-4" stroke="#c3a45c" stroke-width="1.5"/><path d="M-8-9Q-17-18-10-19Q-5-18-8-9M7-4Q16-15 17-6Q15 0 7-4" fill="#49734b" stroke="#2c4c36" stroke-width=".8"/>';
  }
}
const layouts: Record<number, [number, number][]> = {
  1: [[60, 88]],
  2: [
    [60, 49],
    [60, 125],
  ],
  3: [
    [60, 45],
    [60, 87],
    [60, 129],
  ],
  4: [
    [37, 51],
    [83, 51],
    [37, 123],
    [83, 123],
  ],
  5: [
    [37, 48],
    [83, 48],
    [60, 87],
    [37, 127],
    [83, 127],
  ],
  6: [
    [37, 47],
    [83, 47],
    [37, 87],
    [83, 87],
    [37, 127],
    [83, 127],
  ],
  7: [
    [37, 43],
    [83, 43],
    [37, 80],
    [83, 80],
    [60, 105],
    [37, 135],
    [83, 135],
  ],
};
function court(card: Card): string {
  const color = colors[card.suit];
  const head =
    '<ellipse cx="60" cy="50" rx="12" ry="16" fill="#ead2a4" stroke="#6c4d32"/><path d="M49 48Q47 28 63 33Q75 32 73 47L68 40 51 43" fill="#493f31"/><path d="M65 49h3M56 49h3M62 51l-1 5h3M58 60q5 3 9-1" fill="none" stroke="#6c4d32" stroke-width="1.1"/>';
  const robe = `<path d="M46 69 34 117 45 132H79L86 117 74 69 60 64Z" fill="${color}" stroke="#493f31" stroke-width="1.2"/><path d="M53 68 59 126 69 68M39 95H80M41 115H82" fill="none" stroke="#d6ad51" stroke-width="3"/><path d="M48 131 43 151H56L60 132M66 132 67 151H80L75 130" fill="#d6ad51" stroke="#493f31"/>`;
  if (card.rank === 9)
    return `<path d="M23 112Q44 96 72 113L80 90 93 86 101 103 94 109 85 107 82 132 77 150H70L72 130H43L36 150H28L33 127 24 123Z" fill="#ddc69e" stroke="#6c4d32" stroke-width="1.4"/><path d="M85 90 78 80 80 99M26 113Q15 105 18 131" fill="none" stroke="#493f31" stroke-width="3"/><g transform="translate(10 -1) scale(.8)">${robe}${head}</g><path d="M58 99 74 109 70 128 60 126 61 112 48 110" fill="${color}" stroke="#493f31"/><g transform="translate(33 48) scale(.6)">${suitArt(card.suit)}</g>`;
  return `${robe}${head}${card.rank === 10 ? '<path d="M47 36 44 23 54 28 60 19 66 28 77 23 73 36Z" fill="#d6ad51" stroke="#805c25"/><path d="M49 34H71" stroke="#a73f31" stroke-width="3"/>' : '<path d="M45 38Q38 26 55 26H70V35Z" fill="#b44b35" stroke="#493f31"/><path d="M64 27Q73 11 80 24" fill="none" stroke="#49734b" stroke-width="3"/>'}<path d="M45 73 29 96 37 102 52 86M74 73 88 96 80 103 66 87" fill="#ead2a4" stroke="#6c4d32"/><g transform="translate(87 75) scale(.7)">${suitArt(card.suit)}</g><path d="M25 154H94" stroke="#b47b24"/>`;
}
export function cardSvg(card: Card, faceDown = false): string {
  if (faceDown)
    return `<svg viewBox="0 0 120 180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"><rect x="1" y="1" width="118" height="178" rx="7" fill="#f8f0da" stroke="#cabb9e"/><rect x="7" y="7" width="106" height="166" rx="3" fill="#315440"/><path d="M12 12 108 168M12 42 88 168M12 72 68 168M12 102 48 168M12 132 28 168M32 12 108 138M52 12 108 108M72 12 108 78M92 12 108 48M108 12 12 168M88 12 12 138M68 12 12 108M48 12 12 78M28 12 12 48M108 42 32 168M108 72 52 168M108 102 72 168M108 132 92 168" stroke="#d6ad51" opacity=".35"/><path d="M60 49 85 90 60 131 35 90Z" fill="#315440" stroke="#d6ad51"/><g transform="translate(60 90)">${suitArt("coins")}</g></svg>`;
  const label =
    card.rank === 1
      ? "A"
      : card.rank === 8
        ? "F"
        : card.rank === 9
          ? "C"
          : card.rank === 10
            ? "R"
            : String(card.rank);
  const artwork =
    card.rank < 8
      ? layouts[card.rank]!.map(
          ([x, y]) =>
            `<g transform="translate(${x} ${y}) scale(${card.rank === 1 ? 1.9 : 0.9})">${suitArt(card.suit)}</g>`,
        ).join("")
      : court(card);
  const corner = `${lettering(label, 12, 10, 1.6, colors[card.suit])}<g transform="translate(17 34) scale(.28)">${suitArt(card.suit)}</g>`;
  const word =
    card.rank > 7
      ? rankName(card.rank).toUpperCase()
      : suitNames[card.suit].italian.toUpperCase();
  return `<svg viewBox="0 0 120 180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"><rect x="1" y="1" width="118" height="178" rx="7" fill="#fff9e9" stroke="#d2c4a5" stroke-width="1.5"/><rect x="6" y="6" width="108" height="168" rx="3" fill="none" stroke="#cbb891" stroke-width=".6"/>${corner}<g transform="rotate(180 60 90)">${corner}</g>${artwork}${lettering(word, 60 - word.length * 2.6, 160, 0.65, colors[card.suit])}</svg>`;
}
export function cardMarkup(
  card: Card,
  options: {
    interactive?: boolean;
    selected?: boolean;
    disabled?: boolean;
    faceDown?: boolean;
    highlighted?: boolean;
  } = {},
): string {
  const label = options.faceDown ? "Face-down card" : cardLabel(card);
  const classes = `playing-card${options.selected ? " is-selected" : ""}${options.highlighted ? " is-highlighted" : ""}`;
  if (options.interactive)
    return `<button type="button" class="${classes}" data-card-id="${card.id}" aria-label="${label}" aria-pressed="${Boolean(options.selected)}" ${options.disabled ? "disabled" : ""}>${cardSvg(card, options.faceDown)}</button>`;
  return `<span class="${classes}" role="img" aria-label="${label}" ${options.disabled ? 'aria-disabled="true"' : ""}>${cardSvg(card, options.faceDown)}</span>`;
}
