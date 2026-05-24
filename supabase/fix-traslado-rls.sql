create or replace function public.registrar_traslado_unidad(
  p_unidad_id uuid,
  p_punto_destino_id uuid,
  p_nota text default null
)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_role user_role;
  v_punto_usuario uuid;
  v_unidad public.unidades_inventario%rowtype;
begin
  if auth.uid() is null then
    raise exception 'No autenticado';
  end if;

  select rol, punto_id
  into v_role, v_punto_usuario
  from public.usuarios
  where id = auth.uid();

  if v_role is null then
    raise exception 'No se encontro el perfil del usuario autenticado';
  end if;

  select *
  into v_unidad
  from public.unidades_inventario
  where id = p_unidad_id;

  if not found then
    raise exception 'La unidad no existe';
  end if;

  if p_punto_destino_id is null then
    raise exception 'Debes elegir un punto destino';
  end if;

  if v_unidad.punto_actual_id is not distinct from p_punto_destino_id then
    raise exception 'La unidad ya se encuentra en el punto seleccionado';
  end if;

  if v_role not in ('admin', 'produccion') and v_unidad.punto_actual_id is distinct from v_punto_usuario then
    raise exception 'No tienes permiso para trasladar unidades de otro punto';
  end if;

  update public.unidades_inventario
  set punto_actual_id = p_punto_destino_id,
      estado = 'disponible'
  where id = p_unidad_id;

  insert into public.movimientos (
    unidad_id,
    tipo,
    punto_origen_id,
    punto_destino_id,
    usuario_id,
    nota
  )
  values (
    p_unidad_id,
    'traslado',
    v_unidad.punto_actual_id,
    p_punto_destino_id,
    auth.uid(),
    coalesce(p_nota, 'Traslado registrado desde la app')
  );
end;
$$;

grant execute on function public.registrar_traslado_unidad(uuid, uuid, text) to authenticated, service_role;

notify pgrst, 'reload schema';
