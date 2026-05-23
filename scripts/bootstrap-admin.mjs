import { createAdminClient, getAllUsers, getPointMap, getProfileErrorHint } from "./lib/supabase-admin.mjs";

const validRoles = ["admin", "encargado_punto", "produccion"];
const args = process.argv.slice(2);
const [email, password, name = "Admin"] = args;

if (!email || !password) {
  console.error("Uso: npm run bootstrap:user -- <email> <password> [nombre] [--role admin|encargado_punto|produccion] [--point \"Lopez\"]");
  process.exit(1);
}

function readFlag(flagName) {
  const index = args.indexOf(flagName);
  return index >= 0 ? args[index + 1] : undefined;
}

const role = readFlag("--role") ?? "admin";
const pointName = readFlag("--point") ?? null;

if (!validRoles.includes(role)) {
  console.error(`Rol inválido: ${role}`);
  process.exit(1);
}

const supabase = createAdminClient();

async function getOrCreateUser() {
  const created = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true
  });

  if (!created.error && created.data.user) {
    return created.data.user;
  }

  const users = await getAllUsers(supabase);
  const existingUser = users.find((user) => user.email?.toLowerCase() === email.toLowerCase());
  if (!existingUser) {
    throw created.error ?? new Error("No se pudo crear el usuario en Supabase Auth");
  }

  const updated = await supabase.auth.admin.updateUserById(existingUser.id, {
    password,
    email_confirm: true
  });
  if (updated.error) throw updated.error;

  return updated.data.user;
}

async function resolvePointId() {
  if (!pointName) return null;

  const pointMap = await getPointMap(supabase);
  const point = pointMap.get(pointName);
  if (!point) {
    throw new Error(`No existe la sede ${pointName}. Ejecuta npm run normalize:sedes primero.`);
  }

  return point.id;
}

async function main() {
  const user = await getOrCreateUser();
  const pointId = await resolvePointId();

  const profile = await supabase
    .from("usuarios")
    .upsert(
      {
        id: user.id,
        nombre: name,
        rol: role,
        punto_id: pointId
      },
      { onConflict: "id" }
    )
    .select("id")
    .single();

  if (profile.error) {
    throw new Error(`No se pudo crear el perfil en public.usuarios.${getProfileErrorHint(profile.error.message)}`);
  }

  console.log(`Usuario listo: ${email}`);
  console.log(`Rol: ${role}`);
  console.log(`Punto: ${pointName ?? "Global"}`);
  console.log(`Auth user id: ${user.id}`);
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
