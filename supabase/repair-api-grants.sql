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
grant execute on function public.registrar_traslado_unidad(uuid, uuid, text) to authenticated, service_role;

NOTIFY pgrst, 'reload schema';
