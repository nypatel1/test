"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import TeacherLayout from "../../components/TeacherLayout";
import {
  Brain,
  TrendingUp,
  AlertTriangle,
  ArrowUpRight,
  ArrowDownRight,
  BarChart3,
  Zap,
  Filter,
} from "lucide-react";

const ChartsSection = dynamic(() => import("./ChartsSection"), { ssr: false });

const misconceptions = [
  {
    topic: "Cell Division",
    issue: "Confusing mitosis (2 identical cells) with meiosis (4 unique cells)",
    students: 12,
    severity: "high" as const,
    trend: "stable" as const,
  },
  {
    topic: "DNA Replication",
    issue: "Believing replication only occurs in one direction along the strand",
    students: 9,
    severity: "medium" as const,
    trend: "improving" as const,
  },
  {
    topic: "Protein Synthesis",
    issue: "Mixing up where transcription (nucleus) and translation (ribosome) occur",
    students: 7,
    severity: "medium" as const,
    trend: "worsening" as const,
  },
  {
    topic: "Cell Cycle",
    issue: "Thinking G1 and G2 phases are identical rest periods",
    students: 5,
    severity: "low" as const,
    trend: "improving" as const,
  },
  {
    topic: "Genetics",
    issue: "Confusing genotype (genetic makeup) with phenotype (observable traits)",
    students: 15,
    severity: "high" as const,
    trend: "worsening" as const,
  },
];

const masteryHeatmapData = [
  { student: "Alex R.", objectives: [95, 88, 72, 90, 85, 78] },
  { student: "Jordan K.", objectives: [78, 65, 82, 55, 71, 60] },
  { student: "Taylor N.", objectives: [45, 38, 52, 30, 48, 42] },
  { student: "Morgan P.", objectives: [92, 88, 95, 85, 90, 88] },
  { student: "Casey W.", objectives: [62, 70, 58, 65, 55, 72] },
  { student: "Sam O.", objectives: [38, 42, 35, 28, 45, 32] },
  { student: "Jamie L.", objectives: [85, 78, 90, 82, 75, 88] },
  { student: "Quinn D.", objectives: [72, 68, 75, 58, 82, 65] },
];

const objectiveLabels = [
  "Mitosis Stages",
  "Mitosis vs Meiosis",
  "Checkpoints",
  "Division Errors",
  "Growth & Repair",
  "Microscope Images",
];

function getHeatColor(value: number) {
  if (value >= 85) return "bg-emerald-500 text-white";
  if (value >= 70) return "bg-emerald-300 text-emerald-900";
  if (value >= 55) return "bg-amber-300 text-amber-900";
  if (value >= 40) return "bg-orange-400 text-white";
  return "bg-red-500 text-white";
}

