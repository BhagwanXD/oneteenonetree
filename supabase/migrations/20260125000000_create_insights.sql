create or replace function public.is_admin()
returns boolean
language sql
stable
as $$
  select exists (
    select 1
    from public.profiles
    where profiles.id = auth.uid()
      and profiles.role = 'admin'
  );
$$;

create table if not exists public.insights (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  excerpt text null,
  content jsonb not null,
  cover_image_url text null,
  status text not null default 'draft' check (status in ('draft', 'published')),
  author_name text null,
  tags text[] null,
  meta_title text null,
  meta_description text null,
  published_at timestamptz null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists insights_status_idx on public.insights (status);
create index if not exists insights_published_at_idx on public.insights (published_at desc);
create index if not exists insights_created_at_idx on public.insights (created_at desc);

create or replace function public.set_insights_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists set_insights_updated_at on public.insights;
create trigger set_insights_updated_at
before update on public.insights
for each row execute procedure public.set_insights_updated_at();

alter table public.insights enable row level security;

drop policy if exists "Public read published insights" on public.insights;
create policy "Public read published insights"
on public.insights
for select
using (status = 'published');

drop policy if exists "Admin manage insights" on public.insights;
create policy "Admin manage insights"
on public.insights
for all
using (public.is_admin())
with check (public.is_admin());

insert into storage.buckets (id, name, public)
values ('insights', 'insights', true)
on conflict (id) do nothing;

drop policy if exists "Public read insights images" on storage.objects;
create policy "Public read insights images"
on storage.objects
for select
using (bucket_id = 'insights');

drop policy if exists "Admin manage insights images" on storage.objects;
create policy "Admin manage insights images"
on storage.objects
for all
using (
  bucket_id = 'insights'
  and public.is_admin()
)
with check (
  bucket_id = 'insights'
  and public.is_admin()
);
