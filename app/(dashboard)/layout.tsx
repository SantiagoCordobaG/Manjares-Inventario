import { Sidebar } from "@/components/layout/sidebar";
import { MobileNav } from "@/components/layout/mobile-nav";
import { AccessDenied } from "@/components/ui/access-denied";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { getProfile } from "@/lib/data";
import { formatRoleLabel, roleBadgeVariant } from "@/lib/permissions";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const profile = await getProfile();

  if (!profile) {
    return (
      <div className="min-h-screen bg-grid p-4 sm:p-6">
        <AccessDenied
          title="Perfil pendiente de configuracion"
          message="Tu cuenta de Supabase ya inicio sesion, pero aun no tiene un perfil interno en public.usuarios."
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-grid">
      <div className="flex">
        <Sidebar profile={profile} />
        <main className="w-full pb-24 lg:pb-0">
          <div className="mx-auto max-w-7xl p-4 sm:p-6 lg:p-8">
            <Card className="mb-6 bg-white/85 shadow-none lg:hidden">
              <CardContent className="flex flex-wrap items-center justify-between gap-3 p-4">
                <div>
                  <p className="font-semibold">{profile.nombre}</p>
                  <p className="text-sm text-muted-foreground">{profile.punto?.nombre ?? "Acceso global"}</p>
                </div>
                <Badge variant={roleBadgeVariant(profile.rol)}>{formatRoleLabel(profile.rol)}</Badge>
              </CardContent>
            </Card>
            {children}
          </div>
        </main>
      </div>
      <MobileNav profile={profile} />
    </div>
  );
}
