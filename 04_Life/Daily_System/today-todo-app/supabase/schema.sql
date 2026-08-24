create table if not exists public.tasks (
  id uuid primary key,
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  date date not null,
  section text not null check (section in ('must', 'progress', 'later')),
  title text not null check (char_length(title) between 1 and 120),
  completed boolean not null default false,
  parent_id uuid references public.tasks(id) on delete cascade,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

alter table public.tasks enable row level security;

create policy "users manage their own tasks"
on public.tasks for all
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create index if not exists tasks_user_date_idx on public.tasks(user_id, date desc);
create index if not exists tasks_parent_idx on public.tasks(parent_id);
