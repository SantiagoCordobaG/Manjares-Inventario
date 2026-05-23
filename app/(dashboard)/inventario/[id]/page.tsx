import { notFound } from "next/navigation";
import Image from "next/image";
import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TBody, TD, TH, THead, TR } from "@/components/ui/table";
import { UnitActions } from "@/components/forms/unit-actions";
import { formatCurrency, formatDate } from "@/lib/utils";

export default async function UnidadPage({ params }: { params: { id: string } }) {
  const supabase = createClient();
  const [{ data: unidad }, { data: puntos }, { data: movimientos }] = await Promise.all([
    supabase.from("unidades_inventario").select("*, producto:productos(*), punto:puntos(*)").eq("id", params.id).single(),
    supabase.from("puntos").select("*").order("nombre"),
    supabase.from("movimientos").select("*, origen:puntos!movimientos_punto_origen_id_fkey(nombre), destino:puntos!movimientos_punto_destino_id_fkey(nombre), usuario:usuarios(nombre)").eq("unidad_id", params.id).order("fecha", { ascending: false })
  ]);
  if (!unidad) notFound();
  return <div className="space-y-6"><div><h1 className="text-3xl font-semibold tracking-tight">{unidad.producto?.nombre}</h1><p className="font-mono text-sm text-muted-foreground">{unidad.qr_codigo}</p></div><div className="grid gap-4 lg:grid-cols-[360px_1fr]"><Card><CardHeader><CardTitle>QR y acciones</CardTitle></CardHeader><CardContent className="space-y-5"><div className="rounded-2xl border bg-white p-4 text-center"><Image src={`/api/qr/${unidad.qr_codigo}`} alt="QR" width={220} height={220} className="mx-auto" /><p className="mt-2 font-mono text-xs">{unidad.qr_codigo}</p></div><UnitActions unidadId={unidad.id} puntoActualId={unidad.punto_actual_id} puntos={puntos ?? []} /></CardContent></Card><div className="space-y-4"><Card><CardHeader><CardTitle>Detalle</CardTitle></CardHeader><CardContent className="grid gap-3 sm:grid-cols-2"><p><span className="text-muted-foreground">Estado:</span> <Badge>{unidad.estado}</Badge></p><p><span className="text-muted-foreground">Punto:</span> {unidad.punto?.nombre ?? "Sin punto"}</p><p><span className="text-muted-foreground">Entrada:</span> {formatDate(unidad.fecha_entrada)}</p><p><span className="text-muted-foreground">Vencimiento:</span> {formatDate(unidad.fecha_vencimiento)}</p><p><span className="text-muted-foreground">Precio:</span> {formatCurrency(Number(unidad.producto?.precio ?? 0))}</p></CardContent></Card><Card><CardHeader><CardTitle>Historial</CardTitle></CardHeader><CardContent><Table><THead><TR><TH>Fecha</TH><TH>Tipo</TH><TH>Origen</TH><TH>Destino</TH><TH>Usuario</TH></TR></THead><TBody>{movimientos?.map((m: any) => <TR key={m.id}><TD>{formatDate(m.fecha)}</TD><TD>{m.tipo}</TD><TD>{m.origen?.nombre ?? "-"}</TD><TD>{m.destino?.nombre ?? "-"}</TD><TD>{m.usuario?.nombre ?? "Sistema"}</TD></TR>)}</TBody></Table></CardContent></Card></div></div></div>;
}
