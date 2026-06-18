create table if not exists public.products (
  id text primary key,
  slug text not null unique,
  name text not null,
  category text not null check (
    category in (
      'Lingerie',
      'Couples Collection',
      'Wellness Products',
      'Accessories',
      'Fantasy Collections'
    )
  ),
  sku text unique,
  image_url text,
  description text not null,
  details text[] not null default '{}',
  price numeric(12, 2) not null check (price >= 0),
  compare_at_price numeric(12, 2) check (compare_at_price is null or compare_at_price >= 0),
  currency text not null default 'INR' check (currency = 'INR'),
  rating numeric(2, 1) not null default 0 check (rating between 0 and 5),
  review_count integer not null default 0 check (review_count >= 0),
  tags text[] not null default '{}',
  badge text check (badge is null or badge in ('Best seller', 'New', 'Limited', 'Editor pick')),
  is_best_seller boolean not null default false,
  is_new boolean not null default false,
  color text not null,
  inventory integer not null default 0 check (inventory >= 0),
  status text not null default 'active' check (status in ('active', 'draft')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists products_status_idx on public.products (status);
create index if not exists products_category_idx on public.products (category);
create index if not exists products_created_at_idx on public.products (created_at desc);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists products_set_updated_at on public.products;
create trigger products_set_updated_at
before update on public.products
for each row execute function public.set_updated_at();

alter table public.products enable row level security;

grant select on public.products to anon, authenticated;
grant select, insert, update, delete on public.products to service_role;

drop policy if exists "Public can read active products" on public.products;
create policy "Public can read active products"
on public.products
for select
to anon, authenticated
using (status = 'active');

insert into storage.buckets (
  id,
  name,
  public,
  file_size_limit,
  allowed_mime_types
)
values (
  'product-images',
  'product-images',
  true,
  8388608,
  array['image/jpeg', 'image/png', 'image/webp']
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Public can view product images" on storage.objects;
create policy "Public can view product images"
on storage.objects
for select
to public
using (bucket_id = 'product-images');
