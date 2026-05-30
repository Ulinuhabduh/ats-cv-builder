export interface Personal {
  fullName: string;
  title: string;
  email: string;
  phone: string;
  location: string;
  website: string;
  linkedin: string;
}

export interface ExperienceItem {
  id: string;
  position: string;
  company: string;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
  bullets: string[];
}

export interface EducationItem {
  id: string;
  school: string;
  degree: string;
  field: string;
  location: string;
  startDate: string;
  endDate: string;
  gpa: string;
}

export interface ProjectItem {
  id: string;
  name: string;
  link: string;
  tech: string;
  bullets: string[];
}

export interface CertificationItem {
  id: string;
  name: string;
  issuer: string;
  date: string;
}

export interface LanguageItem {
  id: string;
  name: string;
  level: string;
}

export interface PublicationItem {
  id: string;
  title: string;
  venue: string;
  authors: string;
  year: string;
  link: string;
}

export type TemplateId = "classic" | "modern" | "minimal" | "academic";

export interface CVData {
  personal: Personal;
  summary: string;
  experience: ExperienceItem[];
  education: EducationItem[];
  skills: string[];
  projects: ProjectItem[];
  certifications: CertificationItem[];
  languages: LanguageItem[];
  /** Leadership / volunteering positions — same shape as experience entries. */
  leadership: ExperienceItem[];
  publications: PublicationItem[];
  /** Free-form short entries, one per line. */
  awards: string[];
  memberships: string[];
  template: TemplateId;
  accentColor: string;
}
