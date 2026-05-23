export type UserRole = "admin" | "encargado_punto" | "produccion";
export type InventoryStatus = "disponible" | "vendida" | "vencida" | "trasladada" | "perdida";
export type MovementType = "creacion" | "recepcion" | "venta" | "traslado" | "vencimiento" | "perdida" | "correccion";

export type Punto = { id: string; nombre: string; direccion: string | null; created_at: string };
export type Producto = { id: string; nombre: string; tamano: string; precio: number; dias_vencimiento: number; imagen_url: string | null; activo: boolean; created_at: string };
export type Usuario = { id: string; nombre: string; rol: UserRole; punto_id: string | null; created_at: string; punto?: Punto | null };
export type UnidadInventario = {
  id: string;
  producto_id: string;
  qr_codigo: string;
  punto_actual_id: string | null;
  fecha_entrada: string;
  fecha_vencimiento: string;
  estado: InventoryStatus;
  created_by: string | null;
  created_at: string;
  producto?: Producto;
  punto?: Punto;
};
export type Movimiento = {
  id: string;
  unidad_id: string;
  tipo: MovementType;
  punto_origen_id: string | null;
  punto_destino_id: string | null;
  usuario_id: string | null;
  fecha: string;
  nota: string | null;
};
