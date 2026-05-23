import { createClient } from "@/lib/supabase/server";
import { AccessDenied } from "@/components/ui/access-denied";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TBody, TD, TH, THead, TR } from "@/components/ui/table";
import { ProductoForm } from "@/components/forms/producto-form";
import { getProfile } from "@/lib/data";
import { canManageProducts } from "@/lib/permissions";
import { formatCurrency } from "@/lib/utils";

export default async function ProductosPage() {
  const profile = await getProfile();
  if (!canManageProducts(profile?.rol)) {
    return <AccessDenied title="Catalogo restringido" message="Solo administracion y produccion pueden gestionar productos base." />;
  }
  const supabase = createClient();
  const { data: productos } = await supabase.from("productos").select("*").order("created_at", { ascending: false });
  return <div className="space-y-6"><div><h1 className="text-3xl font-semibold tracking-tight">Productos</h1><p className="text-muted-foreground">Crea tortas base con precio y días de vencimiento.</p></div>
    <div className="grid gap-4 lg:grid-cols-[420px_1fr]"><ProductoForm />
    <Card><CardHeader><CardTitle>Catálogo</CardTitle></CardHeader><CardContent><Table><THead><TR><TH>Nombre</TH><TH>Tamaño</TH><TH>Precio</TH><TH>Vence</TH></TR></THead><TBody>{productos?.map((p) => <TR key={p.id}><TD className="font-medium">{p.nombre}</TD><TD>{p.tamano}</TD><TD>{formatCurrency(Number(p.precio))}</TD><TD>{p.dias_vencimiento} días</TD></TR>)}</TBody></Table></CardContent></Card></div>
  </div>;
}
