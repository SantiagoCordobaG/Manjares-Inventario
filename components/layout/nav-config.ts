import type { LucideIcon } from "lucide-react";
import { BarChart3, CakeSlice, LayoutDashboard, Package, QrCode, Repeat2, Users, WalletCards } from "lucide-react";
import type { UserRole } from "@/lib/types/database";

export type NavItem = {
  href: string;
  label: string;
  mobileLabel?: string;
  icon: LucideIcon;
  roles: UserRole[];
  mobile: boolean;
};

export const navItems: NavItem[] = [
  { href: "/dashboard", label: "Dashboard", mobileLabel: "Inicio", icon: LayoutDashboard, roles: ["admin", "encargado_punto", "produccion"], mobile: true },
  { href: "/productos", label: "Productos", mobileLabel: "Productos", icon: CakeSlice, roles: ["admin", "produccion"], mobile: false },
  { href: "/inventario", label: "Inventario", mobileLabel: "Stock", icon: Package, roles: ["admin", "encargado_punto", "produccion"], mobile: true },
  { href: "/escanear", label: "Escanear", mobileLabel: "Scan", icon: QrCode, roles: ["admin", "encargado_punto", "produccion"], mobile: true },
  { href: "/traslados", label: "Traslados", mobileLabel: "Movs", icon: Repeat2, roles: ["admin", "encargado_punto", "produccion"], mobile: false },
  { href: "/reportes", label: "Reportes", mobileLabel: "Datos", icon: BarChart3, roles: ["admin", "encargado_punto", "produccion"], mobile: true },
  { href: "/caja", label: "Caja", mobileLabel: "Caja", icon: WalletCards, roles: ["admin", "encargado_punto", "produccion"], mobile: false },
  { href: "/usuarios", label: "Usuarios", mobileLabel: "Usuarios", icon: Users, roles: ["admin"], mobile: false }
];
