"use client";

import {
  CVData,
  ExperienceEntry,
  EducationEntry,
  ProjectEntry,
  CertificationEntry,
} from "../types/cv";
import RichTextEditor from "./RichTextEditor";
import SectionCard from "./ui/SectionCard";
import EntryCard from "./ui/EntryCard";
import Field from "./ui/Field";
import Input from "./ui/Input";
import AddButton from "./ui/AddButton";
import SkillsInput from "./ui/SkillsInput";

interface Props {
  data: CVData;
  onChange: (data: CVData) => void;
}

const genId = () => `${Date.now()}-${Math.random().toString(36).slice(2)}`;

export default function CVForm({ data, onChange }: Props) {
  /* ── Personal field updater ── */
  const setPersonal = (field: string, value: string) =>
    onChange({ ...data, personal: { ...data.personal, [field]: value } });

  /* ── Generic array helpers ── */
  function addItem<T>(key: keyof CVData, item: T) {
    onChange({ ...data, [key]: [...(data[key] as T[]), item] });
  }

  function removeItem(key: keyof CVData, id: string) {
    onChange({
      ...data,
      [key]: (data[key] as { id: string }[]).filter((item) => item.id !== id),
    });
  }

  function updateItem<T extends { id: string }>(
    key: keyof CVData,
    id: string,
    updates: Partial<T>
  ) {
    onChange({
      ...data,
      [key]: (data[key] as unknown as T[]).map((item) =>
        item.id === id ? { ...item, ...updates } : item
      ),
    });
  }

  /* ── Default new entries ── */
  const newExp = (): ExperienceEntry => ({
    id: genId(),
    position: "",
    company: "",
    location: "",
    startDate: "",
    endDate: "",
    current: false,
    description: "",
  });

  const newEdu = (): EducationEntry => ({
    id: genId(),
    degree: "",
    field: "",
    institution: "",
    startDate: "",
    endDate: "",
    current: false,
    gpa: "",
  });

  const newProj = (): ProjectEntry => ({
    id: genId(),
    name: "",
    technologies: "",
    link: "",
    description: "",
  });

  const newCert = (): CertificationEntry => ({
    id: genId(),
    name: "",
    issuer: "",
    date: "",
  });

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-10">
      {/* ── Personal Information ── */}
      <SectionCard id="personal" title="Personal Information" icon="👤">
        <div className="grid grid-cols-2 gap-4">
          <Field label="Full Name" span="full">
            <Input
              value={data.personal.fullName}
              onChange={(v) => setPersonal("fullName", v)}
              placeholder="John Smith"
            />
          </Field>

          <Field label="Job Title / Position" span="full">
            <Input
              value={data.personal.jobTitle}
              onChange={(v) => setPersonal("jobTitle", v)}
              placeholder="Senior Software Engineer"
            />
          </Field>

          <Field label="Email">
            <Input
              type="email"
              value={data.personal.email}
              onChange={(v) => setPersonal("email", v)}
              placeholder="john@example.com"
            />
          </Field>

          <Field label="Phone">
            <Input
              type="tel"
              value={data.personal.phone}
              onChange={(v) => setPersonal("phone", v)}
              placeholder="+1 234 567 8900"
            />
          </Field>

          <Field label="Location" span="full">
            <Input
              value={data.personal.location}
              onChange={(v) => setPersonal("location", v)}
              placeholder="New York, USA"
            />
          </Field>

          <Field label="LinkedIn">
            <Input
              value={data.personal.linkedin}
              onChange={(v) => setPersonal("linkedin", v)}
              placeholder="linkedin.com/in/username"
            />
          </Field>

          <Field label="GitHub">
            <Input
              value={data.personal.github}
              onChange={(v) => setPersonal("github", v)}
              placeholder="github.com/username"
            />
          </Field>

          <Field label="Website / Portfolio" span="full">
            <Input
              value={data.personal.website}
              onChange={(v) => setPersonal("website", v)}
              placeholder="https://yoursite.com"
            />
          </Field>
        </div>
      </SectionCard>

      {/* ── Professional Summary ── */}
      <SectionCard id="summary" title="Professional Summary" icon="📝">
        <RichTextEditor
          value={data.summary}
          onChange={(v) => onChange({ ...data, summary: v })}
          placeholder="Write a concise overview of your professional background, key strengths, and career goals..."
          minHeight={110}
        />
        <p className="mt-2 text-xs text-gray-400">
          Tip: Keep it 3–5 sentences. Use bold to highlight key points.
        </p>
      </SectionCard>

      {/* ── Work Experience ── */}
      <SectionCard id="experience" title="Work Experience" icon="💼">
        <div className="space-y-4">
          {data.experience.map((exp, i) => (
            <EntryCard
              key={exp.id}
              index={i + 1}
              onDelete={() => removeItem("experience", exp.id)}
            >
              <div className="grid grid-cols-2 gap-3">
                <Field label="Job Title" span="full">
                  <Input
                    value={exp.position}
                    onChange={(v) => updateItem<ExperienceEntry>("experience", exp.id, { position: v })}
                    placeholder="Software Engineer"
                  />
                </Field>

                <Field label="Company">
                  <Input
                    value={exp.company}
                    onChange={(v) => updateItem<ExperienceEntry>("experience", exp.id, { company: v })}
                    placeholder="Acme Corp"
                  />
                </Field>

                <Field label="Location">
                  <Input
                    value={exp.location}
                    onChange={(v) => updateItem<ExperienceEntry>("experience", exp.id, { location: v })}
                    placeholder="New York, USA"
                  />
                </Field>

                <Field label="Start Date">
                  <Input
                    value={exp.startDate}
                    onChange={(v) => updateItem<ExperienceEntry>("experience", exp.id, { startDate: v })}
                    placeholder="Jan 2022"
                  />
                </Field>

                <Field label="End Date">
                  <Input
                    value={exp.endDate}
                    onChange={(v) => updateItem<ExperienceEntry>("experience", exp.id, { endDate: v })}
                    placeholder="Dec 2024"
                    disabled={exp.current}
                  />
                </Field>

                <Field label="" className="flex items-center pt-5">
                  <label className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={exp.current}
                      onChange={(e) =>
                        updateItem<ExperienceEntry>("experience", exp.id, {
                          current: e.target.checked,
                        })
                      }
                      className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    />
                    Currently Working Here
                  </label>
                </Field>
              </div>

              <div className="mt-3">
                <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                  Description
                </label>
                <RichTextEditor
                  value={exp.description}
                  onChange={(v) =>
                    updateItem<ExperienceEntry>("experience", exp.id, { description: v })
                  }
                  placeholder="• Developed and maintained...&#10;• Led a team of 5 engineers..."
                  minHeight={100}
                />
              </div>
            </EntryCard>
          ))}

          <AddButton onClick={() => addItem("experience", newExp())}>
            + Add Work Experience
          </AddButton>
        </div>
      </SectionCard>

      {/* ── Education ── */}
      <SectionCard id="education" title="Education" icon="🎓">
        <div className="space-y-4">
          {data.education.map((edu, i) => (
            <EntryCard
              key={edu.id}
              index={i + 1}
              onDelete={() => removeItem("education", edu.id)}
            >
              <div className="grid grid-cols-2 gap-3">
                <Field label="Degree">
                  <Input
                    value={edu.degree}
                    onChange={(v) => updateItem<EducationEntry>("education", edu.id, { degree: v })}
                    placeholder="Bachelor of Science"
                  />
                </Field>

                <Field label="Field of Study">
                  <Input
                    value={edu.field}
                    onChange={(v) => updateItem<EducationEntry>("education", edu.id, { field: v })}
                    placeholder="Computer Science"
                  />
                </Field>

                <Field label="Institution" span="full">
                  <Input
                    value={edu.institution}
                    onChange={(v) =>
                      updateItem<EducationEntry>("education", edu.id, { institution: v })
                    }
                    placeholder="Massachusetts Institute of Technology"
                  />
                </Field>

                <Field label="Start Date">
                  <Input
                    value={edu.startDate}
                    onChange={(v) =>
                      updateItem<EducationEntry>("education", edu.id, { startDate: v })
                    }
                    placeholder="Sep 2018"
                  />
                </Field>

                <Field label="End Date">
                  <Input
                    value={edu.endDate}
                    onChange={(v) =>
                      updateItem<EducationEntry>("education", edu.id, { endDate: v })
                    }
                    placeholder="Jun 2022"
                    disabled={edu.current}
                  />
                </Field>

                <Field label="" className="flex items-center pt-5">
                  <label className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={edu.current}
                      onChange={(e) =>
                        updateItem<EducationEntry>("education", edu.id, {
                          current: e.target.checked,
                        })
                      }
                      className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    />
                    Currently Enrolled
                  </label>
                </Field>

                <Field label="GPA (optional)">
                  <Input
                    value={edu.gpa}
                    onChange={(v) => updateItem<EducationEntry>("education", edu.id, { gpa: v })}
                    placeholder="3.8 / 4.0"
                  />
                </Field>
              </div>
            </EntryCard>
          ))}

          <AddButton onClick={() => addItem("education", newEdu())}>
            + Add Education
          </AddButton>
        </div>
      </SectionCard>

      {/* ── Skills ── */}
      <SectionCard id="skills" title="Skills" icon="⚡">
        <SkillsInput
          skills={data.skills}
          onChange={(skills) => onChange({ ...data, skills })}
        />
      </SectionCard>

      {/* ── Projects ── */}
      <SectionCard id="projects" title="Projects" icon="🚀">
        <div className="space-y-4">
          {data.projects.map((proj, i) => (
            <EntryCard
              key={proj.id}
              index={i + 1}
              onDelete={() => removeItem("projects", proj.id)}
            >
              <div className="grid grid-cols-2 gap-3">
                <Field label="Project Name" span="full">
                  <Input
                    value={proj.name}
                    onChange={(v) => updateItem<ProjectEntry>("projects", proj.id, { name: v })}
                    placeholder="E-Commerce Platform"
                  />
                </Field>

                <Field label="Technologies Used" span="full">
                  <Input
                    value={proj.technologies}
                    onChange={(v) =>
                      updateItem<ProjectEntry>("projects", proj.id, { technologies: v })
                    }
                    placeholder="React, Node.js, MongoDB, Docker"
                  />
                </Field>

                <Field label="Project Link (optional)" span="full">
                  <Input
                    value={proj.link}
                    onChange={(v) => updateItem<ProjectEntry>("projects", proj.id, { link: v })}
                    placeholder="https://github.com/username/project"
                  />
                </Field>
              </div>

              <div className="mt-3">
                <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                  Description
                </label>
                <RichTextEditor
                  value={proj.description}
                  onChange={(v) =>
                    updateItem<ProjectEntry>("projects", proj.id, { description: v })
                  }
                  placeholder="Describe what the project does, your role, and key achievements..."
                  minHeight={90}
                />
              </div>
            </EntryCard>
          ))}

          <AddButton onClick={() => addItem("projects", newProj())}>
            + Add Project
          </AddButton>
        </div>
      </SectionCard>

      {/* ── Certifications ── */}
      <SectionCard id="certifications" title="Certifications" icon="🏆">
        <div className="space-y-3">
          {data.certifications.map((cert, i) => (
            <EntryCard
              key={cert.id}
              index={i + 1}
              onDelete={() => removeItem("certifications", cert.id)}
            >
              <div className="grid grid-cols-2 gap-3">
                <Field label="Certification Name" span="full">
                  <Input
                    value={cert.name}
                    onChange={(v) =>
                      updateItem<CertificationEntry>("certifications", cert.id, { name: v })
                    }
                    placeholder="AWS Certified Solutions Architect"
                  />
                </Field>

                <Field label="Issuing Organization">
                  <Input
                    value={cert.issuer}
                    onChange={(v) =>
                      updateItem<CertificationEntry>("certifications", cert.id, { issuer: v })
                    }
                    placeholder="Amazon Web Services"
                  />
                </Field>

                <Field label="Date Issued">
                  <Input
                    value={cert.date}
                    onChange={(v) =>
                      updateItem<CertificationEntry>("certifications", cert.id, { date: v })
                    }
                    placeholder="Mar 2024"
                  />
                </Field>
              </div>
            </EntryCard>
          ))}

          <AddButton onClick={() => addItem("certifications", newCert())}>
            + Add Certification
          </AddButton>
        </div>
      </SectionCard>
    </div>
  );
}


