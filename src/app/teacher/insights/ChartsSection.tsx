"use client";

import { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { Zap, TrendingUp, Users } from "lucide-react";

interface Props {
  dailySessions: { day: string; count: number; minutes: number; questions: number }[];
  unitBreakdown: { name: string; sessions: number; messages: number; minutes: number }[];
}

export default function ChartsSection({ dailySessions, unitBreakdown }: Props) {
  const [engagementMetric, setEngagementMetric] = useState<"count" | "minutes" | "questions">("count");

  const metricLabels = { count: "Sessions", minutes: "Minutes", questions: "Questions" };

  const hasData = dailySessions.some((d) => d.count > 0 || d.minutes > 0 || d.questions > 0);
  const hasUnitData = unitBreakdown.length > 0 && unitBreakdown.some((u) => u.sessions > 0);

  const pieColors = ["#4f46e5", "#06b6d4", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899"];

  const cumulativeData = dailySessions.reduce<{ day: string; total: number }[]>(
    (acc, d) => {
      const prev = acc.length > 0 ? acc[acc.length - 1].total : 0;
      acc.push({ day: d.day, total: prev + d.count });
      return acc;
    },
    []
  );

  return (
    <div className="grid lg:grid-cols-2 gap-6 mb-8">
      {/* Daily Engagement */}
      <div className="bg-white rounded-xl border border-border p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Zap size={18} className="text-indigo-500" />
            <h2 className="font-semibold text-lg">Daily Activity (Last 7 Days)</h2>
          </div>
          <select
            value={engagementMetric}
            onChange={(e) => setEngagementMetric(e.target.value as "count" | "minutes" | "questions")}
            className="text-sm border border-border rounded-lg px-2 py-1 bg-white"
          >
            <option value="count">Sessions</option>
            <option value="minutes">Minutes</option>
            <option value="questions">Questions</option>
          </select>
        </div>
        {hasData ? (
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={dailySessions}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="day" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} allowDecimals={false} />
              <Tooltip
                contentStyle={{ borderRadius: "8px", border: "1px solid #e2e8f0", fontSize: "12px" }}
              />
              <Bar
                dataKey={engagementMetric}
                name={metricLabels[engagementMetric]}
                fill="#4f46e5"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-[240px] flex items-center justify-center text-muted text-sm">
            No session data yet. Start chatting to see activity here.
          </div>
        )}
      </div>

      {/* Cumulative Growth */}
      <div className="bg-white rounded-xl border border-border p-6">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp size={18} className="text-emerald-500" />
          <h2 className="font-semibold text-lg">Cumulative Sessions</h2>
        </div>
        {hasData ? (
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={cumulativeData}>
              <defs>
                <linearGradient id="cumGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#4f46e5" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#4f46e5" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="day" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} allowDecimals={false} />
              <Tooltip
                contentStyle={{ borderRadius: "8px", border: "1px solid #e2e8f0", fontSize: "12px" }}
              />
              <Area
                type="monotone"
                dataKey="total"
                name="Total Sessions"
                stroke="#4f46e5"
                fill="url(#cumGrad)"
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-[240px] flex items-center justify-center text-muted text-sm">
            No data yet.
          </div>
        )}
      </div>

      {/* Sessions by Unit */}
      <div className="lg:col-span-2 bg-white rounded-xl border border-border p-6">
        <div className="flex items-center gap-2 mb-4">
          <Users size={18} className="text-primary" />
          <h2 className="font-semibold text-lg">Activity by Unit</h2>
        </div>
        {hasUnitData ? (
          <div className="grid lg:grid-cols-2 gap-6">
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie
                  data={unitBreakdown.filter((u) => u.sessions > 0)}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={95}
                  paddingAngle={3}
                  dataKey="sessions"
                  label={({ value }) => `${value}`}
                  labelLine={false}
                >
                  {unitBreakdown.filter((u) => u.sessions > 0).map((_, i) => (
                    <Cell key={i} fill={pieColors[i % pieColors.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ borderRadius: "8px", border: "1px solid #e2e8f0", fontSize: "12px" }}
                />
                <Legend iconSize={8} wrapperStyle={{ fontSize: "11px" }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-3">
              {unitBreakdown.map((u, i) => (
                <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-gray-50">
                  <div
                    className="w-3 h-3 rounded-full flex-shrink-0"
                    style={{ backgroundColor: pieColors[i % pieColors.length] }}
                  />
                  <div className="flex-1">
                    <p className="text-sm font-medium">{u.name}</p>
                    <p className="text-xs text-muted">
                      {u.sessions} sessions &middot; {u.messages} messages &middot; {u.minutes} min
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="h-[200px] flex items-center justify-center text-muted text-sm">
            No unit activity data yet. Sessions will appear here after students use the chat.
          </div>
        )}
      </div>
    </div>
  );
}
