-- Выполни в Supabase → SQL Editor → Run (один раз)

-- 1. Блокировка пользователей
alter table public.profiles add column if not exists blocked boolean not null default false;

-- Заблокированный админ теряет права
create or replace function public.is_admin()
returns boolean language sql security definer stable set search_path = '' as $$
  select exists (select 1 from public.profiles
    where id = auth.uid() and role = 'admin' and not blocked);
$$;

-- Обычный пользователь не может менять роль, email, дату и блокировку
create or replace function public.protect_profile()
returns trigger language plpgsql security definer set search_path = '' as $$
begin
  if auth.uid() is not null and not public.is_admin() then
    new.role := old.role;
    new.email := old.email;
    new.created_at := old.created_at;
    new.blocked := old.blocked;
  end if;
  return new;
end; $$;

-- 2. Реальный счётчик пользователей для главной (виден всем)
create or replace function public.public_user_count()
returns bigint language sql security definer stable set search_path = '' as $$
  select count(*) from public.profiles;
$$;
grant execute on function public.public_user_count() to anon, authenticated;

-- 3. Пользователь может удалить свой аккаунт
create or replace function public.delete_my_account()
returns void language plpgsql security definer set search_path = '' as $$
begin
  if auth.uid() is null then raise exception 'Не авторизован'; end if;
  delete from auth.users where id = auth.uid();
end; $$;
revoke execute on function public.delete_my_account() from public, anon;
grant execute on function public.delete_my_account() to authenticated;

-- 4. Ограничения длины для заявок (защита от мусора)
alter table public.leads drop constraint if exists leads_len;
alter table public.leads add constraint leads_len check (
  char_length(name) <= 100 and char_length(email) <= 200 and char_length(message) <= 2000);
