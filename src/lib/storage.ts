import {
  Course,
  Unit,
  ChatSession,
  AnalyticsEvent,
  DEFAULT_UNIT_CONFIG,
} from "./types";

const KEYS = {
  COURSES: "riseva_courses",
  UNITS: "riseva_units",
  SESSIONS: "riseva_sessions",
  ANALYTICS: "riseva_analytics",
  ACTIVE_SESSION: "riseva_active_session",
};

function safeGet<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function safeSet(key: string, value: unknown): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // storage quota exceeded
  }
}

// ── Courses ──

export function getCourses(): Course[] {
  return safeGet<Course[]>(KEYS.COURSES, []);
}

export function saveCourses(courses: Course[]): void {
  safeSet(KEYS.COURSES, courses);
}

export function addCourse(name: string): Course {
  const course: Course = {
    id: Date.now().toString(36) + Math.random().toString(36).slice(2),
    name,
    createdAt: new Date().toISOString(),
  };
  const courses = getCourses();
  courses.push(course);
  saveCourses(courses);
  return course;
}

export function deleteCourse(id: string): void {
  saveCourses(getCourses().filter((c) => c.id !== id));
  saveUnits(getUnits().filter((u) => u.courseId !== id));
}

// ── Units ──

export function getUnits(): Unit[] {
  return safeGet<Unit[]>(KEYS.UNITS, []);
}

export function saveUnits(units: Unit[]): void {
  safeSet(KEYS.UNITS, units);
}

export function getUnit(id: string): Unit | undefined {
  return getUnits().find((u) => u.id === id);
}

export function getUnitsByCourse(courseId: string): Unit[] {
  return getUnits().filter((u) => u.courseId === courseId);
}

export function addUnit(courseId: string, name: string): Unit {
  const unit: Unit = {
    id: Date.now().toString(36) + Math.random().toString(36).slice(2),
    courseId,
    name,
    status: "active",
    createdAt: new Date().toISOString(),
    config: { ...DEFAULT_UNIT_CONFIG, objectives: [], allowedSources: [] },
  };
  const units = getUnits();
  units.push(unit);
  saveUnits(units);
  return unit;
}

export function updateUnit(id: string, updates: Partial<Unit>): void {
  const units = getUnits();
  const idx = units.findIndex((u) => u.id === id);
  if (idx >= 0) {
    units[idx] = { ...units[idx], ...updates };
    saveUnits(units);
  }
}

export function deleteUnit(id: string): void {
  saveUnits(getUnits().filter((u) => u.id !== id));
  // also clean up sessions for that unit
  saveSessions(getSessions().filter((s) => s.unitId !== id));
}

// ── Chat Sessions ──

export function getSessions(): ChatSession[] {
  return safeGet<ChatSession[]>(KEYS.SESSIONS, []);
}

export function saveSessions(sessions: ChatSession[]): void {
  safeSet(KEYS.SESSIONS, sessions);
}

export function getSessionsByUnit(unitId: string): ChatSession[] {
  return getSessions().filter((s) => s.unitId === unitId);
}

export function getActiveSession(): ChatSession | null {
  return safeGet<ChatSession | null>(KEYS.ACTIVE_SESSION, null);
}

export function startSession(unitId: string): ChatSession {
  const session: ChatSession = {
    id: Date.now().toString(36) + Math.random().toString(36).slice(2),
    unitId,
    startedAt: new Date().toISOString(),
    messages: [],
    questionsAsked: 0,
    totalTokensEstimate: 0,
  };
  safeSet(KEYS.ACTIVE_SESSION, session);
  logAnalytics({ unitId, timestamp: new Date().toISOString(), type: "session_start" });
  return session;
}

export function updateActiveSession(session: ChatSession): void {
  safeSet(KEYS.ACTIVE_SESSION, session);
}

export function endSession(): void {
  const active = getActiveSession();
  if (active && active.messages.length > 0) {
    const sessions = getSessions();
    sessions.push(active);
    saveSessions(sessions);

    const startTime = new Date(active.startedAt).getTime();
    const duration = Math.round((Date.now() - startTime) / 60000);
    logAnalytics({
      unitId: active.unitId,
      timestamp: new Date().toISOString(),
      type: "session_end",
      durationMinutes: duration,
    });
  }
  if (typeof window !== "undefined") {
    localStorage.removeItem(KEYS.ACTIVE_SESSION);
  }
}

// ── Analytics ──

export function getAnalytics(): AnalyticsEvent[] {
  return safeGet<AnalyticsEvent[]>(KEYS.ANALYTICS, []);
}

export function logAnalytics(event: AnalyticsEvent): void {
  const events = getAnalytics();
  events.push(event);
  safeSet(KEYS.ANALYTICS, events);
}

// ── Derived Data ──

export function getUnitStats(unitId: string) {
  const sessions = getSessionsByUnit(unitId);
  const totalSessions = sessions.length;
  const totalMessages = sessions.reduce((sum, s) => sum + s.messages.length, 0);
  const totalQuestions = sessions.reduce((sum, s) => sum + s.questionsAsked, 0);

  const analytics = getAnalytics().filter((a) => a.unitId === unitId);
  const sessionEnds = analytics.filter((a) => a.type === "session_end");
  const totalMinutes = sessionEnds.reduce((sum, a) => sum + (a.durationMinutes || 0), 0);
  const avgMinutes = sessionEnds.length > 0 ? Math.round(totalMinutes / sessionEnds.length) : 0;

  return { totalSessions, totalMessages, totalQuestions, totalMinutes, avgMinutes };
}

export function getAllStats() {
  const sessions = getSessions();
  const active = getActiveSession();
  const analytics = getAnalytics();

  const totalSessions = sessions.length + (active ? 1 : 0);
  const totalMessages = sessions.reduce((sum, s) => sum + s.messages.length, 0);
  const sessionEnds = analytics.filter((a) => a.type === "session_end");
  const totalMinutes = sessionEnds.reduce((sum, a) => sum + (a.durationMinutes || 0), 0);

  const units = getUnits();
  const courses = getCourses();

  // Per-day session counts for the last 7 days
  const now = new Date();
  const dailySessions: { day: string; count: number; minutes: number; questions: number }[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    const dayStr = d.toLocaleDateString("en-US", { weekday: "short" });
    const dateStr = d.toISOString().slice(0, 10);

    const daySessions = sessions.filter(
      (s) => s.startedAt.slice(0, 10) === dateStr
    );
    const dayEnds = analytics.filter(
      (a) => a.type === "session_end" && a.timestamp.slice(0, 10) === dateStr
    );

    dailySessions.push({
      day: dayStr,
      count: daySessions.length,
      minutes: dayEnds.reduce((s, a) => s + (a.durationMinutes || 0), 0),
      questions: daySessions.reduce((s, sess) => s + sess.questionsAsked, 0),
    });
  }

  return {
    totalSessions,
    totalMessages,
    totalMinutes,
    totalCourses: courses.length,
    totalUnits: units.length,
    dailySessions,
  };
}
