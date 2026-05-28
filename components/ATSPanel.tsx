"use client";

import { useMemo } from "react";
import { useCVStore } from "@/lib/store";
import { analyzeCV } from "@/lib/atsAnalyzer";
import { Textarea } from "./ui";

function scoreColor(score: number) {
  if (score >= 80) return "#16a34a";
  if (score >= 55) return "#d97706";
  return "#dc2626";
}

function ScoreRing({ score }: { score: number }) {
  const color = scoreColor(score);
  const r = 42;
  const c = 2 * Math.PI * r;
  const offset = c - (score / 100) * c;
  return (
    <div className="relative h-28 w-28">
      <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90">
        <circle cx="50" cy="50" r={r} fill="none" stroke="#e5e7eb" strokeWidth="8" />
        <circle
          cx="50"
          cy="50"
          r={r}
          fill="none"
          stroke={color}
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset .5s ease" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl font-bold" style={{ color }}>
          {score}
        </span>
        <span className="text-[10px] text-gray-400">/ 100</span>
      </div>
    </div>
  );
}

export default function ATSPanel() {
  const { cv, jobDescription, setJobDescription } = useCVStore();
  const report = useMemo(() => analyzeCV(cv, jobDescription), [cv, jobDescription]);

  const verdict =
    report.score >= 80
      ? "Great! Your CV is strong for ATS."
      : report.score >= 55
      ? "Decent — there's still room to improve."
      : "Needs work to pass ATS screening.";

  return (
    <div className="space-y-5">
      <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
        <div className="flex items-center gap-4">
          <ScoreRing score={report.score} />
          <div>
            <h3 className="text-sm font-semibold text-gray-900">ATS Score</h3>
            <p className="mt-1 text-xs text-gray-600">{verdict}</p>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
        <h3 className="mb-3 text-sm font-semibold text-gray-900">Checklist</h3>
        <ul className="space-y-2">
          {report.checks.map((c) => (
            <li key={c.id} className="flex items-start gap-2">
              <span
                className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full text-[10px] font-bold text-white ${
                  c.passed ? "bg-green-500" : "bg-gray-300"
                }`}
              >
                {c.passed ? "✓" : "!"}
              </span>
              <div>
                <span
                  className={`text-xs font-medium ${
                    c.passed ? "text-gray-700" : "text-gray-900"
                  }`}
                >
                  {c.label}
                </span>
                {!c.passed && <p className="text-[11px] text-gray-500">{c.hint}</p>}
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
        <h3 className="text-sm font-semibold text-gray-900">Match Against a Job</h3>
        <p className="mt-0.5 mb-3 text-xs text-gray-500">
          Paste a job description and we'll check which keywords are already in your CV.
        </p>
        <Textarea
          rows={5}
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
          placeholder="Paste the job description here..."
        />

        {report.keywords && (
          <div className="mt-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-gray-700">Keyword match</span>
              <span
                className="text-sm font-bold"
                style={{ color: scoreColor(report.keywords.coverage) }}
              >
                {report.keywords.coverage}%
              </span>
            </div>
            {report.keywords.matched.length > 0 && (
              <div>
                <p className="mb-1 text-[11px] font-medium text-green-700">
                  Found ({report.keywords.matched.length})
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {report.keywords.matched.map((k) => (
                    <span
                      key={k}
                      className="rounded-full bg-green-50 px-2 py-0.5 text-[10px] text-green-700"
                    >
                      {k}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {report.keywords.missing.length > 0 && (
              <div>
                <p className="mb-1 text-[11px] font-medium text-red-700">
                  Missing — consider adding ({report.keywords.missing.length})
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {report.keywords.missing.map((k) => (
                    <span
                      key={k}
                      className="rounded-full bg-red-50 px-2 py-0.5 text-[10px] text-red-700"
                    >
                      {k}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
