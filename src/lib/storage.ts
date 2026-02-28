import {
  TeacherConfig,
  StudentProgress,
  ChatMessage,
  DEFAULT_TEACHER_CONFIG,
  DEFAULT_STUDENT_PROGRESS,
} from "./types";

const KEYS = {
  TEACHER_CONFIG: "riseva_teacher_config",
  STUDENT_PROGRESS: "riseva_student_progress",
  CHAT_HISTORY: "riseva_chat_history",
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
    // storage full or unavailable
  }
}

export function getTeacherConfig(): TeacherConfig {
  return safeGet(KEYS.TEACHER_CONFIG, DEFAULT_TEACHER_CONFIG);
}

export function saveTeacherConfig(config: TeacherConfig): void {
  safeSet(KEYS.TEACHER_CONFIG, config);
}

export function getStudentProgress(): StudentProgress {
  return safeGet(KEYS.STUDENT_PROGRESS, DEFAULT_STUDENT_PROGRESS);
}

export function saveStudentProgress(progress: StudentProgress): void {
  safeSet(KEYS.STUDENT_PROGRESS, progress);
}

export function getChatHistory(): ChatMessage[] {
  return safeGet<ChatMessage[]>(KEYS.CHAT_HISTORY, []);
}

export function saveChatHistory(messages: ChatMessage[]): void {
  safeSet(KEYS.CHAT_HISTORY, messages);
}

export function clearChatHistory(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(KEYS.CHAT_HISTORY);
}
