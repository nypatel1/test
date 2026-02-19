"use client";

import Link from "next/link";
import Logo from "./components/Logo";
import {
  Shield,
  Brain,
  BarChart3,
  Users,
  ArrowRight,
  CheckCircle2,
  GraduationCap,
  BookOpen,
} from "lucide-react";

const features = [
  {
    icon: Shield,
    title: "Teacher-Controlled",
    description:
      "Teachers define topics, learning objectives, depth requirements, and boundaries. The AI stays aligned to classroom goals.",
  },
  {
    icon: Brain,
    title: "Adaptive Mastery",
    description:
      "Students learn through guided questioning, not answer-giving. The AI adapts to each student's learning style and pace.",
  },
  {
    icon: BarChart3,
    title: "Deep Insights",
    description:
      "Real-time analytics on misconceptions, engagement, mastery progression, and struggling students flow back to teachers.",
  },
  {
    icon: Users,
    title: "Closed-Loop System",
    description:
      "Teacher configures AI, student learns with AI, insights flow back to teacher. A complete feedback loop for better outcomes.",
  },
];

const differentiators = [
  "Aligned to curriculum standards",
  "No answer-giving — mastery-focused",
  "Detects misconceptions in real-time",
  "Supports MTSS and UDL frameworks",
  "Teacher sets all boundaries",
  "Personalized learning at scale",
];

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 via-white to-white">
      {/* Header */}
      <header className="flex items-center justify-between px-8 py-5 max-w-7xl mx-auto">
        <Logo size="md" />
        <div className="flex items-center gap-4">
          <Link
            href="/student/learn"
            className="text-sm font-medium text-muted hover:text-foreground transition-colors"
          >
            Student Portal
          </Link>
          <Link
            href="/teacher/dashboard"
            className="px-5 py-2.5 rounded-lg bg-primary text-white text-sm font-semibold hover:bg-primary-dark transition-colors shadow-lg shadow-indigo-500/25"
          >
            Teacher Portal
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-7xl mx-auto px-8 pt-20 pb-24 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-100 text-indigo-700 text-sm font-medium mb-8">
          <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
          AI that amplifies teachers, not replaces them
        </div>
        <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-foreground leading-tight max-w-4xl mx-auto">
          Teacher-Controlled AI for{" "}
          <span className="text-primary">Mastery-Based Learning</span>
        </h1>
        <p className="mt-6 text-xl text-muted max-w-2xl mx-auto leading-relaxed">
          Riseva gives teachers the power to configure AI that personalizes
          instruction for every student — while staying aligned to classroom
          goals and measuring true understanding.
        </p>
        <div className="mt-10 flex items-center justify-center gap-4">
          <Link
            href="/teacher/dashboard"
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-primary text-white font-semibold hover:bg-primary-dark transition-all shadow-xl shadow-indigo-500/25 text-base"
          >
            <BookOpen size={18} />
            Explore Teacher Dashboard
          </Link>
          <Link
            href="/student/learn"
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl border-2 border-primary text-primary font-semibold hover:bg-indigo-50 transition-all text-base"
          >
            <GraduationCap size={18} />
            Try Student Experience
          </Link>
        </div>
      </section>

      {/* Flow Diagram */}
      <section className="max-w-5xl mx-auto px-8 pb-24">
        <div className="bg-white rounded-2xl shadow-xl border border-border p-10">
          <h3 className="text-center text-sm font-semibold text-muted uppercase tracking-wider mb-8">
            How Riseva Works — The Closed-Loop
          </h3>
          <div className="flex items-center justify-between gap-2">
            <div className="flex-1 text-center">
              <div className="w-20 h-20 rounded-2xl bg-indigo-100 flex items-center justify-center mx-auto mb-3">
                <BookOpen className="text-primary" size={32} />
              </div>
              <p className="font-semibold text-foreground">Teacher Configures</p>
              <p className="text-xs text-muted mt-1">
                Topics, objectives, boundaries, teaching approach
              </p>
            </div>
            <ArrowRight className="text-indigo-300 flex-shrink-0" size={28} />
            <div className="flex-1 text-center">
              <div className="w-20 h-20 rounded-2xl bg-cyan-100 flex items-center justify-center mx-auto mb-3">
                <Brain className="text-accent" size={32} />
              </div>
              <p className="font-semibold text-foreground">AI Teaches</p>
              <p className="text-xs text-muted mt-1">
                Personalized, adaptive, mastery-focused tutoring
              </p>
            </div>
            <ArrowRight className="text-indigo-300 flex-shrink-0" size={28} />
            <div className="flex-1 text-center">
              <div className="w-20 h-20 rounded-2xl bg-emerald-100 flex items-center justify-center mx-auto mb-3">
                <GraduationCap className="text-success" size={32} />
              </div>
              <p className="font-semibold text-foreground">Student Learns</p>
              <p className="text-xs text-muted mt-1">
                Guided questioning, adapted to learning style
              </p>
            </div>
            <ArrowRight className="text-indigo-300 flex-shrink-0" size={28} />
            <div className="flex-1 text-center">
              <div className="w-20 h-20 rounded-2xl bg-amber-100 flex items-center justify-center mx-auto mb-3">
                <BarChart3 className="text-warning" size={32} />
              </div>
              <p className="font-semibold text-foreground">Insights Flow Back</p>
              <p className="text-xs text-muted mt-1">
                Misconceptions, mastery levels, engagement data
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-7xl mx-auto px-8 pb-24">
        <h2 className="text-3xl font-bold text-center mb-4">
          Built for Schools, Controlled by Teachers
        </h2>
        <p className="text-center text-muted mb-14 max-w-xl mx-auto">
          Not another AI homework tool. A closed-loop learning system aligned to
          mastery-based, differentiated instruction.
        </p>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((f) => (
            <div
              key={f.title}
              className="bg-white rounded-xl border border-border p-6 hover:shadow-lg hover:border-primary/20 transition-all"
            >
              <div className="w-12 h-12 rounded-lg bg-indigo-100 flex items-center justify-center mb-4">
                <f.icon className="text-primary" size={22} />
              </div>
              <h3 className="font-semibold text-lg mb-2">{f.title}</h3>
              <p className="text-sm text-muted leading-relaxed">
                {f.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Differentiators */}
      <section className="max-w-4xl mx-auto px-8 pb-24">
        <div className="bg-gradient-to-br from-indigo-600 to-indigo-800 rounded-2xl p-10 text-white">
          <h2 className="text-2xl font-bold mb-2">What Makes Riseva Different</h2>
          <p className="text-indigo-200 mb-8">
            Most AI tools go directly from AI to student. Riseva puts teachers
            in control of the entire loop.
          </p>
          <div className="grid md:grid-cols-2 gap-3">
            {differentiators.map((d) => (
              <div key={d} className="flex items-center gap-3">
                <CheckCircle2
                  size={18}
                  className="text-emerald-400 flex-shrink-0"
                />
                <span className="text-sm">{d}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8 text-center text-sm text-muted">
        <Logo size="sm" /> &nbsp;&middot;&nbsp; Teacher-controlled AI for
        mastery-based, personalized learning inside schools.
      </footer>
    </div>
  );
}
