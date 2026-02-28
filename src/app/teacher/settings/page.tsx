"use client";

import { useState } from "react";
import TeacherLayout from "../../components/TeacherLayout";
import Link from "next/link";
import {
  Shield,
  Brain,
  MessageSquare,
  Eye,
  Sparkles,
  BookOpen,
  ArrowRight,
} from "lucide-react";
import { useIsMounted } from "@/lib/useIsMounted";
import { getUnits, getCourses } from "@/lib/storage";
import { Unit, Course } from "@/lib/types";

export default function AISettingsPage() {
  const mounted = useIsMounted();
  const [units] = useState<Unit[]>(() =>
    typeof window !== "undefined" ? getUnits() : []
  );
  const [courses] = useState<Course[]>(() =>
    typeof window !== "undefined" ? getCourses() : []
  );

  if (!mounted) return null;

  return (
    <TeacherLayout>
      <div className="max-w-5xl animate-fade-in">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-foreground">AI Configuration</h1>
          <p className="text-muted mt-1">
            Each unit has its own AI configuration. Select a unit below to configure its teaching approach, boundaries, and objectives.
          </p>
        </div>

        {units.length === 0 ? (
          <div className="bg-white rounded-xl border border-border p-12 text-center">
            <Brain size={48} className="text-gray-200 mx-auto mb-4" />
            <h3 className="font-semibold text-lg mb-2">No units to configure</h3>
            <p className="text-muted text-sm mb-4">
              Create courses and units first, then come back to configure the AI for each.
            </p>
            <Link
              href="/teacher/courses"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-white rounded-lg text-sm font-semibold"
            >
              <BookOpen size={16} /> Go to Courses
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {courses.map((course) => {
              const courseUnits = units.filter((u) => u.courseId === course.id);
              if (courseUnits.length === 0) return null;
              return (
                <div key={course.id} className="bg-white rounded-xl border border-border overflow-hidden">
                  <div className="p-5 border-b border-border bg-gradient-to-r from-indigo-50/50 to-transparent">
                    <h2 className="font-semibold text-lg">{course.name}</h2>
                  </div>
                  <div className="divide-y divide-border">
                    {courseUnits.map((unit) => (
                      <Link
                        key={unit.id}
                        href={`/teacher/courses/${unit.id}`}
                        className="flex items-center gap-5 px-5 py-4 hover:bg-surface-hover transition-colors group"
                      >
                        <div className="w-10 h-10 rounded-lg bg-indigo-100 flex items-center justify-center">
                          <Brain size={18} className="text-primary" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium">{unit.name}</p>
                          <div className="flex items-center gap-3 mt-1 text-xs text-muted">
                            <span className="capitalize flex items-center gap-1">
                              <Sparkles size={10} />
                              {unit.config.approach.replace("-", " ")}
                            </span>
                            <span className="flex items-center gap-1">
                              <MessageSquare size={10} />
                              {unit.config.tone}
                            </span>
                            <span className="flex items-center gap-1">
                              <Shield size={10} />
                              {unit.config.boundaries.filter((b) => b.enabled).length} boundaries
                            </span>
                            <span>
                              {unit.config.objectives.length} objectives
                            </span>
                          </div>
                        </div>
                        <ArrowRight size={16} className="text-muted group-hover:text-primary transition-colors" />
                      </Link>
                    ))}
                  </div>
                </div>
              );
            })}

            {/* How it works explanation */}
            <div className="bg-gradient-to-br from-indigo-600 to-indigo-800 rounded-xl p-6 text-white">
              <div className="flex items-center gap-2 mb-3">
                <Eye size={18} />
                <h2 className="font-semibold text-lg">How AI Configuration Works</h2>
              </div>
              <div className="grid md:grid-cols-3 gap-6 mt-4 text-sm">
                <div>
                  <p className="text-indigo-300 text-xs font-medium uppercase tracking-wider mb-1">
                    1. Teacher Configures
                  </p>
                  <p className="text-indigo-100">
                    Set teaching approach, objectives, boundaries, and scaffolding level for each unit.
                  </p>
                </div>
                <div>
                  <p className="text-indigo-300 text-xs font-medium uppercase tracking-wider mb-1">
                    2. AI Gets Instructions
                  </p>
                  <p className="text-indigo-100">
                    Your configuration becomes the AI&apos;s system prompt — controlling exactly how it teaches.
                  </p>
                </div>
                <div>
                  <p className="text-indigo-300 text-xs font-medium uppercase tracking-wider mb-1">
                    3. Student Learns
                  </p>
                  <p className="text-indigo-100">
                    Students chat with an AI that follows your rules, teaches your way, and stays on your topics.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </TeacherLayout>
  );
}
