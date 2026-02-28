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
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts";
import { Zap, TrendingUp, Target, Users } from "lucide-react";

const engagementData = [
  { day: "Mon", sessions: 45, avgMinutes: 18, questions: 120 },
  { day: "Tue", sessions: 52, avgMinutes: 22, questions: 156 },
  { day: "Wed", sessions: 38, avgMinutes: 15, questions: 95 },
  { day: "Thu", sessions: 61, avgMinutes: 25, questions: 183 },
  { day: "Fri", sessions: 33, avgMinutes: 12, questions: 78 },
  { day: "Sat", sessions: 8, avgMinutes: 28, questions: 22 },
  { day: "Sun", sessions: 5, avgMinutes: 30, questions: 14 },
];

const masteryOverTime = [
  { week: "Week 1", mastery: 32, engagement: 45, misconceptions: 12 },
  { week: "Week 2", mastery: 45, engagement: 58, misconceptions: 10 },
  { week: "Week 3", mastery: 58, engagement: 62, misconceptions: 8 },
  { week: "Week 4", mastery: 67, engagement: 70, misconceptions: 6 },
  { week: "Week 5", mastery: 73, engagement: 75, misconceptions: 5 },
];

const objectiveRadar = [
  { objective: "Mitosis Stages", classAvg: 78, topQuartile: 92 },
  { objective: "Mitosis vs Meiosis", classAvg: 54, topQuartile: 82 },
  { objective: "Checkpoints", classAvg: 71, topQuartile: 90 },
  { objective: "Division Errors", classAvg: 45, topQuartile: 78 },
  { objective: "Growth & Repair", classAvg: 82, topQuartile: 95 },
  { objective: "Microscope", classAvg: 69, topQuartile: 88 },
];

const masteryDistribution = [
  { name: "Mastered (80%+)", value: 12, color: "#10b981" },
  { name: "Progressing (60-79%)", value: 14, color: "#f59e0b" },
  { name: "Developing (40-59%)", value: 5, color: "#f97316" },
  { name: "Struggling (<40%)", value: 3, color: "#ef4444" },
];

export default function ChartsSection() {
  const [engagementMetric, setEngagementMetric] = useState<
    "sessions" | "avgMinutes" | "questions"
  >("sessions");

  const metricLabels = {
    sessions: "Sessions",
    avgMinutes: "Avg. Minutes",
    questions: "Questions Asked",
  };

  return (
    <div className="grid lg:grid-cols-2 gap-6 mb-8">
      {/* Engagement Bar Chart */}
      <div className="bg-white rounded-xl border border-border p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Zap size={18} className="text-indigo-500" />
            <h2 className="font-semibold text-lg">Weekly Engagement</h2>
          </div>
          <select
            value={engagementMetric}
            onChange={(e) =>
              setEngagementMetric(
                e.target.value as "sessions" | "avgMinutes" | "questions"
              )
            }
            className="text-sm border border-border rounded-lg px-2 py-1 bg-white"
          >
            <option value="sessions">Sessions</option>
            <option value="avgMinutes">Avg. Minutes</option>
            <option value="questions">Questions</option>
          </select>
        </div>
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={engagementData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis dataKey="day" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip
              contentStyle={{
                borderRadius: "8px",
                border: "1px solid #e2e8f0",
                fontSize: "12px",
              }}
            />
            <Bar
              dataKey={engagementMetric}
              name={metricLabels[engagementMetric]}
              fill="#4f46e5"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Mastery Progression Line Chart */}
      <div className="bg-white rounded-xl border border-border p-6">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp size={18} className="text-emerald-500" />
          <h2 className="font-semibold text-lg">Mastery & Engagement Over Time</h2>
        </div>
        <ResponsiveContainer width="100%" height={240}>
          <AreaChart data={masteryOverTime}>
            <defs>
              <linearGradient id="masteryGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#4f46e5" stopOpacity={0.3} />
                <stop offset="100%" stopColor="#4f46e5" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="engagementGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#10b981" stopOpacity={0.3} />
                <stop offset="100%" stopColor="#10b981" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis dataKey="week" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} domain={[0, 100]} />
            <Tooltip
              contentStyle={{
                borderRadius: "8px",
                border: "1px solid #e2e8f0",
                fontSize: "12px",
              }}
            />
            <Legend iconSize={8} wrapperStyle={{ fontSize: "12px" }} />
            <Area
              type="monotone"
              dataKey="mastery"
              name="Mastery %"
              stroke="#4f46e5"
              fill="url(#masteryGrad)"
              strokeWidth={2}
            />
            <Area
              type="monotone"
              dataKey="engagement"
              name="Engagement %"
              stroke="#10b981"
              fill="url(#engagementGrad)"
              strokeWidth={2}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Objective Radar Chart */}
      <div className="bg-white rounded-xl border border-border p-6">
        <div className="flex items-center gap-2 mb-4">
          <Target size={18} className="text-primary" />
          <h2 className="font-semibold text-lg">Objective Mastery Radar</h2>
        </div>
        <p className="text-xs text-muted mb-2">
          Class average vs. top quartile performance per objective.
        </p>
        <ResponsiveContainer width="100%" height={280}>
          <RadarChart cx="50%" cy="50%" outerRadius="70%" data={objectiveRadar}>
            <PolarGrid stroke="#e2e8f0" />
            <PolarAngleAxis
              dataKey="objective"
              tick={{ fontSize: 10 }}
              className="text-muted"
            />
            <PolarRadiusAxis
              angle={30}
              domain={[0, 100]}
              tick={{ fontSize: 10 }}
            />
            <Radar
              name="Class Average"
              dataKey="classAvg"
              stroke="#4f46e5"
              fill="#4f46e5"
              fillOpacity={0.2}
              strokeWidth={2}
            />
            <Radar
              name="Top Quartile"
              dataKey="topQuartile"
              stroke="#10b981"
              fill="#10b981"
              fillOpacity={0.1}
              strokeWidth={2}
            />
            <Legend iconSize={8} wrapperStyle={{ fontSize: "12px" }} />
            <Tooltip
              contentStyle={{
                borderRadius: "8px",
                border: "1px solid #e2e8f0",
                fontSize: "12px",
              }}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>

      {/* Student Distribution Pie */}
      <div className="bg-white rounded-xl border border-border p-6">
        <div className="flex items-center gap-2 mb-4">
          <Users size={18} className="text-primary" />
          <h2 className="font-semibold text-lg">Mastery Distribution</h2>
        </div>
        <p className="text-xs text-muted mb-2">
          How students are distributed across mastery levels.
        </p>
        <ResponsiveContainer width="100%" height={280}>
          <PieChart>
            <Pie
              data={masteryDistribution}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={95}
              paddingAngle={3}
              dataKey="value"
              label={({ value }) => `${value}`}
              labelLine={false}
            >
              {masteryDistribution.map((entry, index) => (
                <Cell key={index} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                borderRadius: "8px",
                border: "1px solid #e2e8f0",
                fontSize: "12px",
              }}
            />
            <Legend
              iconSize={8}
              wrapperStyle={{ fontSize: "11px" }}
              layout="vertical"
              verticalAlign="middle"
              align="right"
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
