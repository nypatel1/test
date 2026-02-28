export interface TeacherConfig {
  approach: "socratic" | "step-by-step" | "conceptual" | "example-driven";
  scaffolding: number;
  responseLength: "concise" | "medium" | "detailed";
  tone: "encouraging" | "neutral" | "challenging";
  maxHints: number;
  boundaries: BoundaryItem[];
  capabilities: CapabilityItem[];
  objectives: ObjectiveItem[];
  allowedSources: string[];
  unitName: string;
  courseName: string;
}

export interface BoundaryItem {
  label: string;
  enabled: boolean;
  category: string;
}

export interface CapabilityItem {
  label: string;
  enabled: boolean;
}

export interface ObjectiveItem {
  id: number;
  text: string;
  depth: string;
  mastery: number;
}

export interface ChatMessage {
  id: string;
  role: "assistant" | "user";
  content: string;
  timestamp: string;
  type?: "normal" | "hint" | "practice" | "misconception";
}

export interface StudentProgress {
  unitId: string;
  mastery: number;
  sessionsCount: number;
  questionsAsked: number;
  correctResponses: number;
  totalTimeMinutes: number;
  objectivesCompleted: number[];
  lastSession: string;
  chatHistory: ChatMessage[];
}

export const DEFAULT_TEACHER_CONFIG: TeacherConfig = {
  approach: "socratic",
  scaffolding: 3,
  responseLength: "medium",
  tone: "encouraging",
  maxHints: 3,
  unitName: "Cell Division & Mitosis",
  courseName: "AP Biology",
  objectives: [
    { id: 1, text: "Describe the stages of mitosis and their key events", depth: "Explain", mastery: 78 },
    { id: 2, text: "Compare and contrast mitosis and meiosis", depth: "Analyze", mastery: 54 },
    { id: 3, text: "Explain the role of checkpoints in cell cycle regulation", depth: "Explain", mastery: 71 },
    { id: 4, text: "Predict outcomes of errors in cell division", depth: "Apply", mastery: 45 },
    { id: 5, text: "Connect cell division to growth, repair, and reproduction", depth: "Synthesize", mastery: 82 },
    { id: 6, text: "Interpret microscope images of dividing cells", depth: "Apply", mastery: 69 },
  ],
  boundaries: [
    { label: "Never provide direct answers to assessment questions", enabled: true, category: "Safety" },
    { label: "Don't write essays or complete assignments for students", enabled: true, category: "Safety" },
    { label: "Restrict to unit-specific topics only", enabled: true, category: "Alignment" },
    { label: "Always ask a follow-up question after explaining a concept", enabled: true, category: "Mastery" },
    { label: "Allow students to request practice problems", enabled: true, category: "Mastery" },
    { label: "Allow access to supplementary materials beyond textbook", enabled: false, category: "Alignment" },
    { label: "Flag student if they ask for direct answers 3+ times", enabled: true, category: "Safety" },
    { label: "Block essay writing or assignment completion requests", enabled: true, category: "Safety" },
    { label: "Redirect off-topic questions back to unit material", enabled: true, category: "Alignment" },
    { label: "Log all interactions for teacher review", enabled: true, category: "Oversight" },
  ],
  capabilities: [
    { label: "Generate practice problems", enabled: true },
    { label: "Create concept breakdowns", enabled: true },
    { label: "Adaptive difficulty adjustment", enabled: true },
    { label: "Multiple explanation styles", enabled: true },
    { label: "Visual diagram descriptions", enabled: false },
    { label: "Study plan recommendations", enabled: false },
  ],
  allowedSources: [
    "Campbell Biology (Ch. 12)",
    "Class Lecture Notes — Week 6-7",
    "Lab Manual: Mitosis Observation",
    "AP Bio College Board Unit 5",
  ],
};

export const DEFAULT_STUDENT_PROGRESS: StudentProgress = {
  unitId: "cell-division",
  mastery: 72,
  sessionsCount: 8,
  questionsAsked: 0,
  correctResponses: 0,
  totalTimeMinutes: 42,
  objectivesCompleted: [1, 3, 5],
  lastSession: new Date().toISOString(),
  chatHistory: [],
};
