# Inventario Pastelería MVP

Sistema web MVP para gestionar inventario individual de tortas/pastelería con QR, trazabilidad, múltiples puntos de venta, vencimientos, ventas y caja.

## Stack

- Next.js 14 + TypeScript
- TailwindCSS + componentes estilo Shadcn/UI
- Supabase Auth + PostgreSQL
- QR: `qrcode`
- Scanner móvil: `html5-qrcode`
- Gráficas: `recharts`
- Deploy: Vercel

## Funcionalidades incluidas

- Login con Supabase Auth.
- Roles previstos: `admin`, `encargado_punto`, `produccion`.
- Sedes oficiales demo: `Guaduales (Principal)`, `Lopez`, `Villa Colombia`, `Limonar`.
- CRUD base de productos.
- Creación de unidades físicas individuales.
- Código QR único por unidad.
- Detalle de unidad con acciones: vender, trasladar, marcar vencida, perdida.
- Historial de movimientos por unidad.
- Escaneo QR desde navegador móvil.
- Dashboard con KPIs iniciales.
- Reportes base.
- Conciliación de caja base.
- SQL profesional con RLS, índices, enums y tablas mínimas ampliadas.

## Instalación local

```bash
npm install
cp .env.example .env.local
npm run dev
```

Configura `.env.local` con las credenciales de Supabase.

Variables esperadas:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` o `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SECRET_KEY` o `SUPABASE_SERVICE_ROLE_KEY` solo para tareas administrativas server-side
- `NEXT_PUBLIC_APP_URL`

## Scripts útiles

```bash
npm run normalize:sedes
npm run seed:demo
npm run bootstrap:admin -- admin@pasteleria.com TuPasswordSegura123 Admin --role admin
npm run bootstrap:user -- punto.lopez@pasteleria.com LopezDemo123 "Lopez Demo" --role encargado_punto --point Lopez
```

- `normalize:sedes`: renombra o consolida sedes antiguas y garantiza las 4 sedes oficiales.
- `seed:demo`: carga productos, unidades y movimientos demo repetibles.
- `bootstrap:admin`: crea o actualiza un usuario administrador.
- `bootstrap:user`: crea o actualiza un usuario operativo con rol y sede.

## Configuración Supabase

1. Crea un proyecto en Supabase.
2. Ve a SQL Editor.
3. Ejecuta `supabase/schema.sql`.
   Si ya tenías sedes antiguas, ejecuta también `supabase/normalize-sedes.sql`.
   Si el proyecto ya tenía el esquema creado pero el API responde errores de permisos, ejecuta además `supabase/repair-api-grants.sql`.
4. Crea usuarios desde Supabase Auth.
5. Inserta el perfil correspondiente en `public.usuarios` usando el mismo `id` del usuario Auth.

También puedes preparar la demo completa localmente con:

```bash
npm run normalize:sedes
npm run seed:demo
npm run bootstrap:admin -- admin@pasteleria.com TuPasswordSegura123 Admin --role admin
npm run bootstrap:user -- punto.lopez@pasteleria.com LopezDemo123 "Lopez Demo" --role encargado_punto --point Lopez
```

Esto deja listas las sedes, los datos demo, la cuenta admin y una cuenta de sucursal en `Lopez`.

Ejemplo:

```sql
insert into public.usuarios (id, nombre, rol, punto_id)
values ('UUID_AUTH_USER', 'Admin', 'admin', null);
```

## Deploy en Vercel

1. Sube el proyecto al repo `https://github.com/SantiagoCordobaG/Manjares-Inventario`.
2. Importa el repositorio en Vercel.
3. Agrega variables de entorno:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
   - `NEXT_PUBLIC_APP_URL`
4. Configura `NEXT_PUBLIC_APP_URL` con la URL pública de Vercel.
5. Deploy.

### Nota importante de seguridad

- No publiques `SUPABASE_SECRET_KEY` en Vercel salvo que agregues rutas server-side que realmente la necesiten.
- Para la app pública y móvil solo se requiere la publishable key.

### Prueba móvil

- El lector QR usa cámara del navegador.
- En celular funciona mejor sobre HTTPS, por eso conviene probarlo desde Vercel.
- Los QRs generados apuntan a `NEXT_PUBLIC_APP_URL`, así que recuerda actualizar esa variable antes de imprimir o compartir códigos.

## Notas de arquitectura

- `app/`: rutas Next.js App Router.
- `components/`: UI, layout, formularios y dashboard.
- `lib/supabase`: clientes Supabase server/browser.
- `lib/permissions.ts`: helpers de visibilidad y acceso por rol.
- `lib/types`: tipos compartidos.
- `supabase/schema.sql`: estructura de base de datos, RLS e índices.
- `supabase/normalize-sedes.sql`: normalización de sedes antiguas a las sedes oficiales.
- `scripts/seed-demo.mjs`: carga datos demo repetibles.
- `avances.md`: bitácora obligatoria para retomar desarrollo.

## Próximas mejoras sugeridas

- Server Actions tipadas para mutaciones críticas.
- Filtros avanzados por punto, producto, fecha y estado.
- Impresión masiva de etiquetas QR.
- Reportes con rangos de fecha y exportación CSV.
- Pruebas automatizadas.
