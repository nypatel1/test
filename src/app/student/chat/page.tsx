"use client";

import { useState, useRef, useEffect } from "react";
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
} from "lucide-react";

interface Message {
  id: number;
  role: "ai" | "student";
  content: string;
  timestamp: string;
  type?: "normal" | "hint" | "practice" | "misconception";
}

const initialMessages: Message[] = [
  {
    id: 1,
    role: "ai",
    content:
      "Hi Alex! 👋 We're continuing with **Cell Division & Mitosis** today. Last time, you were working on understanding the difference between mitosis and meiosis. Let's pick up there!\n\nHere's a question to get us started: **Both mitosis and meiosis involve cell division, but they produce very different results. What's the key difference in what they produce?**",
    timestamp: "2:30 PM",
    type: "normal",
  },
  {
    id: 2,
    role: "student",
    content:
      "Mitosis makes 2 cells and meiosis makes 4? I think mitosis is for regular cells and meiosis is for like reproductive cells?",
    timestamp: "2:31 PM",
  },
  {
    id: 3,
    role: "ai",
    content:
      "You're on the right track! ✅ You correctly identified that mitosis produces **2 cells** and meiosis produces **4 cells**. And yes, meiosis is for reproductive cells (gametes).\n\nNow let's go deeper: You said mitosis produces \"regular cells\" — can you be more specific? What's special about those 2 cells compared to the original?",
    timestamp: "2:31 PM",
    type: "normal",
  },
  {
    id: 4,
    role: "student",
    content: "They're identical? Like they have the same DNA as the parent cell?",
    timestamp: "2:32 PM",
  },
  {
    id: 5,
    role: "ai",
    content:
      "Exactly! 🎯 Mitosis produces 2 **genetically identical** daughter cells — they're clones of the parent cell with the same number of chromosomes (diploid).\n\nNow, how does meiosis differ? If mitosis produces identical copies, what makes the 4 cells from meiosis different?",
    timestamp: "2:32 PM",
    type: "normal",
  },
  {
    id: 6,
    role: "student",
    content: "They only have half the chromosomes? And they're all different from each other?",
    timestamp: "2:33 PM",
  },
  {
    id: 7,
    role: "ai",
    content:
      "Brilliant! 🌟 That's a key insight. Meiosis produces 4 **genetically unique** cells that are **haploid** (half the chromosomes). This is crucial for sexual reproduction — when two haploid gametes combine, they restore the full chromosome number.\n\nLet me check your understanding with a scenario:\n\n**If a human body cell has 46 chromosomes, how many chromosomes would be in:**\n1. A cell produced by mitosis?\n2. A cell produced by meiosis?",
    timestamp: "2:33 PM",
    type: "practice",
  },
];

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

