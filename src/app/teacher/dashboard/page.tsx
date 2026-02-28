"use client";

import { useState } from "react";
import TeacherLayout from "../../components/TeacherLayout";
import Link from "next/link";
import {
  BookOpen,
  ArrowRight,
  Activity,
  Brain,
  Plus,
  MessageSquare,
  Clock,
} from "lucide-react";
import { useIsMounted } from "@/lib/useIsMounted";
import { getCourses, getUnits, getSessions, getAllStats } from "@/lib/storage";
import { Course, Unit, ChatSession } from "@/lib/types";

export default function TeacherDashboard() {
  const mounted = useIsMounted();
  const [courses] = useState<Course[]>(() =>
    typeof window !== "undefined" ? getCourses() : []
  );
  const [units] = useState<Unit[]>(() =>
    typeof window !== "undefined" ? getUnits() : []
  );
  const [sessions] = useState<ChatSession[]>(() =>
    typeof window !== "undefined" ? getSessions() : []
  );

  if (!mounted) return null;

  const stats = getAllStats();

  const recentSessions = [...sessions]
    .sort((a, b) => new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime())
    .slice(0, 8);

  return (
    <TeacherLayout>
      <div className="max-w-7xl animate-fade-in">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted mt-1">
            Overview of your courses, units, and student activity.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          <div className="bg-white rounded-xl border border-border p-5 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted font-medium">Courses</p>
                <p className="text-3xl font-bold mt-1">{stats.totalCourses}</p>
                <p className="text-xs text-muted mt-1">{stats.totalUnits} units total</p>
              </div>
              <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-indigo-100 text-indigo-600">
                <BookOpen size={20} />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-border p-5 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted font-medium">Chat Sessions</p>
                <p className="text-3xl font-bold mt-1">{stats.totalSessions}</p>
                <p className="text-xs text-muted mt-1">{stats.totalMessages} total messages</p>
              </div>
              <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-cyan-100 text-cyan-600">
                <MessageSquare size={20} />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-border p-5 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted font-medium">Study Time</p>
                <p className="text-3xl font-bold mt-1">{stats.totalMinutes} min</p>
                <p className="text-xs text-muted mt-1">across all sessions</p>
              </div>
              <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-emerald-100 text-emerald-600">
                <Clock size={20} />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-border p-5 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted font-medium">Units Configured</p>
                <p className="text-3xl font-bold mt-1">
                  {units.filter((u) => u.config.objectives.length > 0).length}
                </p>
                <p className="text-xs text-muted mt-1">with objectives set</p>
              </div>
              <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-amber-100 text-amber-600">
                <Brain size={20} />
              </div>
            </div>
          </div>
        </div>

        {courses.length === 0 ? (
          <div className="bg-white rounded-xl border border-border p-12 text-center">
            <BookOpen size={48} className="text-gray-200 mx-auto mb-4" />
            <h3 className="font-semibold text-lg mb-2">Get started</h3>
            <p className="text-muted text-sm mb-4">
              Create your first course and unit to start using AI tutoring with your students.
            </p>
            <Link
              href="/teacher/courses"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-white rounded-lg text-sm font-semibold"
            >
              <Plus size={16} /> Create First Course
            </Link>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Recent Sessions */}
            <div className="lg:col-span-2 bg-white rounded-xl border border-border">
              <div className="flex items-center justify-between p-5 border-b border-border">
                <div className="flex items-center gap-2">
                  <Activity size={18} className="text-primary" />
                  <h2 className="font-semibold">Recent Chat Sessions</h2>
                </div>
                <Link href="/teacher/insights" className="text-xs text-primary font-medium hover:underline">
                  View insights
                </Link>
              </div>
              {recentSessions.length === 0 ? (
                <div className="px-5 py-8 text-center text-muted text-sm">
                  No chat sessions yet. Students can start sessions from the student portal.
                </div>
              ) : (
                <div className="divide-y divide-border">
                  {recentSessions.map((s) => {
                    const unit = units.find((u) => u.id === s.unitId);
                    const ago = getTimeAgo(s.startedAt);
                    return (
                      <div key={s.id} className="flex items-center gap-4 px-5 py-3.5 hover:bg-surface-hover transition-colors">
                        <div className="w-9 h-9 rounded-full bg-indigo-500 flex items-center justify-center text-white text-xs font-bold">
                          <MessageSquare size={14} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">
                            {unit?.name || "Unknown Unit"}
                          </p>
                          <p className="text-xs text-muted">
                            {s.messages.length} messages &middot; {s.questionsAsked} questions
                          </p>
                        </div>
                        <span className="text-xs text-muted">{ago}</span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Courses */}
            <div className="bg-white rounded-xl border border-border">
              <div className="flex items-center justify-between p-5 border-b border-border">
                <div className="flex items-center gap-2">
                  <BookOpen size={18} className="text-primary" />
                  <h2 className="font-semibold">Your Courses</h2>
                </div>
                <Link href="/teacher/courses" className="text-xs text-primary font-medium hover:underline flex items-center gap-1">
                  Manage <ArrowRight size={12} />
                </Link>
              </div>
              <div className="divide-y divide-border">
                {courses.map((c) => {
                  const courseUnits = units.filter((u) => u.courseId === c.id);
                  return (
                    <Link
                      key={c.id}
                      href="/teacher/courses"
                      className="flex items-center gap-4 px-5 py-3.5 hover:bg-surface-hover transition-colors"
                    >
                      <div className="w-9 h-9 rounded-lg bg-indigo-100 flex items-center justify-center text-primary font-bold text-sm">
                        {c.name.charAt(0)}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-sm">{c.name}</p>
                        <p className="text-xs text-muted">
                          {courseUnits.length} unit{courseUnits.length !== 1 ? "s" : ""}
                        </p>
                      </div>
                      <ArrowRight size={14} className="text-muted" />
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </TeacherLayout>
  );
}

function getTimeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}
