-- Выполни в Supabase → SQL Editor ПОСЛЕ шагов 3-4 из инструкции
alter table public.profiles add column if not exists full_name text;

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = '' as $$
begin
  insert into public.profiles (id, email, full_name)
  values (new.id, new.email, new.raw_user_meta_data->>'full_name');
  return new;
end; $$;
