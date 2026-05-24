"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";

export function UnitActions({ unidadId, puntoActualId, puntos }: { unidadId: string; puntoActualId?: string | null; puntos: any[] }) {
  const router = useRouter(); const [destino, setDestino] = useState(""); const [loading, setLoading] = useState(false); const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);
  async function action(tipo: "venta" | "vencimiento" | "perdida") {
    setLoading(true); setFeedback(null); const supabase = createClient();
    const estado = tipo === "venta" ? "vendida" : tipo === "vencimiento" ? "vencida" : "perdida";
    const { error: unidadError } = await supabase.from("unidades_inventario").update({ estado }).eq("id", unidadId);
    if (unidadError) { setLoading(false); setFeedback({ type: "error", message: unidadError.message }); return; }
    const { error: movimientoError } = await supabase.from("movimientos").insert({ unidad_id: unidadId, tipo, punto_origen_id: puntoActualId ?? null });
    if (movimientoError) { setLoading(false); setFeedback({ type: "error", message: movimientoError.message }); return; }
    setLoading(false); setFeedback({ type: "success", message: "Movimiento registrado correctamente." }); setTimeout(() => router.refresh(), 500);
  }
  async function traslado() {
    if (!destino) return; setLoading(true); setFeedback(null); const supabase = createClient();
    const { error } = await supabase.rpc("registrar_traslado_unidad", {
      p_unidad_id: unidadId,
      p_punto_destino_id: destino
    });
    if (error) {
      const message = error.message.includes("registrar_traslado_unidad")
        ? "Falta la funcion SQL de traslados en Supabase. Ejecuta supabase/fix-traslado-rls.sql en el SQL Editor."
        : error.message;
      setLoading(false); setFeedback({ type: "error", message }); return;
    }
    setLoading(false); setFeedback({ type: "success", message: "Traslado registrado correctamente." }); setTimeout(() => router.refresh(), 500);
  }
  return <div className="space-y-3"><div className="grid grid-cols-2 gap-2"><Button disabled={loading} onClick={() => action("venta")}>Vender</Button><Button disabled={loading} variant="outline" onClick={() => action("vencimiento")}>Marcar vencida</Button><Button disabled={loading} variant="destructive" onClick={() => action("perdida")}>Perdida</Button></div><div className="flex gap-2"><select value={destino} onChange={(e) => setDestino(e.target.value)} className="h-10 flex-1 rounded-xl border bg-background px-3 text-sm"><option value="">Destino...</option>{puntos.filter((p) => p.id !== puntoActualId).map((p) => <option key={p.id} value={p.id}>{p.nombre}</option>)}</select><Button variant="secondary" disabled={loading || !destino} onClick={traslado}>Trasladar</Button></div>{feedback && <p className={`rounded-xl p-3 text-sm ${feedback.type === "error" ? "bg-red-50 text-red-700" : "bg-emerald-50 text-emerald-700"}`}>{feedback.message}</p>}</div>;
}
