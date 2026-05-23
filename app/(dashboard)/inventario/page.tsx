import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TBody, TD, TH, THead, TR } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { UnidadForm } from "@/components/forms/unidad-form";
import { getProfile } from "@/lib/data";
import { canCreateUnits } from "@/lib/permissions";
import { formatDate } from "@/lib/utils";

function statusVariant(status: string) { return status === "disponible" ? "success" : status === "vencida" ? "danger" : status === "vendida" ? "muted" : "warning"; }

export default async function InventarioPage() {
  const profile = await getProfile();
  const supabase = createClient();
  const [{ data: unidades }, { data: productos }, { data: puntos }] = await Promise.all([
    supabase.from("unidades_inventario").select("*, producto:productos(*), punto:puntos(*)").order("created_at", { ascending: false }).limit(100),
    supabase.from("productos").select("*").eq("activo", true).order("nombre"),
    supabase.from("puntos").select("*").order("nombre")
  ]);
  const showCreateForm = canCreateUnits(profile?.rol);
  return <div className="space-y-6"><div><h1 className="text-3xl font-semibold tracking-tight">Inventario individual</h1><p className="text-muted-foreground">Cada torta física se controla como una unidad con QR único.</p></div>
    <div className="grid gap-4 xl:grid-cols-[420px_1fr]">{showCreateForm ? <UnidadForm productos={productos ?? []} puntos={puntos ?? []} /> : <Card><CardHeader><CardTitle>Modo operativo</CardTitle></CardHeader><CardContent className="space-y-3 text-sm text-muted-foreground"><p>Tu perfil puede consultar inventario, escanear QRs y registrar movimientos sobre las unidades de su sede.</p><p>La creación de unidades físicas está reservada para administración y producción.</p></CardContent></Card>}
      <Card><CardHeader><CardTitle>Unidades recientes</CardTitle></CardHeader><CardContent><Table><THead><TR><TH>Código</TH><TH>Producto</TH><TH>Punto</TH><TH>Vence</TH><TH>Estado</TH><TH></TH></TR></THead><TBody>{unidades?.map((u: any) => <TR key={u.id}><TD className="font-mono text-xs">{u.qr_codigo}</TD><TD>{u.producto?.nombre}</TD><TD>{u.punto?.nombre ?? "Sin punto"}</TD><TD>{formatDate(u.fecha_vencimiento)}</TD><TD><Badge variant={statusVariant(u.estado) as any}>{u.estado}</Badge></TD><TD><Button asChild size="sm" variant="outline"><Link href={`/inventario/${u.id}`}>Ver</Link></Button></TD></TR>)}</TBody></Table></CardContent></Card>
    </div>
  </div>;
}
