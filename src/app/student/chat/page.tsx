"use client";

import { useState, useRef, useEffect, useCallback, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  Brain,
  Send,
  Target,
  Lightbulb,
  ArrowLeft,
  Sparkles,
  Shield,
  RotateCcw,
  HelpCircle,
  FlaskConical,
  Trash2,
  WifiOff,
} from "lucide-react";
import { ChatMessage, Unit } from "@/lib/types";
import {
  getUnit,
  getUnits,
  getCourses,
  getActiveSession,
  startSession,
  updateActiveSession,
  endSession,
  logAnalytics,
} from "@/lib/storage";

const MOCK_RESPONSES: Record<string, string> = {
  default:
    "That's a great question! Let me help you think through this.\n\nWhat do you already know about this topic? Let's build from there.",
  "Explain differently":
    "Let me try a different angle! 🔄\n\nThink of it this way — can you relate it to something you've seen in everyday life? Sometimes analogies make complex ideas click.\n\nWhat part is most confusing to you?",
  "Give me a hint":
    "💡 Here's a hint: Focus on the *relationship* between the key concepts. How do they connect to each other?\n\nTry working through it step by step and tell me where you get stuck.",
  "Practice problem":
    "📝 Let's practice!\n\nBased on what we've been discussing, here's a scenario: Can you apply the concept we just covered to explain what would happen in a different situation?\n\nWalk me through your reasoning.",
  "Why is this important?":
    "Great question! 🌍 Understanding this concept is important because it connects to many real-world applications.\n\nIt builds the foundation for more advanced topics you'll encounter later. Want to explore how it applies in practice?",
};

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
  return new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
}

