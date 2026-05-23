do $$
declare
  old_id uuid;
  new_id uuid;
begin
  select id into old_id from public.puntos where nombre = 'Producción Central';
  select id into new_id from public.puntos where nombre = 'Guaduales (Principal)';

  if old_id is not null and new_id is null then
    update public.puntos
    set nombre = 'Guaduales (Principal)', direccion = 'Sede principal'
    where id = old_id;
  elsif old_id is not null and new_id is not null and old_id <> new_id then
    update public.usuarios set punto_id = new_id where punto_id = old_id;
    update public.unidades_inventario set punto_actual_id = new_id where punto_actual_id = old_id;
    update public.movimientos set punto_origen_id = new_id where punto_origen_id = old_id;
    update public.movimientos set punto_destino_id = new_id where punto_destino_id = old_id;
    update public.cierres_caja set punto_id = new_id where punto_id = old_id;
    delete from public.puntos where id = old_id;
  end if;

  select id into old_id from public.puntos where nombre = 'Punto Norte';
  select id into new_id from public.puntos where nombre = 'Lopez';

  if old_id is not null and new_id is null then
    update public.puntos
    set nombre = 'Lopez', direccion = 'Sucursal Lopez'
    where id = old_id;
  elsif old_id is not null and new_id is not null and old_id <> new_id then
    update public.usuarios set punto_id = new_id where punto_id = old_id;
    update public.unidades_inventario set punto_actual_id = new_id where punto_actual_id = old_id;
    update public.movimientos set punto_origen_id = new_id where punto_origen_id = old_id;
    update public.movimientos set punto_destino_id = new_id where punto_destino_id = old_id;
    update public.cierres_caja set punto_id = new_id where punto_id = old_id;
    delete from public.puntos where id = old_id;
  end if;

  select id into old_id from public.puntos where nombre = 'Punto Centro';
  select id into new_id from public.puntos where nombre = 'Villa Colombia';

  if old_id is not null and new_id is null then
    update public.puntos
    set nombre = 'Villa Colombia', direccion = 'Sucursal Villa Colombia'
    where id = old_id;
  elsif old_id is not null and new_id is not null and old_id <> new_id then
    update public.usuarios set punto_id = new_id where punto_id = old_id;
    update public.unidades_inventario set punto_actual_id = new_id where punto_actual_id = old_id;
    update public.movimientos set punto_origen_id = new_id where punto_origen_id = old_id;
    update public.movimientos set punto_destino_id = new_id where punto_destino_id = old_id;
    update public.cierres_caja set punto_id = new_id where punto_id = old_id;
    delete from public.puntos where id = old_id;
  end if;
end $$;

insert into public.puntos (nombre, direccion) values
('Guaduales (Principal)', 'Sede principal'),
('Lopez', 'Sucursal Lopez'),
('Villa Colombia', 'Sucursal Villa Colombia'),
('Limonar', 'Sucursal Limonar')
on conflict (nombre) do update
set direccion = excluded.direccion;
