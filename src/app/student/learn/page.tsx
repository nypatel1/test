"use client";

import Link from "next/link";
import Logo from "../../components/Logo";
import {
  BookOpen,
  Brain,
  Target,
  Clock,
  ChevronRight,
  Plus,
} from "lucide-react";
import { useIsMounted } from "@/lib/useIsMounted";
import { getCourses, getUnits, getUnitStats, getAllStats } from "@/lib/storage";
import { Course, Unit } from "@/lib/types";
import { useState } from "react";

export default function StudentLearnPage() {
  const mounted = useIsMounted();
  const [courses] = useState<Course[]>(() =>
    typeof window !== "undefined" ? getCourses() : []
  );
  const [units] = useState<Unit[]>(() =>
    typeof window !== "undefined" ? getUnits() : []
  );

  if (!mounted) return null;

  const stats = getAllStats();

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 via-background to-background">
      <header className="sticky top-0 z-20 bg-white/80 backdrop-blur-md border-b border-border">
        <div className="max-w-6xl mx-auto px-6 py-3 flex items-center justify-between">
          <Logo size="sm" />
          <div className="flex items-center gap-4">
            <Link href="/teacher/dashboard" className="text-xs text-muted hover:text-foreground transition-colors">
              Teacher View
            </Link>
            <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center text-white text-xs font-bold">
              S
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="mb-8 animate-fade-in">
          <h1 className="text-2xl font-bold">Your Learning Dashboard</h1>
          <p className="text-muted mt-1">
            Select a unit to start a tutoring session with the AI.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 animate-fade-in">
          <div className="bg-white rounded-xl border border-border p-4">
            <div className="flex items-center gap-2 text-muted mb-1">
              <BookOpen size={14} />
              <span className="text-xs font-medium">Courses</span>
            </div>
            <p className="text-2xl font-bold">{stats.totalCourses}</p>
          </div>
          <div className="bg-white rounded-xl border border-border p-4">
            <div className="flex items-center gap-2 text-muted mb-1">
              <Target size={14} />
              <span className="text-xs font-medium">Units</span>
            </div>
            <p className="text-2xl font-bold">{stats.totalUnits}</p>
          </div>
          <div className="bg-white rounded-xl border border-border p-4">
            <div className="flex items-center gap-2 text-muted mb-1">
              <Brain size={14} />
              <span className="text-xs font-medium">Chat Sessions</span>
            </div>
            <p className="text-2xl font-bold">{stats.totalSessions}</p>
          </div>
          <div className="bg-white rounded-xl border border-border p-4">
            <div className="flex items-center gap-2 text-muted mb-1">
              <Clock size={14} />
              <span className="text-xs font-medium">Total Study Time</span>
            </div>
            <p className="text-2xl font-bold">{stats.totalMinutes} min</p>
          </div>
        </div>

        {courses.length === 0 ? (
          <div className="bg-white rounded-xl border border-border p-12 text-center animate-fade-in">
            <BookOpen size={48} className="text-gray-200 mx-auto mb-4" />
            <h3 className="font-semibold text-lg mb-2">No courses available</h3>
            <p className="text-muted text-sm mb-4">
              Your teacher needs to create courses and units first. Or you can set them up from the teacher portal.
            </p>
            <Link
              href="/teacher/courses"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-white rounded-lg text-sm font-semibold"
            >
              <Plus size={16} /> Set Up Courses
            </Link>
          </div>
        ) : (
          <div className="space-y-6 animate-fade-in">
            {courses.map((course) => {
              const courseUnits = units.filter((u) => u.courseId === course.id);
              if (courseUnits.length === 0) return null;
              return (
                <div key={course.id}>
                  <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
                    <BookOpen size={18} className="text-primary" />
                    {course.name}
                  </h2>
                  <div className="grid md:grid-cols-2 gap-4">
                    {courseUnits.map((unit) => {
                      const unitStats = getUnitStats(unit.id);
                      return (
                        <Link
                          key={unit.id}
                          href={`/student/chat?unit=${unit.id}`}
                          className="block bg-white rounded-xl border border-border p-5 hover:shadow-lg hover:border-primary/20 transition-all group"
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h3 className="font-semibold text-base">{unit.name}</h3>
                              <p className="text-sm text-muted mt-0.5 capitalize">
                                {unit.config.approach.replace("-", " ")} &middot; {unit.config.objectives.length} objectives
                              </p>
                              {unitStats.totalSessions > 0 && (
                                <div className="flex items-center gap-3 mt-2 text-xs text-muted">
                                  <span>{unitStats.totalSessions} sessions</span>
                                  <span>{unitStats.totalMinutes} min</span>
                                  <span>{unitStats.totalQuestions} questions</span>
                                </div>
                              )}
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                                <Brain size={18} className="text-primary" />
                              </div>
                              <ChevronRight size={16} className="text-muted group-hover:text-primary transition-colors" />
                            </div>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Quick link to set up */}
        {courses.length > 0 && units.length > 0 && (
          <div className="mt-8 bg-gradient-to-r from-indigo-600 to-indigo-700 rounded-xl p-6 text-white animate-fade-in">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-lg">Need more units?</h3>
                <p className="text-indigo-200 text-sm mt-1">
                  Teachers can add new courses and units from the teacher portal.
                </p>
              </div>
              <Link
                href="/teacher/courses"
                className="flex items-center gap-2 px-4 py-2 bg-white/20 rounded-lg text-sm font-medium hover:bg-white/30 transition-colors"
              >
                <Plus size={16} /> Add Units
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
