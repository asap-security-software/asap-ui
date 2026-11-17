import { describe, expect, test } from "bun:test";
import { statusDotClass, statusPillClass, statusTones } from "../../src/components/ui/status-tone";

describe("status tones", () => {
  test("lists exactly the five tones in order", () => {
    expect(statusTones).toEqual(["done", "progress", "scheduled", "warning", "danger"]);
  });

  test("pill and dot maps have exactly the tone keys", () => {
    const tones = [...statusTones].sort();
    expect(Object.keys(statusPillClass).sort()).toEqual(tones);
    expect(Object.keys(statusDotClass).sort()).toEqual(tones);
  });

  test("pins the pill classes for each tone", () => {
    expect(statusPillClass).toEqual({
      done: "bg-success-soft text-success-foreground",
      progress: "bg-primary-soft text-primary-ink",
      scheduled: "bg-scheduled-soft text-scheduled-foreground",
      warning: "bg-warning-soft text-warning-foreground",
      danger: "bg-danger-soft text-danger-foreground",
    });
  });

  test("pins the dot classes for each tone", () => {
    expect(statusDotClass).toEqual({
      done: "bg-success",
      progress: "bg-primary",
      scheduled: "bg-scheduled",
      warning: "bg-warning",
      danger: "bg-danger",
    });
  });
});
