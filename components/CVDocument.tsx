"use client";

import { useLayoutEffect, useMemo, useRef, useState, ReactNode } from "react";
import { CVData } from "@/lib/types";

// A4 geometry in CSS pixels (1mm = 96/25.4 px).
const MM = 96 / 25.4;
const PAGE_H = 297 * MM; // ~1122.5px
const PAD_Y = 40; // py-10 top + bottom is applied per page; one side = 40px
const CONTENT_H = PAGE_H - PAD_Y * 2; // usable height inside one page
const SAFETY = 18; // buffer so estimate stays safely under the physical page
const LIMIT = CONTENT_H - SAFETY;

function dateRange(start: string, end: string, current: boolean) {
  const right = current ? "Present" : end;
  if (start && right) return `${start} – ${right}`;
  return start || right || "";
}

interface Block {
  key: string;
  /** Section titles must not be left alone at the bottom of a page. */
  keepWithNext: boolean;
  node: ReactNode;
}

/** Single-column, ATS-safe document, auto-paginated into A4 pages. */
export default function CVDocument({ cv }: { cv: CVData }) {
  const { template, accentColor: accent } = cv;
  const isMinimal = template === "minimal";
  const isModern = template === "modern";
  const isClassic = template === "classic";
  const fontClass = isClassic ? "font-cv" : "font-cvsans";

  const headingStyle: React.CSSProperties = isModern
    ? { color: accent, borderColor: accent }
    : { color: "#111827", borderColor: "#111827" };

  // Each block carries its own spacing via padding so heights are exact.
  const SectionTitle = ({ children }: { children: string }) => (
    <h2
      className={`pt-3 pb-1 text-[12px] font-bold uppercase tracking-wide ${
        isMinimal ? "border-0" : "border-b"
      }`}
      style={headingStyle}
    >
      {children}
    </h2>
  );

  const p = cv.personal;
  const skills = cv.skills.filter((s) => s.trim());

  // ---- Build the ordered list of blocks ----
  const blocks = useMemo<Block[]>(() => {
    const list: Block[] = [];

    list.push({
      key: "header",
      keepWithNext: false,
      node: (
        <header className={isModern ? "pb-2" : "pb-2 text-center"}>
          <h1
            className="text-[26px] font-bold leading-tight"
            style={{ color: isModern ? accent : "#111827" }}
          >
            {p.fullName || "Your Name"}
          </h1>
          {p.title && (
            <div className="text-[13px] font-medium text-gray-600">{p.title}</div>
          )}
          <div className={isModern ? "mt-1" : "mt-1 flex justify-center"}>
            <div className="text-[11px] leading-snug">
              {[p.email, p.phone, p.location, p.website, p.linkedin]
                .filter(Boolean)
                .map((it, i, arr) => (
                  <span key={i}>
                    {it}
                    {i < arr.length - 1 && <span className="mx-1.5 opacity-50">•</span>}
                  </span>
                ))}
            </div>
          </div>
          {isModern && (
            <div className="mt-2 h-[3px] w-full" style={{ background: accent }} />
          )}
        </header>
      ),
    });

    const addSection = (key: string, title: string) =>
      list.push({ key: `t_${key}`, keepWithNext: true, node: <SectionTitle>{title}</SectionTitle> });

    if (cv.summary.trim()) {
      addSection("summary", "Summary");
      list.push({
        key: "summary",
        keepWithNext: false,
        node: (
          <p className="pb-2 text-[11.5px] leading-relaxed text-gray-700">{cv.summary}</p>
        ),
      });
    }

    if (cv.experience.length > 0) {
      addSection("exp", "Work Experience");
      cv.experience.forEach((e) =>
        list.push({
          key: `exp_${e.id}`,
          keepWithNext: false,
          node: (
            <div className="pb-2.5">
              <div className="flex items-baseline justify-between gap-2">
                <span className="text-[12px] font-semibold text-gray-900">
                  {e.position || "Position"}
                  {e.company && <span className="font-normal">, {e.company}</span>}
                </span>
                <span className="whitespace-nowrap text-[10.5px] text-gray-500">
                  {dateRange(e.startDate, e.endDate, e.current)}
                </span>
              </div>
              {e.location && (
                <div className="text-[10.5px] italic text-gray-500">{e.location}</div>
              )}
              <ul className="mt-1 list-disc space-y-0.5 pl-4 text-[11.5px] leading-relaxed text-gray-700">
                {e.bullets.filter((b) => b.trim()).map((b, i) => <li key={i}>{b}</li>)}
              </ul>
            </div>
          ),
        })
      );
    }

    if (cv.projects.length > 0) {
      addSection("prj", "Projects");
      cv.projects.forEach((pr) =>
        list.push({
          key: `prj_${pr.id}`,
          keepWithNext: false,
          node: (
            <div className="pb-2">
              <div className="flex items-baseline justify-between gap-2">
                <span className="text-[12px] font-semibold text-gray-900">
                  {pr.name || "Project Name"}
                  {pr.tech && (
                    <span className="font-normal text-gray-500"> - {pr.tech}</span>
                  )}
                </span>
                {pr.link && (
                  <span className="text-[10.5px] text-gray-500">{pr.link}</span>
                )}
              </div>
              <ul className="mt-0.5 list-disc space-y-0.5 pl-4 text-[11.5px] leading-relaxed text-gray-700">
                {pr.bullets.filter((b) => b.trim()).map((b, i) => <li key={i}>{b}</li>)}
              </ul>
            </div>
          ),
        })
      );
    }

    if (cv.education.length > 0) {
      addSection("edu", "Education");
      cv.education.forEach((e) =>
        list.push({
          key: `edu_${e.id}`,
          keepWithNext: false,
          node: (
            <div className="pb-1.5">
              <div className="flex items-baseline justify-between gap-2">
                <span className="text-[12px] font-semibold text-gray-900">
                  {e.school || "Institution"}
                </span>
                <span className="whitespace-nowrap text-[10.5px] text-gray-500">
                  {dateRange(e.startDate, e.endDate, false)}
                </span>
              </div>
              <div className="text-[11px] text-gray-700">
                {[e.degree, e.field].filter(Boolean).join(" - ")}
                {e.gpa && <span className="text-gray-500"> · GPA {e.gpa}</span>}
              </div>
            </div>
          ),
        })
      );
    }

    if (skills.length > 0) {
      addSection("skills", "Skills");
      list.push({
        key: "skills",
        keepWithNext: false,
        node: (
          <p className="pb-2 text-[11.5px] leading-relaxed text-gray-700">
            {skills.join(", ")}
          </p>
        ),
      });
    }

    if (cv.certifications.length > 0) {
      addSection("cert", "Certifications");
      list.push({
        key: "cert",
        keepWithNext: false,
        node: (
          <ul className="space-y-0.5 pb-2 text-[11.5px] text-gray-700">
            {cv.certifications.map((c) => (
              <li key={c.id}>
                <span className="font-medium">{c.name}</span>
                {c.issuer && <span className="text-gray-500"> — {c.issuer}</span>}
                {c.date && <span className="text-gray-500"> ({c.date})</span>}
              </li>
            ))}
          </ul>
        ),
      });
    }

    if (cv.languages.filter((l) => l.name.trim()).length > 0) {
      addSection("lang", "Languages");
      list.push({
        key: "lang",
        keepWithNext: false,
        node: (
          <p className="pb-2 text-[11.5px] text-gray-700">
            {cv.languages
              .filter((l) => l.name.trim())
              .map((l) => (l.level ? `${l.name} (${l.level})` : l.name))
              .join(", ")}
          </p>
        ),
      });
    }

    return list;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cv, accent, isModern, isMinimal]);

  // ---- Measure block heights, then pack into pages ----
  const measureRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [pages, setPages] = useState<number[][] | null>(null);
  const signature = JSON.stringify(cv);

  useLayoutEffect(() => {
    const heights = blocks.map((_, i) => measureRefs.current[i]?.offsetHeight ?? 0);
    const result: number[][] = [[]];
    let cur = 0;
    let used = 0;

    blocks.forEach((b, i) => {
      const h = heights[i];
      // keep a section title with its first following block
      let needed = h;
      if (b.keepWithNext && i + 1 < blocks.length) needed += heights[i + 1];

      if (used + needed > LIMIT && result[cur].length > 0) {
        result.push([]);
        cur += 1;
        used = 0;
      }
      result[cur].push(i);
      used += h;
    });

    setPages(result);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [signature, template]);

  const sheetClass = `cv-sheet cv-page ${fontClass} text-[#1f2937]`;

  return (
    <div className="cv-pages flex flex-col items-center gap-6">
      {/* Hidden measurer: same width & block styling, no vertical page padding.
          Wrapped in a 0×0 overflow-hidden box so it never affects scroll/layout. */}
      <div
        aria-hidden
        style={{ position: "absolute", width: 0, height: 0, overflow: "hidden" }}
      >
        <div className={`${fontClass} text-[#1f2937]`} style={{ width: "210mm" }}>
          <div className="px-12">
            {blocks.map((b, i) => (
              <div
                key={b.key}
                ref={(el) => {
                  measureRefs.current[i] = el;
                }}
              >
                {b.node}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Visible paginated pages (fallback: single page before measuring).
          Guard against stale indices when `blocks` changed before the layout
          effect re-paginated — out-of-range entries are dropped this render. */}
      {(pages ?? [blocks.map((_, i) => i)]).map((idxs, pageIdx) => {
        const valid = idxs.filter((i) => blocks[i]);
        if (valid.length === 0) return null;
        return (
          <div key={pageIdx} className={sheetClass}>
            <div className="px-12 py-10">
              {valid.map((i) => (
                <div key={blocks[i].key} className="cv-block">
                  {blocks[i].node}
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
