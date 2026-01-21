alter table public.gallery_items
  add column if not exists title text not null default '',
  add column if not exists template text not null default 'impact',
  add column if not exists size text not null default 'square',
  add column if not exists cta_link text null,
  add column if not exists seo_caption text not null default '',
  add column if not exists taken_on date null;
