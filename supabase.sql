-- Schema setup for Aiaxcart Premium Shop
-- Run this script in the Supabase SQL editor before deploying.

-- Ensure required extensions are present
create extension if not exists "pgcrypto";

-- Stocks available for admins to grant / sell
create table if not exists public.stocks (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default timezone('utc', now()),
  product_key text not null,
  account_type text,
  term_days integer not null,
  email text,
  password text,
  profile text,
  pin text,
  quantity integer default 0,
  price numeric,
  notes text
);

-- Records of which buyer received which stock
create table if not exists public.account_records (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default timezone('utc', now()),
  stock_id uuid not null references public.stocks(id) on delete restrict,
  product_key text,
  buyer_name text,
  buyer_email text,
  social_link text,
  amount numeric
);

-- Automatically copy the product key from the stock row when inserting a record
create or replace function public.account_records_set_product_key()
returns trigger as $$
begin
  if new.product_key is null then
    select s.product_key
      into new.product_key
    from public.stocks s
    where s.id = new.stock_id;
  end if;
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists account_records_set_product_key on public.account_records;
create trigger account_records_set_product_key
  before insert on public.account_records
  for each row
  execute function public.account_records_set_product_key();

-- Helper RPC for admins: decrement quantity after granting an account
create or replace function public.admin_grant_and_decrement(p_stock_id uuid)
returns public.stocks
language plpgsql
security definer
set search_path = public
as $$
declare
  v_stock public.stocks;
begin
  select * into v_stock
  from public.stocks
  where id = p_stock_id
  for update;

  if not found then
    raise exception 'Stock not found';
  end if;

  if coalesce(v_stock.quantity, 0) <= 0 then
    raise exception 'No quantity available for this stock';
  end if;

  update public.stocks
  set quantity = coalesce(quantity, 0) - 1
  where id = p_stock_id;

  select * into v_stock from public.stocks where id = p_stock_id;
  return v_stock;
end;
$$;

-- Optional: expose RPC
grant execute on function public.admin_grant_and_decrement(uuid) to anon, authenticated;

-- Basic read/write access (adjust RLS policies later as needed)
alter table public.stocks enable row level security;
alter table public.account_records enable row level security;

drop policy if exists "Stocks are fully open during initial setup" on public.stocks;
create policy "Stocks are fully open during initial setup"
  on public.stocks
  for all
  using (true)
  with check (true);

drop policy if exists "Account records are fully open during initial setup" on public.account_records;
create policy "Account records are fully open during initial setup"
  on public.account_records
  for all
  using (true)
  with check (true);
