create table if not exists public.gallery_items (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  created_by uuid null,
  is_published boolean default true,
  image_path text not null,
  thumb_path text null,
  caption text null,
  city text null,
  year int null,
  drive_type text null,
  tags text[] null,
  sort_order int default 0,
  taken_at date null
);

create index if not exists gallery_items_is_published_idx
  on public.gallery_items (is_published);

create index if not exists gallery_items_city_idx
  on public.gallery_items (city);

create index if not exists gallery_items_year_idx
  on public.gallery_items (year);

create index if not exists gallery_items_drive_type_idx
  on public.gallery_items (drive_type);

create index if not exists gallery_items_created_at_idx
  on public.gallery_items (created_at desc);

create index if not exists gallery_items_sort_order_idx
  on public.gallery_items (sort_order);

alter table public.gallery_items enable row level security;

drop policy if exists "Public read published gallery items" on public.gallery_items;
create policy "Public read published gallery items"
on public.gallery_items
for select
using (is_published = true);

drop policy if exists "Admin manage gallery items" on public.gallery_items;
create policy "Admin manage gallery items"
on public.gallery_items
for all
using (
  exists (
    select 1 from public.profiles
    where profiles.id = auth.uid()
      and profiles.role = 'admin'
  )
)
with check (
  exists (
    select 1 from public.profiles
    where profiles.id = auth.uid()
      and profiles.role = 'admin'
  )
);

insert into storage.buckets (id, name, public)
values ('gallery', 'gallery', true)
on conflict (id) do nothing;

drop policy if exists "Public read gallery images" on storage.objects;
create policy "Public read gallery images"
on storage.objects
for select
using (bucket_id = 'gallery');

drop policy if exists "Admin manage gallery images" on storage.objects;
create policy "Admin manage gallery images"
on storage.objects
for all
using (
  bucket_id = 'gallery'
  and exists (
    select 1 from public.profiles
    where profiles.id = auth.uid()
      and profiles.role = 'admin'
  )
)
with check (
  bucket_id = 'gallery'
  and exists (
    select 1 from public.profiles
    where profiles.id = auth.uid()
      and profiles.role = 'admin'
  )
);
