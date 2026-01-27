alter table public.gallery_items
add column if not exists media_type text not null default 'image';

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'gallery_items_media_type_check'
  ) then
    alter table public.gallery_items
      add constraint gallery_items_media_type_check
      check (media_type in ('image', 'video'));
  end if;
end $$;
