-- Koka Scent — initial schema (PRD Section 5).
-- Product, ProductVariant, Order, OrderItem.
-- Money is stored in IDR smallest unit (no decimals) as integer.

create extension if not exists "pgcrypto";

-- Enums -----------------------------------------------------------------------
create type product_category as enum ('unisex', 'wanita', 'pria', 'diffuser');

create type order_status as enum (
  'pending',
  'paid',
  'processing',
  'shipped',
  'completed',
  'cancelled',
  'failed',
  'expired'
);

-- Products --------------------------------------------------------------------
create table products (
  id           uuid primary key default gen_random_uuid(),
  slug         text not null unique,
  name         text not null,
  category     product_category not null,
  price        integer not null check (price >= 0), -- IDR, no decimals
  images       text[] not null default '{}',        -- Supabase Storage URLs
  notes_top    text not null default '',
  notes_middle text not null default '',
  notes_base   text not null default '',
  stock        integer not null default 0 check (stock >= 0),
  is_active    boolean not null default true,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

create index products_category_idx on products (category);
create index products_is_active_idx on products (is_active);

-- Product variants (e.g. 10ml / 50ml) ----------------------------------------
create table product_variants (
  id             uuid primary key default gen_random_uuid(),
  product_id     uuid not null references products (id) on delete cascade,
  label          text not null,                       -- "10ml", "50ml"
  price_override integer check (price_override >= 0),  -- nullable
  stock          integer not null default 0 check (stock >= 0)
);

create index product_variants_product_id_idx on product_variants (product_id);

-- Orders ----------------------------------------------------------------------
create table orders (
  id                   uuid primary key default gen_random_uuid(),
  order_number         text not null unique,          -- e.g. KS-20260707-0001
  customer_name        text not null,
  customer_phone       text not null,
  shipping_address     text not null,
  shipping_city        text not null,
  shipping_postal_code text not null,
  shipping_cost        integer not null default 0 check (shipping_cost >= 0),
  subtotal             integer not null check (subtotal >= 0),
  total                integer not null check (total >= 0),
  status               order_status not null default 'pending',
  midtrans_order_id    text,
  created_at           timestamptz not null default now(),
  updated_at           timestamptz not null default now()
);

create index orders_status_idx on orders (status);
create index orders_created_at_idx on orders (created_at desc);

-- Order items -----------------------------------------------------------------
create table order_items (
  id                uuid primary key default gen_random_uuid(),
  order_id          uuid not null references orders (id) on delete cascade,
  product_id        uuid not null references products (id),
  variant_id        uuid references product_variants (id),
  quantity          integer not null check (quantity > 0),
  price_at_purchase integer not null check (price_at_purchase >= 0)
);

create index order_items_order_id_idx on order_items (order_id);

-- updated_at trigger ----------------------------------------------------------
create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger products_set_updated_at
  before update on products
  for each row execute function set_updated_at();

create trigger orders_set_updated_at
  before update on orders
  for each row execute function set_updated_at();

-- Row Level Security ----------------------------------------------------------
-- Public can read active products/variants; writes go through the service-role
-- key (server) only. Orders are not publicly selectable (lookup via server).
alter table products enable row level security;
alter table product_variants enable row level security;
alter table orders enable row level security;
alter table order_items enable row level security;

create policy "public read active products"
  on products for select
  using (is_active = true);

create policy "public read variants of active products"
  on product_variants for select
  using (
    exists (
      select 1 from products p
      where p.id = product_variants.product_id and p.is_active = true
    )
  );

-- No public policies on orders / order_items: only the service-role key
-- (which bypasses RLS) may read/write them. Admin UI uses authenticated
-- server access. TODO: add authenticated admin policies when Supabase Auth
-- roles are wired (Feature 4).
