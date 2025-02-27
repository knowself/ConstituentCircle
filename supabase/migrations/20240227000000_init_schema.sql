-- Create tables for core functionality
create table representatives (
  id uuid default uuid_generate_v4() primary key,
  email text unique not null,
  full_name text not null,
  district text,
  office_type text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table constituents (
  id uuid default uuid_generate_v4() primary key,
  email text unique,
  full_name text not null,
  district text,
  preferences jsonb default '{}'::jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table communications (
  id uuid default uuid_generate_v4() primary key,
  representative_id uuid references representatives(id),
  constituent_id uuid references constituents(id),
  message_type text not null,
  content text not null,
  channel text not null,
  status text default 'pending',
  sent_at timestamp with time zone,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security (RLS)
alter table representatives enable row level security;
alter table constituents enable row level security;
alter table communications enable row level security;

-- Add indexes for better query performance
create index idx_representatives_email on representatives(email);
create index idx_constituents_email on constituents(email);
create index idx_communications_status on communications(status);
create index idx_communications_sent_at on communications(sent_at);

-- Create RLS policies
-- Representatives can only access their own data
create policy "Representatives can view own data"
  on representatives for select
  using (auth.uid() = id);

create policy "Representatives can update own data"
  on representatives for update
  using (auth.uid() = id);

-- Constituents policies
create policy "Constituents can view own data"
  on constituents for select
  using (auth.uid() = id);

create policy "Constituents can update own data"
  on constituents for update
  using (auth.uid() = id);

-- Communications policies
create policy "Representatives can view related communications"
  on communications for select
  using (auth.uid() = representative_id);

create policy "Constituents can view their communications"
  on communications for select
  using (auth.uid() = constituent_id);

create policy "Representatives can create communications"
  on communications for insert
  with check (auth.uid() = representative_id);