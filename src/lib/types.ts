export interface Course {
  id: string;
  name: string;
  createdAt: string;
}

export interface Unit {
  id: string;
  courseId: string;
  name: string;
  status: "active" | "upcoming";
  createdAt: string;
  config: UnitConfig;
}

export interface UnitConfig {
  approach: "socratic" | "step-by-step" | "conceptual" | "example-driven";
  scaffolding: number;
  responseLength: "concise" | "medium" | "detailed";
  tone: "encouraging" | "neutral" | "challenging";
  maxHints: number;
  objectives: Objective[];
  boundaries: Boundary[];
  capabilities: Capability[];
  allowedSources: string[];
  materials: CourseMaterial[];
}

export interface CourseMaterial {
  id: string;
  name: string;
  type: "pdf" | "txt" | "paste";
  content: string;
  addedAt: string;
  charCount: number;
}

export interface Objective {
  id: number;
  text: string;
  depth: string;
}

export interface Boundary {
  label: string;
  enabled: boolean;
  category: string;
}

export interface Capability {
  label: string;
  enabled: boolean;
}

export interface ChatMessage {
  id: string;
  role: "assistant" | "user";
  content: string;
  timestamp: string;
  type?: "normal" | "hint" | "practice" | "misconception";
}

export interface ChatSession {
  id: string;
  unitId: string;
  startedAt: string;
  messages: ChatMessage[];
  questionsAsked: number;
  totalTokensEstimate: number;
}

export interface AnalyticsEvent {
  unitId: string;
  timestamp: string;
  type: "session_start" | "message_sent" | "session_end";
  durationMinutes?: number;
  messageContent?: string;
}

export const DEFAULT_UNIT_CONFIG: UnitConfig = {
  approach: "socratic",
  scaffolding: 3,
  responseLength: "medium",
  tone: "encouraging",
  maxHints: 3,
  objectives: [],
  boundaries: [
    { label: "Never provide direct answers to assessment questions", enabled: true, category: "Safety" },
    { label: "Don't write essays or complete assignments for students", enabled: true, category: "Safety" },
    { label: "Restrict to unit-specific topics only", enabled: true, category: "Alignment" },
    { label: "Always ask a follow-up question after explaining", enabled: true, category: "Mastery" },
    { label: "Allow students to request practice problems", enabled: true, category: "Mastery" },
    { label: "Redirect off-topic questions back to unit material", enabled: true, category: "Alignment" },
  ],
  capabilities: [
    { label: "Generate practice problems", enabled: true },
    { label: "Create concept breakdowns", enabled: true },
    { label: "Adaptive difficulty adjustment", enabled: true },
    { label: "Multiple explanation styles", enabled: true },
  ],
  allowedSources: [],
  materials: [],
};
