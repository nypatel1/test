-- Fix: Allow students to join courses by class code
-- The problem is students can't read courses table before enrolling
-- Solution: a security definer function that handles the entire join

create or replace function public.join_course_by_code(code text)
returns uuid
language plpgsql
security definer
as $$
declare
  found_course_id uuid;
begin
  -- Look up the course (bypasses RLS)
  select id into found_course_id
  from public.courses
  where class_code = upper(trim(code));

  if found_course_id is null then
    raise exception 'Invalid class code';
  end if;

  -- Check if already enrolled
  if exists (
    select 1 from public.enrollments
    where student_id = auth.uid() and course_id = found_course_id
  ) then
    raise exception 'Already enrolled in this course';
  end if;

  -- Enroll the student
  insert into public.enrollments (student_id, course_id)
  values (auth.uid(), found_course_id);

  return found_course_id;
end;
$$;
