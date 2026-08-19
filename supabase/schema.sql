-- Pepthea backend schema: catalog, inventory (with movement audit),
-- orders/billing, CRM, and capture tables for forms.
-- Run once in the Supabase SQL editor, then run seed.sql.
--
-- Security model:
--   * anon key (storefront): SELECT on catalog; INSERT-only on the
--     capture tables (leads, order_requests, newsletter, quiz).
--   * service role (webhook + staff console): everything, via the
--     server only.

-- ---------- catalog ----------

create table if not exists products (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  sku text unique not null,
  name text not null,
  category text not null,
  price integer not null check (price >= 0),               -- cents
  subscribe_price integer not null check (subscribe_price >= 0),
  size text not null default '',
  ingestible boolean not null default false,
  reorder_point integer not null default 0,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

-- Production lots; the storefront batch lookup reads lot + COA.
create table if not exists batches (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references products(id) on delete cascade,
  lot text unique not null,
  manufactured_on text not null default '',
  best_by text not null default '',
  coa_url text not null default '',
  received_qty integer not null default 0 check (received_qty >= 0),
  created_at timestamptz not null default now()
);

-- ---------- inventory ----------

create table if not exists inventory (
  product_id uuid primary key references products(id) on delete cascade,
  stock integer not null default 0 check (stock >= 0),
  updated_at timestamptz not null default now()
);

-- Every stock change is explained by a movement row.
create table if not exists inventory_movements (
  id bigint generated always as identity primary key,
  product_id uuid not null references products(id) on delete cascade,
  batch_id uuid references batches(id) on delete set null,
  type text not null check (type in ('receive','sale','return','adjust')),
  qty integer not null,               -- signed: receive +, sale -
  reference text not null default '', -- order id, PO number, count note
  created_at timestamptz not null default now()
);
create index if not exists idx_movements_product on inventory_movements (product_id, created_at desc);

-- ---------- customers & CRM ----------

create table if not exists customers (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  name text not null default '',
  first_order_at timestamptz,
  last_order_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists crm_notes (
  id bigint generated always as identity primary key,
  customer_id uuid not null references customers(id) on delete cascade,
  note text not null,
  author text not null default 'staff',
  created_at timestamptz not null default now()
);

-- ---------- orders & billing ----------

create table if not exists orders (
  id uuid primary key default gen_random_uuid(),
  stripe_session_id text unique,
  customer_id uuid references customers(id) on delete set null,
  email text not null,
  name text not null default '',
  amount_total integer not null default 0,     -- cents, incl. shipping
  amount_shipping integer not null default 0,
  currency text not null default 'usd',
  status text not null default 'paid'
    check (status in ('pending','paid','shipped','delivered','refunded','cancelled')),
  shipping_address jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);
create index if not exists idx_orders_created on orders (created_at desc);
create index if not exists idx_orders_email on orders (email);

create table if not exists order_items (
  id bigint generated always as identity primary key,
  order_id uuid not null references orders(id) on delete cascade,
  product_slug text not null,
  sku text not null default '',
  product_name text not null,
  qty integer not null check (qty > 0),
  total integer not null default 0,            -- cents for the line
  is_subscription boolean not null default false
);
create index if not exists idx_order_items_order on order_items (order_id);

-- Subscriptions ledger (mirrors Stripe; Stripe stays source of
-- truth for money — this powers CRM segmentation & emails).
create table if not exists subscriptions (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid references customers(id) on delete cascade,
  -- One Stripe subscription can cover several products (one row
  -- per product), so uniqueness is composite.
  stripe_subscription_id text,
  product_slug text not null,
  unique (stripe_subscription_id, product_slug),
  qty integer not null default 1,
  interval_days integer not null default 60,
  status text not null default 'active'
    check (status in ('active','paused','cancelled')),
  next_renewal_at timestamptz,
  created_at timestamptz not null default now()
);

-- ---------- capture tables (storefront inserts) ----------

create table if not exists order_requests (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  name text not null default '',
  items jsonb not null default '[]'::jsonb,
  subtotal integer not null default 0,
  notes text,
  source text not null default '',
  status text not null default 'new'
    check (status in ('new','invoiced','paid','fulfilled','closed')),
  created_at timestamptz not null default now()
);

create table if not exists leads (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  name text,
  topic text not null default '',
  message text,
  source text not null default '',
  status text not null default 'new',
  created_at timestamptz not null default now()
);

create table if not exists newsletter_subscribers (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  source text not null default '',
  created_at timestamptz not null default now()
);

create table if not exists quiz_sessions (
  id uuid primary key default gen_random_uuid(),
  answers jsonb not null default '{}'::jsonb,
  routine_slugs jsonb not null default '[]'::jsonb,
  email text,
  created_at timestamptz not null default now()
);

-- ---------- CRM view ----------

create or replace view customer_overview as
select
  c.email,
  c.name,
  c.first_order_at,
  c.last_order_at,
  count(o.id)::int as orders_count,
  coalesce(sum(o.amount_total) filter (where o.status <> 'refunded'), 0)::int as lifetime_value,
  bool_or(oi.is_subscription) as has_subscription,
  (select string_agg(n.note, ' · ' order by n.created_at desc)
     from crm_notes n where n.customer_id = c.id) as notes
from customers c
left join orders o on o.customer_id = c.id
left join order_items oi on oi.order_id = o.id
group by c.id;

-- ---------- record_order RPC (called by the Stripe webhook) ----------
-- Idempotent on stripe_session_id: replays return the existing
-- order without double-decrementing stock.

create or replace function record_order(
  p_stripe_session_id text,
  p_email text,
  p_name text,
  p_amount_total integer,
  p_amount_shipping integer,
  p_currency text,
  p_shipping_address jsonb,
  p_items jsonb
) returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_customer_id uuid;
  v_order_id uuid;
  v_item jsonb;
  v_product_id uuid;
begin
  select id into v_order_id from orders where stripe_session_id = p_stripe_session_id;
  if v_order_id is not null then
    return v_order_id; -- webhook replay
  end if;

  insert into customers (email, name, first_order_at, last_order_at)
  values (p_email, p_name, now(), now())
  on conflict (email) do update
    set name = coalesce(nullif(excluded.name, ''), customers.name),
        last_order_at = now(),
        first_order_at = coalesce(customers.first_order_at, now())
  returning id into v_customer_id;

  insert into orders (stripe_session_id, customer_id, email, name,
                      amount_total, amount_shipping, currency, shipping_address, status)
  values (p_stripe_session_id, v_customer_id, p_email, p_name,
          p_amount_total, p_amount_shipping, p_currency, p_shipping_address, 'paid')
  returning id into v_order_id;

  for v_item in select * from jsonb_array_elements(p_items)
  loop
    insert into order_items (order_id, product_slug, sku, product_name, qty, total, is_subscription)
    values (
      v_order_id,
      v_item->>'slug',
      coalesce(v_item->>'sku', ''),
      v_item->>'name',
      greatest((v_item->>'qty')::int, 1),
      coalesce((v_item->>'total')::int, 0),
      coalesce((v_item->>'subscribe')::boolean, false)
    );

    select id into v_product_id from products where slug = v_item->>'slug';
    if v_product_id is not null then
      update inventory
        set stock = greatest(stock - greatest((v_item->>'qty')::int, 1), 0),
            updated_at = now()
        where product_id = v_product_id;
      insert into inventory_movements (product_id, type, qty, reference)
      values (v_product_id, 'sale', -greatest((v_item->>'qty')::int, 1), v_order_id::text);
    end if;
  end loop;

  return v_order_id;
end;
$$;

-- ---------- RLS ----------

alter table products enable row level security;
alter table batches enable row level security;
alter table inventory enable row level security;
alter table inventory_movements enable row level security;
alter table customers enable row level security;
alter table crm_notes enable row level security;
alter table orders enable row level security;
alter table order_items enable row level security;
alter table subscriptions enable row level security;
alter table order_requests enable row level security;
alter table leads enable row level security;
alter table newsletter_subscribers enable row level security;
alter table quiz_sessions enable row level security;

-- Public catalog reads
create policy "public read products" on products for select using (true);
create policy "public read batches" on batches for select using (true);

-- Anonymous capture inserts (write-only: no select policy)
create policy "anon insert order_requests" on order_requests for insert with check (true);
create policy "anon insert leads" on leads for insert with check (true);
create policy "anon insert newsletter" on newsletter_subscribers for insert with check (true);
create policy "anon insert quiz" on quiz_sessions for insert with check (true);

-- Everything else: service role only (no policies → denied for anon).

-- ---------- authenticated user area ----------
-- Signed-in customers (Supabase Auth) can read their own orders and
-- subscriptions. Rows are matched on the verified JWT email, so
-- history works even for orders placed before the account existed.
-- Email changes go through Supabase's double-confirmation flow, so
-- the claim is trustworthy.

create policy "own orders" on orders
  for select to authenticated
  using (email = (auth.jwt() ->> 'email'));

create policy "own order items" on order_items
  for select to authenticated
  using (exists (
    select 1 from orders o
    where o.id = order_items.order_id
      and o.email = (auth.jwt() ->> 'email')
  ));

create policy "own subscriptions" on subscriptions
  for select to authenticated
  using (exists (
    select 1 from customers c
    where c.id = subscriptions.customer_id
      and c.email = (auth.jwt() ->> 'email')
  ));
