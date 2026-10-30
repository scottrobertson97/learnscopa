import { cardMarkup } from "../../components/cards/art";
import { lessons, validateAnswer } from "./lessons";
import { blankProgress, parseProgress, STORAGE_KEY } from "./progress";
import { scoreDeal } from "../scopa/scoring";
import { workedDeal } from "../scopa/scenarios";
import { href } from "../urls";
const escape = (text: string): string =>
  text
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");

export function mountTutorial(root: HTMLElement): void {
  const menu = root.querySelector<HTMLElement>("[data-lesson-menu]")!;
  const workspace = root.querySelector<HTMLElement>("[data-lesson-workspace]")!;
  const remember = root.querySelector<HTMLInputElement>(
    "[data-save-progress]",
  )!;
  const storageStatus = root.querySelector<HTMLElement>(
    "[data-storage-status]",
  )!;
  let progress = blankProgress();
  let selected: string[] = [];
  let correct = false;
  let complete = false;
  // All storage operations are optional and guarded for private/blocked storage.
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      progress = parseProgress(stored);
      remember.checked = true;
      complete = progress.completed.length === lessons.length;
    }
  } catch {
    storageStatus.textContent =
      "Progress storage is unavailable. You can still complete every lesson.";
  }
  function save(): void {
    if (!remember.checked) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    } catch {
      storageStatus.textContent =
        "Could not save on this device. Your current lesson still works.";
    }
  }
  function render(focus = false): void {
    const lesson = lessons[progress.lesson]!;
    const step = lesson.steps[progress.step]!;
    const interaction = step.interaction;
    selected = [];
    correct =
      interaction.type === "read" ||
      progress.passed.includes(`${lesson.id}/${step.id}`);
    menu.innerHTML =
      lessons
        .map(
          (l, i) =>
            `<button type="button" data-lesson="${i}" ${i === progress.lesson && !complete ? 'aria-current="step"' : ""}><span class="lesson-index">${progress.completed.includes(l.id) ? "✓" : `0${i + 1}`}</span><span><strong>${escape(l.title)}</strong><small>${escape(l.subtitle)}</small></span></button>`,
        )
        .join("") +
      '<p class="small">Your table. Your pace.<br>Repeat any lesson whenever you like.</p>';
    if (complete) {
      workspace.innerHTML =
        `<div class="completion"><span class="completion-symbol" aria-hidden="true">✳</span><p class="eyebrow">Three lessons. A new tradition.</p><h2>A seat at the table is yours.</h2><p>You’ve met the cards, made your first captures, and counted a winning deal. Find a friend, shuffle a deck, and give it a go.</p><div class="hero-actions"><a class="button" href="${href('/rules')}">Keep the rules handy →</a><a class="text-link" href="${href('/cards')}">Find your first deck ↗</a></div><p class="small" style="margin-top:24px">Finish scoring at the end of each deal. First to 11 wins; tied leaders play another deal.</p></div>`;
      if (focus) {
        const heading = workspace.querySelector("h2")!;
        heading.tabIndex = -1;
        heading.focus({ preventScroll: true });
        workspace.scrollIntoView({ block: "start", behavior: "instant" });
      }
      return;
    }
    let surface = "";
    if (interaction.type === "read")
      surface = `<div class="exercise-cards">${interaction.cards.map((c, i) => `<figure>${cardMarkup(c)}<figcaption>${escape(interaction.captions[i] ?? "")}</figcaption></figure>`).join("")}</div>`;
    else if (interaction.type === "identify")
      surface = `<div class="exercise-cards" role="group" aria-label="Choose a card">${interaction.cards.map((c) => cardMarkup(c, { interactive: true })).join("")}</div>`;
    else if (interaction.type === "capture")
      surface = `<div class="exercise-cards" role="group" aria-label="Table cards: select a capture">${interaction.table.map((c) => cardMarkup(c, { interactive: true })).join("")}</div><div class="played-row">${cardMarkup(interaction.played)}<p><strong>You’re playing a ${interaction.played.rank}.</strong><br><span class="small">${step.id === "no-match" ? "No capture? Leave all cards unselected." : "Select a legal capture above."}</span></p></div>`;
    else {
      if (interaction.cards)
        surface += `<div class="exercise-cards">${interaction.cards.map((c) => cardMarkup(c)).join("")}</div>`;
      if (interaction.scoreboard) {
        const score = scoreDeal(workedDeal);
        surface += `<table class="score-table"><caption class="sr-only">Completed deal: your collection compared with your opponent</caption><thead><tr><th scope="col">Category</th><th scope="col">You</th><th scope="col">Opponent</th></tr></thead><tbody>${score.categories.map((c) => `<tr><th scope="row">${escape(c.name)}</th><td>${c.name === "Settebello" ? (c.values[0] ? "Yes" : "No") : c.values[0]}</td><td>${c.name === "Settebello" ? (c.values[1] ? "Yes" : "No") : c.values[1]}</td></tr>`).join("")}<tr><th scope="row">Sweeps</th><td>2</td><td>1</td></tr></tbody></table>`;
      }
      surface += `<div class="choice-grid" role="group" aria-label="Choose an answer">${interaction.options.map((o) => `<button type="button" class="choice-button" data-choice="${o.id}" aria-pressed="false">${escape(o.label)}</button>`).join("")}</div>`;
    }
    const offset = lessons
      .slice(0, progress.lesson)
      .reduce((n, l) => n + l.steps.length, 0);
    const total = lessons.reduce((n, l) => n + l.steps.length, 0);
    const isLast =
      progress.lesson === lessons.length - 1 &&
      progress.step === lesson.steps.length - 1;
    workspace.innerHTML = `<div class="lesson-topline"><span>Lesson ${progress.lesson + 1} of ${lessons.length}</span><span>Step ${progress.step + 1} of ${lesson.steps.length}</span></div><progress class="lesson-progress" value="${offset + progress.step + 1}" max="${total}" aria-label="Tutorial position"></progress><div class="lesson-intro"><h2 tabindex="-1">${escape(step.title)}</h2><p>${escape(step.explanation)}</p></div><div class="exercise-surface"><p class="eyebrow">${escape(step.prompt)}</p>${surface}</div>${interaction.type !== "read" ? '<div class="check-row"><p>Tap to select. Tap again to change.<br>Then check your answer.</p><button type="button" class="button" data-check>Check answer</button></div>' : ""}<div class="lesson-feedback" role="status" aria-live="polite" hidden data-feedback></div><div class="lesson-controls"><button type="button" class="button button-outline" data-back ${progress.lesson === 0 && progress.step === 0 ? "disabled" : ""}>← Back</button><button type="button" class="button" data-next ${correct ? "" : "disabled"}>${isLast ? "Finish lessons" : progress.step === lesson.steps.length - 1 ? "Next lesson" : "Next"} →</button></div>`;
    if (focus) {
      workspace
        .querySelector<HTMLElement>("h2")!
        .focus({ preventScroll: true });
      workspace.scrollIntoView({ block: "start", behavior: "instant" });
    }
  }
  menu.addEventListener("click", (event) => {
    const button = (event.target as Element).closest<HTMLButtonElement>(
      "[data-lesson]",
    );
    if (!button) return;
    progress.lesson = Number(button.dataset.lesson);
    progress.step = 0;
    complete = false;
    save();
    render(true);
  });
  workspace.addEventListener("click", (event) => {
    const target = (event.target as Element).closest<HTMLButtonElement>(
      "button",
    );
    if (!target) return;
    const lesson = lessons[progress.lesson]!;
    const step = lesson.steps[progress.step]!;
    const key = `${lesson.id}/${step.id}`;
    const option = target.dataset.cardId ?? target.dataset.choice;
    if (option !== undefined) {
      if (step.interaction.type !== "capture")
        selected = selected.includes(option) ? [] : [option];
      else
        selected = selected.includes(option)
          ? selected.filter((id) => id !== option)
          : [...selected, option];
      for (const button of workspace.querySelectorAll<HTMLButtonElement>(
        "[data-card-id], [data-choice]",
      )) {
        const active = selected.includes(
          button.dataset.cardId ?? button.dataset.choice!,
        );
        button.setAttribute("aria-pressed", String(active));
        button.classList.toggle("is-selected", active);
      }
      correct = false;
      workspace.querySelector<HTMLButtonElement>("[data-next]")!.disabled =
        true;
      workspace.querySelector<HTMLElement>("[data-feedback]")!.hidden = true;
    } else if (target.hasAttribute("data-check")) {
      correct = validateAnswer(step, selected);
      const feedback = workspace.querySelector<HTMLElement>("[data-feedback]")!;
      feedback.hidden = false;
      feedback.dataset.tone = correct ? "correct" : "incorrect";
      feedback.textContent = step.feedback[correct ? "correct" : "incorrect"];
      workspace.querySelector<HTMLButtonElement>("[data-next]")!.disabled =
        !correct;
      if (correct && !progress.passed.includes(key)) {
        progress.passed.push(key);
        save();
      }
    } else if (target.hasAttribute("data-next") && correct) {
      if (!progress.passed.includes(key)) progress.passed.push(key);
      if (
        lesson.steps.every((s) =>
          progress.passed.includes(`${lesson.id}/${s.id}`),
        ) &&
        !progress.completed.includes(lesson.id)
      )
        progress.completed.push(lesson.id);
      const finishing =
        progress.lesson === lessons.length - 1 &&
        progress.step === lesson.steps.length - 1;
      if (progress.step < lesson.steps.length - 1) progress.step++;
      else if (progress.lesson < lessons.length - 1) {
        progress.lesson++;
        progress.step = 0;
      } else complete = progress.completed.length === lessons.length;
      if (
        finishing &&
        !complete &&
        progress.completed.length < lessons.length
      ) {
        const firstIncomplete = lessons.findIndex(
          (l) => !progress.completed.includes(l.id),
        );
        if (firstIncomplete >= 0 && firstIncomplete !== progress.lesson) {
          progress.lesson = firstIncomplete;
          progress.step = 0;
        }
      }
      save();
      render(true);
    } else if (target.hasAttribute("data-back")) {
      if (progress.step > 0) progress.step--;
      else if (progress.lesson > 0) {
        progress.lesson--;
        progress.step = lessons[progress.lesson]!.steps.length - 1;
      }
      complete = false;
      save();
      render(true);
    }
  });
  remember.addEventListener("change", () => {
    if (remember.checked) {
      save();
      storageStatus.textContent = "Progress saving is on for this device.";
    } else {
      try {
        localStorage.removeItem(STORAGE_KEY);
        storageStatus.textContent =
          "Saved progress removed. Your current session can continue.";
      } catch {
        storageStatus.textContent = "Storage is blocked on this device.";
      }
    }
  });
  document.querySelector("[data-restart]")?.addEventListener("click", () => {
    progress = blankProgress();
    selected = [];
    complete = false;
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      /* Browser-local storage is optional. */
    }
    save();
    render(true);
  });
  render();
}
