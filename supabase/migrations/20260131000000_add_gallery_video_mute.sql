alter table public.gallery_items
add column if not exists video_muted boolean not null default true;
