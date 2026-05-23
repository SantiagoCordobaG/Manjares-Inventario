import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { createClient } from "@supabase/supabase-js";

export const OFFICIAL_POINTS = [
  { nombre: "Guaduales (Principal)", direccion: "Sede principal" },
  { nombre: "Lopez", direccion: "Sucursal Lopez" },
  { nombre: "Villa Colombia", direccion: "Sucursal Villa Colombia" },
  { nombre: "Limonar", direccion: "Sucursal Limonar" }
];

export const POINT_RENAMES = [
  { from: "Producción Central", to: "Guaduales (Principal)", direccion: "Sede principal" },
  { from: "Punto Norte", to: "Lopez", direccion: "Sucursal Lopez" },
  { from: "Punto Centro", to: "Villa Colombia", direccion: "Sucursal Villa Colombia" }
];

export function loadEnvFile(filePath = resolve(process.cwd(), ".env.local")) {
  if (!existsSync(filePath)) return;

  const content = readFileSync(filePath, "utf8");
  for (const rawLine of content.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#")) continue;

    const separatorIndex = line.indexOf("=");
    if (separatorIndex === -1) continue;

    const key = line.slice(0, separatorIndex).trim();
    const value = line.slice(separatorIndex + 1).trim().replace(/^['"]|['"]$/g, "");

    if (!(key in process.env)) {
      process.env[key] = value;
    }
  }
}

export function createAdminClient() {
  loadEnvFile();

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseSecretKey = process.env.SUPABASE_SECRET_KEY ?? process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseSecretKey) {
    throw new Error("Faltan NEXT_PUBLIC_SUPABASE_URL o SUPABASE_SECRET_KEY en .env.local");
  }

  return createClient(supabaseUrl, supabaseSecretKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
      detectSessionInUrl: false
    }
  });
}

export async function getAllUsers(supabase) {
  const users = [];
  let page = 1;

  while (true) {
    const response = await supabase.auth.admin.listUsers({ page, perPage: 1000 });
    if (response.error) throw response.error;

    users.push(...response.data.users);
    if (response.data.users.length < 1000) break;
    page += 1;
  }

  return users;
}

export async function getPointMap(supabase) {
  const { data, error } = await supabase.from("puntos").select("id, nombre, direccion");
  if (error) throw error;

  return new Map((data ?? []).map((point) => [point.nombre, point]));
}

export function getProfileErrorHint(message) {
  if (message.includes("relation")) {
    return " Asegurate de ejecutar primero supabase/schema.sql en el SQL Editor.";
  }

  if (message.toLowerCase().includes("permission denied")) {
    return " Ejecuta supabase/repair-api-grants.sql en el SQL Editor y luego vuelve a correr este comando.";
  }

  return "";
}
