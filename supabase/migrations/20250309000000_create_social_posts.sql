create table if not exists public.social_posts (
  id uuid primary key default gen_random_uuid(),
  platform text not null check (platform in ('instagram', 'linkedin')),
  url text not null unique,
  title text,
  description text,
  image_url text,
  author text,
  post_date timestamptz,
  published boolean not null default true,
  source text not null default 'manual' check (source in ('manual', 'auto')),
  external_id text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists social_posts_platform_idx
  on public.social_posts (platform);

create index if not exists social_posts_published_idx
  on public.social_posts (published);

create index if not exists social_posts_post_date_idx
  on public.social_posts (post_date desc);

create index if not exists social_posts_created_at_idx
  on public.social_posts (created_at desc);

create unique index if not exists social_posts_platform_external_id_key
  on public.social_posts (platform, external_id)
  where external_id is not null;

create or replace function public.set_social_posts_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists set_social_posts_updated_at on public.social_posts;
create trigger set_social_posts_updated_at
before update on public.social_posts
for each row execute procedure public.set_social_posts_updated_at();

alter table public.social_posts enable row level security;

drop policy if exists "Public read published social posts" on public.social_posts;
create policy "Public read published social posts"
on public.social_posts
for select
using (published = true);

drop policy if exists "Admin manage social posts" on public.social_posts;
create policy "Admin manage social posts"
on public.social_posts
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
