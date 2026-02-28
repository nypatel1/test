"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  Brain,
  Send,
  Target,
  Lightbulb,
  ArrowLeft,
  CheckCircle2,
  Circle,
  Sparkles,
  Shield,
  RotateCcw,
  HelpCircle,
  FlaskConical,
  Trash2,
  WifiOff,
} from "lucide-react";
import { ChatMessage, TeacherConfig, DEFAULT_TEACHER_CONFIG } from "@/lib/types";
import {
  getTeacherConfig,
  getChatHistory,
  saveChatHistory,
  clearChatHistory,
  getStudentProgress,
  saveStudentProgress,
} from "@/lib/storage";

const MOCK_RESPONSES: Record<string, string> = {
  default:
    "That's a great question! Let me help you think through this. **Cell division** is fundamental to life — every organism depends on it for growth, repair, and reproduction.\n\nLet's start here: *Why* do you think cells need to divide in the first place? What would happen if they just kept growing larger instead?",
  "Explain differently":
    "Let me try a different angle! 🔄\n\nThink of **mitosis** like a photocopy machine — you put in one page and get an exact copy. Both copies are identical, with the same 46 chromosomes.\n\n**Meiosis** is like shuffling a deck of cards and dealing 4 hands — each hand is unique and has only half the cards (23 chromosomes).\n\nDoes that analogy help? What part would you like to explore more?",
  "Give me a hint":
    "💡 Here's a hint: Think about what happens at **fertilization**. If a sperm (from meiosis) meets an egg (from meiosis), and each has 23 chromosomes... what happens to the chromosome count in the resulting embryo?\n\nThis might help you understand *why* meiosis needs to halve the number!",
  "Practice problem":
    "📝 Let's practice!\n\n**A plant cell has 24 chromosomes. A student claims that after meiosis, each resulting cell would have 12 chromosomes, and after mitosis, they'd each have 24.**\n\nIs the student correct about both claims? Walk me through your reasoning for each one.",
  "Why is this important?":
    "Great question! 🌍 Understanding cell division is fundamental because:\n\n1. **Mitosis** is how your body **grows and repairs** — every time you heal a cut, mitosis is at work\n2. **Meiosis** creates **genetic diversity** — it's why siblings aren't identical\n3. **Errors** in cell division can lead to conditions like **Down syndrome** (extra chromosome) or **cancer** (uncontrolled mitosis)\n\nThis connects directly to our learning objective about predicting outcomes of division errors. Want to explore that?",
};

const objectives = [
  { text: "Describe stages of mitosis", completed: true },
  { text: "Compare mitosis and meiosis", completed: false },
  { text: "Cell cycle checkpoints", completed: true },
  { text: "Division errors", completed: false },
  { text: "Growth & repair connection", completed: true },
  { text: "Interpret microscope images", completed: false },
];

const quickActions = [
  { label: "Explain differently", icon: RotateCcw },
  { label: "Give me a hint", icon: Lightbulb },
  { label: "Practice problem", icon: FlaskConical },
  { label: "Why is this important?", icon: HelpCircle },
];

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2);
}

function getTimestamp() {
  return new Date().toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
  });
}

