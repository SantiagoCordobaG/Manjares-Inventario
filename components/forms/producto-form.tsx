"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function ProductoForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);
  async function onSubmit(formData: FormData) {
    setLoading(true);
    setFeedback(null);
    const supabase = createClient();
    const { error } = await supabase.from("productos").insert({
      nombre: String(formData.get("nombre")), tamano: String(formData.get("tamano")), precio: Number(formData.get("precio")), dias_vencimiento: Number(formData.get("dias_vencimiento")), imagen_url: String(formData.get("imagen_url") || "") || null
    });
    setLoading(false);

    if (error) {
      setFeedback({ type: "error", message: error.message });
      return;
    }

    setFeedback({ type: "success", message: "Producto creado correctamente." });
    setTimeout(() => router.refresh(), 500);
  }
  return <Card><CardHeader><CardTitle>Nuevo producto</CardTitle></CardHeader><CardContent><form action={onSubmit} className="space-y-4"><div className="space-y-2"><Label>Nombre</Label><Input name="nombre" required placeholder="Torta de chocolate" /></div><div className="space-y-2"><Label>Tamaño</Label><Input name="tamano" required placeholder="Mediana / 8 porciones" /></div><div className="space-y-2"><Label>Precio</Label><Input name="precio" type="number" min="0" required /></div><div className="space-y-2"><Label>Días de vencimiento</Label><Input name="dias_vencimiento" type="number" min="1" required /></div><div className="space-y-2"><Label>Imagen URL opcional</Label><Input name="imagen_url" /></div>{feedback && <p className={`rounded-xl p-3 text-sm ${feedback.type === "error" ? "bg-red-50 text-red-700" : "bg-emerald-50 text-emerald-700"}`}>{feedback.message}</p>}<Button disabled={loading} className="w-full">{loading ? "Guardando..." : "Crear producto"}</Button></form></CardContent></Card>;
}
