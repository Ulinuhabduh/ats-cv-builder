"use client";

import { useCVStore } from "@/lib/store";
import { Field, Input, Textarea, Section, GhostButton, RemoveButton } from "./ui";

export default function CVForm() {
  const {
    cv,
    updatePersonal,
    setSummary,
    setSkills,
    addExperience,
    updateExperience,
    removeExperience,
    addEducation,
    updateEducation,
    removeEducation,
    addProject,
    updateProject,
    removeProject,
    addCertification,
    updateCertification,
    removeCertification,
    addLanguage,
    updateLanguage,
    removeLanguage,
    addLeadership,
    updateLeadership,
    removeLeadership,
    addPublication,
    updatePublication,
    removePublication,
    setAwards,
    setMemberships,
  } = useCVStore();

  const p = cv.personal;

  return (
    <div className="space-y-5">
      {/* Personal */}
      <Section title="Personal Details" desc="Contact information shown at the top of your CV.">
        <div className="grid grid-cols-2 gap-3">
          <Field label="Full Name">
            <Input
              value={p.fullName}
              onChange={(e) => updatePersonal("fullName", e.target.value)}
              placeholder="John Smith"
            />
          </Field>
          <Field label="Title / Headline">
            <Input
              value={p.title}
              onChange={(e) => updatePersonal("title", e.target.value)}
              placeholder="Frontend Developer"
            />
          </Field>
          <Field label="Email">
            <Input
              type="email"
              value={p.email}
              onChange={(e) => updatePersonal("email", e.target.value)}
              placeholder="name@email.com"
            />
          </Field>
          <Field label="Phone">
            <Input
              value={p.phone}
              onChange={(e) => updatePersonal("phone", e.target.value)}
              placeholder="+1 555 123 4567"
            />
          </Field>
          <Field label="Location">
            <Input
              value={p.location}
              onChange={(e) => updatePersonal("location", e.target.value)}
              placeholder="New York, USA"
            />
          </Field>
          <Field label="Website / Portfolio">
            <Input
              value={p.website}
              onChange={(e) => updatePersonal("website", e.target.value)}
              placeholder="yourname.dev"
            />
          </Field>
          <Field label="LinkedIn">
            <Input
              value={p.linkedin}
              onChange={(e) => updatePersonal("linkedin", e.target.value)}
              placeholder="linkedin.com/in/yourname"
            />
          </Field>
        </div>
      </Section>

      {/* Summary */}
      <Section title="Professional Summary" desc="2–4 sentences about your key skills & achievements.">
        <Textarea
          rows={4}
          value={cv.summary}
          onChange={(e) => setSummary(e.target.value)}
          placeholder="Frontend Developer with 4 years of experience..."
        />
      </Section>

      {/* Experience */}
      <Section title="Work Experience" desc="Start with the most recent. Use bullets and numbers for impact.">
        <div className="space-y-4">
          {cv.experience.map((e) => (
            <div key={e.id} className="rounded-lg border border-gray-200 p-4">
              <div className="grid grid-cols-2 gap-3">
                <Field label="Position">
                  <Input
                    value={e.position}
                    onChange={(ev) => updateExperience(e.id, { position: ev.target.value })}
                  />
                </Field>
                <Field label="Company">
                  <Input
                    value={e.company}
                    onChange={(ev) => updateExperience(e.id, { company: ev.target.value })}
                  />
                </Field>
                <Field label="Location">
                  <Input
                    value={e.location}
                    onChange={(ev) => updateExperience(e.id, { location: ev.target.value })}
                  />
                </Field>
                <div className="grid grid-cols-2 gap-2">
                  <Field label="Start">
                    <Input
                      value={e.startDate}
                      placeholder="Jan 2022"
                      onChange={(ev) => updateExperience(e.id, { startDate: ev.target.value })}
                    />
                  </Field>
                  <Field label="End">
                    <Input
                      value={e.endDate}
                      placeholder="Dec 2023"
                      disabled={e.current}
                      onChange={(ev) => updateExperience(e.id, { endDate: ev.target.value })}
                    />
                  </Field>
                </div>
              </div>
              <label className="mt-2 flex items-center gap-2 text-xs text-gray-600">
                <input
                  type="checkbox"
                  checked={e.current}
                  onChange={(ev) => updateExperience(e.id, { current: ev.target.checked })}
                />
                I currently work here
              </label>
              <div className="mt-3">
                <Field label="Achievements (one line = one bullet)">
                  <Textarea
                    rows={4}
                    value={e.bullets.join("\n")}
                    onChange={(ev) =>
                      updateExperience(e.id, { bullets: ev.target.value.split("\n") })
                    }
                    placeholder={"Improved page performance by 40%...\nLed a team of 3 developers..."}
                  />
                </Field>
              </div>
              <div className="mt-2 text-right">
                <RemoveButton onClick={() => removeExperience(e.id)} />
              </div>
            </div>
          ))}
          <GhostButton onClick={addExperience}>+ Add Experience</GhostButton>
        </div>
      </Section>

      {/* Education */}
      <Section title="Education">
        <div className="space-y-4">
          {cv.education.map((e) => (
            <div key={e.id} className="rounded-lg border border-gray-200 p-4">
              <div className="grid grid-cols-2 gap-3">
                <Field label="Institution">
                  <Input
                    value={e.school}
                    onChange={(ev) => updateEducation(e.id, { school: ev.target.value })}
                  />
                </Field>
                <Field label="Degree">
                  <Input
                    value={e.degree}
                    placeholder="Bachelor's"
                    onChange={(ev) => updateEducation(e.id, { degree: ev.target.value })}
                  />
                </Field>
                <Field label="Field of Study">
                  <Input
                    value={e.field}
                    onChange={(ev) => updateEducation(e.id, { field: ev.target.value })}
                  />
                </Field>
                <Field label="GPA (optional)">
                  <Input
                    value={e.gpa}
                    placeholder="3.72"
                    onChange={(ev) => updateEducation(e.id, { gpa: ev.target.value })}
                  />
                </Field>
                <Field label="Start Year">
                  <Input
                    value={e.startDate}
                    placeholder="2016"
                    onChange={(ev) => updateEducation(e.id, { startDate: ev.target.value })}
                  />
                </Field>
                <Field label="End Year">
                  <Input
                    value={e.endDate}
                    placeholder="2020"
                    onChange={(ev) => updateEducation(e.id, { endDate: ev.target.value })}
                  />
                </Field>
              </div>
              <div className="mt-2 text-right">
                <RemoveButton onClick={() => removeEducation(e.id)} />
              </div>
            </div>
          ))}
          <GhostButton onClick={addEducation}>+ Add Education</GhostButton>
        </div>
      </Section>

      {/* Skills */}
      <Section title="Skills" desc="Separate with commas. Include keywords from the job you're targeting.">
        <Textarea
          rows={3}
          value={cv.skills.join(", ")}
          onChange={(e) =>
            setSkills(e.target.value.split(",").map((s) => s.trimStart()))
          }
          placeholder="JavaScript, React, TypeScript, Node.js, Git"
        />
      </Section>

      {/* Projects */}
      <Section title="Projects (optional)">
        <div className="space-y-4">
          {cv.projects.map((pr) => (
            <div key={pr.id} className="rounded-lg border border-gray-200 p-4">
              <div className="grid grid-cols-2 gap-3">
                <Field label="Project Name">
                  <Input
                    value={pr.name}
                    onChange={(ev) => updateProject(pr.id, { name: ev.target.value })}
                  />
                </Field>
                <Field label="Tech Stack">
                  <Input
                    value={pr.tech}
                    placeholder="Next.js, TypeScript"
                    onChange={(ev) => updateProject(pr.id, { tech: ev.target.value })}
                  />
                </Field>
                <Field label="Link (optional)">
                  <Input
                    value={pr.link}
                    onChange={(ev) => updateProject(pr.id, { link: ev.target.value })}
                  />
                </Field>
              </div>
              <div className="mt-3">
                <Field label="Description (one line = one bullet)">
                  <Textarea
                    rows={3}
                    value={pr.bullets.join("\n")}
                    onChange={(ev) =>
                      updateProject(pr.id, { bullets: ev.target.value.split("\n") })
                    }
                  />
                </Field>
              </div>
              <div className="mt-2 text-right">
                <RemoveButton onClick={() => removeProject(pr.id)} />
              </div>
            </div>
          ))}
          <GhostButton onClick={addProject}>+ Add Project</GhostButton>
        </div>
      </Section>

      {/* Certifications */}
      <Section title="Certifications (optional)">
        <div className="space-y-3">
          {cv.certifications.map((c) => (
            <div key={c.id} className="grid grid-cols-[1fr_1fr_auto_auto] items-end gap-2">
              <Field label="Name">
                <Input
                  value={c.name}
                  onChange={(ev) => updateCertification(c.id, { name: ev.target.value })}
                />
              </Field>
              <Field label="Issuer">
                <Input
                  value={c.issuer}
                  onChange={(ev) => updateCertification(c.id, { issuer: ev.target.value })}
                />
              </Field>
              <Field label="Year">
                <Input
                  className="w-20"
                  value={c.date}
                  onChange={(ev) => updateCertification(c.id, { date: ev.target.value })}
                />
              </Field>
              <div className="pb-2">
                <RemoveButton onClick={() => removeCertification(c.id)} />
              </div>
            </div>
          ))}
          <GhostButton onClick={addCertification}>+ Add Certification</GhostButton>
        </div>
      </Section>

      {/* Leadership */}
      <Section title="Leadership (optional)" desc="Organizations, clubs, or volunteer roles. Same fields as Experience.">
        <div className="space-y-4">
          {cv.leadership.map((e) => (
            <div key={e.id} className="rounded-lg border border-gray-200 p-4">
              <div className="grid grid-cols-2 gap-3">
                <Field label="Role">
                  <Input
                    value={e.position}
                    onChange={(ev) => updateLeadership(e.id, { position: ev.target.value })}
                  />
                </Field>
                <Field label="Organization">
                  <Input
                    value={e.company}
                    onChange={(ev) => updateLeadership(e.id, { company: ev.target.value })}
                  />
                </Field>
                <Field label="Location">
                  <Input
                    value={e.location}
                    onChange={(ev) => updateLeadership(e.id, { location: ev.target.value })}
                  />
                </Field>
                <div className="grid grid-cols-2 gap-2">
                  <Field label="Start">
                    <Input
                      value={e.startDate}
                      placeholder="Aug 2023"
                      onChange={(ev) => updateLeadership(e.id, { startDate: ev.target.value })}
                    />
                  </Field>
                  <Field label="End">
                    <Input
                      value={e.endDate}
                      placeholder="Present"
                      disabled={e.current}
                      onChange={(ev) => updateLeadership(e.id, { endDate: ev.target.value })}
                    />
                  </Field>
                </div>
              </div>
              <label className="mt-2 flex items-center gap-2 text-xs text-gray-600">
                <input
                  type="checkbox"
                  checked={e.current}
                  onChange={(ev) => updateLeadership(e.id, { current: ev.target.checked })}
                />
                Currently active
              </label>
              <div className="mt-3">
                <Field label="Details (one line = one bullet)">
                  <Textarea
                    rows={3}
                    value={e.bullets.join("\n")}
                    onChange={(ev) =>
                      updateLeadership(e.id, { bullets: ev.target.value.split("\n") })
                    }
                  />
                </Field>
              </div>
              <div className="mt-2 text-right">
                <RemoveButton onClick={() => removeLeadership(e.id)} />
              </div>
            </div>
          ))}
          <GhostButton onClick={addLeadership}>+ Add Leadership</GhostButton>
        </div>
      </Section>

      {/* Publications */}
      <Section title="Publications (optional)" desc="Research papers, articles, posters. Cite as you'd write them on the page.">
        <div className="space-y-3">
          {cv.publications.map((p) => (
            <div key={p.id} className="rounded-lg border border-gray-200 p-4 space-y-3">
              <Field label="Title">
                <Input
                  value={p.title}
                  onChange={(ev) => updatePublication(p.id, { title: ev.target.value })}
                />
              </Field>
              <Field label="Authors (in order, comma-separated)">
                <Input
                  value={p.authors}
                  placeholder="Last, First; Last, First"
                  onChange={(ev) => updatePublication(p.id, { authors: ev.target.value })}
                />
              </Field>
              <div className="grid grid-cols-[1fr_auto_1fr] gap-3">
                <Field label="Venue / Journal / Conference">
                  <Input
                    value={p.venue}
                    placeholder="CHI 2025"
                    onChange={(ev) => updatePublication(p.id, { venue: ev.target.value })}
                  />
                </Field>
                <Field label="Year">
                  <Input
                    className="w-20"
                    value={p.year}
                    onChange={(ev) => updatePublication(p.id, { year: ev.target.value })}
                  />
                </Field>
                <Field label="Link (optional)">
                  <Input
                    value={p.link}
                    onChange={(ev) => updatePublication(p.id, { link: ev.target.value })}
                  />
                </Field>
              </div>
              <div className="text-right">
                <RemoveButton onClick={() => removePublication(p.id)} />
              </div>
            </div>
          ))}
          <GhostButton onClick={addPublication}>+ Add Publication</GhostButton>
        </div>
      </Section>

      {/* Honors & Awards */}
      <Section title="Honors & Awards (optional)" desc="One per line — they'll be joined as a compact paragraph on the page.">
        <Textarea
          rows={4}
          value={cv.awards.join("\n")}
          onChange={(e) => setAwards(e.target.value.split("\n"))}
          placeholder={"Hackathon Champion (2024)\nDean's Honor List (2023)"}
        />
      </Section>

      {/* Memberships */}
      <Section title="Memberships (optional)" desc="Professional or academic societies. One per line.">
        <Textarea
          rows={3}
          value={cv.memberships.join("\n")}
          onChange={(e) => setMemberships(e.target.value.split("\n"))}
          placeholder={"IEEE — Student Member (2024)\nAAAI — Student Member (2024)"}
        />
      </Section>

      {/* Languages */}
      <Section title="Languages (optional)">
        <div className="space-y-3">
          {cv.languages.map((l) => (
            <div key={l.id} className="grid grid-cols-[1fr_1fr_auto] items-end gap-2">
              <Field label="Language">
                <Input
                  value={l.name}
                  onChange={(ev) => updateLanguage(l.id, { name: ev.target.value })}
                />
              </Field>
              <Field label="Level">
                <Input
                  value={l.level}
                  placeholder="Native / Professional"
                  onChange={(ev) => updateLanguage(l.id, { level: ev.target.value })}
                />
              </Field>
              <div className="pb-2">
                <RemoveButton onClick={() => removeLanguage(l.id)} />
              </div>
            </div>
          ))}
          <GhostButton onClick={addLanguage}>+ Add Language</GhostButton>
        </div>
      </Section>
    </div>
  );
}
