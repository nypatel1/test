import { supabase } from "./supabase";
import { DEFAULT_UNIT_CONFIG, UnitConfig } from "./types";

// ── Courses ──

export async function getCourses(teacherId: string) {
  const { data } = await supabase
    .from("courses")
    .select("*")
    .eq("teacher_id", teacherId)
    .order("created_at", { ascending: false });
  return data || [];
}

export async function getStudentCourses(studentId: string) {
  const { data } = await supabase
    .from("enrollments")
    .select("course_id, courses(*)")
    .eq("student_id", studentId);
  return data?.map((e: { courses: unknown }) => e.courses).filter(Boolean) || [];
}

function generateClassCode() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";
  for (let i = 0; i < 6; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
}

export async function createCourse(teacherId: string, name: string) {
  const { data, error } = await supabase
    .from("courses")
    .insert({ teacher_id: teacherId, name, class_code: generateClassCode() })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function deleteCourse(courseId: string) {
  const { error } = await supabase.from("courses").delete().eq("id", courseId);
  if (error) throw error;
}

// ── Units ──

export async function getUnits(courseId: string) {
  const { data } = await supabase
    .from("units")
    .select("*")
    .eq("course_id", courseId)
    .order("created_at", { ascending: true });
  return (data || []).map((u: { config: unknown }) => ({
    ...u,
    config: { ...DEFAULT_UNIT_CONFIG, ...(u.config as object) },
  }));
}

export async function getAllTeacherUnits(teacherId: string) {
  const { data } = await supabase
    .from("units")
    .select("*, courses!inner(teacher_id)")
    .eq("courses.teacher_id", teacherId);
  return (data || []).map((u: { config: unknown }) => ({
    ...u,
    config: { ...DEFAULT_UNIT_CONFIG, ...(u.config as object) },
  }));
}

export async function getUnit(unitId: string) {
  const { data } = await supabase
    .from("units")
    .select("*, courses(name, teacher_id, class_code)")
    .eq("id", unitId)
    .single();
  if (!data) return null;
  return {
    ...data,
    config: { ...DEFAULT_UNIT_CONFIG, ...(data.config as object) },
  };
}

export async function createUnit(courseId: string, name: string) {
  const { data, error } = await supabase
    .from("units")
    .insert({ course_id: courseId, name, config: DEFAULT_UNIT_CONFIG })
    .select()
    .single();
  if (error) throw error;
  return { ...data, config: { ...DEFAULT_UNIT_CONFIG, ...(data.config as object) } };
}

export async function updateUnitConfig(unitId: string, config: UnitConfig) {
  const { error } = await supabase
    .from("units")
    .update({ config })
    .eq("id", unitId);
  if (error) throw error;
}

export async function deleteUnit(unitId: string) {
  const { error } = await supabase.from("units").delete().eq("id", unitId);
  if (error) throw error;
}

// ── Enrollments ──

export async function joinCourse(studentId: string, classCode: string) {
  const { data: course } = await supabase
    .from("courses")
    .select("id")
    .eq("class_code", classCode.toUpperCase().trim())
    .single();

  if (!course) throw new Error("Invalid class code");

  const { error } = await supabase
    .from("enrollments")
    .insert({ student_id: studentId, course_id: course.id });

  if (error) {
    if (error.code === "23505") throw new Error("Already enrolled in this course");
    throw error;
  }
  return course;
}

export async function getEnrollments(courseId: string) {
  const { data } = await supabase
    .from("enrollments")
    .select("*, profiles(full_name, email)")
    .eq("course_id", courseId);
  return data || [];
}

// ── Chat Sessions ──

export async function createChatSession(studentId: string, unitId: string) {
  const { data, error } = await supabase
    .from("chat_sessions")
    .insert({ student_id: studentId, unit_id: unitId })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function updateChatSession(
  sessionId: string,
  updates: { messages?: unknown[]; questions_asked?: number; duration_minutes?: number; ended_at?: string }
) {
  const { error } = await supabase
    .from("chat_sessions")
    .update(updates)
    .eq("id", sessionId);
  if (error) throw error;
}

export async function getSessionsByUnit(unitId: string) {
  const { data } = await supabase
    .from("chat_sessions")
    .select("*, profiles(full_name)")
    .eq("unit_id", unitId)
    .order("started_at", { ascending: false });
  return data || [];
}

export async function getTeacherSessions(teacherId: string) {
  const { data } = await supabase
    .from("chat_sessions")
    .select("*, units!inner(name, courses!inner(teacher_id)), profiles(full_name)")
    .eq("units.courses.teacher_id", teacherId)
    .order("started_at", { ascending: false })
    .limit(50);
  return data || [];
}

export async function getStudentSessions(studentId: string) {
  const { data } = await supabase
    .from("chat_sessions")
    .select("*, units(name)")
    .eq("student_id", studentId)
    .order("started_at", { ascending: false });
  return data || [];
}

// ── Materials ──

export async function getMaterials(unitId: string) {
  const { data } = await supabase
    .from("materials")
    .select("*")
    .eq("unit_id", unitId)
    .order("added_at", { ascending: true });
  return data || [];
}

export async function addMaterial(
  unitId: string,
  name: string,
  type: string,
  content: string
) {
  const { data, error } = await supabase
    .from("materials")
    .insert({ unit_id: unitId, name, type, content, char_count: content.length })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function deleteMaterial(materialId: string) {
  const { error } = await supabase.from("materials").delete().eq("id", materialId);
  if (error) throw error;
}
