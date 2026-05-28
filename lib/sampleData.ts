import { CVData } from "./types";

export const emptyCV: CVData = {
  personal: {
    fullName: "",
    title: "",
    email: "",
    phone: "",
    location: "",
    website: "",
    linkedin: "",
  },
  summary: "",
  experience: [],
  education: [],
  skills: [],
  projects: [],
  certifications: [],
  languages: [],
  template: "classic",
  accentColor: "#4f46e5",
};

export const sampleCV: CVData = {
  personal: {
    fullName: "John Smith",
    title: "Frontend Developer",
    email: "john.smith@email.com",
    phone: "+1 555 123 4567",
    location: "New York, USA",
    website: "johnsmith.dev",
    linkedin: "linkedin.com/in/johnsmith",
  },
  summary:
    "Frontend Developer with 4 years of experience building responsive web applications with React and TypeScript. Improved page performance by up to 40% and led the migration of 3 products to a modern component architecture.",
  experience: [
    {
      id: "exp1",
      position: "Senior Frontend Developer",
      company: "Acme Technologies",
      location: "New York",
      startDate: "Jan 2022",
      endDate: "",
      current: true,
      bullets: [
        "Led development of an analytics dashboard used by 12,000+ monthly active users.",
        "Raised the Lighthouse score from 62 to 95 through bundle optimization and lazy loading.",
        "Mentored 3 junior developers and established the team's code review standards.",
      ],
    },
    {
      id: "exp2",
      position: "Frontend Developer",
      company: "Bright Digital Startup",
      location: "Boston",
      startDate: "Jul 2020",
      endDate: "Dec 2021",
      current: false,
      bullets: [
        "Built 20+ feature pages using React, Redux, and REST APIs.",
        "Reduced production bugs by 30% by introducing unit testing with Jest.",
      ],
    },
  ],
  education: [
    {
      id: "edu1",
      school: "State University",
      degree: "Bachelor's",
      field: "Computer Science",
      location: "New York",
      startDate: "2016",
      endDate: "2020",
      gpa: "3.72",
    },
  ],
  skills: [
    "JavaScript",
    "TypeScript",
    "React",
    "Next.js",
    "Tailwind CSS",
    "Redux",
    "Jest",
    "Git",
    "REST API",
    "Figma",
  ],
  projects: [
    {
      id: "proj1",
      name: "OpenResume Clone",
      link: "github.com/john/openresume",
      tech: "Next.js, TypeScript",
      bullets: [
        "Open-source CV builder with 500+ stars on GitHub.",
      ],
    },
  ],
  certifications: [
    {
      id: "cert1",
      name: "Meta Front-End Developer Professional Certificate",
      issuer: "Coursera",
      date: "2023",
    },
  ],
  languages: [
    { id: "lang1", name: "English", level: "Native" },
    { id: "lang2", name: "Spanish", level: "Professional" },
  ],
  template: "classic",
  accentColor: "#4f46e5",
};
