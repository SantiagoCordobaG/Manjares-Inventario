import { createClient } from "@/lib/supabase/server";
import type { Usuario } from "@/lib/types/database";

export async function getProfile() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  const { data } = await supabase.from("usuarios").select("*, punto:puntos(*)").eq("id", user.id).single();
  return (data as Usuario | null) ?? null;
}

export async function getDashboardStats() {
  const supabase = createClient();
  const today = new Date();
  const inTwoDays = new Date(today); inTwoDays.setDate(today.getDate() + 2);
  const [disponibles, vencidas, porVencer, ventasDia] = await Promise.all([
    supabase.from("unidades_inventario").select("id", { count: "exact", head: true }).eq("estado", "disponible"),
    supabase.from("unidades_inventario").select("id", { count: "exact", head: true }).eq("estado", "vencida"),
    supabase.from("unidades_inventario").select("id", { count: "exact", head: true }).eq("estado", "disponible").lte("fecha_vencimiento", inTwoDays.toISOString()),
    supabase.from("movimientos").select("id", { count: "exact", head: true }).eq("tipo", "venta").gte("fecha", today.toISOString().slice(0, 10))
  ]);
  return { disponibles: disponibles.count ?? 0, vencidas: vencidas.count ?? 0, porVencer: porVencer.count ?? 0, ventasDia: ventasDia.count ?? 0 };
}

export async function getSalesSeries(days = 7) {
  const supabase = createClient();
  const start = new Date();
  start.setHours(0, 0, 0, 0);
  start.setDate(start.getDate() - (days - 1));

  const { data } = await supabase
    .from("movimientos")
    .select("fecha")
    .eq("tipo", "venta")
    .gte("fecha", start.toISOString())
    .order("fecha", { ascending: true });

  const formatter = new Intl.DateTimeFormat("es-CO", { weekday: "short" });
  const buckets = Array.from({ length: days }, (_, index) => {
    const date = new Date(start);
    date.setDate(start.getDate() + index);

    return {
      dia: formatter.format(date).replace(".", ""),
      ventas: 0,
      key: date.toISOString().slice(0, 10)
    };
  });

  for (const movement of data ?? []) {
    const key = movement.fecha.slice(0, 10);
    const bucket = buckets.find((item) => item.key === key);
    if (bucket) bucket.ventas += 1;
  }

  return buckets.map(({ dia, ventas }) => ({ dia, ventas }));
}
