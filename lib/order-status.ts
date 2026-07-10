// Pure order-status logic + Indonesian display labels. No database — safe to
// unit-test and to reuse when the functional admin phase lands
// (see docs/superpowers/specs/2026-07-08-admin-dashboard-design.md §3).

import type { OrderStatus, ProductCategory } from "@/types";

/** Statuses nothing can leave. */
const TERMINAL: ReadonlySet<OrderStatus> = new Set<OrderStatus>([
  "completed",
  "cancelled",
  "failed",
  "expired",
]);

/** The single forward step in the happy path. */
const FORWARD: Partial<Record<OrderStatus, OrderStatus>> = {
  pending: "paid",
  paid: "processing",
  processing: "shipped",
  shipped: "completed",
};

/**
 * Whether an order may move `from` → `to`.
 *
 * Happy path: pending → paid → processing → shipped → completed.
 * `cancelled` is reachable from any non-terminal state.
 * `failed`/`expired` are payment-webhook outcomes (from `pending` only) and are
 * never offered in the admin UI — modelled here so the webhook can reuse this
 * later without touching the logic.
 */
export function canTransition(from: OrderStatus, to: OrderStatus): boolean {
  if (TERMINAL.has(from)) return false;
  if (to === from) return false;
  if (to === "cancelled") return true;
  if (to === "failed" || to === "expired") return from === "pending";
  return FORWARD[from] === to;
}

/** Legal transitions an admin may choose — forward step + cancel. */
export function nextStatuses(from: OrderStatus): OrderStatus[] {
  if (TERMINAL.has(from)) return [];
  const options: OrderStatus[] = [];
  const forward = FORWARD[from];
  if (forward) options.push(forward);
  options.push("cancelled");
  return options;
}

export const STATUS_LABEL: Record<OrderStatus, string> = {
  pending: "Menunggu Pembayaran",
  paid: "Dibayar",
  processing: "Diproses",
  shipped: "Dikirim",
  completed: "Selesai",
  cancelled: "Dibatalkan",
  failed: "Gagal",
  expired: "Kedaluwarsa",
};

export const CATEGORY_LABEL: Record<ProductCategory, string> = {
  oil_based_perfume: "Oil Based Perfume",
};
