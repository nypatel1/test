"use client";

import TeacherLayout from "../../components/TeacherLayout";
import {
  Brain,
  TrendingUp,
  AlertTriangle,
  ArrowUpRight,
  ArrowDownRight,
  BarChart3,
  Zap,
} from "lucide-react";

const misconceptions = [
  {
    topic: "Cell Division",
    issue: "Confusing mitosis (2 identical cells) with meiosis (4 unique cells)",
    students: 12,
    severity: "high",
    trend: "stable",
  },
  {
    topic: "DNA Replication",
    issue: "Believing replication only occurs in one direction along the strand",
    students: 9,
    severity: "medium",
    trend: "improving",
  },
  {
    topic: "Protein Synthesis",
    issue: "Mixing up where transcription (nucleus) and translation (ribosome) occur",
    students: 7,
    severity: "medium",
    trend: "worsening",
  },
  {
    topic: "Cell Cycle",
    issue: "Thinking G1 and G2 phases are identical rest periods",
    students: 5,
    severity: "low",
    trend: "improving",
  },
  {
    topic: "Genetics",
    issue: "Confusing genotype (genetic makeup) with phenotype (observable traits)",
    students: 15,
    severity: "high",
    trend: "worsening",
  },
];

const masteryHeatmapData = [
  {
    student: "Alex R.",
    objectives: [95, 88, 72, 90, 85, 78],
  },
  {
    student: "Jordan K.",
    objectives: [78, 65, 82, 55, 71, 60],
  },
  {
    student: "Taylor N.",
    objectives: [45, 38, 52, 30, 48, 42],
  },
  {
    student: "Morgan P.",
    objectives: [92, 88, 95, 85, 90, 88],
  },
  {
    student: "Casey W.",
    objectives: [62, 70, 58, 65, 55, 72],
  },
  {
    student: "Sam O.",
    objectives: [38, 42, 35, 28, 45, 32],
  },
  {
    student: "Jamie L.",
    objectives: [85, 78, 90, 82, 75, 88],
  },
  {
    student: "Quinn D.",
    objectives: [72, 68, 75, 58, 82, 65],
  },
];

const objectiveLabels = [
  "Mitosis Stages",
  "Mitosis vs Meiosis",
  "Checkpoints",
  "Division Errors",
  "Growth & Repair",
  "Microscope Images",
];

const engagementData = [
  { label: "Mon", sessions: 45, avgDuration: 18 },
  { label: "Tue", sessions: 52, avgDuration: 22 },
  { label: "Wed", sessions: 38, avgDuration: 15 },
  { label: "Thu", sessions: 61, avgDuration: 25 },
  { label: "Fri", sessions: 33, avgDuration: 12 },
  { label: "Sat", sessions: 8, avgDuration: 28 },
  { label: "Sun", sessions: 5, avgDuration: 30 },
];

const skillProgression = [
  { week: "Week 1", mastery: 32 },
  { week: "Week 2", mastery: 45 },
  { week: "Week 3", mastery: 58 },
  { week: "Week 4", mastery: 67 },
  { week: "Week 5", mastery: 73 },
];

function getHeatColor(value: number) {
  if (value >= 85) return "bg-emerald-500 text-white";
  if (value >= 70) return "bg-emerald-300 text-emerald-900";
  if (value >= 55) return "bg-amber-300 text-amber-900";
  if (value >= 40) return "bg-orange-400 text-white";
  return "bg-red-500 text-white";
}

