import { describe, expect, it } from "vitest";
import {
  jakartaDayStart,
  jakartaOrderPrefix,
  jakartaWeekStart,
} from "./date-window";

// Jakarta is UTC+7. All reference instants below are expressed in UTC.

describe("jakartaOrderPrefix", () => {
  it("uses the Jakarta calendar day, not UTC", () => {
    // 2026-07-08 23:30 WIB (still Wednesday) — UTC is already Thursday-ish.
    expect(jakartaOrderPrefix(new Date("2026-07-08T16:30:00Z"))).toBe(
      "KS-20260708-",
    );
    // 2026-07-09 00:30 WIB (Thursday) — one hour later, next Jakarta day.
    expect(jakartaOrderPrefix(new Date("2026-07-08T17:30:00Z"))).toBe(
      "KS-20260709-",
    );
  });

  it("does not roll to the next day at 06:00 WIB (the original bug)", () => {
    // 06:00 WIB Wednesday = 2026-07-07T23:00:00Z. Must still be the 8th? No —
    // 2026-07-08 06:00 WIB = 2026-07-07T23:00:00Z, and must number as the 8th.
    expect(jakartaOrderPrefix(new Date("2026-07-07T23:00:00Z"))).toBe(
      "KS-20260708-",
    );
  });
});

describe("jakartaDayStart", () => {
  it("returns the UTC instant of Jakarta midnight", () => {
    // Any time on 2026-07-09 WIB → 2026-07-09T00:00 WIB = 2026-07-08T17:00:00Z.
    const start = jakartaDayStart(new Date("2026-07-09T05:00:00Z")); // 12:00 WIB
    expect(start.toISOString()).toBe("2026-07-08T17:00:00.000Z");
  });
});

describe("jakartaWeekStart", () => {
  it("returns Monday 00:00 Jakarta for a mid-week instant", () => {
    // 2026-07-09 is a Thursday; Monday is 2026-07-06 00:00 WIB =
    // 2026-07-05T17:00:00Z.
    const start = jakartaWeekStart(new Date("2026-07-09T05:00:00Z"));
    expect(start.toISOString()).toBe("2026-07-05T17:00:00.000Z");
  });

  it("treats Monday itself as the start of its week", () => {
    // 2026-07-06 08:00 WIB = 2026-07-06T01:00:00Z (Monday).
    const start = jakartaWeekStart(new Date("2026-07-06T01:00:00Z"));
    expect(start.toISOString()).toBe("2026-07-05T17:00:00.000Z");
  });
});
