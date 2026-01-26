alter table public.insights
add column if not exists content_html text;

alter table public.insights
add column if not exists content_format text;

update public.insights
set content_format = 'md'
where content_format is null;

alter table public.insights
alter column content_format set default 'md',
alter column content_format set not null;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'insights_content_format_check'
  ) then
    alter table public.insights
      add constraint insights_content_format_check
      check (content_format in ('md', 'html'));
  end if;
end $$;
