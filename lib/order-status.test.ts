import { describe, expect, it } from "vitest";
import { canTransition, nextStatuses } from "./order-status";
import type { OrderStatus } from "@/types";

const ALL: OrderStatus[] = [
  "pending",
  "paid",
  "processing",
  "shipped",
  "completed",
  "cancelled",
  "failed",
  "expired",
];
const TERMINAL: OrderStatus[] = ["completed", "cancelled", "failed", "expired"];

describe("canTransition", () => {
  it("allows the happy-path forward steps", () => {
    expect(canTransition("pending", "paid")).toBe(true);
    expect(canTransition("paid", "processing")).toBe(true);
    expect(canTransition("processing", "shipped")).toBe(true);
    expect(canTransition("shipped", "completed")).toBe(true);
  });

  it("forbids skipping forward steps", () => {
    expect(canTransition("pending", "shipped")).toBe(false);
    expect(canTransition("paid", "completed")).toBe(false);
  });

  it("forbids moving backward", () => {
    expect(canTransition("paid", "pending")).toBe(false);
    expect(canTransition("shipped", "processing")).toBe(false);
  });

  it("allows cancelling from any non-terminal state", () => {
    for (const s of ["pending", "paid", "processing", "shipped"] as OrderStatus[]) {
      expect(canTransition(s, "cancelled")).toBe(true);
    }
  });

  it("never leaves a terminal state", () => {
    for (const from of TERMINAL) {
      for (const to of ALL) {
        expect(canTransition(from, to)).toBe(false);
      }
    }
  });

  it("never allows a self-transition", () => {
    for (const s of ALL) {
      expect(canTransition(s, s)).toBe(false);
    }
  });

  it("reserves failed/expired for pending (payment webhook) only", () => {
    expect(canTransition("pending", "failed")).toBe(true);
    expect(canTransition("pending", "expired")).toBe(true);
    expect(canTransition("paid", "failed")).toBe(false);
    expect(canTransition("processing", "expired")).toBe(false);
  });
});

describe("nextStatuses (admin dropdown)", () => {
  it("offers forward step + cancel, never failed/expired", () => {
    expect(nextStatuses("pending")).toEqual(["paid", "cancelled"]);
    expect(nextStatuses("paid")).toEqual(["processing", "cancelled"]);
    expect(nextStatuses("shipped")).toEqual(["completed", "cancelled"]);
  });

  it("offers nothing from a terminal state", () => {
    for (const s of TERMINAL) {
      expect(nextStatuses(s)).toEqual([]);
    }
  });
});
