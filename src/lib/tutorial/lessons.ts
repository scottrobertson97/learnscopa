import { card } from "../scopa/deck";
import { isLegalCapture } from "../scopa/captures";
import { scoreDeal } from "../scopa/scoring";
import { workedDeal } from "../scopa/scenarios";
import { SUITS, type Card } from "../scopa/types";

export type Interaction =
  | { type: "read"; cards: Card[]; captions: string[] }
  | { type: "identify"; cards: Card[]; correctId: string }
  | { type: "capture"; table: Card[]; played: Card }
  | {
      type: "choice";
      options: { id: string; label: string }[];
      correctId: string;
      cards?: Card[];
      scoreboard?: boolean;
    };
export interface LessonStep {
  id: string;
  title: string;
  explanation: string;
  prompt: string;
  interaction: Interaction;
  feedback: { correct: string; incorrect: string };
  completionAction: "next";
}
export interface Lesson {
  id: string;
  title: string;
  subtitle: string;
  steps: LessonStep[];
}
const explain = (
  id: string,
  title: string,
  explanation: string,
  cards: Card[],
  captions: string[],
): LessonStep => ({
  id,
  title,
  explanation,
  prompt: "Take a closer look",
  interaction: { type: "read", cards, captions },
  feedback: { correct: "", incorrect: "" },
  completionAction: "next",
});
const identify = (
  id: string,
  title: string,
  explanation: string,
  prompt: string,
  cards: Card[],
  correctId: string,
  correct: string,
  incorrect: string,
): LessonStep => ({
  id,
  title,
  explanation,
  prompt,
  interaction: { type: "identify", cards, correctId },
  feedback: { correct, incorrect },
  completionAction: "next",
});
const capture = (
  id: string,
  title: string,
  explanation: string,
  table: Card[],
  played: Card,
  correct: string,
  incorrect: string,
): LessonStep => ({
  id,
  title,
  explanation,
  prompt: "Select the table cards to capture",
  interaction: { type: "capture", table, played },
  feedback: { correct, incorrect },
  completionAction: "next",
});
const choice = (
  id: string,
  title: string,
  explanation: string,
  prompt: string,
  options: string[],
  correctIndex: number,
  correct: string,
  incorrect: string,
  extra: { cards?: Card[]; scoreboard?: boolean } = {},
): LessonStep => ({
  id,
  title,
  explanation,
  prompt,
  interaction: {
    type: "choice",
    options: options.map((label, i) => ({ id: String(i), label })),
    correctId: String(correctIndex),
    ...extra,
  },
  feedback: { correct, incorrect },
  completionAction: "next",
});
const workedScore = scoreDeal(workedDeal);
export const lessons: Lesson[] = [
  {
    id: "cards",
    title: "Meet the cards",
    subtitle: "The deck & its characters",
    steps: [
      explain(
        "four-suits",
        "Four families. Forty cards.",
        "An Italian Scopa deck has four suits: coins (denari), cups (coppe), swords (spade), and clubs (bastoni). Each suit has ten cards. There are no jokers or trump suits.",
        SUITS.map((s) => card(s, 1)),
        ["Coins · Denari", "Cups · Coppe", "Swords · Spade", "Clubs · Bastoni"],
      ),
      explain(
        "numbers",
        "The number is the value.",
        "Ace counts as 1. Number cards 2 through 7 count exactly as printed. Suit does not change a card’s capturing value: a 3 of cups can take a 3 of coins.",
        [card("coins", 1), card("cups", 3), card("clubs", 7)],
        ["Ace = 1", "Three = 3", "Seven = 7"],
      ),
      explain(
        "court",
        "Meet the royal company.",
        "After seven come three court cards. The Fante (foot soldier) is worth 8, the Cavallo (rider) is worth 9, and the Re (king) is worth 10. Our cards mark them F, C, and R.",
        [card("clubs", 8), card("swords", 9), card("coins", 10)],
        ["Fante = 8", "Cavallo = 9", "Re = 10"],
      ),
      identify(
        "find-coins",
        "A coin for your thoughts.",
        "Look for the round golden coins. A card’s suit matters later when we count points.",
        "Select the four of coins",
        SUITS.map((s) => card(s, 4)),
        "coins-4",
        "That’s denari! Four coins, capturing value 4. You can recognize the suit by its round golden shapes.",
        "Look for the four round golden coins. Cups have handles, swords have blades, and clubs look like leafy batons.",
      ),
      identify(
        "find-rider",
        "Who rides into the game?",
        "The Cavallo is the rider. On our deck, the letter C and a horse help you recognize its value of 9.",
        "Select the Cavallo",
        [card("cups", 8), card("swords", 9), card("clubs", 10)],
        "swords-9",
        "Cavallo means horse. This rider has a capturing value of 9, even though there is no printed numeral 9.",
        "Find the figure on a horse with a C in the corner. Fante = 8, Cavallo = 9, Re = 10.",
      ),
      identify(
        "find-seven",
        "Remember this little beauty.",
        "The seven of coins has a special name: settebello. It will be worth a whole scoring point. First, let’s find it.",
        "Select the settebello",
        [card("coins", 6), card("cups", 7), card("coins", 7), card("clubs", 7)],
        "coins-7",
        "Eccolo! Seven golden coins: the settebello. You’ve met the deck. Let’s put it to work.",
        "It must be both a seven and the coins suit. Look for seven round golden pips.",
      ),
    ],
  },
  {
    id: "captures",
    title: "Capturing cards",
    subtitle: "Match, add & sweep",
    steps: [
      capture(
        "single",
        "A five takes a five.",
        "On your turn, play one card from your three-card hand. If a table card has the same value, you must capture one matching card. Take it together with the card you played.",
        [card("cups", 5), card("clubs", 2), card("swords", 7)],
        card("coins", 5),
        "Exactly. Your five captures the table’s five. Both cards go into your capture pile; the 2 and 7 stay.",
        "Your five matches the five of cups. Suits do not have to match.",
      ),
      capture(
        "sum",
        "A little arithmetic.",
        "When no single card matches, you must take a combination that adds up to your card’s value, if one is available.",
        [card("cups", 4), card("clubs", 3), card("swords", 2)],
        card("coins", 7),
        "Four plus three makes seven. Take those two and your played seven. The two stays on the table.",
        "Select the 4 and the 3 together: 4 + 3 = 7. Tap a selected card again to deselect it.",
      ),
      capture(
        "precedence",
        "A match comes before math.",
        "Here’s the rule that trips people up: when a single matching card exists, you must take it. Even if a sum would collect more cards.",
        [card("cups", 5), card("clubs", 3), card("swords", 2)],
        card("coins", 5),
        "Perfetto. The single 5 takes precedence over 3 + 2. More cards is not always a legal choice.",
        "Take only the 5. Although 3 + 2 equals 5, an exact single match always has priority.",
      ),
      capture(
        "two-matches",
        "Two matches. One choice.",
        "If more than one table card matches, choose just one. You cannot take both, and you do not have to favor any suit.",
        [card("cups", 6), card("clubs", 6), card("swords", 4)],
        card("coins", 6),
        "Yes! Either six is a legal choice. You take exactly one matching card, not both.",
        "Select just one of the sixes. Taking both would total 12, and the rules allow only one single match.",
      ),
      capture(
        "many-sums",
        "More than one way to seven.",
        "Without a matching single card, you may choose any legal sum. Try 3 + 4, or 1 + 2 + 4. You decide which group to collect.",
        [
          card("cups", 1),
          card("clubs", 2),
          card("swords", 3),
          card("coins", 4),
        ],
        card("coins", 7),
        "A legal seven! When several combinations work, the choice is yours. Each selected table card is taken only once.",
        "Choose a group adding to 7: either 3 + 4 or 1 + 2 + 4. There is no single 7, so either sum is allowed.",
      ),
      choice(
        "mandatory",
        "An offer you must take.",
        "If your played card can capture, you must capture. You may choose a different card from your hand, but you cannot play a matching card and deliberately leave it behind.",
        "Your five matches a table five. What happens?",
        ["Capture the table five", "Leave my five on the table"],
        0,
        "Right. A possible capture is mandatory for the card you choose to play.",
        "Once you play that five, capturing is mandatory. You cannot decline a legal capture.",
      ),
      capture(
        "no-match",
        "Sometimes a card stays.",
        "If no match or sum is possible, your played card stays face up on the table. There is nothing to select here: check your answer with no cards selected.",
        [card("cups", 6), card("clubs", 7)],
        card("coins", 4),
        "Correct. A four cannot take a six or seven. Your four joins them on the table for a future turn.",
        "No capture is possible. Deselect every card, then check: neither 6 nor 7 can add up to 4.",
      ),
      capture(
        "sweep",
        "Scopa! A clean table.",
        "A capture that empties the table earns a scopa, or sweep: one extra point. This is a normal turn, with more cards still to be played.",
        [card("cups", 4), card("clubs", 3)],
        card("coins", 7),
        "Scopa! Four plus three makes seven, and there are no cards left on the table. That’s one sweep point.",
        "Select the 4 and the 3. Together they equal 7 and clear the entire table.",
      ),
      choice(
        "final-play",
        "One small sweep exception.",
        "The very last play of the entire deal cannot earn a scopa. This is different from the last card in an earlier three-card hand. Leftover cards also go to the last capturer without a sweep point.",
        "The final play of the deal clears the table. Sweep point?",
        ["Yes, one point", "No sweep point"],
        1,
        "Exactly. You still take the cards, but the final play of the deal earns no sweep point.",
        "There is no sweep point on the last play of the entire deal. Earlier hands can still score sweeps.",
      ),
    ],
  },
  {
    id: "scoring",
    title: "Winning & scoring",
    subtitle: "Make every card count",
    steps: [
      choice(
        "most-cards",
        "The bigger collection.",
        "At the end of a deal, the player with the most captured cards earns 1 point. A 20–20 tie earns neither player that point.",
        "You have 23 cards. Your opponent has 17. Who gets the point?",
        ["You", "Your opponent", "Neither player"],
        0,
        "One point to you: 23 is more than 17. Count the cards you played into captures, too.",
        "The player with the larger pile gets one point. Your pile has 23 cards; theirs has 17.",
      ),
      choice(
        "most-coins",
        "Keep an eye on the coins.",
        "Count the coins in each capture pile separately. Most coins earns 1 point. Five coins each is a tie, so neither player earns this point.",
        "You have 6 coins. Your opponent has 4. Your coins point?",
        ["0 points", "1 point", "6 points"],
        1,
        "One point. Six is the number of coins, not the number of scoring points.",
        "The most-coins category is worth one point total, no matter how many coins win it.",
      ),
      identify(
        "settebello",
        "One card. One whole point.",
        "Whoever captured the seven of coins scores 1 point for the settebello. It can help toward most coins and primiera at the same time.",
        "Select the card worth the settebello point",
        [card("cups", 7), card("coins", 10), card("coins", 7)],
        "coins-7",
        "That’s the settebello. This one card earns its own point, in addition to helping other categories.",
        "Only the seven of coins earns the settebello point. Other sevens help primiera, but do not score this point.",
      ),
      identify(
        "primiera-card",
        "Sevens outrank kings here.",
        "Primiera uses a different scale: 7 = 21, 6 = 18, Ace = 16, 5 = 15, 4 = 14, 3 = 13, 2 = 12, and court cards = 10. Pick your best card in each suit.",
        "Which coin is best for primiera?",
        [
          card("coins", 1),
          card("coins", 6),
          card("coins", 7),
          card("coins", 10),
        ],
        "coins-7",
        "The seven contributes 21 primiera value. The king is worth 10 here, even though its capturing value is 10 too.",
        "For primiera, the seven is highest at 21. Six is 18, Ace is 16, and the king is only 10.",
      ),
      choice(
        "four-suits",
        "You need the whole family.",
        "Add the best primiera card from each of the four suits. The higher qualified total earns 1 point. Equal totals earn neither player the point.",
        "Your pile has coins, cups, and swords—but no clubs. Do you qualify?",
        ["Yes, add three suits", "No, all four suits are required"],
        1,
        "Right. You need at least one card from every suit. A missing suit means no qualifying primiera.",
        "All four suits are required, even if your best three cards are sevens.",
      ),
      choice(
        "sweeps",
        "Count your clean tables.",
        "Each valid scopa adds 1 point. Sweep points are separate from the four collection categories, and both players can earn them.",
        "You made two valid sweeps. How many sweep points?",
        ["1 point", "2 points", "4 points"],
        1,
        "Two sweeps, two points. Remember: no sweep for the final play or for collecting leftovers.",
        "Each valid sweep is one point. Two sweeps earn two points.",
      ),
      choice(
        "final-score",
        "Put it all together.",
        "Here is a complete 40-card deal. You win all four collection categories and made two sweeps. Your opponent made one sweep. Games usually continue across deals until someone reaches 11.",
        "How many points did you earn in this deal?",
        ["4 points", "5 points", `${workedScore.totals[0]} points`, "7 points"],
        2,
        `Bravissimo! Four category points plus two sweeps makes ${workedScore.totals[0]}. Your opponent earns ${workedScore.totals[1]} for their sweep. You’re ready for a real deck.`,
        "Add one each for most cards, most coins, settebello, and primiera, then add your two sweeps: 1 + 1 + 1 + 1 + 2 = 6.",
        { scoreboard: true },
      ),
    ],
  },
];
export function validateAnswer(
  step: LessonStep,
  selected: readonly string[],
): boolean {
  const interaction = step.interaction;
  switch (interaction.type) {
    case "read":
      return true;
    case "identify":
    case "choice":
      return selected.length === 1 && selected[0] === interaction.correctId;
    case "capture":
      return isLegalCapture(interaction.played, interaction.table, selected);
  }
}
