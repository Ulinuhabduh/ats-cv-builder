import { CVData } from "./types";
import { emptyCV } from "./sampleData";

export const PROJECT_VERSION = 1;
export const PROJECT_EXT = ".cvproj.json";

export interface ProjectFile {
  app: "ats-cv-builder";
  version: number;
  savedAt: string;
  cv: CVData;
  jobDescription: string;
}

/** Build the JSON payload for a saved project. */
export function buildProject(cv: CVData, jobDescription: string): ProjectFile {
  return {
    app: "ats-cv-builder",
    version: PROJECT_VERSION,
    savedAt: new Date().toISOString(),
    cv,
    jobDescription,
  };
}

function slugify(name: string): string {
  const base = name.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
  return base || "resume";
}

/** Trigger a browser download of the project as a .cvproj.json file. */
export function downloadProject(cv: CVData, jobDescription: string) {
  const data = JSON.stringify(buildProject(cv, jobDescription), null, 2);
  const blob = new Blob([data], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${slugify(cv.personal.fullName)}${PROJECT_EXT}`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

export interface ParsedProject {
  cv: CVData;
  jobDescription: string;
}

/**
 * Parse & normalize an imported project file. Missing/unknown fields fall back
 * to empty defaults so an older or partial file still loads safely.
 */
export function parseProject(raw: string): ParsedProject {
  let json: unknown;
  try {
    json = JSON.parse(raw);
  } catch {
    throw new Error("File is not valid JSON.");
  }
  if (!json || typeof json !== "object") {
    throw new Error("Unrecognized project file.");
  }
  const obj = json as Partial<ProjectFile>;
  if (obj.app && obj.app !== "ats-cv-builder") {
    throw new Error("This file was not created by ATS CV Builder.");
  }
  if (!obj.cv || typeof obj.cv !== "object") {
    throw new Error("Project file has no CV data.");
  }

  const src = obj.cv as Partial<CVData>;
  const cv: CVData = {
    ...emptyCV,
    ...src,
    personal: { ...emptyCV.personal, ...(src.personal ?? {}) },
    experience: Array.isArray(src.experience) ? src.experience : [],
    education: Array.isArray(src.education) ? src.education : [],
    skills: Array.isArray(src.skills) ? src.skills : [],
    projects: Array.isArray(src.projects) ? src.projects : [],
    certifications: Array.isArray(src.certifications) ? src.certifications : [],
    languages: Array.isArray(src.languages) ? src.languages : [],
    template: src.template ?? emptyCV.template,
    accentColor: src.accentColor ?? emptyCV.accentColor,
  };

  return {
    cv,
    jobDescription: typeof obj.jobDescription === "string" ? obj.jobDescription : "",
  };
}
