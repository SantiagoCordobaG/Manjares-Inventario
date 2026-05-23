import { OFFICIAL_POINTS, POINT_RENAMES, createAdminClient, getPointMap } from "./lib/supabase-admin.mjs";

const REFERENCE_TABLES = [
  { table: "usuarios", column: "punto_id" },
  { table: "unidades_inventario", column: "punto_actual_id" },
  { table: "movimientos", column: "punto_origen_id" },
  { table: "movimientos", column: "punto_destino_id" },
  { table: "cierres_caja", column: "punto_id" }
];

async function moveReferences(supabase, fromId, toId) {
  for (const reference of REFERENCE_TABLES) {
    const { error } = await supabase.from(reference.table).update({ [reference.column]: toId }).eq(reference.column, fromId);
    if (error) throw error;
  }
}

async function main() {
  const supabase = createAdminClient();
  let pointMap = await getPointMap(supabase);

  for (const rename of POINT_RENAMES) {
    const oldPoint = pointMap.get(rename.from);
    const newPoint = pointMap.get(rename.to);

    if (oldPoint && !newPoint) {
      const { error } = await supabase.from("puntos").update({ nombre: rename.to, direccion: rename.direccion }).eq("id", oldPoint.id);
      if (error) throw error;
    }

    if (oldPoint && newPoint && oldPoint.id !== newPoint.id) {
      await moveReferences(supabase, oldPoint.id, newPoint.id);
      const { error } = await supabase.from("puntos").delete().eq("id", oldPoint.id);
      if (error) throw error;
    }
  }

  pointMap = await getPointMap(supabase);

  for (const point of OFFICIAL_POINTS) {
    const current = pointMap.get(point.nombre);
    if (current) {
      const { error } = await supabase.from("puntos").update({ direccion: point.direccion }).eq("id", current.id);
      if (error) throw error;
      continue;
    }

    const { error } = await supabase.from("puntos").insert(point);
    if (error) throw error;
  }

  console.log("Sedes normalizadas:");
  for (const point of OFFICIAL_POINTS) {
    console.log(`- ${point.nombre}`);
  }
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
