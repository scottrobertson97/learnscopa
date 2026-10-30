import { expect, it } from "vitest";
import { lessons, validateAnswer } from "../../src/lib/tutorial/lessons";
import { blankProgress, parseProgress } from "../../src/lib/tutorial/progress";
import { legalCaptures } from "../../src/lib/scopa/captures";
it("every lesson scenario has a valid answer and unique stable IDs", () => {
  const keys = lessons.flatMap((l) => l.steps.map((s) => `${l.id}/${s.id}`));
  expect(new Set(keys).size).toBe(keys.length);
  for (const lesson of lessons)
    for (const step of lesson.steps) {
      const i = step.interaction;
      const answer =
        i.type === "read"
          ? []
          : i.type === "capture"
            ? (legalCaptures(i.played, i.table)[0] ?? []).map((c) => c.id)
            : [i.correctId];
      expect(validateAnswer(step, answer), `${lesson.id}/${step.id}`).toBe(
        true,
      );
    }
});
it("handles invalid progress, clamps indices, removes unknown steps, and verifies completion", () => {
  for (const raw of [null, "broken", "{}", "null", "[]"])
    expect(parseProgress(raw)).toEqual(blankProgress());
  const data = parseProgress(
    JSON.stringify({
      version: 1,
      lesson: 999,
      step: -4,
      passed: ["invented", "cards/four-suits"],
      completed: ["cards", "captures", "scoring"],
    }),
  );
  expect(data.lesson).toBe(2);
  expect(data.step).toBe(0);
  expect(data.passed).toEqual(["cards/four-suits"]);
  expect(data.completed).toEqual([]);
});
