import { createAdminClient, getAllUsers, getPointMap } from "./lib/supabase-admin.mjs";

const PRODUCTS = [
  {
    id: "b0f619f8-193c-40a0-81fc-000000000001",
    nombre: "Torta de Chocolate",
    tamano: "Mediana / 8 porciones",
    precio: 85000,
    dias_vencimiento: 4,
    imagen_url: null,
    activo: true
  },
  {
    id: "b0f619f8-193c-40a0-81fc-000000000002",
    nombre: "Cheesecake de Maracuya",
    tamano: "Mediana / 8 porciones",
    precio: 92000,
    dias_vencimiento: 3,
    imagen_url: null,
    activo: true
  },
  {
    id: "b0f619f8-193c-40a0-81fc-000000000003",
    nombre: "Red Velvet",
    tamano: "Grande / 10 porciones",
    precio: 98000,
    dias_vencimiento: 5,
    imagen_url: null,
    activo: true
  }
];

const UNIT_DEFINITIONS = [
  { id: "f0f619f8-193c-40a0-81fc-000000000001", qr_codigo: "DEMO-LOPEZ-001", productoId: PRODUCTS[0].id, point: "Lopez", status: "disponible", entradaOffset: -1, venceOffset: 1 },
  { id: "f0f619f8-193c-40a0-81fc-000000000002", qr_codigo: "DEMO-LOPEZ-002", productoId: PRODUCTS[0].id, point: "Lopez", status: "vendida", entradaOffset: -2, venceOffset: 2 },
  { id: "f0f619f8-193c-40a0-81fc-000000000003", qr_codigo: "DEMO-LOPEZ-003", productoId: PRODUCTS[1].id, point: "Lopez", status: "perdida", entradaOffset: -3, venceOffset: 0 },
  { id: "f0f619f8-193c-40a0-81fc-000000000004", qr_codigo: "DEMO-LOPEZ-004", productoId: PRODUCTS[2].id, point: "Lopez", status: "disponible", entradaOffset: -4, venceOffset: 2 },
  { id: "f0f619f8-193c-40a0-81fc-000000000005", qr_codigo: "DEMO-VILLA-001", productoId: PRODUCTS[0].id, point: "Villa Colombia", status: "disponible", entradaOffset: -1, venceOffset: 3 },
  { id: "f0f619f8-193c-40a0-81fc-000000000006", qr_codigo: "DEMO-VILLA-002", productoId: PRODUCTS[1].id, point: "Villa Colombia", status: "vendida", entradaOffset: -5, venceOffset: -1 },
  { id: "f0f619f8-193c-40a0-81fc-000000000007", qr_codigo: "DEMO-LIMONAR-001", productoId: PRODUCTS[2].id, point: "Limonar", status: "disponible", entradaOffset: -1, venceOffset: 4 },
  { id: "f0f619f8-193c-40a0-81fc-000000000008", qr_codigo: "DEMO-LIMONAR-002", productoId: PRODUCTS[0].id, point: "Limonar", status: "vencida", entradaOffset: -5, venceOffset: -1 },
  { id: "f0f619f8-193c-40a0-81fc-000000000009", qr_codigo: "DEMO-GUADALES-001", productoId: PRODUCTS[1].id, point: "Guaduales (Principal)", status: "disponible", entradaOffset: -1, venceOffset: 3 },
  { id: "f0f619f8-193c-40a0-81fc-000000000010", qr_codigo: "DEMO-GUADALES-002", productoId: PRODUCTS[2].id, point: "Guaduales (Principal)", status: "disponible", entradaOffset: -2, venceOffset: 4 },
  { id: "f0f619f8-193c-40a0-81fc-000000000011", qr_codigo: "DEMO-GUADALES-003", productoId: PRODUCTS[0].id, point: "Guaduales (Principal)", status: "vendida", entradaOffset: -6, venceOffset: -1 },
  { id: "f0f619f8-193c-40a0-81fc-000000000012", qr_codigo: "DEMO-VILLA-003", productoId: PRODUCTS[1].id, point: "Villa Colombia", status: "disponible", entradaOffset: 0, venceOffset: 2 }
];

