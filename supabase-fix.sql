-- NUCLEAR FIX: Drop ALL existing policies and recreate them
-- Run this in Supabase SQL Editor

-- First, disable RLS temporarily to drop policies cleanly
alter table public.courses disable row level security;
alter table public.units disable row level security;
alter table public.enrollments disable row level security;
alter table public.chat_sessions disable row level security;
alter table public.materials disable row level security;
alter table public.profiles disable row level security;

-- Drop ALL policies on all tables (by querying pg_policies)
do $$
declare
  r record;
begin
  for r in (
    select policyname, tablename
    from pg_policies
    where schemaname = 'public'
  ) loop
    execute format('drop policy if exists %I on public.%I', r.policyname, r.tablename);
  end loop;
end $$;

-- Re-enable RLS
alter table public.profiles enable row level security;
alter table public.courses enable row level security;
alter table public.units enable row level security;
alter table public.enrollments enable row level security;
alter table public.chat_sessions enable row level security;
alter table public.materials enable row level security;

-- PROFILES: users can read/insert/update their own profile
create policy "profiles_select" on public.profiles for select using (auth.uid() = id);
create policy "profiles_insert" on public.profiles for insert with check (auth.uid() = id);
create policy "profiles_update" on public.profiles for update using (auth.uid() = id);

-- COURSES: teachers have full access to their own courses
create policy "courses_teacher" on public.courses for all using (auth.uid() = teacher_id);
-- Students can read courses they are enrolled in (simple subquery, no joins)
create policy "courses_student" on public.courses for select using (
  id in (select course_id from public.enrollments where student_id = auth.uid())
);

-- ENROLLMENTS: students manage their own, teachers can read theirs
create policy "enrollments_student" on public.enrollments for all using (auth.uid() = student_id);
create policy "enrollments_teacher" on public.enrollments for select using (
  course_id in (select id from public.courses where teacher_id = auth.uid())
);

-- UNITS: teachers manage units in their courses, students read enrolled
create policy "units_teacher" on public.units for all using (
  course_id in (select id from public.courses where teacher_id = auth.uid())
);
create policy "units_student" on public.units for select using (
  course_id in (select course_id from public.enrollments where student_id = auth.uid())
);

-- CHAT_SESSIONS: students manage own, teachers read theirs
create policy "sessions_student" on public.chat_sessions for all using (auth.uid() = student_id);
create policy "sessions_teacher" on public.chat_sessions for select using (
  unit_id in (
    select id from public.units where course_id in (
      select id from public.courses where teacher_id = auth.uid()
    )
  )
);

-- MATERIALS: teachers manage, students read
create policy "materials_teacher" on public.materials for all using (
  unit_id in (
    select id from public.units where course_id in (
      select id from public.courses where teacher_id = auth.uid()
    )
  )
);
create policy "materials_student" on public.materials for select using (
  unit_id in (
    select id from public.units where course_id in (
      select course_id from public.enrollments where student_id = auth.uid()
    )
  )
);
