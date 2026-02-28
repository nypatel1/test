-- Riseva Database Schema
-- Run this in the Supabase SQL Editor (supabase.com → your project → SQL Editor)

-- Profiles table (extends Supabase auth.users)
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text not null,
  full_name text not null,
  role text not null check (role in ('teacher', 'student')),
  created_at timestamptz default now()
);

-- Courses created by teachers
create table public.courses (
  id uuid default gen_random_uuid() primary key,
  teacher_id uuid references public.profiles(id) on delete cascade not null,
  name text not null,
  class_code text unique not null,
  created_at timestamptz default now()
);

-- Units within courses
create table public.units (
  id uuid default gen_random_uuid() primary key,
  course_id uuid references public.courses(id) on delete cascade not null,
  name text not null,
  status text default 'active' check (status in ('active', 'upcoming')),
  config jsonb default '{}'::jsonb,
  created_at timestamptz default now()
);

-- Student enrollments (students join courses via class code)
create table public.enrollments (
  id uuid default gen_random_uuid() primary key,
  student_id uuid references public.profiles(id) on delete cascade not null,
  course_id uuid references public.courses(id) on delete cascade not null,
  enrolled_at timestamptz default now(),
  unique(student_id, course_id)
);

-- Chat sessions
create table public.chat_sessions (
  id uuid default gen_random_uuid() primary key,
  student_id uuid references public.profiles(id) on delete cascade not null,
  unit_id uuid references public.units(id) on delete cascade not null,
  messages jsonb default '[]'::jsonb,
  questions_asked integer default 0,
  duration_minutes integer default 0,
  started_at timestamptz default now(),
  ended_at timestamptz
);

-- Course materials (uploaded by teachers)
create table public.materials (
  id uuid default gen_random_uuid() primary key,
  unit_id uuid references public.units(id) on delete cascade not null,
  name text not null,
  type text not null check (type in ('pdf', 'txt', 'paste')),
  content text not null,
  char_count integer default 0,
  added_at timestamptz default now()
);

-- Enable Row Level Security on all tables
alter table public.profiles enable row level security;
alter table public.courses enable row level security;
alter table public.units enable row level security;
alter table public.enrollments enable row level security;
alter table public.chat_sessions enable row level security;
alter table public.materials enable row level security;

-- Profiles: users can read their own profile, insert on signup
create policy "Users can read own profile" on public.profiles
  for select using (auth.uid() = id);

create policy "Users can insert own profile" on public.profiles
  for insert with check (auth.uid() = id);

create policy "Users can update own profile" on public.profiles
  for update using (auth.uid() = id);

-- Courses: teachers can CRUD their own courses, students can read enrolled courses
create policy "Teachers can manage own courses" on public.courses
  for all using (auth.uid() = teacher_id);

create policy "Students can read enrolled courses" on public.courses
  for select using (
    exists (
      select 1 from public.enrollments
      where enrollments.course_id = courses.id
      and enrollments.student_id = auth.uid()
    )
  );

-- Units: teachers can manage units in their courses, students can read enrolled units
create policy "Teachers can manage units in own courses" on public.units
  for all using (
    exists (
      select 1 from public.courses
      where courses.id = units.course_id
      and courses.teacher_id = auth.uid()
    )
  );

create policy "Students can read enrolled units" on public.units
  for select using (
    exists (
      select 1 from public.enrollments e
      join public.courses c on c.id = e.course_id
      where c.id = units.course_id
      and e.student_id = auth.uid()
    )
  );

-- Enrollments: students can manage own enrollments, teachers can read enrollments in their courses
create policy "Students can manage own enrollments" on public.enrollments
  for all using (auth.uid() = student_id);

create policy "Teachers can read enrollments in own courses" on public.enrollments
  for select using (
    exists (
      select 1 from public.courses
      where courses.id = enrollments.course_id
      and courses.teacher_id = auth.uid()
    )
  );

-- Chat sessions: students can manage own sessions, teachers can read sessions in their units
create policy "Students can manage own sessions" on public.chat_sessions
  for all using (auth.uid() = student_id);

create policy "Teachers can read sessions in own units" on public.chat_sessions
  for select using (
    exists (
      select 1 from public.units u
      join public.courses c on c.id = u.course_id
      where u.id = chat_sessions.unit_id
      and c.teacher_id = auth.uid()
    )
  );

-- Materials: teachers can manage materials in their units, students can read
create policy "Teachers can manage materials in own units" on public.materials
  for all using (
    exists (
      select 1 from public.units u
      join public.courses c on c.id = u.course_id
      where u.id = materials.unit_id
      and c.teacher_id = auth.uid()
    )
  );

create policy "Students can read materials in enrolled units" on public.materials
  for select using (
    exists (
      select 1 from public.units u
      join public.enrollments e on e.course_id = u.course_id
      where u.id = materials.unit_id
      and e.student_id = auth.uid()
    )
  );

-- Function to auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name, role)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', ''),
    coalesce(new.raw_user_meta_data->>'role', 'student')
  );
  return new;
end;
$$ language plpgsql security definer;

-- Trigger to auto-create profile
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
