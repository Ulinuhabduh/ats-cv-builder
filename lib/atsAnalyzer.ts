import { CVData } from "./types";

export interface CheckResult {
  id: string;
  label: string;
  passed: boolean;
  weight: number;
  hint: string;
}

export interface KeywordResult {
  matched: string[];
  missing: string[];
  coverage: number; // 0-100
}

export interface ATSReport {
  score: number; // 0-100
  checks: CheckResult[];
  keywords: KeywordResult | null;
}

// Common strong action verbs (EN + ID) used to detect impactful bullet writing.
const ACTION_VERBS = [
  "led", "built", "created", "designed", "developed", "improved", "increased",
  "reduced", "managed", "launched", "implemented", "optimized", "delivered",
  "achieved", "automated", "migrated", "mentored", "drove", "spearheaded",
  "memimpin", "membangun", "membuat", "merancang", "mengembangkan", "meningkatkan",
  "mengurangi", "mengelola", "meluncurkan", "menerapkan", "mengoptimasi",
  "mengoptimalkan", "menghasilkan", "mencapai", "mengotomasi", "membimbing",
];

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const STOPWORDS = new Set([
  "the", "and", "for", "with", "you", "your", "our", "are", "will", "this",
  "that", "have", "has", "from", "who", "what", "into", "able", "must", "should",
  "dan", "yang", "untuk", "dengan", "atau", "pada", "dari", "akan", "adalah",
  "kami", "anda", "para", "dapat", "serta", "dalam", "ini", "itu", "juga",
  "a", "an", "of", "to", "in", "on", "as", "is", "at", "by", "or", "be",
]);

function countBullets(cv: CVData): number {
  const exp = cv.experience.reduce(
    (n, e) => n + e.bullets.filter((b) => b.trim()).length,
    0
  );
  const proj = cv.projects.reduce(
    (n, p) => n + p.bullets.filter((b) => b.trim()).length,
    0
  );
  return exp + proj;
}

function allBulletsText(cv: CVData): string {
  const lines: string[] = [];
  cv.experience.forEach((e) => e.bullets.forEach((b) => lines.push(b)));
  cv.projects.forEach((p) => p.bullets.forEach((b) => lines.push(b)));
  return lines.join(" ").toLowerCase();
}

export function plainText(cv: CVData): string {
  const p = cv.personal;
  const parts: string[] = [
    p.fullName, p.title, p.email, p.phone, p.location, p.website, p.linkedin,
    cv.summary,
    ...cv.experience.flatMap((e) => [e.position, e.company, e.location, ...e.bullets]),
    ...cv.education.flatMap((e) => [e.school, e.degree, e.field]),
    ...cv.skills,
    ...cv.projects.flatMap((pr) => [pr.name, pr.tech, ...pr.bullets]),
    ...cv.certifications.flatMap((c) => [c.name, c.issuer]),
    ...cv.languages.flatMap((l) => [l.name, l.level]),
  ];
  return parts.filter(Boolean).join(" ");
}

export function analyzeKeywords(cv: CVData, jd: string): KeywordResult | null {
  const trimmed = jd.trim();
  if (!trimmed) return null;

  const tokens = trimmed
    .toLowerCase()
    .replace(/[^a-z0-9+#.\s]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length >= 3 && !STOPWORDS.has(w));

  // frequency to surface the most relevant terms
  const freq = new Map<string, number>();
  tokens.forEach((t) => freq.set(t, (freq.get(t) || 0) + 1));
  const keywords = Array.from(freq.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 25)
    .map(([w]) => w);

  const haystack = plainText(cv).toLowerCase();
  const matched: string[] = [];
  const missing: string[] = [];
  keywords.forEach((k) => {
    if (haystack.includes(k)) matched.push(k);
    else missing.push(k);
  });

  const coverage = keywords.length
    ? Math.round((matched.length / keywords.length) * 100)
    : 0;

  return { matched, missing, coverage };
}

export function analyzeCV(cv: CVData, jd: string): ATSReport {
  const p = cv.personal;
  const bulletText = allBulletsText(cv);
  const hasActionVerb = ACTION_VERBS.some((v) => bulletText.includes(v));
  const hasNumbers = /\d/.test(bulletText);
  const bulletCount = countBullets(cv);
  const summaryWords = cv.summary.trim().split(/\s+/).filter(Boolean).length;

  const checks: CheckResult[] = [
    {
      id: "name",
      label: "Full name provided",
      passed: p.fullName.trim().length > 0,
      weight: 6,
      hint: "Add your full name at the top.",
    },
    {
      id: "title",
      label: "Job title / target role",
      passed: p.title.trim().length > 0,
      weight: 6,
      hint: "Add a role headline (e.g. 'Frontend Developer') to stay relevant to the job.",
    },
    {
      id: "email",
      label: "Valid email",
      passed: EMAIL_RE.test(p.email.trim()),
      weight: 8,
      hint: "Use a valid, professional email address.",
    },
    {
      id: "phone",
      label: "Phone number",
      passed: p.phone.replace(/\D/g, "").length >= 8,
      weight: 6,
      hint: "Add a phone number you can be reached at.",
    },
    {
      id: "location",
      label: "Location",
      passed: p.location.trim().length > 0,
      weight: 4,
      hint: "Add your city / location.",
    },
    {
      id: "summary",
      label: "Professional summary (30–80 words)",
      passed: summaryWords >= 25 && summaryWords <= 90,
      weight: 10,
      hint: "Write a 2–4 sentence summary of your key skills & achievements.",
    },
    {
      id: "experience",
      label: "At least 1 work experience",
      passed: cv.experience.length > 0,
      weight: 12,
      hint: "Add relevant work experience or internships.",
    },
    {
      id: "bullets",
      label: "Enough achievement bullets (≥ 3)",
      passed: bulletCount >= 3,
      weight: 10,
      hint: "Describe responsibilities & achievements as bullet points.",
    },
    {
      id: "actionverbs",
      label: "Uses action verbs",
      passed: hasActionVerb,
      weight: 8,
      hint: "Start bullets with action verbs: 'Built', 'Improved', 'Led'...",
    },
    {
      id: "metrics",
      label: "Has measurable results (numbers)",
      passed: hasNumbers,
      weight: 10,
      hint: "Quantify impact: '+40% performance', '12,000 users', 'reduced bugs by 30%'.",
    },
    {
      id: "education",
      label: "Education history",
      passed: cv.education.length > 0,
      weight: 6,
      hint: "Add your most recent education.",
    },
    {
      id: "skills",
      label: "At least 5 skills",
      passed: cv.skills.filter((s) => s.trim()).length >= 5,
      weight: 10,
      hint: "List relevant technical skills & tools (ATS keywords).",
    },
    {
      id: "contactlinks",
      label: "LinkedIn / portfolio",
      passed: p.linkedin.trim().length > 0 || p.website.trim().length > 0,
      weight: 4,
      hint: "Add a LinkedIn or online portfolio link.",
    },
  ];

  const totalWeight = checks.reduce((n, c) => n + c.weight, 0);
  const gained = checks.reduce((n, c) => n + (c.passed ? c.weight : 0), 0);
  const score = Math.round((gained / totalWeight) * 100);

  return { score, checks, keywords: analyzeKeywords(cv, jd) };
}
