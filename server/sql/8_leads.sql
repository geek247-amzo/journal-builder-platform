create table if not exists leads (
  id uuid primary key default gen_random_uuid(),
  name text,
  email text not null,
  company text,
  devices int not null,
  cybersecurity boolean not null default false,
  backup boolean not null default false,
  estimate_low numeric(12,2) not null default 0,
  estimate_high numeric(12,2) not null default 0,
  quote_public_id text,
  created_at timestamptz not null default now()
);

create index if not exists leads_email_idx on leads(email);
create index if not exists leads_created_at_idx on leads(created_at);

alter table leads enable row level security;

drop policy if exists leads_admin_read on leads;
create policy leads_admin_read on leads
for select
using (is_admin());

drop policy if exists leads_admin_insert on leads;
create policy leads_admin_insert on leads
for insert
with check (is_admin());
