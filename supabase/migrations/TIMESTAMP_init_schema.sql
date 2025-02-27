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