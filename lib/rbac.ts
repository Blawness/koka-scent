// Lightweight role-based access control. Two roles, a small fixed permission
// set. The single source of truth for "who may do what" — both the DAL gates
// (server enforcement) and the admin UI (hiding controls) read from here.

export type Role = "admin" | "staff";

export type Permission =
  | "products:read"
  | "products:write"
  | "orders:read"
  | "orders:write";

/**
 * admin — full control, including the catalog (pricing, stock, activation).
 * staff — day-to-day fulfilment: sees everything, manages order status, but
 *         cannot create/edit/deactivate products.
 */
const ROLE_PERMISSIONS: Record<Role, readonly Permission[]> = {
  admin: ["products:read", "products:write", "orders:read", "orders:write"],
  staff: ["products:read", "orders:read", "orders:write"],
};

export const ROLE_LABEL: Record<Role, string> = {
  admin: "Admin",
  staff: "Staf",
};

/**
 * Coerce a raw role string (from the session/DB) to a known Role. Unknown or
 * missing values resolve to "admin" — every account created before RBAC
 * existed defaults to admin, so this preserves their access.
 */
export function normalizeRole(role: string | null | undefined): Role {
  return role === "staff" ? "staff" : "admin";
}

/** Does this role hold the given permission? */
export function can(
  role: string | null | undefined,
  permission: Permission,
): boolean {
  return ROLE_PERMISSIONS[normalizeRole(role)].includes(permission);
}