export default function InsightsPage() {
  const maxSessions = Math.max(...engagementData.map((d) => d.sessions));

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
            <p className="text-3xl font-bold mt-1">5</p>
            <p className="text-xs text-amber-600 mt-1 flex items-center gap-1">
              <ArrowUpRight size={12} />2 need attention
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
              <ArrowDownRight size={12} />
              2 more than last week
            </p>
          </div>
          <div className="bg-white rounded-xl border border-border p-5">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted font-medium">
                Avg. Engagement
              </p>
              <Zap size={16} className="text-indigo-500" />
            </div>
            <p className="text-3xl font-bold mt-1">19 min</p>
            <p className="text-xs text-muted mt-1">per session this week</p>
          </div>
        </div>

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
                  <span className="w-3 h-3 rounded bg-emerald-500" />
                  85%+
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded bg-emerald-300" />
                  70-84%
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded bg-amber-300" />
                  55-69%
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded bg-orange-400" />
                  40-54%
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded bg-red-500" />
                  &lt;40%
                </span>
              </div>
            </div>
            <p className="text-sm text-muted mb-5">
              Each cell shows a student&apos;s mastery level for each learning
              objective in the current unit.
            </p>
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

          {/* Misconceptions */}
          <div className="bg-white rounded-xl border border-border">
            <div className="p-5 border-b border-border">
              <div className="flex items-center gap-2">
                <Brain size={18} className="text-amber-500" />
                <h2 className="font-semibold text-lg">
                  Detected Misconceptions
                </h2>
              </div>
              <p className="text-sm text-muted mt-1">
                AI-detected patterns where students demonstrate
                misunderstandings.
              </p>
            </div>
            <div className="divide-y divide-border">
              {misconceptions.map((m, i) => (
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
                      )}
                      {m.trend}
                    </span>
                  </div>
                  <p className="text-sm text-muted">{m.issue}</p>
                  <p className="text-xs text-amber-600 mt-1.5 font-medium">
                    {m.students} students affected
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Engagement Chart */}
            <div className="bg-white rounded-xl border border-border p-6">
              <div className="flex items-center gap-2 mb-4">
                <Zap size={18} className="text-indigo-500" />
                <h2 className="font-semibold text-lg">Weekly Engagement</h2>
              </div>
              <p className="text-sm text-muted mb-5">
                Sessions per day and average duration.
              </p>
              <div className="flex items-end gap-2 h-36">
                {engagementData.map((d) => (
                  <div key={d.label} className="flex-1 flex flex-col items-center gap-1">
                    <span className="text-[10px] text-muted font-medium">
                      {d.sessions}
                    </span>
                    <div
                      className="w-full bg-indigo-500 rounded-t-md transition-all hover:bg-indigo-600"
                      style={{
                        height: `${(d.sessions / maxSessions) * 100}%`,
                        minHeight: "4px",
                      }}
                    />
                    <span className="text-[10px] text-muted">{d.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Skill Progression */}
            <div className="bg-white rounded-xl border border-border p-6">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp size={18} className="text-emerald-500" />
                <h2 className="font-semibold text-lg">
                  Class Mastery Progression
                </h2>
              </div>
              <p className="text-sm text-muted mb-5">
                Average mastery across all students over time.
              </p>
              <div className="space-y-3">
                {skillProgression.map((s) => (
                  <div key={s.week} className="flex items-center gap-3">
                    <span className="text-xs text-muted w-14">{s.week}</span>
                    <div className="flex-1 h-4 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-indigo-500 to-emerald-500 rounded-full transition-all"
                        style={{ width: `${s.mastery}%` }}
                      />
                    </div>
                    <span className="text-sm font-semibold w-10 text-right">
                      {s.mastery}%
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Struggling Students */}
            <div className="bg-white rounded-xl border border-border p-6">
              <div className="flex items-center gap-2 mb-4">
                <AlertTriangle size={18} className="text-red-500" />
                <h2 className="font-semibold text-lg">Needs Attention</h2>
              </div>
              <div className="space-y-3">
                {[
                  {
                    name: "Taylor Nguyen",
                    mastery: 45,
                    issue: "Struggling with DNA replication concepts",
                  },
                  {
                    name: "Sam Okafor",
                    mastery: 38,
                    issue: "Consistently confuses mitosis and meiosis",
                  },
                  {
                    name: "Riley Brooks",
                    mastery: 42,
                    issue: "Low engagement — only 2 sessions this week",
                  },
                ].map((s, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 p-3 rounded-lg bg-red-50 border border-red-100"
                  >
                    <div className="w-8 h-8 rounded-full bg-red-500 flex items-center justify-center text-white text-xs font-bold">
                      {s.name
                        .split(" ")
                        .map((w) => w[0])
                        .join("")}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{s.name}</p>
                      <p className="text-xs text-red-600">{s.issue}</p>
                    </div>
                    <span className="text-sm font-bold text-red-600">
                      {s.mastery}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </TeacherLayout>
  );
}
