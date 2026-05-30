import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  CVData,
  Personal,
  ExperienceItem,
  EducationItem,
  ProjectItem,
  CertificationItem,
  LanguageItem,
  PublicationItem,
  TemplateId,
} from "./types";
import { emptyCV, sampleCV } from "./sampleData";

const uid = () => Math.random().toString(36).slice(2, 10);

interface CVState {
  cv: CVData;
  jobDescription: string;
  // generic
  setData: (data: CVData) => void;
  loadSample: () => void;
  reset: () => void;
  setJobDescription: (v: string) => void;
  // personal & top-level
  updatePersonal: (field: keyof Personal, value: string) => void;
  setSummary: (v: string) => void;
  setTemplate: (t: TemplateId) => void;
  setAccent: (c: string) => void;
  setSkills: (skills: string[]) => void;
  // experience
  addExperience: () => void;
  updateExperience: (id: string, patch: Partial<ExperienceItem>) => void;
  removeExperience: (id: string) => void;
  // education
  addEducation: () => void;
  updateEducation: (id: string, patch: Partial<EducationItem>) => void;
  removeEducation: (id: string) => void;
  // projects
  addProject: () => void;
  updateProject: (id: string, patch: Partial<ProjectItem>) => void;
  removeProject: (id: string) => void;
  // certifications
  addCertification: () => void;
  updateCertification: (id: string, patch: Partial<CertificationItem>) => void;
  removeCertification: (id: string) => void;
  // languages
  addLanguage: () => void;
  updateLanguage: (id: string, patch: Partial<LanguageItem>) => void;
  removeLanguage: (id: string) => void;
  // leadership (same shape as experience)
  addLeadership: () => void;
  updateLeadership: (id: string, patch: Partial<ExperienceItem>) => void;
  removeLeadership: (id: string) => void;
  // publications
  addPublication: () => void;
  updatePublication: (id: string, patch: Partial<PublicationItem>) => void;
  removePublication: (id: string) => void;
  // simple string lists
  setAwards: (v: string[]) => void;
  setMemberships: (v: string[]) => void;
}

