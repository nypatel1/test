"use client";

import Link from "next/link";
import Logo from "../../components/Logo";
import {
  BookOpen,
  Brain,
  Target,
  TrendingUp,
  Clock,
  Star,
  ChevronRight,
  Sparkles,
  CheckCircle2,
  Circle,
  Flame,
} from "lucide-react";

const units = [
  {
    id: "cell-division",
    name: "Cell Division & Mitosis",
    course: "AP Biology",
    mastery: 72,
    objectives: 6,
    completed: 4,
    lastSession: "Today",
    status: "in-progress",
  },
  {
    id: "dna-replication",
    name: "DNA Replication",
    course: "AP Biology",
    mastery: 45,
    objectives: 4,
    completed: 1,
    lastSession: "Yesterday",
    status: "in-progress",
  },
  {
    id: "protein-synthesis",
    name: "Protein Synthesis",
    course: "AP Biology",
    mastery: 88,
    objectives: 5,
    completed: 5,
    lastSession: "2 days ago",
    status: "mastered",
  },
];

const recentTopics = [
  {
    topic: "Stages of Mitosis",
    confidence: "high",
    lastPracticed: "30 min ago",
  },
  {
    topic: "Cell Cycle Checkpoints",
    confidence: "medium",
    lastPracticed: "1 hour ago",
  },
  {
    topic: "Mitosis vs Meiosis",
    confidence: "low",
    lastPracticed: "Yesterday",
  },
  {
    topic: "DNA Replication Process",
    confidence: "low",
    lastPracticed: "2 days ago",
  },
];

const achievements = [
  { label: "5-Day Streak", icon: Flame, color: "text-orange-500" },
  { label: "Unit Mastered", icon: Star, color: "text-amber-500" },
  { label: "Quick Learner", icon: Sparkles, color: "text-indigo-500" },
];

