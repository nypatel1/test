"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import TeacherLayout from "../../components/TeacherLayout";
import { Brain, BarChart3, Zap, MessageSquare, Clock, Loader2 } from "lucide-react";
import { useAuth } from "@/lib/AuthContext";
import * as db from "@/lib/db";

const ChartsSection = dynamic(() => import("./ChartsSection"), { ssr: false });

export default function InsightsPage() {
  const { profile } = useAuth();
  const [sessions, setSessions] = useState<any[]>([]);
  const [units, setUnits] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!profile) return;
    (async () => {
      const [s, u] = await Promise.all([
        db.getTeacherSessions(profile.id),
        db.getAllTeacherUnits(profile.id),
      ]);
      setSessions(s);
      setUnits(u);
      setLoading(false);
    })();
  }, [profile]);

  if (loading) {
    return <TeacherLayout><div className="flex items-center justify-center h-64"><Loader2 size={24} className="animate-spin text-primary" /></div></TeacherLayout>;
  }

  const totalMessages = sessions.reduce((s: number, x: any) => s + (Array.isArray(x.messages) ? x.messages.length : 0), 0);
  const totalMinutes = sessions.reduce((s: number, x: any) => s + (x.duration_minutes || 0), 0);

  const allStudentMessages = sessions.flatMap((s: any) =>
    Array.isArray(s.messages) ? s.messages.filter((m: any) => m.role === "user").map((m: any) => ({ content: m.content, student: s.profiles?.full_name || "Student", unit: s.units?.name || "Unit" })) : []
  );

  // Build daily data for last 7 days
  const now = new Date();
  const dailySessions = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(now); d.setDate(d.getDate() - (6 - i));
    const dateStr = d.toISOString().slice(0, 10);
    const dayStr = d.toLocaleDateString("en-US", { weekday: "short" });
    const daySessions = sessions.filter((s: any) => s.started_at?.slice(0, 10) === dateStr);
    return {
      day: dayStr,
      count: daySessions.length,
      minutes: daySessions.reduce((s: number, x: any) => s + (x.duration_minutes || 0), 0),
      questions: daySessions.reduce((s: number, x: any) => s + (x.questions_asked || 0), 0),
    };
  });

  const unitBreakdown = units.map((u: any) => {
    const unitSessions = sessions.filter((s: any) => s.unit_id === u.id);
    return {
      name: u.name,
      sessions: unitSessions.length,
      messages: unitSessions.reduce((s: number, x: any) => s + (Array.isArray(x.messages) ? x.messages.length : 0), 0),
      minutes: unitSessions.reduce((s: number, x: any) => s + (x.duration_minutes || 0), 0),
    };
  });

  return (
    <TeacherLayout>
      <div className="max-w-7xl animate-fade-in">
        <div className="mb-8">
          <h1 className="text-2xl font-bold">Student Insights</h1>
          <p className="text-muted mt-1">Analytics from real chat sessions across your courses.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mb-8">
          <div className="bg-white rounded-xl border border-border p-5">
            <div className="flex items-center justify-between"><p className="text-sm text-muted font-medium">Total Sessions</p><MessageSquare size={16} className="text-indigo-500" /></div>
            <p className="text-3xl font-bold mt-1">{sessions.length}</p>
          </div>
          <div className="bg-white rounded-xl border border-border p-5">
            <div className="flex items-center justify-between"><p className="text-sm text-muted font-medium">Total Messages</p><Brain size={16} className="text-cyan-500" /></div>
            <p className="text-3xl font-bold mt-1">{totalMessages}</p>
          </div>
          <div className="bg-white rounded-xl border border-border p-5">
            <div className="flex items-center justify-between"><p className="text-sm text-muted font-medium">Study Time</p><Clock size={16} className="text-emerald-500" /></div>
            <p className="text-3xl font-bold mt-1">{totalMinutes} min</p>
          </div>
          <div className="bg-white rounded-xl border border-border p-5">
            <div className="flex items-center justify-between"><p className="text-sm text-muted font-medium">Active Units</p><Zap size={16} className="text-amber-500" /></div>
            <p className="text-3xl font-bold mt-1">{unitBreakdown.filter((u) => u.sessions > 0).length}</p>
          </div>
        </div>

        <ChartsSection dailySessions={dailySessions} unitBreakdown={unitBreakdown} />

        <div className="bg-white rounded-xl border border-border mb-8">
          <div className="p-5 border-b border-border">
            <div className="flex items-center gap-2"><Brain size={18} className="text-primary" /><h2 className="font-semibold text-lg">Recent Student Questions</h2></div>
          </div>
          {allStudentMessages.length === 0 ? (
            <div className="px-5 py-8 text-center text-muted text-sm">No questions yet.</div>
          ) : (
            <div className="divide-y divide-border max-h-96 overflow-y-auto">
              {allStudentMessages.slice(0, 30).map((msg: any, i: number) => (
                <div key={i} className="px-5 py-3 hover:bg-surface-hover">
                  <p className="text-sm">{msg.content}</p>
                  <p className="text-xs text-muted mt-1">{msg.student} &middot; {msg.unit}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {unitBreakdown.length > 0 && (
          <div className="bg-white rounded-xl border border-border">
            <div className="p-5 border-b border-border"><div className="flex items-center gap-2"><BarChart3 size={18} className="text-primary" /><h2 className="font-semibold text-lg">Unit Breakdown</h2></div></div>
            <table className="w-full">
              <thead><tr className="border-b border-border bg-gray-50">
                <th className="text-left text-xs font-semibold text-muted px-5 py-3">Unit</th>
                <th className="text-left text-xs font-semibold text-muted px-5 py-3">Sessions</th>
                <th className="text-left text-xs font-semibold text-muted px-5 py-3">Messages</th>
                <th className="text-left text-xs font-semibold text-muted px-5 py-3">Time</th>
              </tr></thead>
              <tbody className="divide-y divide-border">
                {unitBreakdown.map((u, i) => (
                  <tr key={i} className="hover:bg-surface-hover"><td className="px-5 py-3.5 text-sm font-medium">{u.name}</td><td className="px-5 py-3.5 text-sm text-muted">{u.sessions}</td><td className="px-5 py-3.5 text-sm text-muted">{u.messages}</td><td className="px-5 py-3.5 text-sm text-muted">{u.minutes} min</td></tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </TeacherLayout>
  );
}
