"use client";

import { useState, useEffect } from "react";
import TeacherLayout from "../../components/TeacherLayout";
import Link from "next/link";
import {
  BookOpen,
  ArrowRight,
  Activity,
  Plus,
  Loader2,
} from "lucide-react";
import { useAuth } from "@/lib/AuthContext";
import * as db from "@/lib/db";

export default function TeacherDashboard() {
  const { profile } = useAuth();
  const [courses, setCourses] = useState<any[]>([]);
  const [sessions, setSessions] = useState<any[]>([]);
  const [units, setUnits] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!profile) return;
    (async () => {
      const [c, u, s] = await Promise.all([
        db.getCourses(profile.id),
        db.getAllTeacherUnits(profile.id),
        db.getTeacherSessions(profile.id),
      ]);
      setCourses(c);
      setUnits(u);
      setSessions(s);
      setLoading(false);
    })();
  }, [profile]);

  if (loading) {
    return (
      <TeacherLayout>
        <div className="flex items-center justify-center h-64">
          <Loader2 size={24} className="animate-spin text-primary" />
        </div>
      </TeacherLayout>
    );
  }

  const totalMessages = sessions.reduce(
    (sum: number, s: any) => sum + (Array.isArray(s.messages) ? s.messages.length : 0),
    0
  );

  return (
    <TeacherLayout>
      <div className="max-w-7xl animate-fade-in">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-foreground">
            Welcome, {profile?.full_name?.split(" ")[0] || "Teacher"}
          </h1>
          <p className="text-muted mt-1">
            Here&apos;s an overview of your courses and student activity.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          <div className="bg-white rounded-xl border border-border p-5">
            <p className="text-sm text-muted font-medium">Courses</p>
            <p className="text-3xl font-bold mt-1">{courses.length}</p>
            <p className="text-xs text-muted mt-1">{units.length} units total</p>
          </div>
          <div className="bg-white rounded-xl border border-border p-5">
            <p className="text-sm text-muted font-medium">Chat Sessions</p>
            <p className="text-3xl font-bold mt-1">{sessions.length}</p>
            <p className="text-xs text-muted mt-1">{totalMessages} messages</p>
          </div>
          <div className="bg-white rounded-xl border border-border p-5">
            <p className="text-sm text-muted font-medium">Study Time</p>
            <p className="text-3xl font-bold mt-1">
              {sessions.reduce((s: number, x: any) => s + (x.duration_minutes || 0), 0)} min
            </p>
          </div>
          <div className="bg-white rounded-xl border border-border p-5">
            <p className="text-sm text-muted font-medium">Configured Units</p>
            <p className="text-3xl font-bold mt-1">
              {units.filter((u: any) => u.config?.objectives?.length > 0).length}
            </p>
            <p className="text-xs text-muted mt-1">with objectives set</p>
          </div>
        </div>

        {courses.length === 0 ? (
          <div className="bg-white rounded-xl border border-border p-12 text-center">
            <BookOpen size={48} className="text-gray-200 mx-auto mb-4" />
            <h3 className="font-semibold text-lg mb-2">Get started</h3>
            <p className="text-muted text-sm mb-4">
              Create your first course to start using Riseva with your students.
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
              {sessions.length === 0 ? (
                <div className="px-5 py-8 text-center text-muted text-sm">
                  No chat sessions yet. Share your class codes with students to get started.
                </div>
              ) : (
                <div className="divide-y divide-border">
                  {sessions.slice(0, 8).map((s: any) => (
                    <div key={s.id} className="flex items-center gap-4 px-5 py-3.5 hover:bg-surface-hover transition-colors">
                      <div className="w-9 h-9 rounded-full bg-indigo-500 flex items-center justify-center text-white text-xs font-bold">
                        {s.profiles?.full_name?.[0] || "S"}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">
                          {s.profiles?.full_name || "Student"} — {s.units?.name || "Unit"}
                        </p>
                        <p className="text-xs text-muted">
                          {Array.isArray(s.messages) ? s.messages.length : 0} messages &middot; {s.questions_asked || 0} questions
                        </p>
                      </div>
                      <span className="text-xs text-muted">
                        {new Date(s.started_at).toLocaleDateString()}
                      </span>
                    </div>
                  ))}
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
                {courses.map((c: any) => (
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
                      <p className="text-xs text-muted">Code: {c.class_code}</p>
                    </div>
                    <ArrowRight size={14} className="text-muted" />
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </TeacherLayout>
  );
}
