"use client";

import TeacherLayout from "../../components/TeacherLayout";
import Link from "next/link";
import {
  Users,
  BookOpen,
  TrendingUp,
  AlertTriangle,
  ArrowRight,
  Activity,
  Clock,
  Brain,
} from "lucide-react";

const stats = [
  {
    label: "Active Students",
    value: "147",
    change: "+12 this week",
    icon: Users,
    color: "bg-indigo-100 text-indigo-600",
  },
  {
    label: "Active Courses",
    value: "4",
    change: "12 units total",
    icon: BookOpen,
    color: "bg-cyan-100 text-cyan-600",
  },
  {
    label: "Avg. Mastery",
    value: "73%",
    change: "+5% from last week",
    icon: TrendingUp,
    color: "bg-emerald-100 text-emerald-600",
  },
  {
    label: "Needs Attention",
    value: "8",
    change: "students struggling",
    icon: AlertTriangle,
    color: "bg-amber-100 text-amber-600",
  },
];

const recentActivity = [
  {
    student: "Alex Rivera",
    action: 'Completed "Cell Division" concept check',
    time: "2 min ago",
    status: "mastered",
  },
  {
    student: "Jordan Kim",
    action: "Asked 5 questions about mitosis phases",
    time: "8 min ago",
    status: "learning",
  },
  {
    student: "Taylor Nguyen",
    action: "Struggling with DNA replication — 3 retries",
    time: "15 min ago",
    status: "struggling",
  },
  {
    student: "Morgan Patel",
    action: 'Achieved mastery in "Protein Synthesis"',
    time: "22 min ago",
    status: "mastered",
  },
  {
    student: "Casey Wright",
    action: "Started new session on Genetics unit",
    time: "30 min ago",
    status: "learning",
  },
  {
    student: "Sam Okafor",
    action: "Misconception detected: confusing meiosis/mitosis",
    time: "45 min ago",
    status: "struggling",
  },
];

const topMisconceptions = [
  {
    topic: "Cell Division",
    misconception: "Confusing mitosis and meiosis outcomes",
    students: 12,
  },
  {
    topic: "DNA Replication",
    misconception: "Believing replication is one-directional",
    students: 9,
  },
  {
    topic: "Protein Synthesis",
    misconception: "Mixing up transcription and translation roles",
    students: 7,
  },
];

const courses = [
  {
    name: "AP Biology — Period 3",
    students: 34,
    units: 4,
    avgMastery: 76,
  },
  {
    name: "AP Biology — Period 5",
    students: 38,
    units: 4,
    avgMastery: 71,
  },
  {
    name: "Biology Honors",
    students: 42,
    units: 3,
    avgMastery: 68,
  },
  {
    name: "Intro to Life Science",
    students: 33,
    units: 1,
    avgMastery: 82,
  },
];

export default function TeacherDashboard() {
  return (
    <TeacherLayout>
      <div className="max-w-7xl animate-fade-in">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-foreground">
            Good morning, Ms. Chen
          </h1>
          <p className="text-muted mt-1">
            Here&apos;s what&apos;s happening across your classes today.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          {stats.map((s) => (
            <div
              key={s.label}
              className="bg-white rounded-xl border border-border p-5 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-muted font-medium">{s.label}</p>
                  <p className="text-3xl font-bold mt-1">{s.value}</p>
                  <p className="text-xs text-muted mt-1">{s.change}</p>
                </div>
                <div
                  className={`w-10 h-10 rounded-lg flex items-center justify-center ${s.color}`}
                >
                  <s.icon size={20} />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          {/* Recent Activity */}
          <div className="lg:col-span-2 bg-white rounded-xl border border-border">
            <div className="flex items-center justify-between p-5 border-b border-border">
              <div className="flex items-center gap-2">
                <Activity size={18} className="text-primary" />
                <h2 className="font-semibold">Live Student Activity</h2>
              </div>
              <span className="flex items-center gap-1.5 text-xs text-success font-medium">
                <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
                23 students online
              </span>
            </div>
            <div className="divide-y divide-border">
              {recentActivity.map((a, i) => (
                <div
                  key={i}
                  className="flex items-center gap-4 px-5 py-3.5 hover:bg-surface-hover transition-colors"
                >
                  <div
                    className={`w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold ${
                      a.status === "mastered"
                        ? "bg-emerald-500"
                        : a.status === "struggling"
                        ? "bg-amber-500"
                        : "bg-indigo-500"
                    }`}
                  >
                    {a.student
                      .split(" ")
                      .map((w) => w[0])
                      .join("")}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">
                      <span className="text-foreground">{a.student}</span>
                    </p>
                    <p className="text-xs text-muted truncate">{a.action}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {a.status === "mastered" && (
                      <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 text-xs font-medium">
                        Mastered
                      </span>
                    )}
                    {a.status === "struggling" && (
                      <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 text-xs font-medium">
                        Needs Help
                      </span>
                    )}
                    <span className="text-xs text-muted flex items-center gap-1">
                      <Clock size={12} />
                      {a.time}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Misconceptions */}
          <div className="bg-white rounded-xl border border-border">
            <div className="flex items-center justify-between p-5 border-b border-border">
              <div className="flex items-center gap-2">
                <Brain size={18} className="text-amber-500" />
                <h2 className="font-semibold">Top Misconceptions</h2>
              </div>
              <Link
                href="/teacher/insights"
                className="text-xs text-primary font-medium hover:underline"
              >
                View all
              </Link>
            </div>
            <div className="p-5 space-y-4">
              {topMisconceptions.map((m, i) => (
                <div key={i} className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium">{m.topic}</p>
                    <span className="text-xs text-amber-600 font-medium">
                      {m.students} students
                    </span>
                  </div>
                  <p className="text-xs text-muted">{m.misconception}</p>
                  <div className="w-full h-1.5 bg-amber-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-amber-400 rounded-full"
                      style={{ width: `${(m.students / 34) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Courses */}
        <div className="bg-white rounded-xl border border-border">
          <div className="flex items-center justify-between p-5 border-b border-border">
            <div className="flex items-center gap-2">
              <BookOpen size={18} className="text-primary" />
              <h2 className="font-semibold">Your Courses</h2>
            </div>
            <Link
              href="/teacher/courses"
              className="text-sm text-primary font-medium hover:underline flex items-center gap-1"
            >
              Manage courses <ArrowRight size={14} />
            </Link>
          </div>
          <div className="divide-y divide-border">
            {courses.map((c, i) => (
              <Link
                key={i}
                href="/teacher/courses"
                className="flex items-center gap-6 px-5 py-4 hover:bg-surface-hover transition-colors"
              >
                <div className="w-10 h-10 rounded-lg bg-indigo-100 flex items-center justify-center text-primary font-bold text-sm">
                  {c.name.charAt(0)}
                </div>
                <div className="flex-1">
                  <p className="font-medium text-sm">{c.name}</p>
                  <p className="text-xs text-muted">
                    {c.students} students &middot; {c.units} active units
                  </p>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-2">
                    <div className="w-24 h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          c.avgMastery >= 75
                            ? "bg-emerald-500"
                            : c.avgMastery >= 60
                            ? "bg-amber-500"
                            : "bg-red-500"
                        }`}
                        style={{ width: `${c.avgMastery}%` }}
                      />
                    </div>
                    <span className="text-sm font-semibold w-10 text-right">
                      {c.avgMastery}%
                    </span>
                  </div>
                  <p className="text-xs text-muted mt-0.5">avg. mastery</p>
                </div>
                <ArrowRight size={16} className="text-muted" />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </TeacherLayout>
  );
}