export default function StudentChatPage() {
  const [config] = useState<TeacherConfig>(() => {
    if (typeof window !== "undefined") return getTeacherConfig();
    return DEFAULT_TEACHER_CONFIG;
  });
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    if (typeof window === "undefined") return [];
    const saved = getChatHistory();
    if (saved.length > 0) return saved;
    const cfg = getTeacherConfig();
    const welcome: ChatMessage = {
      id: generateId(),
      role: "assistant",
      content: `Hi there! I'm your AI tutor for **${cfg.unitName}** in ${cfg.courseName}. I'm here to help you learn — not to give you answers, but to guide you toward real understanding.\n\nLet's get started! What topic within ${cfg.unitName} would you like to explore, or should I pick a concept to work through together?`,
      timestamp: getTimestamp(),
      type: "normal",
    };
    saveChatHistory([welcome]);
    return [welcome];
  });
  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [usingMock, setUsingMock] = useState(false);
  const [sessionQuestions, setSessionQuestions] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendToAPI = useCallback(
    async (
      allMessages: ChatMessage[],
      onChunk: (text: string) => void,
      onDone: () => void,
      onError: () => void
    ) => {
      try {
        const apiMessages = allMessages.map((m) => ({
          role: m.role,
          content: m.content,
        }));

        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messages: apiMessages,
            teacherConfig: config,
          }),
        });

        if (res.status === 503) {
          setUsingMock(true);
          onError();
          return;
        }

        if (!res.ok) {
          onError();
          return;
        }

        const reader = res.body?.getReader();
        const decoder = new TextDecoder();

        if (!reader) {
          onError();
          return;
        }

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const text = decoder.decode(value);
          const lines = text.split("\n").filter((l) => l.startsWith("data: "));

          for (const line of lines) {
            const data = line.slice(6);
            if (data === "[DONE]") {
              onDone();
              return;
            }
            try {
              const parsed = JSON.parse(data);
              if (parsed.content) {
                onChunk(parsed.content);
              }
              if (parsed.error) {
                onError();
                return;
              }
            } catch {
              // skip malformed chunks
            }
          }
        }
        onDone();
      } catch {
        setUsingMock(true);
        onError();
      }
    },
    [config]
  );

  const sendMessage = async (content: string) => {
    if (!content.trim() || isStreaming) return;

    const userMsg: ChatMessage = {
      id: generateId(),
      role: "user",
      content: content.trim(),
      timestamp: getTimestamp(),
    };

    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setInput("");
    setSessionQuestions((q) => q + 1);
    setIsStreaming(true);

    const progress = getStudentProgress();
    progress.questionsAsked += 1;
    progress.lastSession = new Date().toISOString();
    saveStudentProgress(progress);

    if (usingMock) {
      const mockKey =
        content in MOCK_RESPONSES ? content : "default";
      const mockContent = MOCK_RESPONSES[mockKey];
      const aiMsg: ChatMessage = {
        id: generateId(),
        role: "assistant",
        content: mockContent,
        timestamp: getTimestamp(),
        type: content === "Give me a hint" ? "hint" : content === "Practice problem" ? "practice" : "normal",
      };

      await new Promise((r) => setTimeout(r, 800 + Math.random() * 1200));
      const final = [...updatedMessages, aiMsg];
      setMessages(final);
      saveChatHistory(final);
      setIsStreaming(false);
      return;
    }

    const placeholderMsg: ChatMessage = {
      id: generateId(),
      role: "assistant",
      content: "",
      timestamp: getTimestamp(),
      type: content === "Give me a hint" ? "hint" : content === "Practice problem" ? "practice" : "normal",
    };

    const withPlaceholder = [...updatedMessages, placeholderMsg];
    setMessages(withPlaceholder);

    let accumulated = "";

    await sendToAPI(
      updatedMessages,
      (chunk) => {
        accumulated += chunk;
        setMessages((prev) => {
          const updated = [...prev];
          const last = updated[updated.length - 1];
          if (last.id === placeholderMsg.id) {
            updated[updated.length - 1] = { ...last, content: accumulated };
          }
          return updated;
        });
      },
      () => {
        setMessages((prev) => {
          const final = [...prev];
          saveChatHistory(final);
          return final;
        });
        setIsStreaming(false);
      },
      () => {
        // Fallback to mock on error
        const mockKey = content in MOCK_RESPONSES ? content : "default";
        const aiMsg: ChatMessage = {
          id: placeholderMsg.id,
          role: "assistant",
          content: MOCK_RESPONSES[mockKey],
          timestamp: getTimestamp(),
          type: placeholderMsg.type,
        };
        const final = [...updatedMessages, aiMsg];
        setMessages(final);
        saveChatHistory(final);
        setIsStreaming(false);
      }
    );
  };

  const handleClear = () => {
    clearChatHistory();
    setSessionQuestions(0);
    const welcomeMsg: ChatMessage = {
      id: generateId(),
      role: "assistant",
      content: `Session cleared! Let's start fresh with **${config.unitName}**.\n\nWhat would you like to work on?`,
      timestamp: getTimestamp(),
      type: "normal",
    };
    setMessages([welcomeMsg]);
    saveChatHistory([welcomeMsg]);
  };

  return (
    <div className="h-screen flex bg-background">
      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Chat Header */}
        <header className="bg-white border-b border-border px-6 py-3 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-4">
            <Link
              href="/student/learn"
              className="text-muted hover:text-foreground transition-colors"
            >
              <ArrowLeft size={18} />
            </Link>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center">
                <Brain size={18} className="text-white" />
              </div>
              <div>
                <h1 className="font-semibold text-sm">{config.unitName}</h1>
                <p className="text-xs text-muted">
                  {config.courseName} &middot;{" "}
                  {config.approach.replace("-", " ")} method
                </p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {usingMock && (
              <span className="flex items-center gap-1.5 text-xs text-amber-600 bg-amber-50 px-2.5 py-1 rounded-full">
                <WifiOff size={12} />
                Demo mode
              </span>
            )}
            <button
              onClick={handleClear}
              className="text-xs text-muted hover:text-red-500 transition-colors flex items-center gap-1"
            >
              <Trash2 size={12} />
              Clear
            </button>
            <div className="flex items-center gap-1.5 text-xs text-muted">
              <Shield size={12} className="text-emerald-500" />
              Teacher-configured
            </div>
          </div>
        </header>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-5">
          <div className="flex items-center justify-center gap-3 py-2">
            <div className="h-px flex-1 bg-border" />
            <span className="text-xs text-muted px-3 py-1 rounded-full bg-gray-100 flex items-center gap-1.5">
              <Sparkles size={10} />
              Learning session &middot; {config.unitName}
            </span>
            <div className="h-px flex-1 bg-border" />
          </div>

          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-3 animate-fade-in ${
                msg.role === "user" ? "justify-end" : ""
              }`}
            >
              {msg.role === "assistant" && (
                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white flex-shrink-0 mt-1">
                  <Brain size={16} />
                </div>
              )}
              <div
                className={`max-w-lg ${
                  msg.role === "user"
                    ? "bg-primary text-white rounded-2xl rounded-tr-sm"
                    : msg.type === "hint"
                    ? "bg-amber-50 border border-amber-200 rounded-2xl rounded-tl-sm"
                    : msg.type === "practice"
                    ? "bg-cyan-50 border border-cyan-200 rounded-2xl rounded-tl-sm"
                    : "bg-white border border-border rounded-2xl rounded-tl-sm"
                } px-4 py-3 shadow-sm`}
              >
                {msg.type === "hint" && (
                  <div className="flex items-center gap-1.5 mb-1.5">
                    <Lightbulb size={12} className="text-amber-500" />
                    <span className="text-[10px] font-medium text-amber-600 uppercase tracking-wider">
                      Hint
                    </span>
                  </div>
                )}
                {msg.type === "practice" && (
                  <div className="flex items-center gap-1.5 mb-1.5">
                    <FlaskConical size={12} className="text-cyan-500" />
                    <span className="text-[10px] font-medium text-cyan-600 uppercase tracking-wider">
                      Practice
                    </span>
                  </div>
                )}
                <div
                  className={`text-sm leading-relaxed whitespace-pre-wrap ${
                    msg.role === "user" ? "text-white" : ""
                  }`}
                  dangerouslySetInnerHTML={{
                    __html: msg.content
                      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
                      .replace(/\*(.*?)\*/g, "<em>$1</em>")
                      .replace(/\n/g, "<br/>"),
                  }}
                />
                {msg.content === "" && isStreaming && (
                  <div className="flex gap-1.5">
                    <div className="w-2 h-2 bg-gray-300 rounded-full typing-dot" />
                    <div className="w-2 h-2 bg-gray-300 rounded-full typing-dot" />
                    <div className="w-2 h-2 bg-gray-300 rounded-full typing-dot" />
                  </div>
                )}
                <p
                  className={`text-[10px] mt-1.5 ${
                    msg.role === "user" ? "text-white/60" : "text-muted"
                  }`}
                >
                  {msg.timestamp}
                </p>
              </div>
              {msg.role === "user" && (
                <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0 mt-1">
                  AR
                </div>
              )}
            </div>
          ))}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Actions */}
        <div className="px-6 pb-2 flex gap-2 flex-wrap">
          {quickActions.map((a) => (
            <button
              key={a.label}
              onClick={() => sendMessage(a.label)}
              disabled={isStreaming}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-border bg-white text-xs font-medium text-muted hover:text-primary hover:border-primary/30 transition-all disabled:opacity-50"
            >
              <a.icon size={12} />
              {a.label}
            </button>
          ))}
        </div>

        {/* Input */}
        <div className="px-6 pb-6 pt-2">
          <div className="flex items-center gap-3 bg-white border border-border rounded-xl px-4 py-3 shadow-sm focus-within:border-primary/40 focus-within:shadow-md transition-all">
            <input
              ref={inputRef}
              type="text"
              placeholder="Type your answer or ask a question..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage(input)}
              disabled={isStreaming}
              className="flex-1 outline-none text-sm bg-transparent disabled:opacity-50"
            />
            <button
              onClick={() => sendMessage(input)}
              disabled={!input.trim() || isStreaming}
              className={`w-9 h-9 rounded-lg flex items-center justify-center transition-all ${
                input.trim() && !isStreaming
                  ? "bg-primary text-white hover:bg-primary-dark"
                  : "bg-gray-100 text-gray-300"
              }`}
            >
              <Send size={16} />
            </button>
          </div>
          <p className="text-center text-[10px] text-muted mt-2">
            {usingMock
              ? "Running in demo mode — connect an OpenAI API key for live AI responses"
              : "AI tutor powered by OpenAI"}{" "}
            &middot; Configured by teacher &middot; Focused on mastery
          </p>
        </div>
      </div>

      {/* Right Sidebar */}
      <aside className="w-72 bg-white border-l border-border p-5 flex-shrink-0 overflow-y-auto hidden lg:block">
        <h3 className="font-semibold text-sm flex items-center gap-2 mb-4">
          <Target size={15} className="text-primary" />
          Learning Objectives
        </h3>
        <div className="space-y-2 mb-6">
          {objectives.map((obj, i) => (
            <div
              key={i}
              className={`flex items-start gap-2.5 p-2.5 rounded-lg text-sm ${
                obj.completed ? "bg-emerald-50" : "bg-gray-50"
              }`}
            >
              {obj.completed ? (
                <CheckCircle2
                  size={15}
                  className="text-emerald-500 mt-0.5 flex-shrink-0"
                />
              ) : (
                <Circle
                  size={15}
                  className="text-gray-300 mt-0.5 flex-shrink-0"
                />
              )}
              <span
                className={obj.completed ? "text-emerald-700" : "text-muted"}
              >
                {obj.text}
              </span>
            </div>
          ))}
        </div>

        <div className="border-t border-border pt-5">
          <h3 className="font-semibold text-sm flex items-center gap-2 mb-3">
            <TrendingUpIcon />
            Session Stats
          </h3>
          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-muted">Questions This Session</span>
                <span className="font-semibold">{sessionQuestions}</span>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-muted">Messages</span>
                <span className="font-semibold">{messages.length}</span>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-muted">Mode</span>
                <span className="font-semibold text-xs">
                  {usingMock ? "Demo" : "Live AI"}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-border pt-5 mt-5">
          <h3 className="font-semibold text-sm flex items-center gap-2 mb-3">
            <Sparkles size={15} className="text-amber-500" />
            AI Configuration
          </h3>
          <div className="space-y-2 text-xs text-muted">
            <div className="flex items-center justify-between p-2 bg-indigo-50 rounded-lg">
              <span>Approach</span>
              <span className="font-medium text-indigo-700 capitalize">
                {config.approach.replace("-", " ")}
              </span>
            </div>
            <div className="flex items-center justify-between p-2 bg-indigo-50 rounded-lg">
              <span>Tone</span>
              <span className="font-medium text-indigo-700 capitalize">
                {config.tone}
              </span>
            </div>
            <div className="flex items-center justify-between p-2 bg-indigo-50 rounded-lg">
              <span>Scaffolding</span>
              <span className="font-medium text-indigo-700">
                Level {config.scaffolding}/5
              </span>
            </div>
            <div className="flex items-center justify-between p-2 bg-indigo-50 rounded-lg">
              <span>Boundaries</span>
              <span className="font-medium text-indigo-700">
                {config.boundaries.filter((b) => b.enabled).length} active
              </span>
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
}

function TrendingUpIcon() {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="text-emerald-500"
    >
      <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
      <polyline points="16 7 22 7 22 13" />
    </svg>
  );
}
