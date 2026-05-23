"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { addDays } from "date-fns";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

export function UnidadForm({ productos, puntos }: { productos: any[]; puntos: any[] }) {
  const router = useRouter(); const [loading, setLoading] = useState(false); const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);
  async function onSubmit(formData: FormData) {
    setLoading(true); setFeedback(null); const supabase = createClient();
    const productoId = String(formData.get("producto_id")); const puntoId = String(formData.get("punto_id")); const cantidad = Number(formData.get("cantidad"));
    const producto = productos.find((p) => p.id === productoId); const now = new Date();
    for (let i = 0; i < cantidad; i++) {
      const code = `TORTA-${Date.now()}-${i}`;
      const { data: unidad, error: unidadError } = await supabase.from("unidades_inventario").insert({ producto_id: productoId, punto_actual_id: puntoId, qr_codigo: code, fecha_entrada: now.toISOString(), fecha_vencimiento: addDays(now, producto.dias_vencimiento).toISOString(), estado: "disponible" }).select("id").single();
      if (unidadError) { setLoading(false); setFeedback({ type: "error", message: unidadError.message }); return; }
      if (unidad) {
        const { error: movimientoError } = await supabase.from("movimientos").insert({ unidad_id: unidad.id, tipo: "creacion", punto_destino_id: puntoId, nota: "Creación desde producción" });
        if (movimientoError) { setLoading(false); setFeedback({ type: "error", message: movimientoError.message }); return; }
      }
    }
    setLoading(false); setFeedback({ type: "success", message: "Unidades creadas correctamente." }); setTimeout(() => router.refresh(), 500);
  }
  return <Card><CardHeader><CardTitle>Crear unidades físicas</CardTitle></CardHeader><CardContent><form action={onSubmit} className="space-y-4"><div className="space-y-2"><Label>Producto</Label><select name="producto_id" required className="h-10 w-full rounded-xl border bg-background px-3 text-sm">{productos.map((p) => <option key={p.id} value={p.id}>{p.nombre} - {p.tamano}</option>)}</select></div><div className="space-y-2"><Label>Punto inicial</Label><select name="punto_id" required className="h-10 w-full rounded-xl border bg-background px-3 text-sm">{puntos.map((p) => <option key={p.id} value={p.id}>{p.nombre}</option>)}</select></div><div className="space-y-2"><Label>Cantidad a crear</Label><input name="cantidad" type="number" min="1" defaultValue="1" className="h-10 w-full rounded-xl border bg-background px-3 text-sm" /></div>{feedback && <p className={`rounded-xl p-3 text-sm ${feedback.type === "error" ? "bg-red-50 text-red-700" : "bg-emerald-50 text-emerald-700"}`}>{feedback.message}</p>}<Button disabled={loading} className="w-full">{loading ? "Creando..." : "Crear y generar QR"}</Button></form></CardContent></Card>;
}
