import type { UserRole } from "@/lib/types/database";

export const ALL_ROLES: UserRole[] = ["admin", "encargado_punto", "produccion"];
export const PRODUCT_ROLES: UserRole[] = ["admin", "produccion"];
export const UNIT_CREATOR_ROLES: UserRole[] = ["admin", "produccion"];
export const USER_ADMIN_ROLES: UserRole[] = ["admin"];

const routeAccess: Record<string, UserRole[]> = {
  "/dashboard": ALL_ROLES,
  "/productos": PRODUCT_ROLES,
  "/inventario": ALL_ROLES,
  "/escanear": ALL_ROLES,
  "/traslados": ALL_ROLES,
  "/reportes": ALL_ROLES,
  "/caja": ALL_ROLES,
  "/usuarios": USER_ADMIN_ROLES
};

export function canManageProducts(role?: UserRole | null) {
  return !!role && PRODUCT_ROLES.includes(role);
}

export function canCreateUnits(role?: UserRole | null) {
  return !!role && UNIT_CREATOR_ROLES.includes(role);
}

export function canManageUsers(role?: UserRole | null) {
  return role === "admin";
}

export function hasRouteAccess(role: UserRole | null | undefined, href: string) {
  if (!role) return false;
  return (routeAccess[href] ?? []).includes(role);
}

export function formatRoleLabel(role?: UserRole | null) {
  if (role === "admin") return "Administrador";
  if (role === "produccion") return "Produccion";
  if (role === "encargado_punto") return "Encargado de punto";
  return "Sin rol";
}

export function roleBadgeVariant(role?: UserRole | null): "default" | "warning" | "success" | "danger" | "muted" {
  if (role === "admin") return "default";
  if (role === "produccion") return "warning";
  if (role === "encargado_punto") return "success";
  return "muted";
}
