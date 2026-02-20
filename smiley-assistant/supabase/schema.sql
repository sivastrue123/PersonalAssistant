-- Profiles table to store user details and state
create table public.profiles (
  id uuid references auth.users not null primary key,
  email text,
  display_name text,
  is_home_mode boolean default false,
  partner_id uuid references public.profiles(id),
  created_at timestamptz default now()
);

-- Messages for chat
create table public.messages (
  id uuid default gen_random_uuid() primary key,
  sender_id uuid references public.profiles(id) not null,
  content text not null,
  is_read boolean default false,
  created_at timestamptz default now()
);

-- Shared and private notes
create table public.notes (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) not null,
  title text,
  content text,
  is_shared boolean default false,
  created_at timestamptz default now()
);

-- Important dates (exams, leave, travel)
create table public.important_dates (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) not null,
  title text not null,
  date date not null,
  type text check (type in ('exam', 'leave', 'travel', 'anniversary', 'other')) default 'other',
  is_shared boolean default true,
  created_at timestamptz default now()
);

-- Water intake logs
create table public.water_logs (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) not null,
  glasses int default 0,
  date date default current_date,
  unique(user_id, date)
);

-- Row Level Security (RLS) setup

alter table public.profiles enable row level security;
alter table public.messages enable row level security;
alter table public.notes enable row level security;
alter table public.important_dates enable row level security;
alter table public.water_logs enable row level security;

-- Policies

-- Profiles: Everyone can read everyone (in a 2-person app context)
create policy "Public profiles are viewable by everyone."
  on public.profiles for select
  using ( true );

create policy "Users can insert their own profile."
  on public.profiles for insert
  with check ( auth.uid() = id );

create policy "Users can update own profile."
  on public.profiles for update
  using ( auth.uid() = id );

-- Messages: Authenticated users can read all messages
create policy "Authenticated users can read messages."
  on public.messages for select
  using ( auth.role() = 'authenticated' );

create policy "Users can insert their own messages."
  on public.messages for insert
  with check ( auth.uid() = sender_id );

-- Notes: Read if own or shared
create policy "Users can read own or shared notes."
  on public.notes for select
  using ( auth.uid() = user_id or is_shared = true );

create policy "Users can insert own notes."
  on public.notes for insert
  with check ( auth.uid() = user_id );

create policy "Users can update own notes."
  on public.notes for update
  using ( auth.uid() = user_id );

create policy "Users can delete own notes."
  on public.notes for delete
  using ( auth.uid() = user_id );

-- Important Dates: Read all, edit own
create policy "Authenticated users can read all dates."
  on public.important_dates for select
  using ( auth.role() = 'authenticated' );

create policy "Users can insert own dates."
  on public.important_dates for insert
  with check ( auth.uid() = user_id );

create policy "Users can update own dates."
  on public.important_dates for update
  using ( auth.uid() = user_id );

create policy "Users can delete own dates."
  on public.important_dates for delete
  using ( auth.uid() = user_id );

-- Water Logs: Read all (for support), edit own
create policy "Authenticated users can read all water logs."
  on public.water_logs for select
  using ( auth.role() = 'authenticated' );

create policy "Users can insert own water logs."
  on public.water_logs for insert
  with check ( auth.uid() = user_id );

create policy "Users can update own water logs."
  on public.water_logs for update
  using ( auth.uid() = user_id );


-- Function to handle new user creation
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, display_name)
  values (new.id, new.email, new.raw_user_meta_data->>'full_name');
  return new;
end;
$$ language plpgsql security definer;

-- Trigger for new user creation
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
