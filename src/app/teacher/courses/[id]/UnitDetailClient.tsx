"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import TeacherLayout from "../../../components/TeacherLayout";
import Link from "next/link";
import {
  ArrowLeft, Target, BookOpen, Shield, Brain, Sliders,
  CheckCircle2, XCircle, Save, Eye, MessageSquare, Check, Plus, Loader2,
} from "lucide-react";
import { UnitConfig, CourseMaterial } from "@/lib/types";
import MaterialUpload from "../../../components/MaterialUpload";
import * as db from "@/lib/db";

export default function UnitDetailClient() {
  const params = useParams();
  const [unit, setUnit] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);
  const [newObjective, setNewObjective] = useState("");
  const [newSource, setNewSource] = useState("");
  const [tab, setTab] = useState<"config" | "preview">("config");

  useEffect(() => {
    (async () => {
      const u = await db.getUnit(params.id as string);
      setUnit(u);
      setLoading(false);
    })();
  }, [params.id]);

  if (loading) {
    return <TeacherLayout><div className="flex items-center justify-center h-64"><Loader2 size={24} className="animate-spin text-primary" /></div></TeacherLayout>;
  }

  if (!unit) {
    return (
      <TeacherLayout>
        <div className="max-w-4xl text-center py-20">
          <h2 className="text-xl font-semibold mb-2">Unit not found</h2>
          <Link href="/teacher/courses" className="text-primary font-medium hover:underline">Go to Courses</Link>
        </div>
      </TeacherLayout>
    );
  }

  const config: UnitConfig = unit.config;
  const courseName = unit.courses?.name || "";

  const updateConfig = (partial: Partial<UnitConfig>) => {
    setUnit((prev: any) => ({ ...prev, config: { ...prev.config, ...partial } }));
  };

  const handleSave = async () => {
    await db.updateUnitConfig(unit.id, unit.config);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const toggleBoundary = (index: number) => {
    const updated = [...config.boundaries];
    updated[index] = { ...updated[index], enabled: !updated[index].enabled };
    updateConfig({ boundaries: updated });
  };

  const addObjective = () => {
    if (!newObjective.trim()) return;
    updateConfig({ objectives: [...config.objectives, { id: Date.now(), text: newObjective.trim(), depth: "Explain" }] });
    setNewObjective("");
  };

  const removeObjective = (id: number) => {
    updateConfig({ objectives: config.objectives.filter((o) => o.id !== id) });
  };

  const addSource = () => {
    if (!newSource.trim()) return;
    updateConfig({ allowedSources: [...config.allowedSources, newSource.trim()] });
    setNewSource("");
  };

  const removeSource = (source: string) => {
    updateConfig({ allowedSources: config.allowedSources.filter((s) => s !== source) });
  };

  const approaches = [
    { id: "socratic" as const, name: "Socratic Method", desc: "Guide through questions" },
    { id: "step-by-step" as const, name: "Step-by-Step", desc: "Sequential small steps" },
    { id: "conceptual" as const, name: "Conceptual-First", desc: "Big picture then details" },
    { id: "example-driven" as const, name: "Example-Driven", desc: "Real-world analogies" },
  ];

  return (
    <TeacherLayout>
      <div className="max-w-6xl animate-fade-in">
        <Link href="/teacher/courses" className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-primary transition-colors mb-4">
          <ArrowLeft size={14} /> Back to Courses
        </Link>

        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">{unit.name}</h1>
            <p className="text-muted mt-1">{courseName}</p>
          </div>
          <div className="flex items-center gap-2">
            <Link href={`/student/chat?unit=${unit.id}`} className="px-4 py-2 border border-border rounded-lg text-sm font-medium hover:bg-surface-hover transition-colors flex items-center gap-1.5">
              <Eye size={15} /> Open as Student
            </Link>
            <button onClick={handleSave} className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-1.5 ${saved ? "bg-emerald-500 text-white" : "bg-primary text-white hover:bg-primary-dark shadow-lg shadow-indigo-500/20"}`}>
              {saved ? <Check size={15} /> : <Save size={15} />}
              {saved ? "Saved!" : "Save Changes"}
            </button>
          </div>
        </div>

        <div className="flex gap-1 mb-6 bg-gray-100 rounded-lg p-1 w-fit">
          {[
            { id: "config" as const, label: "AI Configuration", icon: Sliders },
            { id: "preview" as const, label: "Chat Preview", icon: MessageSquare },
          ].map((t) => (
            <button key={t.id} onClick={() => setTab(t.id)} className={`flex items-center gap-1.5 px-4 py-2 rounded-md text-sm font-medium transition-all ${tab === t.id ? "bg-white shadow-sm text-foreground" : "text-muted hover:text-foreground"}`}>
              <t.icon size={15} /> {t.label}
            </button>
          ))}
        </div>

        {tab === "config" && (
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Objectives */}
            <div className="bg-white rounded-xl border border-border p-6">
              <div className="flex items-center gap-2 mb-4"><Target size={18} className="text-primary" /><h2 className="font-semibold text-lg">Learning Objectives</h2></div>
              <p className="text-sm text-muted mb-4">What should students understand? These are sent to the AI.</p>
              {config.objectives.length === 0 && <p className="text-sm text-muted italic mb-3">No objectives yet.</p>}
              <div className="space-y-3">
                {config.objectives.map((obj) => (
                  <div key={obj.id} className="flex items-start gap-3 p-3 rounded-lg border border-border hover:border-primary/20 transition-colors group">
                    <CheckCircle2 size={16} className="text-primary mt-0.5 flex-shrink-0" />
                    <div className="flex-1">
                      <p className="text-sm">{obj.text}</p>
                      <span className="px-2 py-0.5 rounded bg-indigo-100 text-indigo-700 text-xs font-medium mt-1 inline-block">{obj.depth}</span>
                    </div>
                    <button onClick={() => removeObjective(obj.id)} className="text-gray-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"><XCircle size={14} /></button>
                  </div>
                ))}
              </div>
              <div className="mt-4 flex gap-2">
                <input type="text" value={newObjective} onChange={(e) => setNewObjective(e.target.value)} onKeyDown={(e) => e.key === "Enter" && addObjective()} placeholder="e.g., Explain the stages of mitosis" className="flex-1 text-sm border border-border rounded-lg px-3 py-2 outline-none focus:border-primary/40" />
                <button onClick={addObjective} disabled={!newObjective.trim()} className="px-3 py-2 bg-primary text-white rounded-lg text-sm disabled:opacity-50 flex items-center gap-1"><Plus size={14} /> Add</button>
              </div>
            </div>

            {/* Approach & Scaffolding */}
            <div className="space-y-6">
              <div className="bg-white rounded-xl border border-border p-6">
                <div className="flex items-center gap-2 mb-4"><Brain size={18} className="text-accent" /><h2 className="font-semibold text-lg">Teaching Approach</h2></div>
                <div className="space-y-2">
                  {approaches.map((a) => (
                    <label key={a.id} className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-all ${config.approach === a.id ? "border-primary bg-indigo-50/50" : "border-border hover:border-gray-300"}`}>
                      <input type="radio" name="approach" checked={config.approach === a.id} onChange={() => updateConfig({ approach: a.id })} className="mt-1 accent-[#4f46e5]" />
                      <div><p className="text-sm font-medium">{a.name}</p><p className="text-xs text-muted mt-0.5">{a.desc}</p></div>
                    </label>
                  ))}
                </div>
              </div>
              <div className="bg-white rounded-xl border border-border p-6">
                <div className="flex items-center gap-2 mb-2"><Sliders size={18} className="text-emerald-500" /><h2 className="font-semibold text-lg">Scaffolding: {config.scaffolding}/5</h2></div>
                <input type="range" min={1} max={5} value={config.scaffolding} onChange={(e) => updateConfig({ scaffolding: Number(e.target.value) })} className="w-full accent-[#4f46e5]" />
                <div className="flex justify-between text-xs text-muted mt-1"><span>Minimal</span><span>Heavy support</span></div>
              </div>
              <div className="bg-white rounded-xl border border-border p-6">
                <h2 className="font-semibold mb-3">Response Style</h2>
                <div className="space-y-3">
                  <div>
                    <label className="text-xs font-medium text-muted mb-1.5 block">Length</label>
                    <div className="flex gap-2">{(["concise", "medium", "detailed"] as const).map((opt) => (<button key={opt} onClick={() => updateConfig({ responseLength: opt })} className={`flex-1 py-1.5 rounded-lg text-xs font-medium border transition-all ${config.responseLength === opt ? "border-primary bg-indigo-50 text-primary" : "border-border"}`}>{opt.charAt(0).toUpperCase() + opt.slice(1)}</button>))}</div>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-muted mb-1.5 block">Tone</label>
                    <div className="flex gap-2">{(["encouraging", "neutral", "challenging"] as const).map((opt) => (<button key={opt} onClick={() => updateConfig({ tone: opt })} className={`flex-1 py-1.5 rounded-lg text-xs font-medium border transition-all ${config.tone === opt ? "border-primary bg-indigo-50 text-primary" : "border-border"}`}>{opt.charAt(0).toUpperCase() + opt.slice(1)}</button>))}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Boundaries */}
            <div className="lg:col-span-2 bg-white rounded-xl border border-border p-6">
              <div className="flex items-center gap-2 mb-4"><Shield size={18} className="text-red-500" /><h2 className="font-semibold text-lg">Boundaries & Restrictions</h2></div>
              <div className="grid md:grid-cols-2 gap-3">
                {config.boundaries.map((b, i) => (
                  <div key={i} className={`flex items-center gap-3 p-3 rounded-lg border transition-all ${b.enabled ? "border-emerald-200 bg-emerald-50/50" : "border-border"}`}>
                    <button onClick={() => toggleBoundary(i)} className={`w-9 h-5 rounded-full relative transition-colors flex-shrink-0 ${b.enabled ? "bg-emerald-500" : "bg-gray-200"}`}>
                      <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${b.enabled ? "translate-x-4" : "translate-x-0.5"}`} />
                    </button>
                    <span className="text-sm">{b.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Sources */}
            <div className="lg:col-span-2 bg-white rounded-xl border border-border p-6">
              <div className="flex items-center gap-2 mb-4"><BookOpen size={18} className="text-primary" /><h2 className="font-semibold text-lg">Allowed Sources</h2></div>
              <div className="flex flex-wrap gap-2 mb-3">
                {config.allowedSources.map((src) => (
                  <div key={src} className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 rounded-lg text-sm">
                    <BookOpen size={13} className="text-muted" />{src}
                    <button onClick={() => removeSource(src)} className="text-gray-400 hover:text-red-500"><XCircle size={13} /></button>
                  </div>
                ))}
                {config.allowedSources.length === 0 && <p className="text-sm text-muted italic">No sources added.</p>}
              </div>
              <div className="flex gap-2">
                <input type="text" value={newSource} onChange={(e) => setNewSource(e.target.value)} onKeyDown={(e) => e.key === "Enter" && addSource()} placeholder="e.g., Textbook Ch. 5" className="flex-1 text-sm border border-border rounded-lg px-3 py-2 outline-none focus:border-primary/40" />
                <button onClick={addSource} disabled={!newSource.trim()} className="px-3 py-2 bg-primary text-white rounded-lg text-sm disabled:opacity-50">Add</button>
              </div>
            </div>

            {/* Materials */}
            <div className="lg:col-span-2">
              <MaterialUpload materials={config.materials || []} onChange={(mats: CourseMaterial[]) => updateConfig({ materials: mats })} />
            </div>
          </div>
        )}

        {tab === "preview" && (
          <div className="bg-white rounded-xl border border-border overflow-hidden p-8 text-center">
            <Brain size={48} className="text-primary mx-auto mb-4" />
            <h3 className="font-semibold text-lg mb-2">Ready to Test</h3>
            <p className="text-muted text-sm mb-6 max-w-md mx-auto">
              Open the student chat to see how the AI interacts based on your configuration.
            </p>
            <Link href={`/student/chat?unit=${unit.id}`} className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg text-sm font-semibold hover:bg-primary-dark transition-colors">
              <Brain size={16} /> Open Student Chat
            </Link>
          </div>
        )}
      </div>
    </TeacherLayout>
  );
}
