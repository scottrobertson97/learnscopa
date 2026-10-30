import { lessons } from "./lessons";
export const STORAGE_KEY = "learn-scopa-progress-v1";
export interface Progress {
  version: 1;
  lesson: number;
  step: number;
  passed: string[];
  completed: string[];
}
export const blankProgress = (): Progress => ({
  version: 1,
  lesson: 0,
  step: 0,
  passed: [],
  completed: [],
});
export function parseProgress(raw: string | null): Progress {
  try {
    const data: unknown = JSON.parse(raw ?? "null");
    if (!data || typeof data !== "object") return blankProgress();
    const p = data as Record<string, unknown>;
    if (
      p["version"] !== 1 ||
      !Number.isInteger(p["lesson"]) ||
      !Number.isInteger(p["step"]) ||
      !Array.isArray(p["passed"]) ||
      !Array.isArray(p["completed"])
    )
      return blankProgress();
    const lesson = Math.max(
      0,
      Math.min(lessons.length - 1, p["lesson"] as number),
    );
    const step = Math.max(
      0,
      Math.min(lessons[lesson]!.steps.length - 1, p["step"] as number),
    );
    const validSteps = new Set(
      lessons.flatMap((l) => l.steps.map((s) => `${l.id}/${s.id}`)),
    );
    const passed = [
      ...new Set(
        p["passed"].filter(
          (id): id is string => typeof id === "string" && validSteps.has(id),
        ),
      ),
    ];
    const completed = lessons
      .filter((l) => l.steps.every((s) => passed.includes(`${l.id}/${s.id}`)))
      .map((l) => l.id);
    return { version: 1, lesson, step, passed, completed };
  } catch {
    return blankProgress();
  }
}
