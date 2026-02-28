"use client";

import { useState, useRef } from "react";
import {
  Upload,
  FileText,
  Trash2,
  X,
  FileUp,
  ClipboardPaste,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { CourseMaterial } from "@/lib/types";

interface Props {
  materials: CourseMaterial[];
  onChange: (materials: CourseMaterial[]) => void;
}

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2);
}

async function extractTextFromPDF(file: File): Promise<string> {
  const pdfjsLib = await import("pdfjs-dist");
  pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;

  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  const pages: string[] = [];

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const textContent = await page.getTextContent();
    const pageText = textContent.items
      .map((item: unknown) => {
        const textItem = item as { str?: string };
        return textItem.str || "";
      })
      .join(" ");
    pages.push(pageText);
  }

  return pages.join("\n\n");
}

async function readTextFile(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsText(file);
  });
}

export default function MaterialUpload({ materials, onChange }: Props) {
  const [showPaste, setShowPaste] = useState(false);
  const [pasteTitle, setPasteTitle] = useState("");
  const [pasteContent, setPasteContent] = useState("");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [expanded, setExpanded] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError("");
    setUploading(true);

    try {
      let content: string;
      let type: "pdf" | "txt";

      if (file.type === "application/pdf" || file.name.endsWith(".pdf")) {
        content = await extractTextFromPDF(file);
        type = "pdf";
      } else if (
        file.type === "text/plain" ||
        file.name.endsWith(".txt") ||
        file.name.endsWith(".md")
      ) {
        content = await readTextFile(file);
        type = "txt";
      } else {
        setError("Unsupported file type. Please upload a PDF or TXT file.");
        setUploading(false);
        return;
      }

      if (!content.trim()) {
        setError("The file appears to be empty or couldn't be read.");
        setUploading(false);
        return;
      }

      const material: CourseMaterial = {
        id: generateId(),
        name: file.name,
        type,
        content: content.trim(),
        addedAt: new Date().toISOString(),
        charCount: content.trim().length,
      };

      onChange([...materials, material]);
    } catch (err) {
      setError("Failed to read file. Please try a different file.");
      console.error("File upload error:", err);
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handlePaste = () => {
    if (!pasteTitle.trim() || !pasteContent.trim()) return;

    const material: CourseMaterial = {
      id: generateId(),
      name: pasteTitle.trim(),
      type: "paste",
      content: pasteContent.trim(),
      addedAt: new Date().toISOString(),
      charCount: pasteContent.trim().length,
    };

    onChange([...materials, material]);
    setPasteTitle("");
    setPasteContent("");
    setShowPaste(false);
  };

  const removeMaterial = (id: string) => {
    onChange(materials.filter((m) => m.id !== id));
  };

  const totalChars = materials.reduce((sum, m) => sum + m.charCount, 0);

  return (
    <div className="bg-white rounded-xl border border-border p-6">
      <div className="flex items-center gap-2 mb-2">
        <Upload size={18} className="text-primary" />
        <h2 className="font-semibold text-lg">Course Materials</h2>
      </div>
      <p className="text-sm text-muted mb-4">
        Upload lecture notes, textbook excerpts, or study guides. The AI will use
        these as its primary reference when teaching students.
      </p>

      {/* Uploaded Materials List */}
      {materials.length > 0 && (
        <div className="space-y-2 mb-4">
          {materials.map((m) => (
            <div
              key={m.id}
              className="border border-border rounded-lg overflow-hidden"
            >
              <div className="flex items-center gap-3 px-3 py-2.5 bg-gray-50">
                <FileText
                  size={16}
                  className={
                    m.type === "pdf"
                      ? "text-red-500"
                      : m.type === "txt"
                      ? "text-blue-500"
                      : "text-emerald-500"
                  }
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{m.name}</p>
                  <p className="text-xs text-muted">
                    {m.type.toUpperCase()} &middot;{" "}
                    {m.charCount.toLocaleString()} characters
                  </p>
                </div>
                <button
                  onClick={() =>
                    setExpanded(expanded === m.id ? null : m.id)
                  }
                  className="text-muted hover:text-foreground transition-colors p-1"
                >
                  {expanded === m.id ? (
                    <ChevronUp size={14} />
                  ) : (
                    <ChevronDown size={14} />
                  )}
                </button>
                <button
                  onClick={() => removeMaterial(m.id)}
                  className="text-gray-300 hover:text-red-500 transition-colors p-1"
                >
                  <Trash2 size={14} />
                </button>
              </div>
              {expanded === m.id && (
                <div className="px-3 py-2 border-t border-border bg-white max-h-48 overflow-y-auto">
                  <pre className="text-xs text-muted whitespace-pre-wrap font-sans">
                    {m.content.slice(0, 2000)}
                    {m.content.length > 2000 && "\n\n[... content continues ...]"}
                  </pre>
                </div>
              )}
            </div>
          ))}
          <p className="text-xs text-muted">
            {materials.length} material{materials.length !== 1 ? "s" : ""} &middot;{" "}
            {totalChars.toLocaleString()} total characters
            {totalChars > 15000 && (
              <span className="text-amber-600 ml-1">
                (large — content will be truncated in AI context)
              </span>
            )}
          </p>
        </div>
      )}

      {/* Upload Actions */}
      <div className="flex gap-2 flex-wrap">
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.txt,.md"
          onChange={handleFileUpload}
          className="hidden"
        />
        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="flex items-center gap-1.5 px-4 py-2 border border-border rounded-lg text-sm font-medium hover:bg-surface-hover transition-colors disabled:opacity-50"
        >
          <FileUp size={14} />
          {uploading ? "Reading file..." : "Upload PDF or TXT"}
        </button>
        <button
          onClick={() => setShowPaste(!showPaste)}
          className="flex items-center gap-1.5 px-4 py-2 border border-border rounded-lg text-sm font-medium hover:bg-surface-hover transition-colors"
        >
          <ClipboardPaste size={14} />
          Paste Text
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="mt-3 flex items-center gap-2 text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">
          <X size={14} />
          {error}
          <button onClick={() => setError("")} className="ml-auto">
            <X size={12} />
          </button>
        </div>
      )}

      {/* Paste Form */}
      {showPaste && (
        <div className="mt-4 border border-border rounded-lg p-4 animate-fade-in">
          <h3 className="text-sm font-medium mb-3">Paste Course Content</h3>
          <input
            type="text"
            value={pasteTitle}
            onChange={(e) => setPasteTitle(e.target.value)}
            placeholder="Title (e.g., Lecture Notes Week 3)"
            className="w-full border border-border rounded-lg px-3 py-2 text-sm outline-none focus:border-primary/40 mb-2"
          />
          <textarea
            value={pasteContent}
            onChange={(e) => setPasteContent(e.target.value)}
            placeholder="Paste your course content here — lecture notes, textbook excerpts, study guides..."
            className="w-full border border-border rounded-lg px-3 py-2 text-sm outline-none focus:border-primary/40 h-32 resize-y"
          />
          <div className="flex justify-between items-center mt-2">
            <span className="text-xs text-muted">
              {pasteContent.length.toLocaleString()} characters
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => setShowPaste(false)}
                className="px-3 py-1.5 border border-border rounded-lg text-sm hover:bg-surface-hover"
              >
                Cancel
              </button>
              <button
                onClick={handlePaste}
                disabled={!pasteTitle.trim() || !pasteContent.trim()}
                className="px-4 py-1.5 bg-primary text-white rounded-lg text-sm font-medium disabled:opacity-50"
              >
                Add Material
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
