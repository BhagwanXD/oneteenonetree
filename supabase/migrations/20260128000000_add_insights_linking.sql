create table if not exists public.insight_links_map (
  category text primary key,
  pillar_slug text not null,
  cluster_slugs text[] not null default '{}',
  action_type text not null,
  anchor_variants jsonb null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create or replace function public.set_insight_links_map_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists set_insight_links_map_updated_at on public.insight_links_map;
create trigger set_insight_links_map_updated_at
before update on public.insight_links_map
for each row execute procedure public.set_insight_links_map_updated_at();

create table if not exists public.insights_internal_edges (
  from_insight_id uuid not null references public.insights(id) on delete cascade,
  to_insight_id uuid null references public.insights(id) on delete set null,
  type text not null,
  action_path text null,
  created_at timestamptz not null default now()
);

create index if not exists insights_internal_edges_from_idx on public.insights_internal_edges (from_insight_id);
create index if not exists insights_internal_edges_to_idx on public.insights_internal_edges (to_insight_id);

alter table public.insights
add column if not exists category text;

alter table public.insight_links_map enable row level security;
alter table public.insights_internal_edges enable row level security;

drop policy if exists "Admin manage insight links map" on public.insight_links_map;
create policy "Admin manage insight links map"
on public.insight_links_map
for all
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "Admin manage insight internal edges" on public.insights_internal_edges;
create policy "Admin manage insight internal edges"
on public.insights_internal_edges
for all
using (public.is_admin())
with check (public.is_admin());
