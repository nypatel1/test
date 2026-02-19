"use client";

import { useState } from "react";
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
} from "lucide-react";

const objectives = [
  {
    id: 1,
    text: "Describe the stages of mitosis and their key events",
    depth: "Explain",
    mastery: 78,
  },
  {
    id: 2,
    text: "Compare and contrast mitosis and meiosis",
    depth: "Analyze",
    mastery: 54,
  },
  {
    id: 3,
    text: "Explain the role of checkpoints in cell cycle regulation",
    depth: "Explain",
    mastery: 71,
  },
  {
    id: 4,
    text: "Predict outcomes of errors in cell division",
    depth: "Apply",
    mastery: 45,
  },
  {
    id: 5,
    text: "Connect cell division to growth, repair, and reproduction",
    depth: "Synthesize",
    mastery: 82,
  },
  {
    id: 6,
    text: "Interpret microscope images of dividing cells",
    depth: "Apply",
    mastery: 69,
  },
];

const studentProgress = [
  { name: "Alex Rivera", mastery: 92, sessions: 8, status: "mastered" },
  { name: "Jordan Kim", mastery: 78, sessions: 12, status: "progressing" },
  { name: "Taylor Nguyen", mastery: 45, sessions: 6, status: "struggling" },
  { name: "Morgan Patel", mastery: 88, sessions: 9, status: "mastered" },
  { name: "Casey Wright", mastery: 62, sessions: 4, status: "progressing" },
  { name: "Sam Okafor", mastery: 38, sessions: 10, status: "struggling" },
];