export default function InsightsPage() {
  const [severityFilter, setSeverityFilter] = useState<string>("all");

  const filteredMisconceptions =
    severityFilter === "all"
      ? misconceptions
      : misconceptions.filter((m) => m.severity === severityFilter);

  return (
    <TeacherLayout>
      <div className="max-w-7xl animate-fade-in">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-foreground">
            Student Insights
          </h1>
          <p className="text-muted mt-1">
            Real-time analytics on understanding, misconceptions, engagement,
            and mastery across your classes.
          </p>
        </div>

        {/* Top Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mb-8">
          <div className="bg-white rounded-xl border border-border p-5">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted font-medium">
                Overall Class Mastery
              </p>
              <TrendingUp size={16} className="text-emerald-500" />
            </div>
            <p className="text-3xl font-bold mt-1">73%</p>
            <p className="text-xs text-emerald-600 mt-1 flex items-center gap-1">
              <ArrowUpRight size={12} />
              +5% from last week
            </p>
          </div>
          <div className="bg-white rounded-xl border border-border p-5">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted font-medium">
                Active Misconceptions
              </p>
              <Brain size={16} className="text-amber-500" />
            </div>
            <p className="text-3xl font-bold mt-1">{misconceptions.length}</p>
            <p className="text-xs text-amber-600 mt-1 flex items-center gap-1">
              <ArrowUpRight size={12} />
              {misconceptions.filter((m) => m.severity === "high").length} need
              attention
            </p>
          </div>
          <div className="bg-white rounded-xl border border-border p-5">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted font-medium">
                Students Struggling
              </p>
              <AlertTriangle size={16} className="text-red-500" />
            </div>
            <p className="text-3xl font-bold mt-1">8</p>
            <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
              <ArrowDownRight size={12} />2 more than last week
            </p>
          </div>
          <div className="bg-white rounded-xl border border-border p-5">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted font-medium">Avg. Engagement</p>
              <Zap size={16} className="text-indigo-500" />
            </div>
            <p className="text-3xl font-bold mt-1">19 min</p>
            <p className="text-xs text-muted mt-1">per session this week</p>
          </div>
        </div>

        {/* Recharts Interactive Section */}
        <ChartsSection />

        {/* Heatmap + Misconceptions */}
        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          {/* Mastery Heatmap */}
          <div className="lg:col-span-2 bg-white rounded-xl border border-border p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <BarChart3 size={18} className="text-primary" />
                <h2 className="font-semibold text-lg">
                  Concept Mastery Heatmap
                </h2>
              </div>
              <div className="flex items-center gap-4 text-xs text-muted">
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded bg-emerald-500" /> 85%+
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded bg-emerald-300" /> 70-84%
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded bg-amber-300" /> 55-69%
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded bg-orange-400" /> 40-54%
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded bg-red-500" /> &lt;40%
                </span>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr>
                    <th className="text-left text-xs font-semibold text-muted pb-3 pr-4 w-28">
                      Student
                    </th>
                    {objectiveLabels.map((obj) => (
                      <th
                        key={obj}
                        className="text-center text-xs font-semibold text-muted pb-3 px-2 min-w-[90px]"
                      >
                        {obj}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {masteryHeatmapData.map((row, i) => (
                    <tr key={i}>
                      <td className="text-sm font-medium pr-4 py-1.5">
                        {row.student}
                      </td>
                      {row.objectives.map((val, j) => (
                        <td key={j} className="px-1 py-1.5">
                          <div
                            className={`rounded-lg py-2 text-center text-xs font-bold ${getHeatColor(
                              val
                            )}`}
                          >
                            {val}%
                          </div>
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Misconceptions with filter */}
          <div className="lg:col-span-2 bg-white rounded-xl border border-border">
            <div className="p-5 border-b border-border">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Brain size={18} className="text-amber-500" />
                  <h2 className="font-semibold text-lg">
                    Detected Misconceptions
                  </h2>
                </div>
                <div className="flex items-center gap-2">
                  <Filter size={14} className="text-muted" />
                  <select
                    value={severityFilter}
                    onChange={(e) => setSeverityFilter(e.target.value)}
                    className="text-sm border border-border rounded-lg px-2 py-1 bg-white"
                  >
                    <option value="all">All Severities</option>
                    <option value="high">High Only</option>
                    <option value="medium">Medium Only</option>
                    <option value="low">Low Only</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="divide-y divide-border">
              {filteredMisconceptions.map((m, i) => (
                <div key={i} className="p-5">
                  <div className="flex items-start justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <span
                        className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                          m.severity === "high"
                            ? "bg-red-100 text-red-700"
                            : m.severity === "medium"
                            ? "bg-amber-100 text-amber-700"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {m.severity}
                      </span>
                      <span className="text-sm font-medium">{m.topic}</span>
                    </div>
                    <span
                      className={`text-xs flex items-center gap-1 ${
                        m.trend === "improving"
                          ? "text-emerald-600"
                          : m.trend === "worsening"
                          ? "text-red-600"
                          : "text-gray-500"
                      }`}
                    >
                      {m.trend === "improving" ? (
                        <ArrowDownRight size={12} />
                      ) : m.trend === "worsening" ? (
                        <ArrowUpRight size={12} />
                      ) : (
                        "—"
                      )}{" "}
                      {m.trend}
                    </span>
                  </div>
                  <p className="text-sm text-muted">{m.issue}</p>
                  <p className="text-xs text-amber-600 mt-1.5 font-medium">
                    {m.students} students affected
                  </p>
                </div>
              ))}
              {filteredMisconceptions.length === 0 && (
                <p className="p-5 text-sm text-muted text-center">
                  No misconceptions match this filter.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </TeacherLayout>
  );
}
