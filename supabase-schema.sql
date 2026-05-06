create table if not exists public.class_board_state (
  id text primary key,
  data jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.class_board_state enable row level security;

drop policy if exists "class board state can be read" on public.class_board_state;
create policy "class board state can be read"
on public.class_board_state
for select
to anon
using (id = 'main');

drop policy if exists "class board state can be written" on public.class_board_state;
create policy "class board state can be written"
on public.class_board_state
for insert
to anon
with check (id = 'main');

drop policy if exists "class board state can be updated" on public.class_board_state;
create policy "class board state can be updated"
on public.class_board_state
for update
to anon
using (id = 'main')
with check (id = 'main');
