"use client";

import { useState, useRef, useEffect, useCallback, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  Brain, Send, Target, Lightbulb, ArrowLeft, Sparkles, Shield,
  RotateCcw, HelpCircle, FlaskConical, Trash2, WifiOff, Loader2,
} from "lucide-react";
import { ChatMessage } from "@/lib/types";
import { useAuth } from "@/lib/AuthContext";
import * as db from "@/lib/db";

const MOCK_RESPONSES: Record<string, string> = {
  default: "That's a great question! Let me help you think through this.\n\nWhat do you already know about this topic? Let's build from there.",
  "Explain differently": "Let me try a different angle! 🔄\n\nThink of it this way — can you relate it to something you've seen in everyday life?\n\nWhat part is most confusing to you?",
  "Give me a hint": "💡 Here's a hint: Focus on the *relationship* between the key concepts. How do they connect?\n\nTry working through it step by step.",
  "Practice problem": "📝 Let's practice!\n\nBased on what we've discussed, here's a scenario: Can you apply the concept to explain what would happen in a different situation?\n\nWalk me through your reasoning.",
  "Why is this important?": "Great question! 🌍 Understanding this connects to real-world applications and builds the foundation for more advanced topics.\n\nWant to explore how it applies in practice?",
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
  const router = useRouter();
  const unitId = searchParams.get("unit");
  const { user, profile, loading: authLoading } = useAuth();

  const [unit, setUnit] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [usingMock, setUsingMock] = useState(false);
  const [questionsAsked, setQuestionsAsked] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const sessionStartRef = useRef<number>(0);

  useEffect(() => {
    if (authLoading) return;
    if (!user) { router.push("/auth"); return; }
    if (!unitId) { requestAnimationFrame(() => setLoading(false)); return; }

    (async () => {
      const u = await db.getUnit(unitId);
      setUnit(u);
      if (u && user) {
        const session = await db.createChatSession(user.id, u.id);
        setSessionId(session.id);
        sessionStartRef.current = Date.now();
        const welcome: ChatMessage = {
          id: generateId(), role: "assistant",
          content: `Hi! I'm your AI tutor for **${u.name}**${u.courses?.name ? ` in ${u.courses.name}` : ""}. I'm here to help you learn through guided questions.\n\nWhat would you like to explore?`,
          timestamp: getTimestamp(), type: "normal",
        };
        setMessages([welcome]);
      }
      setLoading(false);
    })();
  }, [unitId, user, authLoading, router]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Save session on unmount
  useEffect(() => {
    return () => {
      if (sessionId && messages.length > 1) {
        const duration = Math.round((Date.now() - sessionStartRef.current) / 60000);
        db.updateChatSession(sessionId, {
          messages, questions_asked: questionsAsked, duration_minutes: duration,
          ended_at: new Date().toISOString(),
        });
      }
    };
  }, [sessionId, messages, questionsAsked]);

  const sendToAPI = useCallback(
    async (allMessages: ChatMessage[], onChunk: (t: string) => void, onDone: () => void, onError: () => void) => {
      try {
        const res = await fetch("/api/chat", {
          method: "POST", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messages: allMessages.map((m) => ({ role: m.role, content: m.content })),
            unitConfig: unit?.config, unitName: unit?.name || "General",
            courseName: unit?.courses?.name || "General",
          }),
        });
        if (!res.ok) { onError(); return; }
        const reader = res.body?.getReader();
        const decoder = new TextDecoder();
        if (!reader) { onError(); return; }
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          for (const line of decoder.decode(value).split("\n").filter((l) => l.startsWith("data: "))) {
            const data = line.slice(6);
            if (data === "[DONE]") { onDone(); return; }
            try { const p = JSON.parse(data); if (p.content) onChunk(p.content); if (p.error) { onError(); return; } } catch {}
          }
        }
        onDone();
      } catch { onError(); }
    }, [unit]
  );

  const sendMessage = async (content: string) => {
    if (!content.trim() || isStreaming) return;
    const userMsg: ChatMessage = { id: generateId(), role: "user", content: content.trim(), timestamp: getTimestamp() };
    const updated = [...messages, userMsg];
    setMessages(updated);
    setInput("");
    setIsStreaming(true);
    setQuestionsAsked((q) => q + 1);

    const placeholder: ChatMessage = {
      id: generateId(), role: "assistant", content: "", timestamp: getTimestamp(),
      type: content === "Give me a hint" ? "hint" : content === "Practice problem" ? "practice" : "normal",
    };
    setMessages([...updated, placeholder]);
    let accumulated = "";

    await sendToAPI(updated,
      (chunk) => {
        accumulated += chunk;
        setMessages((prev) => { const m = [...prev]; m[m.length - 1] = { ...m[m.length - 1], content: accumulated }; return m; });
      },
      () => {
        setUsingMock(false);
        // Save progress periodically
        if (sessionId) {
          const duration = Math.round((Date.now() - sessionStartRef.current) / 60000);
          setMessages((prev) => {
            db.updateChatSession(sessionId, { messages: prev, questions_asked: questionsAsked + 1, duration_minutes: duration });
            return prev;
          });
        }
        setIsStreaming(false);
      },
      () => {
        setUsingMock(true);
        const mockKey = content in MOCK_RESPONSES ? content : "default";
        setMessages([...updated, { ...placeholder, content: MOCK_RESPONSES[mockKey] }]);
        setIsStreaming(false);
      }
    );
  };

  const handleClear = async () => {
    if (sessionId && messages.length > 1) {
      const duration = Math.round((Date.now() - sessionStartRef.current) / 60000);
      await db.updateChatSession(sessionId, { messages, questions_asked: questionsAsked, duration_minutes: duration, ended_at: new Date().toISOString() });
    }
    if (unit && user) {
      const session = await db.createChatSession(user.id, unit.id);
      setSessionId(session.id);
      sessionStartRef.current = Date.now();
      setQuestionsAsked(0);
    }
    const welcome: ChatMessage = {
      id: generateId(), role: "assistant",
      content: `Session cleared! Let's start fresh with **${unit?.name || "this topic"}**.\n\nWhat would you like to work on?`,
      timestamp: getTimestamp(), type: "normal",
    };
    setMessages([welcome]);
  };

  if (loading || authLoading) {
    return <div className="h-screen flex items-center justify-center"><Loader2 size={24} className="animate-spin text-primary" /></div>;
  }

  if (!unit) {
    return (
      <div className="h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <Brain size={48} className="text-gray-200 mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">No unit selected</h2>
          <p className="text-muted text-sm mb-4">Go back and select a unit to start learning.</p>
          <Link href="/student/learn" className="px-4 py-2 bg-primary text-white rounded-lg text-sm">Student Home</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex bg-background">
      <div className="flex-1 flex flex-col">
        <header className="bg-white border-b border-border px-6 py-3 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-4">
            <Link href="/student/learn" className="text-muted hover:text-foreground"><ArrowLeft size={18} /></Link>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center"><Brain size={18} className="text-white" /></div>
              <div>
                <h1 className="font-semibold text-sm">{unit.name}</h1>
                <p className="text-xs text-muted">{unit.courses?.name} &middot; {(unit.config?.approach || "socratic").replace("-", " ")}</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {usingMock && <span className="flex items-center gap-1.5 text-xs text-amber-600 bg-amber-50 px-2.5 py-1 rounded-full"><WifiOff size={12} /> Demo</span>}
            <button onClick={handleClear} className="text-xs text-muted hover:text-red-500 flex items-center gap-1"><Trash2 size={12} /> Clear</button>
            <div className="flex items-center gap-1.5 text-xs text-muted"><Shield size={12} className="text-emerald-500" /> Teacher-configured</div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-5">
          <div className="flex items-center justify-center gap-3 py-2">
            <div className="h-px flex-1 bg-border" /><span className="text-xs text-muted px-3 py-1 rounded-full bg-gray-100 flex items-center gap-1.5"><Sparkles size={10} /> {unit.name}</span><div className="h-px flex-1 bg-border" />
          </div>
          {messages.map((msg) => (
            <div key={msg.id} className={`flex gap-3 animate-fade-in ${msg.role === "user" ? "justify-end" : ""}`}>
              {msg.role === "assistant" && <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white flex-shrink-0 mt-1"><Brain size={16} /></div>}
              <div className={`max-w-lg px-4 py-3 shadow-sm ${msg.role === "user" ? "bg-primary text-white rounded-2xl rounded-tr-sm" : msg.type === "hint" ? "bg-amber-50 border border-amber-200 rounded-2xl rounded-tl-sm" : msg.type === "practice" ? "bg-cyan-50 border border-cyan-200 rounded-2xl rounded-tl-sm" : "bg-white border border-border rounded-2xl rounded-tl-sm"}`}>
                {msg.type === "hint" && <div className="flex items-center gap-1.5 mb-1.5"><Lightbulb size={12} className="text-amber-500" /><span className="text-[10px] font-medium text-amber-600 uppercase tracking-wider">Hint</span></div>}
                {msg.type === "practice" && <div className="flex items-center gap-1.5 mb-1.5"><FlaskConical size={12} className="text-cyan-500" /><span className="text-[10px] font-medium text-cyan-600 uppercase tracking-wider">Practice</span></div>}
                {msg.content === "" && isStreaming ? (
                  <div className="flex gap-1.5"><div className="w-2 h-2 bg-gray-300 rounded-full typing-dot" /><div className="w-2 h-2 bg-gray-300 rounded-full typing-dot" /><div className="w-2 h-2 bg-gray-300 rounded-full typing-dot" /></div>
                ) : (
                  <div className={`text-sm leading-relaxed whitespace-pre-wrap ${msg.role === "user" ? "text-white" : ""}`} dangerouslySetInnerHTML={{ __html: msg.content.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>").replace(/\*(.*?)\*/g, "<em>$1</em>").replace(/\n/g, "<br/>") }} />
                )}
                <p className={`text-[10px] mt-1.5 ${msg.role === "user" ? "text-white/60" : "text-muted"}`}>{msg.timestamp}</p>
              </div>
              {msg.role === "user" && <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0 mt-1">{profile?.full_name?.[0] || "S"}</div>}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        <div className="px-6 pb-2 flex gap-2 flex-wrap">
          {quickActions.map((a) => (
            <button key={a.label} onClick={() => sendMessage(a.label)} disabled={isStreaming} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-border bg-white text-xs font-medium text-muted hover:text-primary hover:border-primary/30 disabled:opacity-50">
              <a.icon size={12} /> {a.label}
            </button>
          ))}
        </div>

        <div className="px-6 pb-6 pt-2">
          <div className="flex items-center gap-3 bg-white border border-border rounded-xl px-4 py-3 shadow-sm focus-within:border-primary/40 focus-within:shadow-md transition-all">
            <input type="text" placeholder="Type your answer or ask a question..." value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && sendMessage(input)} disabled={isStreaming} className="flex-1 outline-none text-sm bg-transparent disabled:opacity-50" />
            <button onClick={() => sendMessage(input)} disabled={!input.trim() || isStreaming} className={`w-9 h-9 rounded-lg flex items-center justify-center transition-all ${input.trim() && !isStreaming ? "bg-primary text-white hover:bg-primary-dark" : "bg-gray-100 text-gray-300"}`}>
              <Send size={16} />
            </button>
          </div>
          <p className="text-center text-[10px] text-muted mt-2">{usingMock ? "Demo mode" : "Powered by OpenAI"} &middot; Teacher-configured</p>
        </div>
      </div>

      <aside className="w-72 bg-white border-l border-border p-5 flex-shrink-0 overflow-y-auto hidden lg:block">
        <h3 className="font-semibold text-sm flex items-center gap-2 mb-4"><Target size={15} className="text-primary" />Learning Objectives</h3>
        {!unit.config?.objectives?.length ? (
          <p className="text-xs text-muted italic">No objectives set.</p>
        ) : (
          <div className="space-y-2 mb-6">
            {unit.config.objectives.map((obj: any, i: number) => (
              <div key={i} className="flex items-start gap-2.5 p-2.5 rounded-lg text-sm bg-gray-50">
                <Target size={13} className="text-primary mt-0.5 flex-shrink-0" />
                <span className="text-muted text-xs">{obj.text}</span>
              </div>
            ))}
          </div>
        )}
        <div className="border-t border-border pt-5">
          <h3 className="font-semibold text-sm flex items-center gap-2 mb-3"><Sparkles size={15} className="text-amber-500" />AI Configuration</h3>
          <div className="space-y-2 text-xs text-muted">
            <div className="flex items-center justify-between p-2 bg-indigo-50 rounded-lg"><span>Approach</span><span className="font-medium text-indigo-700 capitalize">{(unit.config?.approach || "socratic").replace("-", " ")}</span></div>
            <div className="flex items-center justify-between p-2 bg-indigo-50 rounded-lg"><span>Tone</span><span className="font-medium text-indigo-700 capitalize">{unit.config?.tone || "encouraging"}</span></div>
            <div className="flex items-center justify-between p-2 bg-indigo-50 rounded-lg"><span>Scaffolding</span><span className="font-medium text-indigo-700">Level {unit.config?.scaffolding || 3}/5</span></div>
          </div>
        </div>
      </aside>
    </div>
  );
}

export default function StudentChatPage() {
  return <Suspense fallback={<div className="h-screen flex items-center justify-center"><Loader2 size={24} className="animate-spin text-primary" /></div>}><ChatInner /></Suspense>;
}