export default function StudentLearnPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 via-background to-background">
      {/* Student Header */}
      <header className="sticky top-0 z-20 bg-white/80 backdrop-blur-md border-b border-border">
        <div className="max-w-6xl mx-auto px-6 py-3 flex items-center justify-between">
          <Logo size="sm" />
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-orange-100 rounded-full">
              <Flame size={14} className="text-orange-500" />
              <span className="text-xs font-bold text-orange-700">
                5 day streak
              </span>
            </div>
            <Link
              href="/teacher/dashboard"
              className="text-xs text-muted hover:text-foreground transition-colors"
            >
              Teacher View
            </Link>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center text-white text-xs font-bold">
                AR
              </div>
              <span className="text-sm font-medium">Alex</span>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Welcome */}
        <div className="mb-8 animate-fade-in">
          <h1 className="text-2xl font-bold">Welcome back, Alex!</h1>
          <p className="text-muted mt-1">
            Ready to continue learning? Pick up where you left off or explore a
            new topic.
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 animate-fade-in">
          <div className="bg-white rounded-xl border border-border p-4">
            <div className="flex items-center gap-2 text-muted mb-1">
              <TrendingUp size={14} />
              <span className="text-xs font-medium">Overall Mastery</span>
            </div>
            <p className="text-2xl font-bold text-primary">68%</p>
          </div>
          <div className="bg-white rounded-xl border border-border p-4">
            <div className="flex items-center gap-2 text-muted mb-1">
              <Clock size={14} />
              <span className="text-xs font-medium">Study Time Today</span>
            </div>
            <p className="text-2xl font-bold">42 min</p>
          </div>
          <div className="bg-white rounded-xl border border-border p-4">
            <div className="flex items-center gap-2 text-muted mb-1">
              <Target size={14} />
              <span className="text-xs font-medium">Objectives Met</span>
            </div>
            <p className="text-2xl font-bold text-emerald-600">10/15</p>
          </div>
          <div className="bg-white rounded-xl border border-border p-4">
            <div className="flex items-center gap-2 text-muted mb-1">
              <Brain size={14} />
              <span className="text-xs font-medium">Sessions This Week</span>
            </div>
            <p className="text-2xl font-bold">12</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Units */}
          <div className="lg:col-span-2 space-y-4 animate-fade-in">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <BookOpen size={18} className="text-primary" />
              Your Active Units
            </h2>

            {units.map((unit) => (
              <Link
                key={unit.id}
                href="/student/chat"
                className="block bg-white rounded-xl border border-border p-5 hover:shadow-lg hover:border-primary/20 transition-all group"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-base">{unit.name}</h3>
                      {unit.status === "mastered" && (
                        <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 text-xs font-medium flex items-center gap-1">
                          <Star size={10} />
                          Mastered
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-muted mt-0.5">
                      {unit.course} &middot; Last session: {unit.lastSession}
                    </p>

                    {/* Objectives progress */}
                    <div className="flex items-center gap-2 mt-3">
                      {Array.from({ length: unit.objectives }).map((_, i) => (
                        <div
                          key={i}
                          className={`w-7 h-7 rounded-lg flex items-center justify-center ${
                            i < unit.completed
                              ? "bg-emerald-100"
                              : "bg-gray-100"
                          }`}
                        >
                          {i < unit.completed ? (
                            <CheckCircle2
                              size={14}
                              className="text-emerald-600"
                            />
                          ) : (
                            <Circle size={14} className="text-gray-300" />
                          )}
                        </div>
                      ))}
                      <span className="text-xs text-muted ml-2">
                        {unit.completed}/{unit.objectives} objectives
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <div className="relative w-14 h-14">
                        <svg
                          className="w-14 h-14 -rotate-90"
                          viewBox="0 0 56 56"
                        >
                          <circle
                            cx="28"
                            cy="28"
                            r="24"
                            fill="none"
                            stroke="#f1f5f9"
                            strokeWidth="4"
                          />
                          <circle
                            cx="28"
                            cy="28"
                            r="24"
                            fill="none"
                            stroke={
                              unit.mastery >= 75
                                ? "#10b981"
                                : unit.mastery >= 50
                                ? "#f59e0b"
                                : "#ef4444"
                            }
                            strokeWidth="4"
                            strokeLinecap="round"
                            strokeDasharray={`${
                              (unit.mastery / 100) * 150.8
                            } 150.8`}
                          />
                        </svg>
                        <span className="absolute inset-0 flex items-center justify-center text-xs font-bold">
                          {unit.mastery}%
                        </span>
                      </div>
                    </div>
                    <ChevronRight
                      size={18}
                      className="text-muted group-hover:text-primary transition-colors"
                    />
                  </div>
                </div>
              </Link>
            ))}

            {/* Continue Learning CTA */}
            <Link
              href="/student/chat"
              className="block bg-gradient-to-r from-indigo-600 to-indigo-700 rounded-xl p-6 text-white hover:from-indigo-700 hover:to-indigo-800 transition-all"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-lg">Continue Learning</h3>
                  <p className="text-indigo-200 text-sm mt-1">
                    Pick up where you left off with Cell Division & Mitosis
                  </p>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-white/20 rounded-lg text-sm font-medium">
                  <Brain size={16} />
                  Start Session
                </div>
              </div>
            </Link>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6 animate-fade-in">
            {/* Topic Confidence */}
            <div className="bg-white rounded-xl border border-border p-5">
              <h3 className="font-semibold flex items-center gap-2 mb-4">
                <Target size={16} className="text-primary" />
                Topic Confidence
              </h3>
              <div className="space-y-3">
                {recentTopics.map((t) => (
                  <div key={t.topic}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm">{t.topic}</span>
                      <span
                        className={`text-xs font-medium ${
                          t.confidence === "high"
                            ? "text-emerald-600"
                            : t.confidence === "medium"
                            ? "text-amber-600"
                            : "text-red-500"
                        }`}
                      >
                        {t.confidence}
                      </span>
                    </div>
                    <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          t.confidence === "high"
                            ? "bg-emerald-500 w-[85%]"
                            : t.confidence === "medium"
                            ? "bg-amber-500 w-[55%]"
                            : "bg-red-500 w-[30%]"
                        }`}
                      />
                    </div>
                    <p className="text-[10px] text-muted mt-0.5">
                      Last practiced: {t.lastPracticed}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Achievements */}
            <div className="bg-white rounded-xl border border-border p-5">
              <h3 className="font-semibold flex items-center gap-2 mb-4">
                <Star size={16} className="text-amber-500" />
                Recent Achievements
              </h3>
              <div className="space-y-3">
                {achievements.map((a, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 p-2.5 rounded-lg bg-amber-50 border border-amber-100"
                  >
                    <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm">
                      <a.icon size={16} className={a.color} />
                    </div>
                    <span className="text-sm font-medium">{a.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* AI Learning Tips */}
            <div className="bg-gradient-to-br from-cyan-50 to-indigo-50 rounded-xl border border-indigo-100 p-5">
              <h3 className="font-semibold flex items-center gap-2 mb-3">
                <Sparkles size={16} className="text-indigo-500" />
                Learning Tip
              </h3>
              <p className="text-sm text-muted leading-relaxed">
                You learn best through visual analogies! Try asking the AI
                to explain concepts using real-world comparisons. For example:
                &quot;Can you explain mitosis like a factory assembly line?&quot;
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
