create table if not exists public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  phone text,
  subject text not null,
  message text not null,
  status text not null default 'new' check (status in ('new', 'read', 'replied')),
  created_at timestamptz not null default now()
);

create index if not exists contact_messages_created_at_idx
  on public.contact_messages (created_at desc);

create index if not exists contact_messages_status_idx
  on public.contact_messages (status);

alter table public.contact_messages enable row level security;

drop policy if exists "Public insert contact messages" on public.contact_messages;
create policy "Public insert contact messages"
on public.contact_messages
for insert
with check (auth.role() in ('anon', 'authenticated'));

drop policy if exists "Admin read contact messages" on public.contact_messages;
create policy "Admin read contact messages"
on public.contact_messages
for select
using (
  exists (
    select 1 from public.profiles
    where profiles.id = auth.uid()
      and profiles.role = 'admin'
  )
);

drop policy if exists "Admin update contact messages" on public.contact_messages;
create policy "Admin update contact messages"
on public.contact_messages
for update
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

drop policy if exists "Admin delete contact messages" on public.contact_messages;
create policy "Admin delete contact messages"
on public.contact_messages
for delete
using (
  exists (
    select 1 from public.profiles
    where profiles.id = auth.uid()
      and profiles.role = 'admin'
  )
);
