create or replace function public.is_admin()
returns boolean
language sql
stable
as $$
  select exists (
    select 1
    from public.profiles p
    where p.role = 'admin'
      and (
        p.auth_user_id = auth.uid()
        or p.email = (auth.jwt() ->> 'email')
      )
  );
$$;
