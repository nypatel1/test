"use client";

import { useState } from "react";
import TeacherLayout from "../../components/TeacherLayout";
import {
  Shield,
  Brain,
  Save,
  MessageSquare,
  Eye,
  Sparkles,
} from "lucide-react";

export default function AISettingsPage() {
  const [globalApproach, setGlobalApproach] = useState("socratic");
  const [maxHintsBeforeGuide, setMaxHintsBeforeGuide] = useState(3);
  const [responseLength, setResponseLength] = useState("medium");
  const [tone, setTone] = useState("encouraging");

  const globalBoundaries = [
    {
      label: "Never provide direct answers to graded assessments",
      enabled: true,
      category: "Safety",
    },
    {
      label: "Block essay writing or assignment completion requests",
      enabled: true,
      category: "Safety",
    },
    {
      label: "Always require student reasoning before hints",
      enabled: true,
      category: "Mastery",
    },
    {
      label: "Detect and flag copy-paste attempts from external sources",
      enabled: true,
      category: "Safety",
    },
    {
      label: "Redirect off-topic questions back to unit material",
      enabled: true,
      category: "Alignment",
    },
    {
      label: "Log all interactions for teacher review",
      enabled: true,
      category: "Oversight",
    },
    {
      label: "Flag students asking for direct answers 3+ times",
      enabled: true,
      category: "Safety",
    },
    {
      label: "Allow AI to generate practice problems",
      enabled: true,
      category: "Mastery",
    },
    {
      label: "Enable multi-modal explanations (diagrams, analogies)",
      enabled: true,
      category: "Learning",
    },
    {
      label: "Allow students to rate AI explanations",
      enabled: false,
      category: "Feedback",
    },
  ];

  return (
    <TeacherLayout>
      <div className="max-w-5xl animate-fade-in">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              AI Configuration
            </h1>
            <p className="text-muted mt-1">
              Global settings that apply across all your courses. Unit-specific
              overrides can be set within each unit.
            </p>
          </div>
          <button className="px-5 py-2 bg-primary text-white rounded-lg text-sm font-semibold hover:bg-primary-dark transition-colors shadow-lg shadow-indigo-500/20 flex items-center gap-1.5">
            <Save size={15} />
            Save Settings
          </button>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Default Teaching Approach */}
          <div className="bg-white rounded-xl border border-border p-6">
            <div className="flex items-center gap-2 mb-4">
              <Brain size={18} className="text-primary" />
              <h2 className="font-semibold text-lg">
                Default Teaching Approach
              </h2>
            </div>
            <p className="text-sm text-muted mb-4">
              Applied to new units by default. Can be overridden per unit.
            </p>
            <div className="space-y-2">
              {[
                {
                  id: "socratic",
                  name: "Socratic Method",
                  desc: "Guide through questions",
                },
                {
                  id: "step-by-step",
                  name: "Step-by-Step",
                  desc: "Sequential small steps",
                },
                {
                  id: "conceptual",
                  name: "Conceptual-First",
                  desc: "Big picture then details",
                },
                {
                  id: "example-driven",
                  name: "Example-Driven",
                  desc: "Real-world analogies",
                },
              ].map((a) => (
                <label
                  key={a.id}
                  className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
                    globalApproach === a.id
                      ? "border-primary bg-indigo-50/50"
                      : "border-border hover:border-gray-300"
                  }`}
                >
                  <input
                    type="radio"
                    name="globalApproach"
                    value={a.id}
                    checked={globalApproach === a.id}
                    onChange={() => setGlobalApproach(a.id)}
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
                    {["concise", "medium", "detailed"].map((opt) => (
                      <button
                        key={opt}
                        onClick={() => setResponseLength(opt)}
                        className={`flex-1 py-2 rounded-lg text-sm font-medium border transition-all ${
                          responseLength === opt
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
                    {["encouraging", "neutral", "challenging"].map((opt) => (
                      <button
                        key={opt}
                        onClick={() => setTone(opt)}
                        className={`flex-1 py-2 rounded-lg text-sm font-medium border transition-all ${
                          tone === opt
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
                  <label className="text-sm font-medium mb-2 block">
                    Max Hints Before Guided Answer: {maxHintsBeforeGuide}
                  </label>
                  <input
                    type="range"
                    min={1}
                    max={5}
                    value={maxHintsBeforeGuide}
                    onChange={(e) =>
                      setMaxHintsBeforeGuide(Number(e.target.value))
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
                {[
                  { label: "Generate practice problems", enabled: true },
                  { label: "Create concept breakdowns", enabled: true },
                  { label: "Adaptive difficulty adjustment", enabled: true },
                  { label: "Multiple explanation styles", enabled: true },
                  {
                    label: "Visual diagram descriptions",
                    enabled: false,
                  },
                  { label: "Study plan recommendations", enabled: false },
                ].map((cap, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between p-2.5 rounded-lg hover:bg-surface-hover transition-colors"
                  >
                    <span className="text-sm">{cap.label}</span>
                    <div
                      className={`w-9 h-5 rounded-full relative transition-colors cursor-pointer ${
                        cap.enabled ? "bg-primary" : "bg-gray-200"
                      }`}
                    >
                      <div
                        className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${
                          cap.enabled ? "translate-x-4" : "translate-x-0.5"
                        }`}
                      />
                    </div>
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
                Global Safety & Boundaries
              </h2>
            </div>
            <p className="text-sm text-muted mb-4">
              These guardrails apply to every student interaction across all
              courses. They ensure the AI stays safe, aligned, and focused on
              learning.
            </p>
            <div className="grid md:grid-cols-2 gap-3">
              {globalBoundaries.map((b, i) => (
                <div
                  key={i}
                  className={`flex items-center gap-3 p-3 rounded-lg border transition-all ${
                    b.enabled
                      ? "border-emerald-200 bg-emerald-50/50"
                      : "border-border"
                  }`}
                >
                  <div
                    className={`w-9 h-5 rounded-full relative transition-colors cursor-pointer flex-shrink-0 ${
                      b.enabled ? "bg-emerald-500" : "bg-gray-200"
                    }`}
                  >
                    <div
                      className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${
                        b.enabled ? "translate-x-4" : "translate-x-0.5"
                      }`}
                    />
                  </div>
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

          {/* Preview of Configuration */}
          <div className="lg:col-span-2 bg-gradient-to-br from-indigo-600 to-indigo-800 rounded-xl p-6 text-white">
            <div className="flex items-center gap-2 mb-3">
              <Eye size={18} />
              <h2 className="font-semibold text-lg">
                Current Configuration Summary
              </h2>
            </div>
            <div className="grid md:grid-cols-4 gap-6 mt-4">
              <div>
                <p className="text-indigo-300 text-xs font-medium uppercase tracking-wider">
                  Teaching Approach
                </p>
                <p className="text-lg font-semibold mt-1">
                  {globalApproach === "socratic"
                    ? "Socratic Method"
                    : globalApproach === "step-by-step"
                    ? "Step-by-Step"
                    : globalApproach === "conceptual"
                    ? "Conceptual-First"
                    : "Example-Driven"}
                </p>
              </div>
              <div>
                <p className="text-indigo-300 text-xs font-medium uppercase tracking-wider">
                  Response Style
                </p>
                <p className="text-lg font-semibold mt-1 capitalize">
                  {responseLength}, {tone}
                </p>
              </div>
              <div>
                <p className="text-indigo-300 text-xs font-medium uppercase tracking-wider">
                  Hints Before Guide
                </p>
                <p className="text-lg font-semibold mt-1">
                  {maxHintsBeforeGuide} attempts
                </p>
              </div>
              <div>
                <p className="text-indigo-300 text-xs font-medium uppercase tracking-wider">
                  Active Guardrails
                </p>
                <p className="text-lg font-semibold mt-1">
                  {globalBoundaries.filter((b) => b.enabled).length} /{" "}
                  {globalBoundaries.length}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </TeacherLayout>
  );
}
