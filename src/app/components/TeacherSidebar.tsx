"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Logo from "./Logo";
import { useAuth } from "@/lib/AuthContext";
import {
  LayoutDashboard,
  BookOpen,
  BarChart3,
  Settings,
  LogOut,
  GraduationCap,
} from "lucide-react";

const links = [
  { href: "/teacher/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/teacher/courses", label: "Courses & Units", icon: BookOpen },
  { href: "/teacher/insights", label: "Student Insights", icon: BarChart3 },
  { href: "/teacher/settings", label: "AI Settings", icon: Settings },
];

export default function TeacherSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { profile, signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
    router.push("/");
  };

  const initials = profile?.full_name
    ? profile.full_name
        .split(" ")
        .map((w) => w[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "T";

  return (
    <aside className="w-64 bg-sidebar-bg min-h-screen flex flex-col fixed left-0 top-0 bottom-0 z-30">
      <div className="px-6 py-5 border-b border-white/10">
        <Logo light size="md" />
        <p className="text-xs text-indigo-300 mt-1 tracking-wide">Teacher Portal</p>
      </div>

      <nav className="flex-1 py-4 px-3 space-y-1">
        {links.map((link) => {
          const active = pathname.startsWith(link.href);
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                active
                  ? "bg-sidebar-active text-white shadow-lg shadow-indigo-500/20"
                  : "text-sidebar-text hover:bg-white/8 hover:text-white"
              }`}
            >
              <link.icon size={18} />
              {link.label}
            </Link>
          );
        })}
      </nav>

      <div className="px-3 pb-3 space-y-1">
        <Link
          href="/student/learn"
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-sidebar-text hover:bg-white/8 hover:text-white transition-all"
        >
          <GraduationCap size={18} />
          Student View
        </Link>
        <button
          onClick={handleSignOut}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-sidebar-text hover:bg-white/8 hover:text-white transition-all w-full"
        >
          <LogOut size={18} />
          Sign Out
        </button>
      </div>

      <div className="px-4 py-4 border-t border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-indigo-500 flex items-center justify-center text-white font-semibold text-sm">
            {initials}
          </div>
          <div>
            <p className="text-sm font-medium text-white">
              {profile?.full_name || "Teacher"}
            </p>
            <p className="text-xs text-indigo-300 truncate max-w-[140px]">
              {profile?.email || ""}
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}