function ChatInner() {
  const searchParams = useSearchParams();
  const unitId = searchParams.get("unit");

  const [unit] = useState<Unit | null>(() => {
    if (typeof window === "undefined") return null;
    if (unitId) return getUnit(unitId) || null;
    const allUnits = getUnits();
    return allUnits.length > 0 ? allUnits[0] : null;
  });
  const [courseName] = useState<string>(() => {
    if (typeof window === "undefined" || !unit) return "";
    return getCourses().find((c) => c.id === unit.courseId)?.name || "";
  });

  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    if (typeof window === "undefined") return [];
    const active = getActiveSession();
    if (active && unit && active.unitId === unit.id && active.messages.length > 0) {
      return active.messages;
    }
    if (!unit) return [];
    const session = startSession(unit.id);
    const welcome: ChatMessage = {
      id: generateId(),
      role: "assistant",
      content: `Hi! I'm your AI tutor for **${unit.name}**${courseName ? ` in ${courseName}` : ""}. I'm here to help you learn through guided questions — not to give you answers directly.\n\nWhat would you like to explore, or should I start with a concept?`,
      timestamp: getTimestamp(),
      type: "normal",
    };
    session.messages = [welcome];
    updateActiveSession(session);
    return [welcome];
  });

  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [usingMock, setUsingMock] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Save session when leaving the page
  useEffect(() => {
    const handleBeforeUnload = () => endSession();
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      endSession();
    };
  }, []);

  const sendToAPI = useCallback(
    async (
      allMessages: ChatMessage[],
      onChunk: (text: string) => void,
      onDone: () => void,
      onError: () => void
    ) => {
      try {
        const apiMessages = allMessages.map((m) => ({ role: m.role, content: m.content }));
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messages: apiMessages,
            unitConfig: unit?.config,
            unitName: unit?.name || "General",
            courseName: courseName || "General",
          }),
        });

        if (!res.ok) { onError(); return; }

        const reader = res.body?.getReader();
        const decoder = new TextDecoder();
        if (!reader) { onError(); return; }

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          const text = decoder.decode(value);
          const lines = text.split("\n").filter((l) => l.startsWith("data: "));
          for (const line of lines) {
            const data = line.slice(6);
            if (data === "[DONE]") { onDone(); return; }
            try {
              const parsed = JSON.parse(data);
              if (parsed.content) onChunk(parsed.content);
              if (parsed.error) { onError(); return; }
            } catch { /* skip */ }
          }
        }
        onDone();
      } catch {
        onError();
      }
    },
    [unit, courseName]
  );

  const sendMessage = async (content: string) => {
    if (!content.trim() || isStreaming) return;

    const userMsg: ChatMessage = {
      id: generateId(),
      role: "user",
      content: content.trim(),
      timestamp: getTimestamp(),
    };

    const updated = [...messages, userMsg];
    setMessages(updated);
    setInput("");
    setIsStreaming(true);

    if (unit) {
      logAnalytics({ unitId: unit.id, timestamp: new Date().toISOString(), type: "message_sent", messageContent: content.trim() });
    }

    const placeholder: ChatMessage = {
      id: generateId(),
      role: "assistant",
      content: "",
      timestamp: getTimestamp(),
      type: content === "Give me a hint" ? "hint" : content === "Practice problem" ? "practice" : "normal",
    };
    const withPlaceholder = [...updated, placeholder];
    setMessages(withPlaceholder);

    let accumulated = "";

    await sendToAPI(
      updated,
      (chunk) => {
        accumulated += chunk;
        setMessages((prev) => {
          const msgs = [...prev];
          const last = msgs[msgs.length - 1];
          if (last.id === placeholder.id) {
            msgs[msgs.length - 1] = { ...last, content: accumulated };
          }
          return msgs;
        });
      },
      () => {
        setUsingMock(false);
        setMessages((prev) => {
          const session = getActiveSession();
          if (session) {
            session.messages = prev;
            session.questionsAsked += 1;
            updateActiveSession(session);
          }
          return prev;
        });
        setIsStreaming(false);
      },
      () => {
        setUsingMock(true);
        const mockKey = content in MOCK_RESPONSES ? content : "default";
        const aiMsg: ChatMessage = {
          id: placeholder.id,
          role: "assistant",
          content: MOCK_RESPONSES[mockKey],
          timestamp: getTimestamp(),
          type: placeholder.type,
        };
        const final = [...updated, aiMsg];
        setMessages(final);
        const session = getActiveSession();
        if (session) {
          session.messages = final;
          session.questionsAsked += 1;
          updateActiveSession(session);
        }
        setIsStreaming(false);
      }
    );
  };

  const handleClear = () => {
    endSession();
    if (unit) {
      const session = startSession(unit.id);
      const welcome: ChatMessage = {
        id: generateId(),
        role: "assistant",
        content: `Session cleared! Let's start fresh with **${unit.name}**.\n\nWhat would you like to work on?`,
        timestamp: getTimestamp(),
        type: "normal",
      };
      session.messages = [welcome];
      updateActiveSession(session);
      setMessages([welcome]);
    } else {
      setMessages([]);
    }
  };

  if (!unit) {
    return (
      <div className="h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <Brain size={48} className="text-gray-200 mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">No unit selected</h2>
          <p className="text-muted text-sm mb-4">
            Ask your teacher to set up a course and unit, or go to the teacher portal to create one.
          </p>
          <div className="flex gap-3 justify-center">
            <Link href="/student/learn" className="px-4 py-2 border border-border rounded-lg text-sm hover:bg-surface-hover">
              Student Home
            </Link>
            <Link href="/teacher/courses" className="px-4 py-2 bg-primary text-white rounded-lg text-sm">
              Teacher Portal
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex bg-background">
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white border-b border-border px-6 py-3 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-4">
            <Link href="/student/learn" className="text-muted hover:text-foreground transition-colors">
              <ArrowLeft size={18} />
            </Link>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center">
                <Brain size={18} className="text-white" />
              </div>
              <div>
                <h1 className="font-semibold text-sm">{unit.name}</h1>
                <p className="text-xs text-muted">
                  {courseName} &middot; {unit.config.approach.replace("-", " ")}
                </p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {usingMock && (
              <span className="flex items-center gap-1.5 text-xs text-amber-600 bg-amber-50 px-2.5 py-1 rounded-full">
                <WifiOff size={12} /> Demo mode
              </span>
            )}
            <button
              onClick={handleClear}
              className="text-xs text-muted hover:text-red-500 transition-colors flex items-center gap-1"
            >
              <Trash2 size={12} /> Clear
            </button>
            <div className="flex items-center gap-1.5 text-xs text-muted">
              <Shield size={12} className="text-emerald-500" /> Teacher-configured
            </div>
          </div>
        </header>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-5">
          <div className="flex items-center justify-center gap-3 py-2">
            <div className="h-px flex-1 bg-border" />
            <span className="text-xs text-muted px-3 py-1 rounded-full bg-gray-100 flex items-center gap-1.5">
              <Sparkles size={10} /> {unit.name}
            </span>
            <div className="h-px flex-1 bg-border" />
          </div>

          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-3 animate-fade-in ${msg.role === "user" ? "justify-end" : ""}`}
            >
              {msg.role === "assistant" && (
                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white flex-shrink-0 mt-1">
                  <Brain size={16} />
                </div>
              )}
              <div
                className={`max-w-lg px-4 py-3 shadow-sm ${
                  msg.role === "user"
                    ? "bg-primary text-white rounded-2xl rounded-tr-sm"
                    : msg.type === "hint"
                    ? "bg-amber-50 border border-amber-200 rounded-2xl rounded-tl-sm"
                    : msg.type === "practice"
                    ? "bg-cyan-50 border border-cyan-200 rounded-2xl rounded-tl-sm"
                    : "bg-white border border-border rounded-2xl rounded-tl-sm"
                }`}
              >
                {msg.type === "hint" && (
                  <div className="flex items-center gap-1.5 mb-1.5">
                    <Lightbulb size={12} className="text-amber-500" />
                    <span className="text-[10px] font-medium text-amber-600 uppercase tracking-wider">Hint</span>
                  </div>
                )}
                {msg.type === "practice" && (
                  <div className="flex items-center gap-1.5 mb-1.5">
                    <FlaskConical size={12} className="text-cyan-500" />
                    <span className="text-[10px] font-medium text-cyan-600 uppercase tracking-wider">Practice</span>
                  </div>
                )}
                {msg.content === "" && isStreaming ? (
                  <div className="flex gap-1.5">
                    <div className="w-2 h-2 bg-gray-300 rounded-full typing-dot" />
                    <div className="w-2 h-2 bg-gray-300 rounded-full typing-dot" />
                    <div className="w-2 h-2 bg-gray-300 rounded-full typing-dot" />
                  </div>
                ) : (
                  <div
                    className={`text-sm leading-relaxed whitespace-pre-wrap ${msg.role === "user" ? "text-white" : ""}`}
                    dangerouslySetInnerHTML={{
                      __html: msg.content
                        .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
                        .replace(/\*(.*?)\*/g, "<em>$1</em>")
                        .replace(/\n/g, "<br/>"),
                    }}
                  />
                )}
                <p className={`text-[10px] mt-1.5 ${msg.role === "user" ? "text-white/60" : "text-muted"}`}>
                  {msg.timestamp}
                </p>
              </div>
              {msg.role === "user" && (
                <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0 mt-1">
                  S
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
              <a.icon size={12} /> {a.label}
            </button>
          ))}
        </div>

        {/* Input */}
        <div className="px-6 pb-6 pt-2">
          <div className="flex items-center gap-3 bg-white border border-border rounded-xl px-4 py-3 shadow-sm focus-within:border-primary/40 focus-within:shadow-md transition-all">
            <input
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
            {usingMock ? "Demo mode — add OpenAI key for live AI" : "Powered by OpenAI"} &middot; Teacher-configured
          </p>
        </div>
      </div>

      {/* Sidebar */}
      <aside className="w-72 bg-white border-l border-border p-5 flex-shrink-0 overflow-y-auto hidden lg:block">
        <h3 className="font-semibold text-sm flex items-center gap-2 mb-4">
          <Target size={15} className="text-primary" />
          Learning Objectives
        </h3>
        {unit.config.objectives.length === 0 ? (
          <p className="text-xs text-muted italic">No objectives set for this unit yet.</p>
        ) : (
          <div className="space-y-2 mb-6">
            {unit.config.objectives.map((obj, i) => (
              <div key={i} className="flex items-start gap-2.5 p-2.5 rounded-lg text-sm bg-gray-50">
                <Target size={13} className="text-primary mt-0.5 flex-shrink-0" />
                <span className="text-muted text-xs">{obj.text}</span>
              </div>
            ))}
          </div>
        )}

        <div className="border-t border-border pt-5">
          <h3 className="font-semibold text-sm flex items-center gap-2 mb-3">
            <Sparkles size={15} className="text-amber-500" />
            AI Configuration
          </h3>
          <div className="space-y-2 text-xs text-muted">
            <div className="flex items-center justify-between p-2 bg-indigo-50 rounded-lg">
              <span>Approach</span>
              <span className="font-medium text-indigo-700 capitalize">{unit.config.approach.replace("-", " ")}</span>
            </div>
            <div className="flex items-center justify-between p-2 bg-indigo-50 rounded-lg">
              <span>Tone</span>
              <span className="font-medium text-indigo-700 capitalize">{unit.config.tone}</span>
            </div>
            <div className="flex items-center justify-between p-2 bg-indigo-50 rounded-lg">
              <span>Scaffolding</span>
              <span className="font-medium text-indigo-700">Level {unit.config.scaffolding}/5</span>
            </div>
            <div className="flex items-center justify-between p-2 bg-indigo-50 rounded-lg">
              <span>Boundaries</span>
              <span className="font-medium text-indigo-700">{unit.config.boundaries.filter((b) => b.enabled).length} active</span>
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
}

export default function StudentChatPage() {
  return (
    <Suspense fallback={<div className="h-screen flex items-center justify-center">Loading...</div>}>
      <ChatInner />
    </Suspense>
  );
}
