"use client";

import TeacherLayout from "../../components/TeacherLayout";
import Link from "next/link";
import {
  Plus,
  BookOpen,
  Users,
  ChevronRight,
  Target,
  Clock,
  Lock,
  Settings2,
} from "lucide-react";

const courses = [
  {
    id: "ap-bio-p3",
    name: "AP Biology — Period 3",
    students: 34,
    units: [
      {
        id: "cell-division",
        name: "Cell Division & Mitosis",
        objectives: 6,
        mastery: 76,
        status: "active",
        approach: "Socratic",
        daysLeft: 5,
      },
      {
        id: "dna-replication",
        name: "DNA Replication",
        objectives: 4,
        mastery: 62,
        status: "active",
        approach: "Step-by-step",
        daysLeft: 12,
      },
      {
        id: "protein-synthesis",
        name: "Protein Synthesis",
        objectives: 5,
        mastery: 81,
        status: "active",
        approach: "Conceptual-first",
        daysLeft: 3,
      },
      {
        id: "genetics",
        name: "Genetics & Heredity",
        objectives: 7,
        mastery: 0,
        status: "upcoming",
        approach: "Socratic",
        daysLeft: 18,
      },
    ],
  },
  {
    id: "ap-bio-p5",
    name: "AP Biology — Period 5",
    students: 38,
    units: [
      {
        id: "cell-division-2",
        name: "Cell Division & Mitosis",
        objectives: 6,
        mastery: 71,
        status: "active",
        approach: "Socratic",
        daysLeft: 5,
      },
      {
        id: "dna-replication-2",
        name: "DNA Replication",
        objectives: 4,
        mastery: 58,
        status: "active",
        approach: "Step-by-step",
        daysLeft: 12,
      },
    ],
  },
  {
    id: "bio-honors",
    name: "Biology Honors",
    students: 42,
    units: [
      {
        id: "ecology",
        name: "Ecology & Ecosystems",
        objectives: 5,
        mastery: 68,
        status: "active",
        approach: "Conceptual-first",
        daysLeft: 8,
      },
      {
        id: "evolution",
        name: "Evolution & Natural Selection",
        objectives: 6,
        mastery: 55,
        status: "active",
        approach: "Socratic",
        daysLeft: 14,
      },
    ],
  },
];

export default function CoursesPage() {
  return (
    <TeacherLayout>
      <div className="max-w-7xl animate-fade-in">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              Courses & Units
            </h1>
            <p className="text-muted mt-1">
              Configure your courses, define units, and set AI learning
              parameters.
            </p>
          </div>
          <button className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-white rounded-lg text-sm font-semibold hover:bg-primary-dark transition-colors shadow-lg shadow-indigo-500/20">
            <Plus size={16} />
            New Course
          </button>
        </div>

        <div className="space-y-6">
          {courses.map((course) => (
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
                    <p className="text-sm text-muted flex items-center gap-3">
                      <span className="flex items-center gap-1">
                        <Users size={13} />
                        {course.students} students
                      </span>
                      <span className="flex items-center gap-1">
                        <Target size={13} />
                        {course.units.length} units
                      </span>
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button className="px-3 py-1.5 text-sm border border-border rounded-lg hover:bg-surface-hover transition-colors flex items-center gap-1.5">
                    <Settings2 size={14} />
                    Course Settings
                  </button>
                  <button className="px-3 py-1.5 text-sm border border-primary text-primary rounded-lg hover:bg-indigo-50 transition-colors flex items-center gap-1.5">
                    <Plus size={14} />
                    Add Unit
                  </button>
                </div>
              </div>

              <div className="divide-y divide-border">
                {course.units.map((unit) => (
                  <Link
                    key={unit.id}
                    href={`/teacher/courses/${unit.id}`}
                    className="flex items-center gap-5 px-5 py-4 hover:bg-surface-hover transition-colors group"
                  >
                    <div
                      className={`w-2 h-12 rounded-full ${
                        unit.status === "active"
                          ? "bg-emerald-400"
                          : "bg-gray-200"
                      }`}
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className="font-medium">{unit.name}</p>
                        {unit.status === "upcoming" && (
                          <span className="px-2 py-0.5 rounded-full bg-gray-100 text-gray-500 text-xs font-medium">
                            Upcoming
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-4 mt-1 text-xs text-muted">
                        <span className="flex items-center gap-1">
                          <Target size={12} />
                          {unit.objectives} learning objectives
                        </span>
                        <span className="flex items-center gap-1">
                          <Settings2 size={12} />
                          {unit.approach} approach
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock size={12} />
                          {unit.daysLeft} days remaining
                        </span>
                      </div>
                    </div>

                    {unit.status === "active" ? (
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <div className="flex items-center gap-2">
                            <div className="w-20 h-2 bg-gray-100 rounded-full overflow-hidden">
                              <div
                                className={`h-full rounded-full ${
                                  unit.mastery >= 75
                                    ? "bg-emerald-500"
                                    : unit.mastery >= 60
                                    ? "bg-amber-500"
                                    : "bg-red-500"
                                }`}
                                style={{ width: `${unit.mastery}%` }}
                              />
                            </div>
                            <span className="text-sm font-semibold w-10 text-right">
                              {unit.mastery}%
                            </span>
                          </div>
                          <p className="text-xs text-muted">class mastery</p>
                        </div>
                        <ChevronRight
                          size={16}
                          className="text-muted group-hover:text-primary transition-colors"
                        />
                      </div>
                    ) : (
                      <div className="flex items-center gap-3">
                        <Lock size={14} className="text-gray-300" />
                        <ChevronRight
                          size={16}
                          className="text-muted group-hover:text-primary transition-colors"
                        />
                      </div>
                    )}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </TeacherLayout>
  );
}