export const useCVStore = create<CVState>()(
  persist(
    (set) => ({
      cv: emptyCV,
      jobDescription: "",

      setData: (data) => set({ cv: data }),
      loadSample: () => set({ cv: sampleCV }),
      reset: () => set({ cv: emptyCV }),
      setJobDescription: (v) => set({ jobDescription: v }),

      updatePersonal: (field, value) =>
        set((s) => ({ cv: { ...s.cv, personal: { ...s.cv.personal, [field]: value } } })),
      setSummary: (v) => set((s) => ({ cv: { ...s.cv, summary: v } })),
      setTemplate: (t) => set((s) => ({ cv: { ...s.cv, template: t } })),
      setAccent: (c) => set((s) => ({ cv: { ...s.cv, accentColor: c } })),
      setSkills: (skills) => set((s) => ({ cv: { ...s.cv, skills } })),

      addExperience: () =>
        set((s) => ({
          cv: {
            ...s.cv,
            experience: [
              ...s.cv.experience,
              {
                id: uid(),
                position: "",
                company: "",
                location: "",
                startDate: "",
                endDate: "",
                current: false,
                bullets: [""],
              },
            ],
          },
        })),
      updateExperience: (id, patch) =>
        set((s) => ({
          cv: {
            ...s.cv,
            experience: s.cv.experience.map((e) => (e.id === id ? { ...e, ...patch } : e)),
          },
        })),
      removeExperience: (id) =>
        set((s) => ({
          cv: { ...s.cv, experience: s.cv.experience.filter((e) => e.id !== id) },
        })),

      addEducation: () =>
        set((s) => ({
          cv: {
            ...s.cv,
            education: [
              ...s.cv.education,
              {
                id: uid(),
                school: "",
                degree: "",
                field: "",
                location: "",
                startDate: "",
                endDate: "",
                gpa: "",
              },
            ],
          },
        })),
      updateEducation: (id, patch) =>
        set((s) => ({
          cv: {
            ...s.cv,
            education: s.cv.education.map((e) => (e.id === id ? { ...e, ...patch } : e)),
          },
        })),
      removeEducation: (id) =>
        set((s) => ({
          cv: { ...s.cv, education: s.cv.education.filter((e) => e.id !== id) },
        })),

      addProject: () =>
        set((s) => ({
          cv: {
            ...s.cv,
            projects: [
              ...s.cv.projects,
              { id: uid(), name: "", link: "", tech: "", bullets: [""] },
            ],
          },
        })),
      updateProject: (id, patch) =>
        set((s) => ({
          cv: {
            ...s.cv,
            projects: s.cv.projects.map((p) => (p.id === id ? { ...p, ...patch } : p)),
          },
        })),
      removeProject: (id) =>
        set((s) => ({
          cv: { ...s.cv, projects: s.cv.projects.filter((p) => p.id !== id) },
        })),

      addCertification: () =>
        set((s) => ({
          cv: {
            ...s.cv,
            certifications: [
              ...s.cv.certifications,
              { id: uid(), name: "", issuer: "", date: "" },
            ],
          },
        })),
      updateCertification: (id, patch) =>
        set((s) => ({
          cv: {
            ...s.cv,
            certifications: s.cv.certifications.map((c) =>
              c.id === id ? { ...c, ...patch } : c
            ),
          },
        })),
      removeCertification: (id) =>
        set((s) => ({
          cv: { ...s.cv, certifications: s.cv.certifications.filter((c) => c.id !== id) },
        })),

      addLanguage: () =>
        set((s) => ({
          cv: {
            ...s.cv,
            languages: [...s.cv.languages, { id: uid(), name: "", level: "" }],
          },
        })),
      updateLanguage: (id, patch) =>
        set((s) => ({
          cv: {
            ...s.cv,
            languages: s.cv.languages.map((l) => (l.id === id ? { ...l, ...patch } : l)),
          },
        })),
      removeLanguage: (id) =>
        set((s) => ({
          cv: { ...s.cv, languages: s.cv.languages.filter((l) => l.id !== id) },
        })),

      addLeadership: () =>
        set((s) => ({
          cv: {
            ...s.cv,
            leadership: [
              ...s.cv.leadership,
              {
                id: uid(),
                position: "",
                company: "",
                location: "",
                startDate: "",
                endDate: "",
                current: false,
                bullets: [""],
              },
            ],
          },
        })),
      updateLeadership: (id, patch) =>
        set((s) => ({
          cv: {
            ...s.cv,
            leadership: s.cv.leadership.map((l) => (l.id === id ? { ...l, ...patch } : l)),
          },
        })),
      removeLeadership: (id) =>
        set((s) => ({
          cv: { ...s.cv, leadership: s.cv.leadership.filter((l) => l.id !== id) },
        })),

      addPublication: () =>
        set((s) => ({
          cv: {
            ...s.cv,
            publications: [
              ...s.cv.publications,
              { id: uid(), title: "", venue: "", authors: "", year: "", link: "" },
            ],
          },
        })),
      updatePublication: (id, patch) =>
        set((s) => ({
          cv: {
            ...s.cv,
            publications: s.cv.publications.map((p) =>
              p.id === id ? { ...p, ...patch } : p
            ),
          },
        })),
      removePublication: (id) =>
        set((s) => ({
          cv: { ...s.cv, publications: s.cv.publications.filter((p) => p.id !== id) },
        })),

      setAwards: (v) => set((s) => ({ cv: { ...s.cv, awards: v } })),
      setMemberships: (v) => set((s) => ({ cv: { ...s.cv, memberships: v } })),
    }),
    {
      name: "ats-cv-data",
      // Backfill any fields added in newer versions so old persisted payloads
      // don't crash the renderer when they lack newly-introduced arrays.
      merge: (persisted, current) => {
        const c = current as CVState;
        const p = (persisted ?? {}) as Partial<CVState> & { cv?: Partial<CVData> };
        return {
          ...c,
          ...p,
          cv: { ...c.cv, ...(p.cv ?? {}) },
        };
      },
    }
  )
);