export default function StudentChatPage() {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;

    const studentMsg: Message = {
      id: messages.length + 1,
      role: "student",
      content: input,
      timestamp: new Date().toLocaleTimeString([], {
        hour: "numeric",
        minute: "2-digit",
      }),
    };

    setMessages((prev) => [...prev, studentMsg]);
    setInput("");
    setIsTyping(true);

    setTimeout(() => {
      const aiReply: Message = {
        id: messages.length + 2,
        role: "ai",
        content:
          "Great thinking! 🧬 Let me break that down for you. For **mitosis**, since it creates identical copies, the answer is **46 chromosomes** — the same as the parent cell. For **meiosis**, since it halves the chromosome count, each gamete would have **23 chromosomes**.\n\nYou're really getting the hang of this! Now, here's something to think about: **What would happen if meiosis didn't reduce the chromosome number?** What problem would that cause when fertilization occurs?",
        timestamp: new Date().toLocaleTimeString([], {
          hour: "numeric",
          minute: "2-digit",
        }),
        type: "normal",
      };
      setMessages((prev) => [...prev, aiReply]);
      setIsTyping(false);
    }, 2000);
  };

  const handleQuickAction = (label: string) => {
    setInput("");
    const studentMsg: Message = {
      id: messages.length + 1,
      role: "student",
      content: label,
      timestamp: new Date().toLocaleTimeString([], {
        hour: "numeric",
        minute: "2-digit",
      }),
    };
    setMessages((prev) => [...prev, studentMsg]);
    setIsTyping(true);

    const responses: Record<string, string> = {
      "Explain differently":
        "Let me try a different approach! 🔄 Think of it like this:\n\n**Mitosis** is like a photocopy machine — you put in one page and get an exact copy. Both copies are identical.\n\n**Meiosis** is like shuffling a deck of cards and dealing 4 hands — each hand is unique and has only half the cards.\n\nDoes that analogy help? What part would you like to explore more?",
      "Give me a hint":
        "💡 Here's a hint: Think about what happens at **fertilization**. If a sperm (from meiosis) meets an egg (from meiosis), and each has 23 chromosomes... what happens to the chromosome count in the resulting embryo?\n\nThis might help you understand *why* meiosis needs to halve the number!",
      "Practice problem":
        "📝 Here's a practice problem:\n\n**A plant cell has 24 chromosomes. A student claims that after meiosis, the resulting cells would each have 12 chromosomes, and after mitosis, they'd have 24.**\n\n**Is the student correct about both claims?** Explain your reasoning for each.",
      "Why is this important?":
        "Great question! 🌍 Understanding cell division is fundamental because:\n\n1. **Mitosis** is how your body **grows and repairs** — every time you heal a cut, mitosis is happening\n2. **Meiosis** is how **genetic diversity** is created — it's why siblings aren't identical\n3. **Errors** in cell division can lead to conditions like **Down syndrome** (extra chromosome) or **cancer** (uncontrolled mitosis)\n\nThis connects to our next objective about division errors. Want to explore that?",
    };

    setTimeout(() => {
      const aiReply: Message = {
        id: messages.length + 2,
        role: "ai",
        content:
          responses[label] || "Let me think about that and provide a helpful response...",
        timestamp: new Date().toLocaleTimeString([], {
          hour: "numeric",
          minute: "2-digit",
        }),
        type:
          label === "Give me a hint"
            ? "hint"
            : label === "Practice problem"
            ? "practice"
            : "normal",
      };
      setMessages((prev) => [...prev, aiReply]);
      setIsTyping(false);
    }, 1500);
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
                <h1 className="font-semibold text-sm">
                  Cell Division & Mitosis
                </h1>
                <p className="text-xs text-muted">
                  AP Biology &middot; Socratic Method
                </p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted">
            <Shield size={12} className="text-emerald-500" />
            Teacher-configured &middot; Ms. Chen
          </div>
        </header>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-5">
          {/* Session Start Indicator */}
          <div className="flex items-center justify-center gap-3 py-2">
            <div className="h-px flex-1 bg-border" />
            <span className="text-xs text-muted px-3 py-1 rounded-full bg-gray-100 flex items-center gap-1.5">
              <Sparkles size={10} />
              Learning session started &middot; Cell Division & Mitosis
            </span>
            <div className="h-px flex-1 bg-border" />
          </div>

          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-3 animate-fade-in ${
                msg.role === "student" ? "justify-end" : ""
              }`}
            >
              {msg.role === "ai" && (
                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white flex-shrink-0 mt-1">
                  <Brain size={16} />
                </div>
              )}
              <div
                className={`max-w-lg ${
                  msg.role === "student"
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
                    msg.role === "student" ? "text-white" : ""
                  }`}
                  dangerouslySetInnerHTML={{
                    __html: msg.content
                      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
                      .replace(/\*(.*?)\*/g, "<em>$1</em>")
                      .replace(/\n/g, "<br/>"),
                  }}
                />
                <p
                  className={`text-[10px] mt-1.5 ${
                    msg.role === "student" ? "text-white/60" : "text-muted"
                  }`}
                >
                  {msg.timestamp}
                </p>
              </div>
              {msg.role === "student" && (
                <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0 mt-1">
                  AR
                </div>
              )}
            </div>
          ))}

          {/* Typing indicator */}
          {isTyping && (
            <div className="flex gap-3 animate-fade-in">
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white flex-shrink-0 mt-1">
                <Brain size={16} />
              </div>
              <div className="bg-white border border-border rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm">
                <div className="flex gap-1.5">
                  <div className="w-2 h-2 bg-gray-300 rounded-full typing-dot" />
                  <div className="w-2 h-2 bg-gray-300 rounded-full typing-dot" />
                  <div className="w-2 h-2 bg-gray-300 rounded-full typing-dot" />
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Actions */}
        <div className="px-6 pb-2 flex gap-2 flex-wrap">
          {quickActions.map((a) => (
            <button
              key={a.label}
              onClick={() => handleQuickAction(a.label)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-border bg-white text-xs font-medium text-muted hover:text-primary hover:border-primary/30 transition-all"
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
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              className="flex-1 outline-none text-sm bg-transparent"
            />
            <button
              onClick={handleSend}
              disabled={!input.trim()}
              className={`w-9 h-9 rounded-lg flex items-center justify-center transition-all ${
                input.trim()
                  ? "bg-primary text-white hover:bg-primary-dark"
                  : "bg-gray-100 text-gray-300"
              }`}
            >
              <Send size={16} />
            </button>
          </div>
          <p className="text-center text-[10px] text-muted mt-2">
            AI tutor configured by Ms. Chen &middot; Focused on mastery, not
            answers &middot; Your progress is tracked
          </p>
        </div>
      </div>

      {/* Right Sidebar - Progress */}
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
            Session Progress
          </h3>
          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-muted">Unit Mastery</span>
                <span className="font-semibold">72%</span>
              </div>
              <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 rounded-full w-[72%]" />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-muted">Session Questions</span>
                <span className="font-semibold">7</span>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-muted">Correct Responses</span>
                <span className="font-semibold text-emerald-600">5/7</span>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-muted">Time in Session</span>
                <span className="font-semibold">18 min</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-border pt-5 mt-5">
          <h3 className="font-semibold text-sm flex items-center gap-2 mb-3">
            <Sparkles size={15} className="text-amber-500" />
            Your Learning Style
          </h3>
          <div className="space-y-2 text-xs text-muted">
            <div className="flex items-center justify-between p-2 bg-indigo-50 rounded-lg">
              <span>Preferred approach</span>
              <span className="font-medium text-indigo-700">
                Visual + Analogies
              </span>
            </div>
            <div className="flex items-center justify-between p-2 bg-indigo-50 rounded-lg">
              <span>Best time</span>
              <span className="font-medium text-indigo-700">Afternoon</span>
            </div>
            <div className="flex items-center justify-between p-2 bg-indigo-50 rounded-lg">
              <span>Avg. session</span>
              <span className="font-medium text-indigo-700">22 minutes</span>
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
