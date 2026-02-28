"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Logo from "../components/Logo";
import { useAuth } from "@/lib/AuthContext";
import { GraduationCap, BookOpen, Mail, Lock, User, AlertCircle, Loader2 } from "lucide-react";

export default function AuthPage() {
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [role, setRole] = useState<"teacher" | "student">("teacher");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [signupSuccess, setSignupSuccess] = useState(false);
  const { signIn, signUp } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (mode === "login") {
      const { error } = await signIn(email, password);
      if (error) {
        setError(error);
        setLoading(false);
      } else {
        router.push("/");
        router.refresh();
      }
    } else {
      if (!fullName.trim()) {
        setError("Please enter your name");
        setLoading(false);
        return;
      }
      const { error } = await signUp(email, password, fullName.trim(), role);
      if (error) {
        setError(error);
        setLoading(false);
      } else {
        setSignupSuccess(true);
        setLoading(false);
      }
    }
  };

  if (signupSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-indigo-50 via-white to-white flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl border border-border shadow-xl p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4">
            <Mail size={28} className="text-emerald-600" />
          </div>
          <h2 className="text-xl font-bold mb-2">Check Your Email</h2>
          <p className="text-muted text-sm mb-6">
            We sent a confirmation link to <strong>{email}</strong>. Click the
            link in the email to activate your account, then come back and sign in.
          </p>
          <button
            onClick={() => {
              setSignupSuccess(false);
              setMode("login");
            }}
            className="px-6 py-2.5 bg-primary text-white rounded-lg text-sm font-semibold"
          >
            Go to Sign In
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 via-white to-white flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl border border-border shadow-xl p-8 max-w-md w-full">
        <div className="text-center mb-6">
          <div className="flex justify-center mb-4">
            <Logo size="lg" />
          </div>
          <p className="text-muted text-sm">
            {mode === "login"
              ? "Sign in to your account"
              : "Create your account to get started"}
          </p>
        </div>

        {/* Mode Toggle */}
        <div className="flex gap-1 bg-gray-100 rounded-lg p-1 mb-6">
          <button
            onClick={() => { setMode("login"); setError(""); }}
            className={`flex-1 py-2 rounded-md text-sm font-medium transition-all ${
              mode === "login" ? "bg-white shadow-sm text-foreground" : "text-muted"
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => { setMode("signup"); setError(""); }}
            className={`flex-1 py-2 rounded-md text-sm font-medium transition-all ${
              mode === "signup" ? "bg-white shadow-sm text-foreground" : "text-muted"
            }`}
          >
            Sign Up
          </button>
        </div>

        {/* Role Selection (signup only) */}
        {mode === "signup" && (
          <div className="grid grid-cols-2 gap-3 mb-5">
            <button
              onClick={() => setRole("teacher")}
              className={`p-4 rounded-xl border-2 transition-all text-center ${
                role === "teacher"
                  ? "border-primary bg-indigo-50"
                  : "border-border hover:border-gray-300"
              }`}
            >
              <BookOpen
                size={24}
                className={`mx-auto mb-2 ${
                  role === "teacher" ? "text-primary" : "text-muted"
                }`}
              />
              <p className="text-sm font-semibold">Teacher</p>
              <p className="text-xs text-muted mt-0.5">Create & configure courses</p>
            </button>
            <button
              onClick={() => setRole("student")}
              className={`p-4 rounded-xl border-2 transition-all text-center ${
                role === "student"
                  ? "border-primary bg-indigo-50"
                  : "border-border hover:border-gray-300"
              }`}
            >
              <GraduationCap
                size={24}
                className={`mx-auto mb-2 ${
                  role === "student" ? "text-primary" : "text-muted"
                }`}
              />
              <p className="text-sm font-semibold">Student</p>
              <p className="text-xs text-muted mt-0.5">Join classes & learn</p>
            </button>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === "signup" && (
            <div>
              <label className="text-sm font-medium block mb-1.5">Full Name</label>
              <div className="relative">
                <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Your full name"
                  className="w-full border border-border rounded-lg pl-10 pr-4 py-2.5 text-sm outline-none focus:border-primary/40"
                  required
                />
              </div>
            </div>
          )}

          <div>
            <label className="text-sm font-medium block mb-1.5">Email</label>
            <div className="relative">
              <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@school.edu"
                className="w-full border border-border rounded-lg pl-10 pr-4 py-2.5 text-sm outline-none focus:border-primary/40"
                required
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium block mb-1.5">Password</label>
            <div className="relative">
              <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={mode === "signup" ? "At least 6 characters" : "Your password"}
                className="w-full border border-border rounded-lg pl-10 pr-4 py-2.5 text-sm outline-none focus:border-primary/40"
                required
                minLength={6}
              />
            </div>
          </div>

          {error && (
            <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">
              <AlertCircle size={14} />
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 bg-primary text-white rounded-lg text-sm font-semibold hover:bg-primary-dark transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading && <Loader2 size={16} className="animate-spin" />}
            {mode === "login" ? "Sign In" : `Sign Up as ${role === "teacher" ? "Teacher" : "Student"}`}
          </button>
        </form>

        <p className="text-center text-xs text-muted mt-4">
          {mode === "login" ? (
            <>Don&apos;t have an account?{" "}
              <button onClick={() => { setMode("signup"); setError(""); }} className="text-primary font-medium">
                Sign up
              </button>
            </>
          ) : (
            <>Already have an account?{" "}
              <button onClick={() => { setMode("login"); setError(""); }} className="text-primary font-medium">
                Sign in
              </button>
            </>
          )}
        </p>
      </div>
    </div>
  );
}
