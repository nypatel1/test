-- Fix infinite recursion in RLS policies
-- Run this in the Supabase SQL Editor

-- Drop the problematic policies
drop policy if exists "Teachers can manage own courses" on public.courses;
drop policy if exists "Students can read enrolled courses" on public.courses;
drop policy if exists "Students can manage own enrollments" on public.enrollments;
drop policy if exists "Teachers can read enrollments in own courses" on public.enrollments;
drop policy if exists "Teachers can manage units in own courses" on public.units;
drop policy if exists "Students can read enrolled units" on public.units;
drop policy if exists "Students can manage own sessions" on public.chat_sessions;
drop policy if exists "Teachers can read sessions in own units" on public.chat_sessions;
drop policy if exists "Teachers can manage materials in own units" on public.materials;
drop policy if exists "Students can read materials in enrolled units" on public.materials;

-- Courses: teachers full access, students read via direct enrollment lookup
create policy "Teachers manage own courses" on public.courses
  for all using (auth.uid() = teacher_id);

create policy "Students read enrolled courses" on public.courses
  for select using (
    id in (select course_id from public.enrollments where student_id = auth.uid())
  );

-- Units: use subquery style to avoid recursion
create policy "Teachers manage units" on public.units
  for all using (
    course_id in (select id from public.courses where teacher_id = auth.uid())
  );

create policy "Students read units" on public.units
  for select using (
    course_id in (select course_id from public.enrollments where student_id = auth.uid())
  );

-- Enrollments: students insert/read own, teachers read in their courses
create policy "Students manage enrollments" on public.enrollments
  for all using (auth.uid() = student_id);

create policy "Teachers read enrollments" on public.enrollments
  for select using (
    course_id in (select id from public.courses where teacher_id = auth.uid())
  );

-- Chat sessions: students manage own, teachers read in their units
create policy "Students manage sessions" on public.chat_sessions
  for all using (auth.uid() = student_id);

create policy "Teachers read sessions" on public.chat_sessions
  for select using (
    unit_id in (
      select u.id from public.units u
      where u.course_id in (select id from public.courses where teacher_id = auth.uid())
    )
  );

-- Materials: teachers manage in their units, students read enrolled
create policy "Teachers manage materials" on public.materials
  for all using (
    unit_id in (
      select u.id from public.units u
      where u.course_id in (select id from public.courses where teacher_id = auth.uid())
    )
  );

create policy "Students read materials" on public.materials
  for select using (
    unit_id in (
      select u.id from public.units u
      where u.course_id in (select course_id from public.enrollments where student_id = auth.uid())
    )
  );
