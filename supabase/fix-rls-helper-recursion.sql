create or replace function public.current_user_role()
returns user_role
language sql
stable
security definer
set search_path = public
as $$
  select rol from public.usuarios where id = auth.uid()
$$;

create or replace function public.current_user_punto()
returns uuid
language sql
stable
security definer
set search_path = public
as $$
  select punto_id from public.usuarios where id = auth.uid()
$$;

grant execute on function public.current_user_role() to authenticated, service_role;
grant execute on function public.current_user_punto() to authenticated, service_role;

notify pgrst, 'reload schema';
