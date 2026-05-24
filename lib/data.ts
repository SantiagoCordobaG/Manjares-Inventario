import { createClient } from "@/lib/supabase/server";
import type { Usuario } from "@/lib/types/database";

export type PointSalesSummary = {
  puntoId: string | null;
  punto: string;
  ventasHoy: number;
  ventasPeriodo: number;
  ingresos: number;
};

export type AdminSalesOverview = {
  puntos: PointSalesSummary[];
  total: {
    ventasHoy: number;
    ventasPeriodo: number;
    ingresos: number;
    puntosActivos: number;
  };
};

export type AdminMovementSummary = {
  id: string;
  fecha: string;
  tipo: string;
  unidadCodigo: string | null;
  origen: string | null;
  destino: string | null;
  usuario: string | null;
};

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

export async function getAdminSalesOverview(days = 7): Promise<AdminSalesOverview> {
  const supabase = createClient();
  const start = new Date();
  start.setHours(0, 0, 0, 0);
  start.setDate(start.getDate() - (days - 1));
  const todayKey = new Date().toISOString().slice(0, 10);

  const [{ data: puntos }, { data: movimientos }] = await Promise.all([
    supabase.from("puntos").select("id, nombre").order("nombre"),
    supabase
      .from("movimientos")
      .select("fecha, punto_origen_id, origen:puntos!movimientos_punto_origen_id_fkey(id, nombre), unidad:unidades_inventario(producto:productos(precio))")
      .eq("tipo", "venta")
      .gte("fecha", start.toISOString())
      .order("fecha", { ascending: false })
  ]);

  const summaryMap = new Map<string, PointSalesSummary>();

  for (const punto of puntos ?? []) {
    summaryMap.set(punto.id, {
      puntoId: punto.id,
      punto: punto.nombre,
      ventasHoy: 0,
      ventasPeriodo: 0,
      ingresos: 0
    });
  }

  for (const movimiento of movimientos ?? []) {
    const origin = Array.isArray(movimiento.origen) ? movimiento.origen[0] : movimiento.origen;
    const unit = Array.isArray(movimiento.unidad) ? movimiento.unidad[0] : movimiento.unidad;
    const product = Array.isArray(unit?.producto) ? unit.producto[0] : unit?.producto;
    const pointId = movimiento.punto_origen_id ?? "__sin_punto__";
    const existing = summaryMap.get(pointId) ?? {
      puntoId: movimiento.punto_origen_id ?? null,
      punto: origin?.nombre ?? "Sin punto",
      ventasHoy: 0,
      ventasPeriodo: 0,
      ingresos: 0
    };

    existing.ventasPeriodo += 1;
    if (movimiento.fecha.slice(0, 10) === todayKey) {
      existing.ventasHoy += 1;
    }

    existing.ingresos += Number(product?.precio ?? 0);
    summaryMap.set(pointId, existing);
  }

  const orderedPoints = Array.from(summaryMap.values()).sort((a, b) => b.ventasPeriodo - a.ventasPeriodo || a.punto.localeCompare(b.punto));
  const total = orderedPoints.reduce(
    (acc, item) => {
      acc.ventasHoy += item.ventasHoy;
      acc.ventasPeriodo += item.ventasPeriodo;
      acc.ingresos += item.ingresos;
      if (item.ventasPeriodo > 0) acc.puntosActivos += 1;
      return acc;
    },
    { ventasHoy: 0, ventasPeriodo: 0, ingresos: 0, puntosActivos: 0 }
  );

  return { puntos: orderedPoints, total };
}

export async function getRecentAdminMovements(limit = 8): Promise<AdminMovementSummary[]> {
  const supabase = createClient();
  const { data } = await supabase
    .from("movimientos")
    .select("id, tipo, fecha, unidad:unidades_inventario(qr_codigo), origen:puntos!movimientos_punto_origen_id_fkey(nombre), destino:puntos!movimientos_punto_destino_id_fkey(nombre), usuario:usuarios(nombre)")
    .in("tipo", ["traslado", "venta", "vencimiento", "perdida"])
    .order("fecha", { ascending: false })
    .limit(limit);

  return (data ?? []).map((movement: any) => ({
    id: movement.id,
    fecha: movement.fecha,
    tipo: movement.tipo,
    unidadCodigo: movement.unidad?.qr_codigo ?? null,
    origen: movement.origen?.nombre ?? null,
    destino: movement.destino?.nombre ?? null,
    usuario: movement.usuario?.nombre ?? null
  }));
}