function daysFromNow(days) {
  const date = new Date();
  date.setHours(10, 0, 0, 0);
  date.setDate(date.getDate() + days);
  return date.toISOString();
}

function movementDate(days, hour) {
  const date = new Date();
  date.setHours(hour, 0, 0, 0);
  date.setDate(date.getDate() + days);
  return date.toISOString();
}

async function main() {
  const supabase = createAdminClient();
  const pointMap = await getPointMap(supabase);
  const users = await getAllUsers(supabase);

  const adminProfile = await supabase.from("usuarios").select("id, rol").eq("rol", "admin").limit(1).maybeSingle();
  if (adminProfile.error) throw adminProfile.error;

  const adminUserId = adminProfile.data?.id ?? null;
  const adminEmail = users.find((user) => user.id === adminUserId)?.email ?? "admin@pasteleria.com";

  for (const product of PRODUCTS) {
    const { error } = await supabase.from("productos").upsert(product, { onConflict: "id" });
    if (error) throw error;
  }

  const units = UNIT_DEFINITIONS.map((definition) => {
    const point = pointMap.get(definition.point);
    if (!point) throw new Error(`No existe la sede ${definition.point}. Ejecuta npm run normalize:sedes primero.`);

    return {
      id: definition.id,
      producto_id: definition.productoId,
      qr_codigo: definition.qr_codigo,
      punto_actual_id: point.id,
      fecha_entrada: daysFromNow(definition.entradaOffset),
      fecha_vencimiento: daysFromNow(definition.venceOffset),
      estado: definition.status,
      created_by: adminUserId
    };
  });

  const demoUnitIds = units.map((unit) => unit.id);
  const { error: deleteMovementsError } = await supabase.from("movimientos").delete().in("unidad_id", demoUnitIds);
  if (deleteMovementsError) throw deleteMovementsError;

  for (const unit of units) {
    const { error } = await supabase.from("unidades_inventario").upsert(unit, { onConflict: "id" });
    if (error) throw error;
  }

  const lopez = pointMap.get("Lopez");
  const guaduales = pointMap.get("Guaduales (Principal)");
  const villa = pointMap.get("Villa Colombia");
  const limonar = pointMap.get("Limonar");

  if (!lopez || !guaduales || !villa || !limonar) {
    throw new Error("Faltan sedes oficiales para crear los movimientos demo.");
  }

  const movements = [
    { id: "c0f619f8-193c-40a0-81fc-000000000001", unidad_id: units[0].id, tipo: "creacion", punto_destino_id: lopez.id, usuario_id: adminUserId, fecha: movementDate(-1, 8), nota: `Seed demo creado por ${adminEmail}` },
    { id: "c0f619f8-193c-40a0-81fc-000000000002", unidad_id: units[1].id, tipo: "creacion", punto_destino_id: lopez.id, usuario_id: adminUserId, fecha: movementDate(-2, 8), nota: "Ingreso inicial demo" },
    { id: "c0f619f8-193c-40a0-81fc-000000000003", unidad_id: units[1].id, tipo: "venta", punto_origen_id: lopez.id, usuario_id: adminUserId, fecha: movementDate(0, 11), nota: "Venta demo del dia" },
    { id: "c0f619f8-193c-40a0-81fc-000000000004", unidad_id: units[2].id, tipo: "creacion", punto_destino_id: lopez.id, usuario_id: adminUserId, fecha: movementDate(-3, 9), nota: "Ingreso inicial demo" },
    { id: "c0f619f8-193c-40a0-81fc-000000000005", unidad_id: units[2].id, tipo: "perdida", punto_origen_id: lopez.id, usuario_id: adminUserId, fecha: movementDate(-1, 17), nota: "Merma demo" },
    { id: "c0f619f8-193c-40a0-81fc-000000000006", unidad_id: units[3].id, tipo: "creacion", punto_destino_id: guaduales.id, usuario_id: adminUserId, fecha: movementDate(-4, 7), nota: "Produccion central" },
    { id: "c0f619f8-193c-40a0-81fc-000000000007", unidad_id: units[3].id, tipo: "traslado", punto_origen_id: guaduales.id, punto_destino_id: lopez.id, usuario_id: adminUserId, fecha: movementDate(-1, 15), nota: "Traslado demo a Lopez" },
    { id: "c0f619f8-193c-40a0-81fc-000000000008", unidad_id: units[4].id, tipo: "creacion", punto_destino_id: villa.id, usuario_id: adminUserId, fecha: movementDate(-1, 9), nota: "Ingreso inicial demo" },
    { id: "c0f619f8-193c-40a0-81fc-000000000009", unidad_id: units[5].id, tipo: "creacion", punto_destino_id: villa.id, usuario_id: adminUserId, fecha: movementDate(-5, 8), nota: "Ingreso inicial demo" },
    { id: "c0f619f8-193c-40a0-81fc-000000000010", unidad_id: units[5].id, tipo: "venta", punto_origen_id: villa.id, usuario_id: adminUserId, fecha: movementDate(-2, 14), nota: "Venta demo Villa Colombia" },
    { id: "c0f619f8-193c-40a0-81fc-000000000011", unidad_id: units[6].id, tipo: "creacion", punto_destino_id: limonar.id, usuario_id: adminUserId, fecha: movementDate(-1, 8), nota: "Ingreso inicial demo" },
    { id: "c0f619f8-193c-40a0-81fc-000000000012", unidad_id: units[7].id, tipo: "creacion", punto_destino_id: limonar.id, usuario_id: adminUserId, fecha: movementDate(-5, 9), nota: "Ingreso inicial demo" },
    { id: "c0f619f8-193c-40a0-81fc-000000000013", unidad_id: units[7].id, tipo: "vencimiento", punto_origen_id: limonar.id, usuario_id: adminUserId, fecha: movementDate(-1, 18), nota: "Vencimiento demo" },
    { id: "c0f619f8-193c-40a0-81fc-000000000014", unidad_id: units[8].id, tipo: "creacion", punto_destino_id: guaduales.id, usuario_id: adminUserId, fecha: movementDate(-1, 7), nota: "Ingreso inicial demo" },
    { id: "c0f619f8-193c-40a0-81fc-000000000015", unidad_id: units[9].id, tipo: "creacion", punto_destino_id: guaduales.id, usuario_id: adminUserId, fecha: movementDate(-2, 7), nota: "Ingreso inicial demo" },
    { id: "c0f619f8-193c-40a0-81fc-000000000016", unidad_id: units[10].id, tipo: "creacion", punto_destino_id: guaduales.id, usuario_id: adminUserId, fecha: movementDate(-6, 7), nota: "Ingreso inicial demo" },
    { id: "c0f619f8-193c-40a0-81fc-000000000017", unidad_id: units[10].id, tipo: "venta", punto_origen_id: guaduales.id, usuario_id: adminUserId, fecha: movementDate(-4, 12), nota: "Venta demo principal" },
    { id: "c0f619f8-193c-40a0-81fc-000000000018", unidad_id: units[11].id, tipo: "creacion", punto_destino_id: villa.id, usuario_id: adminUserId, fecha: movementDate(0, 8), nota: "Ingreso inicial demo" }
  ];

  for (const movement of movements) {
    const { error } = await supabase.from("movimientos").insert(movement);
    if (error) throw error;
  }

  console.log("Datos demo listos:");
  console.log(`- ${PRODUCTS.length} productos demo`);
  console.log(`- ${units.length} unidades demo`);
  console.log(`- ${movements.length} movimientos demo`);
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
