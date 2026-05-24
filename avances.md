# Avances del proyecto

## 2026-05-23

### Qué se hizo
- Se creó el setup base del proyecto Next.js 14 con TypeScript y TailwindCSS.
- Se implementó una UI minimalista tipo dashboard SaaS, responsive y optimizada para celular.
- Se configuraron componentes reutilizables: Button, Card, Input, Label, Badge y Table.
- Se creó layout principal con sidebar de escritorio y navegación inferior móvil.
- Se implementó pantalla de login con Supabase Auth.
- Se creó arquitectura base de Supabase: cliente browser, cliente server y middleware de sesión.
- Se creó dashboard inicial con KPIs y gráfica usando Recharts.
- Se creó módulo de productos con formulario de creación y tabla de catálogo.
- Se creó inventario individual: cada torta física se maneja como unidad independiente.
- Se implementó generación de unidades con código único tipo TORTA-*.
- Se agregó endpoint `/api/qr/[code]` para generar QR SVG con librería `qrcode`.
- Se creó detalle de unidad con QR, estado, punto, vencimiento, precio y acciones.
- Se implementaron acciones de unidad: vender, trasladar, marcar vencida y marcar perdida.
- Se creó historial de movimientos por unidad.
- Se implementó scanner QR móvil con `html5-qrcode`.
- Se creó pantalla de traslados con historial.
- Se creó reporte base con ventas, pérdidas e ingresos estimados.
- Se creó reporte de caja para comparar ventas registradas vs dinero reportado.
- Se creó pantalla de usuarios para visualizar perfiles y roles.
- Se creó `supabase/schema.sql` con enums, tablas, relaciones, índices y políticas RLS.
- Se creó `.env.example`.
- Se creó README con instalación, Supabase y deploy en Vercel.
- Se actualizó la integración de Supabase para soportar claves modernas `sb_publishable_*` y `sb_secret_*`.
- Se configuró `.env.local` para apuntar al proyecto real de Supabase compartido por el usuario.
- Se creó script `npm run bootstrap:admin` para crear un usuario admin en Supabase Auth y sincronizar su perfil en `public.usuarios`.
- Se agregaron grants SQL explícitos y un archivo `supabase/repair-api-grants.sql` para proyectos Supabase donde el Data API no hereda permisos automáticamente.
- Se normalizó la demo para usar las sedes reales `Guaduales (Principal)`, `Lopez`, `Villa Colombia` y `Limonar`.
- Se creó `supabase/normalize-sedes.sql` y el script `npm run normalize:sedes` para renombrar sedes antiguas y conservar relaciones existentes.
- Se creó `npm run seed:demo` para cargar productos, unidades y movimientos demo repetibles.
- Se extendió el bootstrap de usuarios para aceptar `rol` y `punto`, permitiendo crear cuentas operativas de sucursal además del admin.
- Se agregó gating mínimo por rol en navegación y rutas para que `encargado_punto` no vea pantallas administrativas.
- Se agregó contexto visible de usuario, rol y sede en el layout para mejorar la demo.
- Se mejoró el feedback de formularios y acciones para mostrar errores reales de Supabase/RLS.
- Se conectó la gráfica de ventas del dashboard a datos reales de movimientos, en lugar de datos estáticos.
- Se rediseñó la pantalla de login con accesos de demo visibles, mejor jerarquía visual y redirección más robusta tras autenticarse.

### Archivos creados/modificados
- `package.json`
- `tsconfig.json`
- `next.config.mjs`
- `postcss.config.mjs`
- `tailwind.config.ts`
- `app/globals.css`
- `app/layout.tsx`
- `app/page.tsx`
- `middleware.ts`
- `lib/utils.ts`
- `lib/data.ts`
- `lib/types/database.ts`
- `lib/supabase/client.ts`
- `lib/supabase/server.ts`
- `components/ui/*`
- `components/layout/*`
- `components/dashboard/*`
- `components/forms/*`
- `app/(auth)/login/page.tsx`
- `app/(dashboard)/*`
- `app/api/qr/[code]/route.ts`
- `supabase/schema.sql`
- `supabase/repair-api-grants.sql`
- `supabase/normalize-sedes.sql`
- `.env.example`
- `.env.local`
- `README.md`
- `avances.md`
- `lib/supabase/env.ts`
- `lib/permissions.ts`
- `scripts/bootstrap-admin.mjs`
- `scripts/lib/supabase-admin.mjs`
- `scripts/normalize-sedes.mjs`
- `scripts/seed-demo.mjs`

### Decisiones técnicas
- Se modela cada torta como una unidad física en `unidades_inventario`, no como cantidad agregada.
- El QR guarda un código único que redirige al flujo de escaneo/detalle.
- Los movimientos son la fuente de trazabilidad histórica.
- Los roles se almacenan en `usuarios` y se usan en políticas RLS.
- El MVP usa Supabase directamente desde componentes cliente/server para avanzar rápido sin crear un backend adicional.
- Se usa diseño mobile-first con navegación inferior para operación rápida en puntos de venta.
- Se agregó compatibilidad con los nombres nuevos de API keys de Supabase sin romper compatibilidad con `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
- La `SUPABASE_SECRET_KEY` se mantiene solo en entorno server/local y no se expone al cliente.
- Para la demo se decidió diferenciar por rol mediante gating de navegación, rutas y formularios, sin construir layouts totalmente distintos por perfil.
- Se decidió sembrar datos demo con IDs determinísticos para poder reejecutar la carga y resetear el escenario sin duplicados.

### Problemas encontrados
- La gestión real de usuarios requiere crear primero usuarios en Supabase Auth y luego su perfil en `public.usuarios`.
- Las políticas RLS son funcionales para MVP, pero conviene revisarlas con datos reales antes de producción.
- La conciliación de caja está implementada como cálculo base en UI; falta persistir cierres en `cierres_caja` desde formulario.
- Sigue siendo necesario ejecutar `supabase/schema.sql` en el proyecto remoto si aún no se ha corrido, porque desde este repo no hay acceso directo al SQL Editor del dashboard.
- El proyecto remoto respondió `permission denied for table puntos` usando la secret key, lo que indica que faltan grants del Data API aunque el esquema parece existir.
- El proyecto no tenía un repo Git funcional utilizable desde este directorio, así que el flujo de publicación debe re-inicializar Git y conectar el remoto correcto antes de empujar a GitHub.

### Próximos pasos
- Reemplazar mutaciones cliente por Server Actions con validación Zod y control de permisos más estricto.
- Agregar filtros avanzados en inventario.
- Implementar impresión masiva de etiquetas QR.
- Persistir cierres de caja en la tabla `cierres_caja`.
- Mejorar reportes con rangos de fecha y gráficas reales desde base de datos.
- Agregar creación/edición de puntos de venta desde UI.
- Agregar tests básicos y pipeline de calidad.
- Publicar el estado actual en `SantiagoCordobaG/Manjares-Inventario` y conectar el deploy en Vercel.
- Persistir cierres de caja en base de datos en lugar de calcularlos solo en cliente.
