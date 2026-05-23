create extension if not exists "pgcrypto";

create type user_role as enum ('admin', 'encargado_punto', 'produccion');
create type inventory_status as enum ('disponible', 'vendida', 'vencida', 'trasladada', 'perdida');
create type movement_type as enum ('creacion', 'recepcion', 'venta', 'traslado', 'vencimiento', 'perdida', 'correccion');

create table public.puntos (
  id uuid primary key default gen_random_uuid(),
  nombre text not null unique,
  direccion text,
  created_at timestamptz not null default now()
);

create table public.productos (
  id uuid primary key default gen_random_uuid(),
  nombre text not null,
  tamano text not null,
  precio numeric(12,2) not null check (precio >= 0),
  dias_vencimiento integer not null check (dias_vencimiento > 0),
  imagen_url text,
  activo boolean not null default true,
  created_at timestamptz not null default now()
);

create table public.usuarios (
  id uuid primary key references auth.users(id) on delete cascade,
  nombre text not null,
  rol user_role not null default 'encargado_punto',
  punto_id uuid references public.puntos(id),
  created_at timestamptz not null default now()
);

create table public.unidades_inventario (
  id uuid primary key default gen_random_uuid(),
  producto_id uuid not null references public.productos(id),
  qr_codigo text not null unique,
  punto_actual_id uuid references public.puntos(id),
  fecha_entrada timestamptz not null default now(),
  fecha_vencimiento timestamptz not null,
  estado inventory_status not null default 'disponible',
  created_by uuid references public.usuarios(id),
  created_at timestamptz not null default now()
);

create table public.movimientos (
  id uuid primary key default gen_random_uuid(),
  unidad_id uuid not null references public.unidades_inventario(id) on delete cascade,
  tipo movement_type not null,
  punto_origen_id uuid references public.puntos(id),
  punto_destino_id uuid references public.puntos(id),
  usuario_id uuid references public.usuarios(id),
  fecha timestamptz not null default now(),
  nota text
);

create table public.cierres_caja (
  id uuid primary key default gen_random_uuid(),
  punto_id uuid references public.puntos(id),
  usuario_id uuid references public.usuarios(id),
  fecha date not null default current_date,
  ventas_registradas numeric(12,2) not null default 0,
  dinero_reportado numeric(12,2) not null default 0,
  diferencia numeric(12,2) generated always as (dinero_reportado - ventas_registradas) stored,
  nota text,
  created_at timestamptz not null default now()
);

create index idx_unidades_estado on public.unidades_inventario(estado);
create index idx_unidades_punto on public.unidades_inventario(punto_actual_id);
create index idx_unidades_vencimiento on public.unidades_inventario(fecha_vencimiento);
create index idx_movimientos_unidad on public.movimientos(unidad_id);
create index idx_movimientos_tipo_fecha on public.movimientos(tipo, fecha);

create or replace function public.current_user_role()
returns user_role language sql stable as $$
  select rol from public.usuarios where id = auth.uid()
$$;

create or replace function public.current_user_punto()
returns uuid language sql stable as $$
  select punto_id from public.usuarios where id = auth.uid()
$$;

alter table public.puntos enable row level security;
alter table public.productos enable row level security;
alter table public.usuarios enable row level security;
alter table public.unidades_inventario enable row level security;
alter table public.movimientos enable row level security;
alter table public.cierres_caja enable row level security;

create policy "puntos lectura autenticados" on public.puntos for select to authenticated using (true);
create policy "puntos admin todo" on public.puntos for all to authenticated using (public.current_user_role() = 'admin') with check (public.current_user_role() = 'admin');

create policy "productos lectura autenticados" on public.productos for select to authenticated using (true);
create policy "productos admin produccion escribe" on public.productos for all to authenticated using (public.current_user_role() in ('admin','produccion')) with check (public.current_user_role() in ('admin','produccion'));

create policy "usuarios lectura propia/admin" on public.usuarios for select to authenticated using (id = auth.uid() or public.current_user_role() = 'admin');
create policy "usuarios admin todo" on public.usuarios for all to authenticated using (public.current_user_role() = 'admin') with check (public.current_user_role() = 'admin');

create policy "unidades segun rol" on public.unidades_inventario for select to authenticated using (
  public.current_user_role() in ('admin','produccion') or punto_actual_id = public.current_user_punto()
);
create policy "unidades insertar produccion admin" on public.unidades_inventario for insert to authenticated with check (public.current_user_role() in ('admin','produccion'));
create policy "unidades actualizar autorizados" on public.unidades_inventario for update to authenticated using (
  public.current_user_role() = 'admin' or public.current_user_role() = 'produccion' or punto_actual_id = public.current_user_punto()
) with check (true);

create policy "movimientos lectura autorizada" on public.movimientos for select to authenticated using (
  public.current_user_role() in ('admin','produccion') or punto_origen_id = public.current_user_punto() or punto_destino_id = public.current_user_punto()
);
create policy "movimientos crear autenticados" on public.movimientos for insert to authenticated with check (true);
create policy "movimientos admin corrige" on public.movimientos for update to authenticated using (public.current_user_role() = 'admin') with check (public.current_user_role() = 'admin');

create policy "caja lectura autorizada" on public.cierres_caja for select to authenticated using (public.current_user_role() = 'admin' or punto_id = public.current_user_punto());
create policy "caja crear punto/admin" on public.cierres_caja for insert to authenticated with check (public.current_user_role() = 'admin' or punto_id = public.current_user_punto());

insert into public.puntos (nombre, direccion) values
('Guaduales (Principal)', 'Sede principal'),
('Lopez', 'Sucursal Lopez'),
('Villa Colombia', 'Sucursal Villa Colombia'),
('Limonar', 'Sucursal Limonar')
on conflict do nothing;

grant usage on schema public to authenticated, service_role;
grant usage on all sequences in schema public to authenticated, service_role;

grant select, insert, update, delete on table
  public.puntos,
  public.productos,
  public.usuarios,
  public.unidades_inventario,
  public.movimientos,
  public.cierres_caja
to authenticated, service_role;

grant execute on function public.current_user_role() to authenticated, service_role;
grant execute on function public.current_user_punto() to authenticated, service_role;
