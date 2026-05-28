# ATS CV Builder

A web platform for building **ATS-friendly** resumes (Applicant Tracking System). Built with Next.js 14, TypeScript, and Tailwind CSS. All data is stored in the browser (localStorage) — no server, nothing leaves your machine.

## Features

- **Editor + Live Preview** — fill in the form and see the result instantly at A4 size.
- **Auto-paginated A4 preview** — content flows into real A4 pages; entries are never split across a page break, so the preview matches the exported PDF.
- **3 ATS-friendly templates** — Classic, Modern, Minimal. All single-column with real, selectable text for easy ATS parsing.
- **Accent color picker** — customize the look without hurting readability.
- **ATS Score analysis** — automatic checklist (contact info, summary, action verbs, quantified results, etc.) with a 0–100 score.
- **Job matching** — paste a job description and see which keywords are already in your CV and which are missing.
- **PDF export** — via the browser print dialog (Save as PDF), producing a real-text PDF that ATS can parse.
- **Save & Import Project** — download your entire CV as a `.cvproj.json` file and re-import it anytime to keep editing. Great for keeping multiple CV versions.

## Getting started

```bash
npm install
npm run dev      # http://localhost:3000
```

Production build:

```bash
npm run build
npm start
```

## Best PDF export settings for ATS

1. Click **⬇ Download PDF**.
2. In the print dialog, set the destination to **Save as PDF**.
3. Set **Margins = None** and enable **Background graphics** so the accent color prints.

## Project structure

```
app/
  layout.tsx        # root layout + metadata
  page.tsx          # main page: toolbar, editor/ATS tabs, preview
  globals.css       # Tailwind + print stylesheet (A4)
components/
  CVForm.tsx        # form editor for every section
  CVDocument.tsx    # CV renderer (3 template variants) + A4 pagination
  ATSPanel.tsx      # ATS score, checklist, keyword matching
  ui.tsx            # input/section/button primitives
lib/
  types.ts          # CV data types
  store.ts          # Zustand state + localStorage persistence
  atsAnalyzer.ts    # ATS scoring heuristics + keyword analysis
  projectIO.ts      # export/import of .cvproj.json project files
  sampleData.ts     # sample data & empty template
```

## ATS notes

The templates are intentionally **single-column with no tables, icons, or multiple columns**, use standard headings ("Work Experience", "Education", "Skills"), and common fonts (Calibri/Arial/Georgia) — all factors that make a CV easy for modern ATS to parse.

## Deployment

Optimized for **Vercel** (zero config for Next.js):

1. Push this repo to GitHub.
2. On [vercel.com](https://vercel.com), **Add New → Project** and import the repo.
3. Keep the defaults (Vercel detects Next.js) and click **Deploy**.

Every subsequent `git push` triggers an automatic deployment.

## Tech stack

Next.js 14 (App Router) · TypeScript · Tailwind CSS · Zustand
