"use client";

import { useEffect, useRef, useState } from "react";
import { useCVStore } from "@/lib/store";
import { TemplateId } from "@/lib/types";
import { downloadProject, parseProject } from "@/lib/projectIO";
import CVForm from "@/components/CVForm";
import CVDocument from "@/components/CVDocument";
import ATSPanel from "@/components/ATSPanel";

const TEMPLATES: { id: TemplateId; name: string }[] = [
  { id: "classic", name: "Classic" },
  { id: "modern", name: "Modern" },
  { id: "minimal", name: "Minimal" },
];

const COLORS = ["#4f46e5", "#0f766e", "#b91c1c", "#1d4ed8", "#9333ea", "#111827"];

export default function Page() {
  const {
    cv,
    jobDescription,
    setTemplate,
    setAccent,
    loadSample,
    reset,
    setData,
    setJobDescription,
  } = useCVStore();
  const [tab, setTab] = useState<"editor" | "ats">("editor");
  const [mounted, setMounted] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Avoid hydration mismatch: persisted store hydrates on the client only.
  useEffect(() => setMounted(true), []);

  const handleImportFile = async (file: File | undefined) => {
    if (!file) return;
    try {
      const text = await file.text();
      const { cv: importedCv, jobDescription: jd } = parseProject(text);
      setData(importedCv);
      setJobDescription(jd);
    } catch (err) {
      alert(
        `Failed to import: ${
          err instanceof Error ? err.message : "unknown error"
        }`
      );
    } finally {
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  if (!mounted) {
    return (
      <div className="flex h-screen items-center justify-center text-sm text-gray-400">
        Loading editor…
      </div>
    );
  }

  return (
    <div className="flex h-screen flex-col">
      {/* Hidden file input for project import */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".json,application/json"
        className="hidden"
        onChange={(e) => handleImportFile(e.target.files?.[0])}
      />

      {/* Toolbar */}
      <header className="no-print z-10 flex flex-wrap items-center gap-3 border-b border-gray-200 bg-white px-4 py-2.5 shadow-sm">
        <div className="flex items-center gap-2">
          <span className="grid h-7 w-7 place-items-center rounded-md bg-brand-600 text-sm font-bold text-white">
            CV
          </span>
          <span className="text-sm font-semibold text-gray-900">ATS CV Builder</span>
        </div>

        <div className="ml-2 flex items-center gap-1 rounded-lg bg-gray-100 p-1">
          {TEMPLATES.map((t) => (
            <button
              key={t.id}
              onClick={() => setTemplate(t.id)}
              className={`rounded-md px-3 py-1 text-xs font-medium transition ${
                cv.template === t.id
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-500 hover:text-gray-800"
              }`}
            >
              {t.name}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-1.5">
          {COLORS.map((c) => (
            <button
              key={c}
              onClick={() => setAccent(c)}
              aria-label={`Color ${c}`}
              className={`h-5 w-5 rounded-full ring-offset-1 transition ${
                cv.accentColor === c ? "ring-2 ring-gray-400" : ""
              }`}
              style={{ background: c }}
            />
          ))}
        </div>

        <div className="ml-auto flex items-center gap-2">
          <button
            onClick={loadSample}
            className="rounded-md px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-100"
          >
            Sample
          </button>
          <button
            onClick={() => {
              if (confirm("Clear all CV data?")) reset();
            }}
            className="rounded-md px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-100"
          >
            Reset
          </button>

          <span className="mx-1 h-5 w-px bg-gray-200" />

          <button
            onClick={() => fileInputRef.current?.click()}
            className="rounded-md border border-gray-300 px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50"
          >
            Import
          </button>
          <button
            onClick={() => downloadProject(cv, jobDescription)}
            className="rounded-md border border-gray-300 px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50"
          >
            Save Project
          </button>
          <button
            onClick={() => window.print()}
            className="rounded-md bg-brand-600 px-4 py-1.5 text-xs font-semibold text-white shadow-sm transition hover:bg-brand-700"
          >
            ⬇ Download PDF
          </button>
        </div>
      </header>

      {/* Body */}
      <div className="flex min-h-0 flex-1">
        {/* Left: editor / ats */}
        <div className="no-print flex w-[46%] min-w-[420px] flex-col border-r border-gray-200 bg-gray-50">
          <div className="flex gap-1 border-b border-gray-200 bg-white px-4 pt-2">
            {(["editor", "ats"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`rounded-t-md px-4 py-2 text-xs font-semibold transition ${
                  tab === t
                    ? "border-b-2 border-brand-600 text-brand-700"
                    : "text-gray-500 hover:text-gray-800"
                }`}
              >
                {t === "editor" ? "Editor" : "ATS Analysis"}
              </button>
            ))}
          </div>
          <div className="scroll-slim flex-1 overflow-y-auto p-4">
            {tab === "editor" ? <CVForm /> : <ATSPanel />}
          </div>
        </div>

        {/* Right: live preview */}
        <div className="print-area flex-1 overflow-y-auto bg-slate-200 p-6">
          <div className="preview-scale origin-top scale-90 lg:scale-100">
            <CVDocument cv={cv} />
          </div>
        </div>
      </div>

      {/* Print hint */}
      <p className="no-print border-t border-gray-200 bg-white px-4 py-1.5 text-center text-[11px] text-gray-400">
        Tip: when the print dialog opens, choose <b>Save as PDF</b> and set margins to{" "}
        <b>None</b> for the best ATS result. Use <b>Save Project</b> to download an editable
        file you can re-import later.
      </p>
    </div>
  );
}
