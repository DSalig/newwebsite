-- Lumenwright — Supabase schema
-- Run in the Supabase SQL editor (or `supabase db push`).

-- ── catalog ─────────────────────────────────────────────────
create table if not exists categories (
  slug text primary key,
  name text not null,
  short text not null,
  description text not null
);

create table if not exists products (
  slug text primary key,
  sku text unique not null,
  name text not null,
  category text not null references categories(slug),
  art text not null,
  palette jsonb not null,
  price numeric not null,
  price_note text not null,
  blurb text not null,
  description text not null,
  specs jsonb not null,
  options jsonb not null,
  lead_time_weeks int4range,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

-- ── inbound ─────────────────────────────────────────────────
create table if not exists leads (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  phone text,
  interest text not null,
  message text not null,
  source text not null default 'contact-page',
  created_at timestamptz not null default now()
);

create table if not exists order_requests (
  id uuid primary key default gen_random_uuid(),
  product_slug text not null,
  product_name text not null,
  sku text not null,
  options jsonb not null default '{}',
  quantity int not null default 1,
  name text not null,
  email text not null,
  notes text,
  status text not null default 'new', -- new → confirmed → sent_to_manufacturer → fulfilled
  created_at timestamptz not null default now()
);

-- ── designer network ────────────────────────────────────────
-- Vetted members published on /designers. Rows are added by the
-- team (service role) as designers pass review — never fabricated.
create table if not exists designers (
  slug text primary key,
  name text not null,
  studio text not null,
  metros text[] not null default '{}',
  specialties text[] not null default '{}',
  bio text not null,
  credentials text,
  website text,
  email text,
  active boolean not null default false,
  created_at timestamptz not null default now()
);

-- Concierge match requests from the four interjection points
-- (studio plan, product order, retrofit, general).
create table if not exists designer_referrals (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  location text not null,
  notes text,
  context jsonb not null default '{}',
  context_summary text not null default '',
  matched_designer_slug text references designers(slug),
  status text not null default 'new', -- new → matched → introduced → closed
  created_at timestamptz not null default now()
);

create table if not exists designer_applications (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  studio text not null,
  email text not null,
  location text not null,
  specialties text[] not null default '{}',
  portfolio_url text,
  message text,
  status text not null default 'new', -- new → reviewing → accepted → declined
  created_at timestamptz not null default now()
);

-- AI studio consultations (photo stored in the `spaces` bucket)
create table if not exists ai_consultations (
  id uuid primary key default gen_random_uuid(),
  room_type text,
  goals text,
  image_path text,          -- storage path in `spaces` bucket, if retained
  analysis jsonb,           -- the generated plan
  source text,              -- 'ai' | 'demo'
  email text,               -- captured if the visitor books from the plan
  created_at timestamptz not null default now()
);

-- ── storage ─────────────────────────────────────────────────
insert into storage.buckets (id, name, public)
values ('spaces', 'spaces', false)
on conflict (id) do nothing;

-- ── row level security ──────────────────────────────────────
alter table categories enable row level security;
alter table products enable row level security;
alter table leads enable row level security;
alter table order_requests enable row level security;
alter table ai_consultations enable row level security;
alter table designers enable row level security;
alter table designer_referrals enable row level security;
alter table designer_applications enable row level security;

-- catalog is public to read; writes via service role only
create policy "public read categories" on categories for select using (true);
create policy "public read products" on products for select using (active);

-- anonymous visitors may create inbound records but never read them
create policy "anon insert leads" on leads for insert with check (true);
create policy "anon insert order_requests" on order_requests for insert with check (true);
create policy "anon insert ai_consultations" on ai_consultations for insert with check (true);

-- network: published members are public; inbound is write-only
create policy "public read active designers" on designers for select using (active);
create policy "anon insert designer_referrals" on designer_referrals for insert with check (true);
create policy "anon insert designer_applications" on designer_applications for insert with check (true);
