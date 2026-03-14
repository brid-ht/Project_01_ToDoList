-- 极简待办清单 - 待办任务表
-- 在 Supabase Dashboard → SQL Editor 中执行此脚本

create table if not exists public.todos (
  id uuid primary key default gen_random_uuid(),
  content text not null,
  completed boolean not null default false,
  created_at timestamptz not null default now()
);

-- 启用 Row Level Security (RLS)
alter table public.todos enable row level security;

-- 策略：允许匿名读写（演示/单用户）；多用户时可改为 using (auth.uid() = user_id)
create policy "Allow all for todos"
  on public.todos
  for all
  using (true)
  with check (true);

-- 索引：按创建时间倒序查列表
create index if not exists todos_created_at_idx on public.todos (created_at desc);

comment on table public.todos is '待办任务表';
comment on column public.todos.id is '主键';
comment on column public.todos.content is '任务内容';
comment on column public.todos.completed is '是否已完成';
comment on column public.todos.created_at is '创建时间';
