"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Logo from "../../components/Logo";
import {
  BookOpen, Brain, Clock, ChevronRight, Plus,
  LogOut, KeyRound, Loader2, AlertCircle, Check,
} from "lucide-react";
import { useAuth } from "@/lib/AuthContext";
import * as db from "@/lib/db";

export default function StudentLearnPage() {
  const { user, profile, loading: authLoading, signOut } = useAuth();
  const router = useRouter();
  const [courses, setCourses] = useState<any[]>([]);
  const [unitMap, setUnitMap] = useState<Record<string, any[]>>({});
  const [sessions, setSessions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [classCode, setClassCode] = useState("");
  const [joinError, setJoinError] = useState("");
  const [joinSuccess, setJoinSuccess] = useState(false);
  const [joining, setJoining] = useState(false);

  useEffect(() => {
    if (authLoading) return;
    if (!user) { router.push("/auth"); return; }

    (async () => {
      const c = await db.getStudentCourses(user.id) as any[];
      setCourses(c);
      const map: Record<string, any[]> = {};
      for (const course of c) {
        map[(course as any).id] = await db.getUnits((course as any).id);
      }
      setUnitMap(map);
      const s = await db.getStudentSessions(user.id);
      setSessions(s);
      setLoading(false);
    })();
  }, [user, authLoading, router]);

  const handleJoin = async () => {
    if (!classCode.trim() || !user) return;
    setJoinError("");
    setJoining(true);
    try {
      await db.joinCourse(user.id, classCode.trim());
      setJoinSuccess(true);
      setClassCode("");
      const c = await db.getStudentCourses(user.id) as any[];
      setCourses(c);
      const map: Record<string, any[]> = {};
      for (const course of c) {
        map[(course as any).id] = await db.getUnits((course as any).id);
      }
      setUnitMap(map);
      setTimeout(() => setJoinSuccess(false), 3000);
    } catch (err: any) {
      setJoinError(err.message || "Failed to join");
    } finally {
      setJoining(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    router.push("/");
  };

  if (authLoading || loading) {
    return <div className="min-h-screen flex items-center justify-center"><Loader2 size={24} className="animate-spin text-primary" /></div>;
  }

  const totalSessions = sessions.length;
  const totalMinutes = sessions.reduce((s: number, x: any) => s + (x.duration_minutes || 0), 0);

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 via-background to-background">
      <header className="sticky top-0 z-20 bg-white/80 backdrop-blur-md border-b border-border">
        <div className="max-w-6xl mx-auto px-6 py-3 flex items-center justify-between">
          <Logo size="sm" />
          <div className="flex items-center gap-4">
            {profile?.role === "teacher" && (
              <Link href="/teacher/dashboard" className="text-xs text-muted hover:text-foreground">Teacher View</Link>
            )}
            <button onClick={handleSignOut} className="text-xs text-muted hover:text-foreground flex items-center gap-1">
              <LogOut size={12} /> Sign Out
            </button>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center text-white text-xs font-bold">
                {profile?.full_name?.[0] || "S"}
              </div>
              <span className="text-sm font-medium">{profile?.full_name?.split(" ")[0]}</span>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="mb-8 animate-fade-in">
          <h1 className="text-2xl font-bold">
            Welcome, {profile?.full_name?.split(" ")[0] || "Student"}!
          </h1>
          <p className="text-muted mt-1">Select a unit to start a tutoring session.</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8 animate-fade-in">
          <div className="bg-white rounded-xl border border-border p-4">
            <div className="flex items-center gap-2 text-muted mb-1"><BookOpen size={14} /><span className="text-xs font-medium">Courses</span></div>
            <p className="text-2xl font-bold">{courses.length}</p>
          </div>
          <div className="bg-white rounded-xl border border-border p-4">
            <div className="flex items-center gap-2 text-muted mb-1"><Brain size={14} /><span className="text-xs font-medium">Sessions</span></div>
            <p className="text-2xl font-bold">{totalSessions}</p>
          </div>
          <div className="bg-white rounded-xl border border-border p-4">
            <div className="flex items-center gap-2 text-muted mb-1"><Clock size={14} /><span className="text-xs font-medium">Study Time</span></div>
            <p className="text-2xl font-bold">{totalMinutes} min</p>
          </div>
        </div>

        {/* Join Course */}
        <div className="bg-white rounded-xl border border-border p-5 mb-8 animate-fade-in">
          <h2 className="font-semibold flex items-center gap-2 mb-3">
            <KeyRound size={16} className="text-primary" /> Join a Class
          </h2>
          <p className="text-sm text-muted mb-3">Enter the class code your teacher gave you.</p>
          <div className="flex gap-3">
            <input
              type="text"
              value={classCode}
              onChange={(e) => setClassCode(e.target.value.toUpperCase())}
              onKeyDown={(e) => e.key === "Enter" && handleJoin()}
              placeholder="e.g., AB3X9K"
              className="flex-1 border border-border rounded-lg px-4 py-2.5 text-sm outline-none focus:border-primary/40 font-mono tracking-wider uppercase"
              maxLength={6}
            />
            <button
              onClick={handleJoin}
              disabled={!classCode.trim() || joining}
              className="px-5 py-2.5 bg-primary text-white rounded-lg text-sm font-semibold disabled:opacity-50 flex items-center gap-2"
            >
              {joining ? <Loader2 size={14} className="animate-spin" /> : <Plus size={14} />}
              Join
            </button>
          </div>
          {joinError && (
            <div className="mt-2 flex items-center gap-2 text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">
              <AlertCircle size={14} /> {joinError}
            </div>
          )}
          {joinSuccess && (
            <div className="mt-2 flex items-center gap-2 text-sm text-emerald-600 bg-emerald-50 px-3 py-2 rounded-lg">
              <Check size={14} /> Successfully joined the class!
            </div>
          )}
        </div>

        {/* Courses & Units */}
        {courses.length === 0 ? (
          <div className="bg-white rounded-xl border border-border p-12 text-center animate-fade-in">
            <BookOpen size={48} className="text-gray-200 mx-auto mb-4" />
            <h3 className="font-semibold text-lg mb-2">No courses yet</h3>
            <p className="text-muted text-sm">Ask your teacher for a class code to get started.</p>
          </div>
        ) : (
          <div className="space-y-6 animate-fade-in">
            {courses.map((course: any) => {
              const courseUnits = unitMap[course.id] || [];
              return (
                <div key={course.id}>
                  <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
                    <BookOpen size={18} className="text-primary" /> {course.name}
                  </h2>
                  {courseUnits.length === 0 ? (
                    <p className="text-sm text-muted ml-7">No units available yet. Your teacher is setting things up.</p>
                  ) : (
                    <div className="grid md:grid-cols-2 gap-4">
                      {courseUnits.map((unit: any) => (
                        <Link key={unit.id} href={`/student/chat?unit=${unit.id}`} className="block bg-white rounded-xl border border-border p-5 hover:shadow-lg hover:border-primary/20 transition-all group">
                          <div className="flex items-start justify-between">
                            <div>
                              <h3 className="font-semibold">{unit.name}</h3>
                              <p className="text-sm text-muted mt-0.5 capitalize">
                                {(unit.config?.approach || "socratic").replace("-", " ")} &middot; {unit.config?.objectives?.length || 0} objectives
                              </p>
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center"><Brain size={18} className="text-primary" /></div>
                              <ChevronRight size={16} className="text-muted group-hover:text-primary" />
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