export default function UnitDetailPage() {
  const [approach, setApproach] = useState("socratic");
  const [scaffolding, setScaffolding] = useState(3);
  const [tab, setTab] = useState<"config" | "students" | "preview">("config");

  const approaches = [
    {
      id: "socratic",
      name: "Socratic Method",
      desc: "AI asks guiding questions to help students discover answers themselves",
    },
    {
      id: "step-by-step",
      name: "Step-by-Step",
      desc: "AI breaks concepts into small, sequential steps with checkpoints",
    },
    {
      id: "conceptual",
      name: "Conceptual-First",
      desc: "AI builds the big picture first, then dives into details",
    },
    {
      id: "example-driven",
      name: "Example-Driven",
      desc: "AI uses real-world examples and analogies to teach concepts",
    },
  ];

  const boundaries = [
    {
      label: "Never provide direct answers to assessment questions",
      enabled: true,
    },
    {
      label: "Don't write essays or complete assignments for students",
      enabled: true,
    },
    { label: "Restrict to unit-specific topics only", enabled: true },
    {
      label: "Always ask a follow-up question after explaining a concept",
      enabled: true,
    },
    { label: "Allow students to request practice problems", enabled: true },
    {
      label: "Allow access to supplementary materials beyond textbook",
      enabled: false,
    },
    {
      label: "Flag student if they ask for direct answers 3+ times",
      enabled: true,
    },
  ];

  return (
    <TeacherLayout>
      <div className="max-w-6xl animate-fade-in">
        {/* Breadcrumb */}
        <Link
          href="/teacher/courses"
          className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-primary transition-colors mb-4"
        >
          <ArrowLeft size={14} />
          Back to Courses
        </Link>

        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold">Cell Division & Mitosis</h1>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-700 text-xs font-medium">
                Active
              </span>
            </div>
            <p className="text-muted mt-1">
              AP Biology — Period 3 &middot; 34 students &middot; 5 days
              remaining
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button className="px-4 py-2 border border-border rounded-lg text-sm font-medium hover:bg-surface-hover transition-colors flex items-center gap-1.5">
              <Eye size={15} />
              Preview as Student
            </button>
            <button className="px-5 py-2 bg-primary text-white rounded-lg text-sm font-semibold hover:bg-primary-dark transition-colors shadow-lg shadow-indigo-500/20 flex items-center gap-1.5">
              <Save size={15} />
              Save Changes
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-6 bg-gray-100 rounded-lg p-1 w-fit">
          {[
            { id: "config" as const, label: "AI Configuration", icon: Sliders },
            {
              id: "students" as const,
              label: "Student Progress",
              icon: Users,
            },
            {
              id: "preview" as const,
              label: "Chat Preview",
              icon: MessageSquare,
            },
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
                Define what mastery looks like. The AI will guide students toward
                these objectives.
              </p>
              <div className="space-y-3">
                {objectives.map((obj) => (
                  <div
                    key={obj.id}
                    className="flex items-start gap-3 p-3 rounded-lg border border-border hover:border-primary/20 transition-colors"
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
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <button className="mt-4 text-sm text-primary font-medium hover:underline flex items-center gap-1">
                + Add objective
              </button>
            </div>

            {/* Teaching Approach */}
            <div className="space-y-6">
              <div className="bg-white rounded-xl border border-border p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Brain size={18} className="text-accent" />
                  <h2 className="font-semibold text-lg">Teaching Approach</h2>
                </div>
                <p className="text-sm text-muted mb-4">
                  Choose how the AI should interact with students in this unit.
                </p>
                <div className="space-y-2">
                  {approaches.map((a) => (
                    <label
                      key={a.id}
                      className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
                        approach === a.id
                          ? "border-primary bg-indigo-50/50"
                          : "border-border hover:border-gray-300"
                      }`}
                    >
                      <input
                        type="radio"
                        name="approach"
                        value={a.id}
                        checked={approach === a.id}
                        onChange={() => setApproach(a.id)}
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

              {/* Scaffolding Level */}
              <div className="bg-white rounded-xl border border-border p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Sliders size={18} className="text-emerald-500" />
                  <h2 className="font-semibold text-lg">Scaffolding Level</h2>
                </div>
                <p className="text-sm text-muted mb-4">
                  How much support should the AI provide before students must
                  think independently?
                </p>
                <div className="space-y-3">
                  <input
                    type="range"
                    min={1}
                    max={5}
                    value={scaffolding}
                    onChange={(e) => setScaffolding(Number(e.target.value))}
                    className="w-full accent-[#4f46e5]"
                  />
                  <div className="flex justify-between text-xs text-muted">
                    <span>Minimal hints</span>
                    <span>Balanced</span>
                    <span>Heavy support</span>
                  </div>
                  <div className="p-3 bg-indigo-50 rounded-lg">
                    <p className="text-sm text-indigo-800">
                      {scaffolding <= 2
                        ? "The AI will give minimal hints and expect students to work through problems with little guidance. Best for advanced learners."
                        : scaffolding <= 3
                        ? "The AI will provide moderate scaffolding — guiding questions and partial explanations while still requiring student reasoning."
                        : "The AI will provide detailed step-by-step support, breaking concepts into very small pieces. Best for students who need extra help."}
                    </p>
                  </div>
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
                Set guardrails for how the AI can and cannot interact with
                students. These ensure alignment and prevent misuse.
              </p>
              <div className="grid md:grid-cols-2 gap-3">
                {boundaries.map((b, i) => (
                  <label
                    key={i}
                    className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
                      b.enabled
                        ? "border-emerald-200 bg-emerald-50/50"
                        : "border-border"
                    }`}
                  >
                    <div
                      className={`w-9 h-5 rounded-full relative transition-colors ${
                        b.enabled ? "bg-emerald-500" : "bg-gray-200"
                      }`}
                    >
                      <div
                        className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${
                          b.enabled ? "translate-x-4" : "translate-x-0.5"
                        }`}
                      />
                    </div>
                    <span className="text-sm">{b.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Allowed Sources */}
            <div className="lg:col-span-2 bg-white rounded-xl border border-border p-6">
              <div className="flex items-center gap-2 mb-4">
                <BookOpen size={18} className="text-primary" />
                <h2 className="font-semibold text-lg">Allowed Sources</h2>
              </div>
              <p className="text-sm text-muted mb-4">
                Restrict the AI to only reference these materials when teaching.
              </p>
              <div className="flex flex-wrap gap-2">
                {[
                  "Campbell Biology (Ch. 12)",
                  "Class Lecture Notes — Week 6-7",
                  "Lab Manual: Mitosis Observation",
                  "AP Bio College Board Unit 5",
                ].map((src) => (
                  <div
                    key={src}
                    className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 rounded-lg text-sm"
                  >
                    <BookOpen size={13} className="text-muted" />
                    {src}
                    <button className="text-gray-400 hover:text-red-500 transition-colors">
                      <XCircle size={13} />
                    </button>
                  </div>
                ))}
                <button className="px-3 py-1.5 border border-dashed border-primary/30 rounded-lg text-sm text-primary hover:bg-indigo-50 transition-colors">
                  + Add source
                </button>
              </div>
            </div>
          </div>
        )}

        {tab === "students" && (
          <div className="bg-white rounded-xl border border-border">
            <div className="p-5 border-b border-border">
              <h2 className="font-semibold text-lg">
                Student Progress — Cell Division & Mitosis
              </h2>
              <p className="text-sm text-muted mt-1">
                Track individual student mastery and engagement in this unit.
              </p>
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
                        {s.sessions} sessions
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
                          {s.status.charAt(0).toUpperCase() +
                            s.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="flex gap-1">
                          {objectives.slice(0, 6).map((_, j) => (
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
                Chat Preview — How Students Will Experience This Unit
              </h2>
              <p className="text-sm text-muted mt-1">
                This shows a simulated conversation based on your current
                configuration.
              </p>
            </div>
            <div className="p-6 space-y-4 max-w-3xl mx-auto">
              {/* AI message */}
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white flex-shrink-0">
                  <Brain size={16} />
                </div>
                <div className="bg-indigo-50 rounded-2xl rounded-tl-sm px-4 py-3 max-w-md">
                  <p className="text-sm">
                    Welcome! We&apos;re exploring cell division today. Let&apos;s
                    start with a question: What do you think happens to a
                    cell&apos;s DNA before it divides? Take a guess!
                  </p>
                </div>
              </div>
              {/* Student message */}
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
              {/* AI follow-up */}
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white flex-shrink-0">
                  <Brain size={16} />
                </div>
                <div className="bg-indigo-50 rounded-2xl rounded-tl-sm px-4 py-3 max-w-md">
                  <p className="text-sm">
                    Great thinking! You&apos;re on the right track. The DNA does
                    get copied — this process is called{" "}
                    <strong>replication</strong>. Now, here&apos;s a deeper
                    question: <em>Why</em> is it important that the DNA is
                    copied <em>exactly</em>? What might happen if there were
                    errors?
                  </p>
                </div>
              </div>
              {/* Student */}
              <div className="flex gap-3 justify-end">
                <div className="bg-gray-100 rounded-2xl rounded-tr-sm px-4 py-3 max-w-md">
                  <p className="text-sm">
                    Maybe the new cell wouldn&apos;t work right? Like mutations
                    or something?
                  </p>
                </div>
                <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                  AR
                </div>
              </div>
              {/* AI */}
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white flex-shrink-0">
                  <Brain size={16} />
                </div>
                <div className="bg-indigo-50 rounded-2xl rounded-tl-sm px-4 py-3 max-w-md">
                  <p className="text-sm">
                    Exactly! Errors in DNA copying can lead to{" "}
                    <strong>mutations</strong>, which might cause the cell to
                    malfunction. This connects to one of our key objectives:
                    understanding <em>cell cycle checkpoints</em>. Can you think
                    of why a cell might have &quot;checkpoints&quot; before it
                    proceeds to divide?
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-center gap-2 py-4">
                <div className="h-px flex-1 bg-border" />
                <span className="text-xs text-muted px-3 flex items-center gap-1.5">
                  <Shield size={12} className="text-emerald-500" />
                  AI stayed within unit scope • Socratic method active • No
                  answers given directly
                </span>
                <div className="h-px flex-1 bg-border" />
              </div>
            </div>
          </div>
        )}
      </div>
    </TeacherLayout>
  );
}
