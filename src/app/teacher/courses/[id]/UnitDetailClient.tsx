"use client";

import { useState } from "react";
import { useIsMounted } from "@/lib/useIsMounted";
import TeacherLayout from "../../../components/TeacherLayout";
import Link from "next/link";
import {
  ArrowLeft,
  Target,
  BookOpen,
  Shield,
  Brain,
  Sliders,
  CheckCircle2,
  XCircle,
  Save,
  Eye,
  Users,
  MessageSquare,
  Check,
  Plus,
} from "lucide-react";
import { TeacherConfig, DEFAULT_TEACHER_CONFIG } from "@/lib/types";
import { getTeacherConfig, saveTeacherConfig } from "@/lib/storage";

const studentProgress = [
  { name: "Alex Rivera", mastery: 92, sessions: 8, status: "mastered" },
  { name: "Jordan Kim", mastery: 78, sessions: 12, status: "progressing" },
  { name: "Taylor Nguyen", mastery: 45, sessions: 6, status: "struggling" },
  { name: "Morgan Patel", mastery: 88, sessions: 9, status: "mastered" },
  { name: "Casey Wright", mastery: 62, sessions: 4, status: "progressing" },
  { name: "Sam Okafor", mastery: 38, sessions: 10, status: "struggling" },
];

export default function UnitDetailClient() {
  const [config, setConfig] = useState<TeacherConfig>(() => {
    if (typeof window !== "undefined") {
      return getTeacherConfig();
    }
    return DEFAULT_TEACHER_CONFIG;
  });
  const [tab, setTab] = useState<"config" | "students" | "preview">("config");
  const [saved, setSaved] = useState(false);
  const mounted = useIsMounted();
  const [newObjective, setNewObjective] = useState("");

  const handleSave = () => {
    saveTeacherConfig(config);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const updateConfig = (partial: Partial<TeacherConfig>) => {
    setConfig((prev) => ({ ...prev, ...partial }));
  };

  const toggleBoundary = (index: number) => {
    const updated = [...config.boundaries];
    updated[index] = { ...updated[index], enabled: !updated[index].enabled };
    updateConfig({ boundaries: updated });
  };

  const addObjective = () => {
    if (!newObjective.trim()) return;
    const newObj = {
      id: Date.now(),
      text: newObjective.trim(),
      depth: "Explain",
      mastery: 0,
    };
    updateConfig({ objectives: [...config.objectives, newObj] });
    setNewObjective("");
  };

  const removeObjective = (id: number) => {
    updateConfig({
      objectives: config.objectives.filter((o) => o.id !== id),
    });
  };

  const removeSource = (source: string) => {
    updateConfig({
      allowedSources: config.allowedSources.filter((s) => s !== source),
    });
  };

  if (!mounted) return null;

  const approaches = [
    {
      id: "socratic" as const,
      name: "Socratic Method",
      desc: "AI asks guiding questions to help students discover answers",
    },
    {
      id: "step-by-step" as const,
      name: "Step-by-Step",
      desc: "AI breaks concepts into small, sequential steps",
    },
    {
      id: "conceptual" as const,
      name: "Conceptual-First",
      desc: "AI builds the big picture first, then details",
    },
    {
      id: "example-driven" as const,
      name: "Example-Driven",
      desc: "AI uses real-world examples and analogies",
    },
  ];

  return (
    <TeacherLayout>
      <div className="max-w-6xl animate-fade-in">
        <Link
          href="/teacher/courses"
          className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-primary transition-colors mb-4"
        >
          <ArrowLeft size={14} />
          Back to Courses
        </Link>

        <div className="flex items-start justify-between mb-6">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold">{config.unitName}</h1>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-700 text-xs font-medium">
                Active
              </span>
            </div>
            <p className="text-muted mt-1">
              {config.courseName} &middot; 34 students &middot; 5 days remaining
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href="/student/chat"
              className="px-4 py-2 border border-border rounded-lg text-sm font-medium hover:bg-surface-hover transition-colors flex items-center gap-1.5"
            >
              <Eye size={15} />
              Preview as Student
            </Link>
            <button
              onClick={handleSave}
              className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-1.5 ${
                saved
                  ? "bg-emerald-500 text-white"
                  : "bg-primary text-white hover:bg-primary-dark shadow-lg shadow-indigo-500/20"
              }`}
            >
              {saved ? <Check size={15} /> : <Save size={15} />}
              {saved ? "Saved!" : "Save Changes"}
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-6 bg-gray-100 rounded-lg p-1 w-fit">
          {[
            { id: "config" as const, label: "AI Configuration", icon: Sliders },
            { id: "students" as const, label: "Student Progress", icon: Users },
            { id: "preview" as const, label: "Chat Preview", icon: MessageSquare },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-md text-sm font-medium transition-all ${
                tab === t.id
                  ? "bg-white shadow-sm text-foreground"
                  : "text-muted hover:text-foreground"
              }`}
            >
              <t.icon size={15} />
              {t.label}
            </button>
          ))}
        </div>

        {tab === "config" && (
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Learning Objectives */}
            <div className="bg-white rounded-xl border border-border p-6">
              <div className="flex items-center gap-2 mb-4">
                <Target size={18} className="text-primary" />
                <h2 className="font-semibold text-lg">Learning Objectives</h2>
              </div>
              <p className="text-sm text-muted mb-4">
                Define what mastery looks like. These are injected into the AI&apos;s
                system prompt.
              </p>
              <div className="space-y-3">
                {config.objectives.map((obj) => (
                  <div
                    key={obj.id}
                    className="flex items-start gap-3 p-3 rounded-lg border border-border hover:border-primary/20 transition-colors group"
                  >
                    <CheckCircle2
                      size={16}
                      className="text-primary mt-0.5 flex-shrink-0"
                    />
                    <div className="flex-1">
                      <p className="text-sm">{obj.text}</p>
                      <div className="flex items-center gap-3 mt-1.5">
                        <span className="px-2 py-0.5 rounded bg-indigo-100 text-indigo-700 text-xs font-medium">
                          {obj.depth}
                        </span>
                        {obj.mastery > 0 && (
                          <div className="flex items-center gap-1.5">
                            <div className="w-12 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                              <div
                                className={`h-full rounded-full ${
                                  obj.mastery >= 75
                                    ? "bg-emerald-500"
                                    : obj.mastery >= 60
                                    ? "bg-amber-500"
                                    : "bg-red-500"
                                }`}
                                style={{ width: `${obj.mastery}%` }}
                              />
                            </div>
                            <span className="text-xs text-muted">
                              {obj.mastery}%
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={() => removeObjective(obj.id)}
                      className="text-gray-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                    >
                      <XCircle size={14} />
                    </button>
                  </div>
                ))}
              </div>
              <div className="mt-4 flex gap-2">
                <input
                  type="text"
                  value={newObjective}
                  onChange={(e) => setNewObjective(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && addObjective()}
                  placeholder="Add a new objective..."
                  className="flex-1 text-sm border border-border rounded-lg px-3 py-2 outline-none focus:border-primary/40"
                />
                <button
                  onClick={addObjective}
                  disabled={!newObjective.trim()}
                  className="px-3 py-2 bg-primary text-white rounded-lg text-sm disabled:opacity-50 flex items-center gap-1"
                >
                  <Plus size={14} />
                  Add
                </button>
              </div>
            </div>

            {/* Teaching Approach & Scaffolding */}
            <div className="space-y-6">
              <div className="bg-white rounded-xl border border-border p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Brain size={18} className="text-accent" />
                  <h2 className="font-semibold text-lg">Teaching Approach</h2>
                </div>
                <div className="space-y-2">
                  {approaches.map((a) => (
                    <label
                      key={a.id}
                      className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
                        config.approach === a.id
                          ? "border-primary bg-indigo-50/50"
                          : "border-border hover:border-gray-300"
                      }`}
                    >
                      <input
                        type="radio"
                        name="approach"
                        checked={config.approach === a.id}
                        onChange={() => updateConfig({ approach: a.id })}
                        className="mt-1 accent-[#4f46e5]"
                      />
                      <div>
                        <p className="text-sm font-medium">{a.name}</p>
                        <p className="text-xs text-muted mt-0.5">{a.desc}</p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-xl border border-border p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Sliders size={18} className="text-emerald-500" />
                  <h2 className="font-semibold text-lg">Scaffolding Level</h2>
                </div>
                <input
                  type="range"
                  min={1}
                  max={5}
                  value={config.scaffolding}
                  onChange={(e) =>
                    updateConfig({ scaffolding: Number(e.target.value) })
                  }
                  className="w-full accent-[#4f46e5]"
                />
                <div className="flex justify-between text-xs text-muted mt-1">
                  <span>Minimal hints</span>
                  <span>Balanced</span>
                  <span>Heavy support</span>
                </div>
                <div className="p-3 bg-indigo-50 rounded-lg mt-3">
                  <p className="text-sm text-indigo-800">
                    {config.scaffolding <= 2
                      ? "Minimal hints — students work through problems with little guidance."
                      : config.scaffolding <= 3
                      ? "Moderate scaffolding — guiding questions with partial explanations."
                      : "Heavy scaffolding — detailed step-by-step support for all students."}
                  </p>
                </div>
              </div>
            </div>

            {/* Boundaries */}
            <div className="lg:col-span-2 bg-white rounded-xl border border-border p-6">
              <div className="flex items-center gap-2 mb-4">
                <Shield size={18} className="text-red-500" />
                <h2 className="font-semibold text-lg">
                  Boundaries & Restrictions
                </h2>
              </div>
              <p className="text-sm text-muted mb-4">
                These guardrails are directly injected into the AI system prompt.
                Toggle them to control student interactions.
              </p>
              <div className="grid md:grid-cols-2 gap-3">
                {config.boundaries.map((b, i) => (
                  <div
                    key={i}
                    className={`flex items-center gap-3 p-3 rounded-lg border transition-all ${
                      b.enabled
                        ? "border-emerald-200 bg-emerald-50/50"
                        : "border-border"
                    }`}
                  >
                    <button
                      onClick={() => toggleBoundary(i)}
                      className={`w-9 h-5 rounded-full relative transition-colors flex-shrink-0 ${
                        b.enabled ? "bg-emerald-500" : "bg-gray-200"
                      }`}
                    >
                      <div
                        className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${
                          b.enabled ? "translate-x-4" : "translate-x-0.5"
                        }`}
                      />
                    </button>
                    <span className="text-sm">{b.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Allowed Sources */}
            <div className="lg:col-span-2 bg-white rounded-xl border border-border p-6">
              <div className="flex items-center gap-2 mb-4">
                <BookOpen size={18} className="text-primary" />
                <h2 className="font-semibold text-lg">Allowed Sources</h2>
              </div>
              <div className="flex flex-wrap gap-2">
                {config.allowedSources.map((src) => (
                  <div
                    key={src}
                    className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 rounded-lg text-sm"
                  >
                    <BookOpen size={13} className="text-muted" />
                    {src}
                    <button
                      onClick={() => removeSource(src)}
                      className="text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <XCircle size={13} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {tab === "students" && (
          <div className="bg-white rounded-xl border border-border">
            <div className="p-5 border-b border-border">
              <h2 className="font-semibold text-lg">
                Student Progress — {config.unitName}
              </h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border bg-gray-50">
                    <th className="text-left text-xs font-semibold text-muted px-5 py-3">
                      Student
                    </th>
                    <th className="text-left text-xs font-semibold text-muted px-5 py-3">
                      Mastery
                    </th>
                    <th className="text-left text-xs font-semibold text-muted px-5 py-3">
                      Sessions
                    </th>
                    <th className="text-left text-xs font-semibold text-muted px-5 py-3">
                      Status
                    </th>
                    <th className="text-left text-xs font-semibold text-muted px-5 py-3">
                      Objectives
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {studentProgress.map((s, i) => (
                    <tr
                      key={i}
                      className="hover:bg-surface-hover transition-colors"
                    >
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold ${
                              s.status === "mastered"
                                ? "bg-emerald-500"
                                : s.status === "struggling"
                                ? "bg-amber-500"
                                : "bg-indigo-500"
                            }`}
                          >
                            {s.name
                              .split(" ")
                              .map((w) => w[0])
                              .join("")}
                          </div>
                          <span className="text-sm font-medium">{s.name}</span>
                        </div>
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-2">
                          <div className="w-20 h-2 bg-gray-100 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full ${
                                s.mastery >= 75
                                  ? "bg-emerald-500"
                                  : s.mastery >= 60
                                  ? "bg-amber-500"
                                  : "bg-red-500"
                              }`}
                              style={{ width: `${s.mastery}%` }}
                            />
                          </div>
                          <span className="text-sm font-semibold">
                            {s.mastery}%
                          </span>
                        </div>
                      </td>
                      <td className="px-5 py-3.5 text-sm text-muted">
                        {s.sessions}
                      </td>
                      <td className="px-5 py-3.5">
                        <span
                          className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                            s.status === "mastered"
                              ? "bg-emerald-100 text-emerald-700"
                              : s.status === "struggling"
                              ? "bg-amber-100 text-amber-700"
                              : "bg-indigo-100 text-indigo-700"
                          }`}
                        >
                          {s.status.charAt(0).toUpperCase() + s.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="flex gap-1">
                          {config.objectives.slice(0, 6).map((_, j) => (
                            <div
                              key={j}
                              className={`w-5 h-5 rounded text-[10px] font-bold flex items-center justify-center ${
                                j < Math.floor((s.mastery / 100) * 6)
                                  ? "bg-emerald-100 text-emerald-700"
                                  : j === Math.floor((s.mastery / 100) * 6)
                                  ? "bg-amber-100 text-amber-700"
                                  : "bg-gray-100 text-gray-400"
                              }`}
                            >
                              {j + 1}
                            </div>
                          ))}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {tab === "preview" && (
          <div className="bg-white rounded-xl border border-border overflow-hidden">
            <div className="p-5 border-b border-border bg-gradient-to-r from-indigo-50/50 to-transparent">
              <h2 className="font-semibold text-lg">
                Chat Preview — How Students Experience This Unit
              </h2>
              <p className="text-sm text-muted mt-1">
                Based on your current config: <strong>{config.approach.replace("-", " ")}</strong> method,
                scaffolding level {config.scaffolding}/5,{" "}
                {config.boundaries.filter((b) => b.enabled).length} active boundaries.
              </p>
            </div>
            <div className="p-6 space-y-4 max-w-3xl mx-auto">
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white flex-shrink-0">
                  <Brain size={16} />
                </div>
                <div className="bg-indigo-50 rounded-2xl rounded-tl-sm px-4 py-3 max-w-md">
                  <p className="text-sm">
                    Welcome! We&apos;re exploring {config.unitName} today. Let&apos;s
                    start with a question: What do you think happens to a
                    cell&apos;s DNA before it divides?
                  </p>
                </div>
              </div>
              <div className="flex gap-3 justify-end">
                <div className="bg-gray-100 rounded-2xl rounded-tr-sm px-4 py-3 max-w-md">
                  <p className="text-sm">
                    I think the DNA gets copied so each new cell gets a copy?
                  </p>
                </div>
                <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                  AR
                </div>
              </div>
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white flex-shrink-0">
                  <Brain size={16} />
                </div>
                <div className="bg-indigo-50 rounded-2xl rounded-tl-sm px-4 py-3 max-w-md">
                  <p className="text-sm">
                    Great thinking! The DNA does get copied — this is called{" "}
                    <strong>replication</strong>. Now, <em>why</em> is it
                    important that the DNA is copied <em>exactly</em>? What might
                    happen if there were errors?
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-center gap-2 py-4">
                <div className="h-px flex-1 bg-border" />
                <span className="text-xs text-muted px-3 flex items-center gap-1.5">
                  <Shield size={12} className="text-emerald-500" />
                  {config.approach.replace("-", " ")} method active &bull;{" "}
                  {config.boundaries.filter((b) => b.enabled).length} guardrails enforced
                </span>
                <div className="h-px flex-1 bg-border" />
              </div>

              <div className="text-center">
                <Link
                  href="/student/chat"
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-white rounded-lg text-sm font-semibold hover:bg-primary-dark transition-colors"
                >
                  <Brain size={16} />
                  Open Live Student Chat
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </TeacherLayout>
  );
}
