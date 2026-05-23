import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { navItems } from "@/components/layout/nav-config";
import { formatRoleLabel, roleBadgeVariant } from "@/lib/permissions";
import type { Usuario } from "@/lib/types/database";
import { CakeSlice } from "lucide-react";

export function Sidebar({ profile }: { profile: Usuario }) {
  const items = navItems.filter((item) => item.roles.includes(profile.rol));
  return (
    <aside className="hidden min-h-screen w-64 border-r bg-white/80 p-4 backdrop-blur lg:block">
      <div className="mb-8 flex items-center gap-3 rounded-2xl bg-primary p-3 text-primary-foreground">
        <CakeSlice className="h-5 w-5" />
        <div><p className="font-semibold">Pastelería</p><p className="text-xs opacity-80">Inventario QR</p></div>
      </div>
      <Card className="mb-5 border-dashed bg-slate-50/90 shadow-none">
        <CardContent className="space-y-2 p-4">
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Sesion activa</p>
          <div>
            <p className="font-semibold">{profile.nombre}</p>
            <p className="text-sm text-muted-foreground">{profile.punto?.nombre ?? "Acceso global"}</p>
          </div>
          <Badge variant={roleBadgeVariant(profile.rol)}>{formatRoleLabel(profile.rol)}</Badge>
        </CardContent>
      </Card>
      <nav className="space-y-1">
        {items.map((item) => (
          <Link key={item.href} href={item.href} className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-muted-foreground transition hover:bg-muted hover:text-foreground">
            <item.icon className="h-4 w-4" /> {item.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
