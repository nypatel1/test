"use client";

import { useState } from "react";
import { useIsMounted } from "@/lib/useIsMounted";
import TeacherLayout from "../../components/TeacherLayout";
import {
  Shield,
  Brain,
  Save,
  MessageSquare,
  Eye,
  Sparkles,
  Check,
} from "lucide-react";
import { TeacherConfig, DEFAULT_TEACHER_CONFIG } from "@/lib/types";
import { getTeacherConfig, saveTeacherConfig } from "@/lib/storage";

export default function AISettingsPage() {
  const [config, setConfig] = useState<TeacherConfig>(() => {
    if (typeof window !== "undefined") return getTeacherConfig();
    return DEFAULT_TEACHER_CONFIG;
  });
  const [saved, setSaved] = useState(false);
  const mounted = useIsMounted();

  const handleSave = () => {
    saveTeacherConfig(config);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const updateConfig = (partial: Partial<TeacherConfig>) => {
    setConfig((prev) => ({ ...prev, ...partial }));
  };

  const toggleBoundary = (index: number) => {
    const updated = [...config.boundaries];
    updated[index] = { ...updated[index], enabled: !updated[index].enabled };
    updateConfig({ boundaries: updated });
  };

  const toggleCapability = (index: number) => {
    const updated = [...config.capabilities];
    updated[index] = { ...updated[index], enabled: !updated[index].enabled };
    updateConfig({ capabilities: updated });
  };

  if (!mounted) return null;

  return (
    <TeacherLayout>
      <div className="max-w-5xl animate-fade-in">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              AI Configuration
            </h1>
            <p className="text-muted mt-1">
              These settings control how the AI tutor interacts with students.
              Changes are applied in real-time to the student chat experience.
            </p>
          </div>
          <button
            onClick={handleSave}
            className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-1.5 ${
              saved
                ? "bg-emerald-500 text-white"
                : "bg-primary text-white hover:bg-primary-dark shadow-lg shadow-indigo-500/20"
            }`}
          >
            {saved ? <Check size={15} /> : <Save size={15} />}
            {saved ? "Saved!" : "Save Settings"}
          </button>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Teaching Approach */}
          <div className="bg-white rounded-xl border border-border p-6">
            <div className="flex items-center gap-2 mb-4">
              <Brain size={18} className="text-primary" />
              <h2 className="font-semibold text-lg">Teaching Approach</h2>
            </div>
            <p className="text-sm text-muted mb-4">
              This determines the core pedagogical method the AI uses.
            </p>
            <div className="space-y-2">
              {(
                [
                  { id: "socratic", name: "Socratic Method", desc: "Guide through questions" },
                  { id: "step-by-step", name: "Step-by-Step", desc: "Sequential small steps" },
                  { id: "conceptual", name: "Conceptual-First", desc: "Big picture then details" },
                  { id: "example-driven", name: "Example-Driven", desc: "Real-world analogies" },
                ] as const
              ).map((a) => (
                <label
                  key={a.id}
                  className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
                    config.approach === a.id
                      ? "border-primary bg-indigo-50/50"
                      : "border-border hover:border-gray-300"
                  }`}
                >
                  <input
                    type="radio"
                    name="globalApproach"
                    checked={config.approach === a.id}
                    onChange={() => updateConfig({ approach: a.id })}
                    className="accent-[#4f46e5]"
                  />
                  <div className="flex-1">
                    <span className="text-sm font-medium">{a.name}</span>
                    <span className="text-xs text-muted ml-2">{a.desc}</span>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Response Style */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl border border-border p-6">
              <div className="flex items-center gap-2 mb-4">
                <MessageSquare size={18} className="text-cyan-500" />
                <h2 className="font-semibold text-lg">Response Style</h2>
              </div>
              <div className="space-y-5">
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Response Length
                  </label>
                  <div className="flex gap-2">
                    {(["concise", "medium", "detailed"] as const).map((opt) => (
                      <button
                        key={opt}
                        onClick={() => updateConfig({ responseLength: opt })}
                        className={`flex-1 py-2 rounded-lg text-sm font-medium border transition-all ${
                          config.responseLength === opt
                            ? "border-primary bg-indigo-50 text-primary"
                            : "border-border hover:border-gray-300"
                        }`}
                      >
                        {opt.charAt(0).toUpperCase() + opt.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Tone</label>
                  <div className="flex gap-2">
                    {(["encouraging", "neutral", "challenging"] as const).map(
                      (opt) => (
                        <button
                          key={opt}
                          onClick={() => updateConfig({ tone: opt })}
                          className={`flex-1 py-2 rounded-lg text-sm font-medium border transition-all ${
                            config.tone === opt
                              ? "border-primary bg-indigo-50 text-primary"
                              : "border-border hover:border-gray-300"
                          }`}
                        >
                          {opt.charAt(0).toUpperCase() + opt.slice(1)}
                        </button>
                      )
                    )}
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Hints Before Guided Answer: {config.maxHints}
                  </label>
                  <input
                    type="range"
                    min={1}
                    max={5}
                    value={config.maxHints}
                    onChange={(e) =>
                      updateConfig({ maxHints: Number(e.target.value) })
                    }
                    className="w-full accent-[#4f46e5]"
                  />
                  <div className="flex justify-between text-xs text-muted mt-1">
                    <span>Quick guidance</span>
                    <span>Extended discovery</span>
                  </div>
                </div>
              </div>
            </div>

            {/* AI Capabilities */}
            <div className="bg-white rounded-xl border border-border p-6">
              <div className="flex items-center gap-2 mb-4">
                <Sparkles size={18} className="text-amber-500" />
                <h2 className="font-semibold text-lg">AI Capabilities</h2>
              </div>
              <div className="space-y-2">
                {config.capabilities.map((cap, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between p-2.5 rounded-lg hover:bg-surface-hover transition-colors"
                  >
                    <span className="text-sm">{cap.label}</span>
                    <button
                      onClick={() => toggleCapability(i)}
                      className={`w-9 h-5 rounded-full relative transition-colors ${
                        cap.enabled ? "bg-primary" : "bg-gray-200"
                      }`}
                    >
                      <div
                        className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${
                          cap.enabled ? "translate-x-4" : "translate-x-0.5"
                        }`}
                      />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Global Boundaries */}
          <div className="lg:col-span-2 bg-white rounded-xl border border-border p-6">
            <div className="flex items-center gap-2 mb-4">
              <Shield size={18} className="text-red-500" />
              <h2 className="font-semibold text-lg">
                Safety & Boundaries
              </h2>
            </div>
            <p className="text-sm text-muted mb-4">
              These guardrails are injected into the AI&apos;s system prompt and
              control what it can and cannot do during student interactions.
            </p>
            <div className="grid md:grid-cols-2 gap-3">
              {config.boundaries.map((b, i) => (
                <div
                  key={i}
                  className={`flex items-center gap-3 p-3 rounded-lg border transition-all ${
                    b.enabled
                      ? "border-emerald-200 bg-emerald-50/50"
                      : "border-border"
                  }`}
                >
                  <button
                    onClick={() => toggleBoundary(i)}
                    className={`w-9 h-5 rounded-full relative transition-colors flex-shrink-0 ${
                      b.enabled ? "bg-emerald-500" : "bg-gray-200"
                    }`}
                  >
                    <div
                      className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${
                        b.enabled ? "translate-x-4" : "translate-x-0.5"
                      }`}
                    />
                  </button>
                  <div className="flex-1">
                    <span className="text-sm">{b.label}</span>
                    <span className="ml-2 px-1.5 py-0.5 rounded bg-gray-100 text-[10px] text-muted font-medium">
                      {b.category}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Live Config Summary */}
          <div className="lg:col-span-2 bg-gradient-to-br from-indigo-600 to-indigo-800 rounded-xl p-6 text-white">
            <div className="flex items-center gap-2 mb-3">
              <Eye size={18} />
              <h2 className="font-semibold text-lg">
                Current Configuration Summary
              </h2>
            </div>
            <p className="text-indigo-200 text-sm mb-4">
              This is what gets sent to the AI as its system prompt when students
              start a learning session.
            </p>
            <div className="grid md:grid-cols-4 gap-6">
              <div>
                <p className="text-indigo-300 text-xs font-medium uppercase tracking-wider">
                  Teaching Approach
                </p>
                <p className="text-lg font-semibold mt-1 capitalize">
                  {config.approach.replace("-", " ")}
                </p>
              </div>
              <div>
                <p className="text-indigo-300 text-xs font-medium uppercase tracking-wider">
                  Response Style
                </p>
                <p className="text-lg font-semibold mt-1 capitalize">
                  {config.responseLength}, {config.tone}
                </p>
              </div>
              <div>
                <p className="text-indigo-300 text-xs font-medium uppercase tracking-wider">
                  Hints Before Guide
                </p>
                <p className="text-lg font-semibold mt-1">
                  {config.maxHints} attempts
                </p>
              </div>
              <div>
                <p className="text-indigo-300 text-xs font-medium uppercase tracking-wider">
                  Active Guardrails
                </p>
                <p className="text-lg font-semibold mt-1">
                  {config.boundaries.filter((b) => b.enabled).length} /{" "}
                  {config.boundaries.length}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </TeacherLayout>
  );
}
