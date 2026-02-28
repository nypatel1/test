-- COMPLETE FIX: Break RLS circular dependency using security definer functions
-- Run this in Supabase SQL Editor

-- Step 1: Disable RLS and drop all policies
alter table public.profiles disable row level security;
alter table public.courses disable row level security;
alter table public.units disable row level security;
alter table public.enrollments disable row level security;
alter table public.chat_sessions disable row level security;
alter table public.materials disable row level security;

do $$
declare r record;
begin
  for r in (select policyname, tablename from pg_policies where schemaname = 'public') loop
    execute format('drop policy if exists %I on public.%I', r.policyname, r.tablename);
  end loop;
end $$;

-- Step 2: Create helper functions that bypass RLS (security definer)
-- These avoid the circular dependency between courses <-> enrollments

create or replace function public.get_my_course_ids()
returns setof uuid
language sql
security definer
stable
as $$
  select id from public.courses where teacher_id = auth.uid()
$$;

create or replace function public.get_my_enrolled_course_ids()
returns setof uuid
language sql
security definer
stable
as $$
  select course_id from public.enrollments where student_id = auth.uid()
$$;

create or replace function public.get_my_unit_ids()
returns setof uuid
language sql
security definer
stable
as $$
  select u.id from public.units u
  where u.course_id in (select id from public.courses where teacher_id = auth.uid())
$$;

create or replace function public.get_my_enrolled_unit_ids()
returns setof uuid
language sql
security definer
stable
as $$
  select u.id from public.units u
  where u.course_id in (select course_id from public.enrollments where student_id = auth.uid())
$$;

-- Step 3: Re-enable RLS
alter table public.profiles enable row level security;
alter table public.courses enable row level security;
alter table public.units enable row level security;
alter table public.enrollments enable row level security;
alter table public.chat_sessions enable row level security;
alter table public.materials enable row level security;

-- Step 4: Create policies using the helper functions (no cross-table references)

-- Profiles
create policy "profiles_select" on public.profiles for select using (auth.uid() = id);
create policy "profiles_insert" on public.profiles for insert with check (auth.uid() = id);
create policy "profiles_update" on public.profiles for update using (auth.uid() = id);

-- Courses
create policy "courses_teacher" on public.courses for all using (auth.uid() = teacher_id);
create policy "courses_student" on public.courses for select using (id in (select public.get_my_enrolled_course_ids()));

-- Enrollments
create policy "enrollments_student" on public.enrollments for all using (auth.uid() = student_id);
create policy "enrollments_teacher" on public.enrollments for select using (course_id in (select public.get_my_course_ids()));

-- Units
create policy "units_teacher" on public.units for all using (course_id in (select public.get_my_course_ids()));
create policy "units_student" on public.units for select using (course_id in (select public.get_my_enrolled_course_ids()));

-- Chat sessions
create policy "sessions_student" on public.chat_sessions for all using (auth.uid() = student_id);
create policy "sessions_teacher" on public.chat_sessions for select using (unit_id in (select public.get_my_unit_ids()));

-- Materials
create policy "materials_teacher" on public.materials for all using (unit_id in (select public.get_my_unit_ids()));
create policy "materials_student" on public.materials for select using (unit_id in (select public.get_my_enrolled_unit_ids()));
