"use client";

import { useState } from "react";
import TeacherLayout from "../../components/TeacherLayout";
import Link from "next/link";
import {
  Plus,
  BookOpen,
  ChevronRight,
  Settings2,
  Trash2,
  X,
} from "lucide-react";
import { useIsMounted } from "@/lib/useIsMounted";
import {
  getCourses,
  addCourse,
  deleteCourse,
  getUnitsByCourse,
  addUnit,
  deleteUnit,
  getUnitStats,
} from "@/lib/storage";
import { Course, Unit } from "@/lib/types";

export default function CoursesPage() {
  const mounted = useIsMounted();
  const [courses, setCourses] = useState<Course[]>(() =>
    typeof window !== "undefined" ? getCourses() : []
  );
  const [units, setUnits] = useState<Record<string, Unit[]>>(() => {
    if (typeof window === "undefined") return {};
    const c = getCourses();
    const map: Record<string, Unit[]> = {};
    c.forEach((course) => {
      map[course.id] = getUnitsByCourse(course.id);
    });
    return map;
  });
  const [newCourseName, setNewCourseName] = useState("");
  const [showNewCourse, setShowNewCourse] = useState(false);
  const [newUnitNames, setNewUnitNames] = useState<Record<string, string>>({});
  const [showNewUnit, setShowNewUnit] = useState<Record<string, boolean>>({});

  if (!mounted) return null;

  const handleAddCourse = () => {
    if (!newCourseName.trim()) return;
    const course = addCourse(newCourseName.trim());
    setCourses((prev) => [...prev, course]);
    setUnits((prev) => ({ ...prev, [course.id]: [] }));
    setNewCourseName("");
    setShowNewCourse(false);
  };

  const handleDeleteCourse = (id: string) => {
    if (!confirm("Delete this course and all its units?")) return;
    deleteCourse(id);
    setCourses((prev) => prev.filter((c) => c.id !== id));
    setUnits((prev) => {
      const updated = { ...prev };
      delete updated[id];
      return updated;
    });
  };

  const handleAddUnit = (courseId: string) => {
    const name = newUnitNames[courseId]?.trim();
    if (!name) return;
    const unit = addUnit(courseId, name);
    setUnits((prev) => ({
      ...prev,
      [courseId]: [...(prev[courseId] || []), unit],
    }));
    setNewUnitNames((prev) => ({ ...prev, [courseId]: "" }));
    setShowNewUnit((prev) => ({ ...prev, [courseId]: false }));
  };

  const handleDeleteUnit = (courseId: string, unitId: string) => {
    if (!confirm("Delete this unit?")) return;
    deleteUnit(unitId);
    setUnits((prev) => ({
      ...prev,
      [courseId]: prev[courseId].filter((u) => u.id !== unitId),
    }));
  };

  return (
    <TeacherLayout>
      <div className="max-w-7xl animate-fade-in">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              Courses & Units
            </h1>
            <p className="text-muted mt-1">
              Create courses, add units, and configure AI settings for each.
            </p>
          </div>
          <button
            onClick={() => setShowNewCourse(true)}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-white rounded-lg text-sm font-semibold hover:bg-primary-dark transition-colors shadow-lg shadow-indigo-500/20"
          >
            <Plus size={16} />
            New Course
          </button>
        </div>

        {/* New Course Form */}
        {showNewCourse && (
          <div className="bg-white rounded-xl border border-primary/30 p-5 mb-6 animate-fade-in">
            <h3 className="font-semibold mb-3">Create a New Course</h3>
            <div className="flex gap-3">
              <input
                type="text"
                value={newCourseName}
                onChange={(e) => setNewCourseName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAddCourse()}
                placeholder="e.g., AP Biology, Algebra II, World History..."
                className="flex-1 border border-border rounded-lg px-4 py-2 text-sm outline-none focus:border-primary/40"
                autoFocus
              />
              <button
                onClick={handleAddCourse}
                disabled={!newCourseName.trim()}
                className="px-5 py-2 bg-primary text-white rounded-lg text-sm font-semibold disabled:opacity-50"
              >
                Create
              </button>
              <button
                onClick={() => setShowNewCourse(false)}
                className="px-3 py-2 border border-border rounded-lg text-sm hover:bg-surface-hover"
              >
                <X size={16} />
              </button>
            </div>
          </div>
        )}

        {courses.length === 0 && !showNewCourse && (
          <div className="bg-white rounded-xl border border-border p-12 text-center">
            <BookOpen size={48} className="text-gray-200 mx-auto mb-4" />
            <h3 className="font-semibold text-lg mb-2">No courses yet</h3>
            <p className="text-muted text-sm mb-4">
              Create your first course to start configuring AI tutoring for your
              students.
            </p>
            <button
              onClick={() => setShowNewCourse(true)}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-white rounded-lg text-sm font-semibold"
            >
              <Plus size={16} />
              Create First Course
            </button>
          </div>
        )}

        <div className="space-y-6">
          {courses.map((course) => {
            const courseUnits = units[course.id] || [];
            return (
              <div
                key={course.id}
                className="bg-white rounded-xl border border-border overflow-hidden"
              >
                <div className="flex items-center justify-between p-5 border-b border-border bg-gradient-to-r from-indigo-50/50 to-transparent">
                  <div className="flex items-center gap-4">
                    <div className="w-11 h-11 rounded-xl bg-primary flex items-center justify-center text-white font-bold">
                      <BookOpen size={20} />
                    </div>
                    <div>
                      <h2 className="font-semibold text-lg">{course.name}</h2>
                      <p className="text-sm text-muted">
                        {courseUnits.length} unit{courseUnits.length !== 1 ? "s" : ""}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() =>
                        setShowNewUnit((prev) => ({
                          ...prev,
                          [course.id]: true,
                        }))
                      }
                      className="px-3 py-1.5 text-sm border border-primary text-primary rounded-lg hover:bg-indigo-50 transition-colors flex items-center gap-1.5"
                    >
                      <Plus size={14} />
                      Add Unit
                    </button>
                    <button
                      onClick={() => handleDeleteCourse(course.id)}
                      className="px-3 py-1.5 text-sm border border-border text-muted rounded-lg hover:bg-red-50 hover:text-red-500 hover:border-red-200 transition-colors"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>

                {/* Add Unit Form */}
                {showNewUnit[course.id] && (
                  <div className="px-5 py-3 bg-indigo-50/30 border-b border-border">
                    <div className="flex gap-3">
                      <input
                        type="text"
                        value={newUnitNames[course.id] || ""}
                        onChange={(e) =>
                          setNewUnitNames((prev) => ({
                            ...prev,
                            [course.id]: e.target.value,
                          }))
                        }
                        onKeyDown={(e) =>
                          e.key === "Enter" && handleAddUnit(course.id)
                        }
                        placeholder="Unit name, e.g., Cell Division, Quadratic Equations..."
                        className="flex-1 border border-border rounded-lg px-3 py-2 text-sm outline-none focus:border-primary/40 bg-white"
                        autoFocus
                      />
                      <button
                        onClick={() => handleAddUnit(course.id)}
                        disabled={!newUnitNames[course.id]?.trim()}
                        className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-semibold disabled:opacity-50"
                      >
                        Add
                      </button>
                      <button
                        onClick={() =>
                          setShowNewUnit((prev) => ({
                            ...prev,
                            [course.id]: false,
                          }))
                        }
                        className="px-2 py-2 border border-border rounded-lg hover:bg-surface-hover"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  </div>
                )}

                {courseUnits.length === 0 && !showNewUnit[course.id] && (
                  <div className="px-5 py-8 text-center text-muted text-sm">
                    No units yet. Add a unit to start configuring AI tutoring.
                  </div>
                )}

                <div className="divide-y divide-border">
                  {courseUnits.map((unit) => {
                    const stats = getUnitStats(unit.id);
                    return (
                      <div
                        key={unit.id}
                        className="flex items-center gap-5 px-5 py-4 hover:bg-surface-hover transition-colors group"
                      >
                        <div className="w-2 h-12 rounded-full bg-emerald-400" />
                        <div className="flex-1">
                          <p className="font-medium">{unit.name}</p>
                          <div className="flex items-center gap-4 mt-1 text-xs text-muted">
                            <span>
                              {unit.config.objectives.length} objective{unit.config.objectives.length !== 1 ? "s" : ""}
                            </span>
                            <span className="capitalize">
                              {unit.config.approach.replace("-", " ")}
                            </span>
                            {stats.totalSessions > 0 && (
                              <span>
                                {stats.totalSessions} session{stats.totalSessions !== 1 ? "s" : ""}
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Link
                            href={`/teacher/courses/${unit.id}`}
                            className="px-3 py-1.5 text-sm border border-border rounded-lg hover:bg-surface-hover transition-colors flex items-center gap-1.5"
                          >
                            <Settings2 size={13} />
                            Configure
                          </Link>
                          <button
                            onClick={() =>
                              handleDeleteUnit(course.id, unit.id)
                            }
                            className="px-2 py-1.5 text-sm border border-border rounded-lg text-muted hover:bg-red-50 hover:text-red-500 hover:border-red-200 transition-colors opacity-0 group-hover:opacity-100"
                          >
                            <Trash2 size={13} />
                          </button>
                          <Link
                            href={`/teacher/courses/${unit.id}`}
                          >
                            <ChevronRight
                              size={16}
                              className="text-muted group-hover:text-primary transition-colors"
                            />
                          </Link>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </TeacherLayout>
  );
}
