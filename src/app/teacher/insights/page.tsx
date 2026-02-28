"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import TeacherLayout from "../../components/TeacherLayout";
import {
  Brain,
  BarChart3,
  Zap,
  MessageSquare,
  Clock,
} from "lucide-react";
import { useIsMounted } from "@/lib/useIsMounted";
import { getAllStats, getUnits, getSessions, getUnitStats } from "@/lib/storage";

const ChartsSection = dynamic(() => import("./ChartsSection"), { ssr: false });

export default function InsightsPage() {
  const mounted = useIsMounted();
  const [units] = useState(() =>
    typeof window !== "undefined" ? getUnits() : []
  );
  const [sessions] = useState(() =>
    typeof window !== "undefined" ? getSessions() : []
  );

  if (!mounted) return null;

  const stats = getAllStats();

  const unitBreakdown = units.map((u) => {
    const uStats = getUnitStats(u.id);
    return {
      name: u.name,
      sessions: uStats.totalSessions,
      messages: uStats.totalMessages,
      minutes: uStats.totalMinutes,
      questions: uStats.totalQuestions,
    };
  });

  // Get all messages across all sessions for word cloud / topic analysis
  const allMessages = sessions.flatMap((s) =>
    s.messages.filter((m) => m.role === "user").map((m) => m.content)
  );

  return (
    <TeacherLayout>
      <div className="max-w-7xl animate-fade-in">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-foreground">Student Insights</h1>
          <p className="text-muted mt-1">
            Analytics from real chat sessions. Data updates as students interact with the AI tutor.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mb-8">
          <div className="bg-white rounded-xl border border-border p-5">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted font-medium">Total Sessions</p>
              <MessageSquare size={16} className="text-indigo-500" />
            </div>
            <p className="text-3xl font-bold mt-1">{stats.totalSessions}</p>
          </div>
          <div className="bg-white rounded-xl border border-border p-5">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted font-medium">Total Messages</p>
              <Brain size={16} className="text-cyan-500" />
            </div>
            <p className="text-3xl font-bold mt-1">{stats.totalMessages}</p>
          </div>
          <div className="bg-white rounded-xl border border-border p-5">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted font-medium">Study Time</p>
              <Clock size={16} className="text-emerald-500" />
            </div>
            <p className="text-3xl font-bold mt-1">{stats.totalMinutes} min</p>
          </div>
          <div className="bg-white rounded-xl border border-border p-5">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted font-medium">Active Units</p>
              <Zap size={16} className="text-amber-500" />
            </div>
            <p className="text-3xl font-bold mt-1">
              {unitBreakdown.filter((u) => u.sessions > 0).length}
            </p>
          </div>
        </div>

        {/* Charts */}
        <ChartsSection
          dailySessions={stats.dailySessions}
          unitBreakdown={unitBreakdown}
        />

        {/* Recent Student Questions */}
        <div className="bg-white rounded-xl border border-border mb-8">
          <div className="p-5 border-b border-border">
            <div className="flex items-center gap-2">
              <Brain size={18} className="text-primary" />
              <h2 className="font-semibold text-lg">Recent Student Questions</h2>
            </div>
            <p className="text-sm text-muted mt-1">
              What students are asking the AI tutor — review these to identify common themes and struggles.
            </p>
          </div>
          {allMessages.length === 0 ? (
            <div className="px-5 py-8 text-center text-muted text-sm">
              No student questions yet. Questions will appear here as students chat.
            </div>
          ) : (
            <div className="divide-y divide-border max-h-96 overflow-y-auto">
              {allMessages
                .slice(-20)
                .reverse()
                .map((msg, i) => (
                  <div key={i} className="px-5 py-3 hover:bg-surface-hover transition-colors">
                    <p className="text-sm">{msg}</p>
                  </div>
                ))}
            </div>
          )}
        </div>

        {/* Per-Unit Breakdown Table */}
        {unitBreakdown.length > 0 && (
          <div className="bg-white rounded-xl border border-border">
            <div className="p-5 border-b border-border">
              <div className="flex items-center gap-2">
                <BarChart3 size={18} className="text-primary" />
                <h2 className="font-semibold text-lg">Unit-Level Breakdown</h2>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border bg-gray-50">
                    <th className="text-left text-xs font-semibold text-muted px-5 py-3">Unit</th>
                    <th className="text-left text-xs font-semibold text-muted px-5 py-3">Sessions</th>
                    <th className="text-left text-xs font-semibold text-muted px-5 py-3">Messages</th>
                    <th className="text-left text-xs font-semibold text-muted px-5 py-3">Questions</th>
                    <th className="text-left text-xs font-semibold text-muted px-5 py-3">Total Time</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {unitBreakdown.map((u, i) => (
                    <tr key={i} className="hover:bg-surface-hover transition-colors">
                      <td className="px-5 py-3.5 text-sm font-medium">{u.name}</td>
                      <td className="px-5 py-3.5 text-sm text-muted">{u.sessions}</td>
                      <td className="px-5 py-3.5 text-sm text-muted">{u.messages}</td>
                      <td className="px-5 py-3.5 text-sm text-muted">{u.questions}</td>
                      <td className="px-5 py-3.5 text-sm text-muted">{u.minutes} min</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </TeacherLayout>
  );
}
