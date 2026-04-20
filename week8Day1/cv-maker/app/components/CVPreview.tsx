import { CVData } from "../types/cv";

interface Props {
  data: CVData;
}

export default function CVPreview({ data }: Props) {
  const { personal, summary, experience, education, skills, projects, certifications } = data;

  const hasContact =
    personal.email ||
    personal.phone ||
    personal.location ||
    personal.linkedin ||
    personal.github ||
    personal.website;

  const isEmptySummary = !summary || summary === "<br>" || summary === "<div><br></div>";

  return (
    <div
      id="cv-preview"
      // fontFamily kept as inline — Tailwind has no Segoe UI utility
      style={{ fontFamily: "'Segoe UI', Arial, sans-serif" }}
      className="bg-white text-[9.5pt] leading-[1.55] text-slate-800 py-[14mm] px-[18mm] min-h-[297mm] w-[210mm] box-border"
    >
      {/* Embedded styles for rich-content (contentEditable HTML) */}
      <style>{`
        #cv-preview .rich-content ul {
          list-style: disc;
          padding-left: 1.25rem;
          margin: 0.2rem 0;
        }
        #cv-preview .rich-content ol {
          list-style: decimal;
          padding-left: 1.25rem;
          margin: 0.2rem 0;
        }
        #cv-preview .rich-content li { margin: 0.1rem 0; }
        #cv-preview .rich-content b,
        #cv-preview .rich-content strong { font-weight: 700; }
        #cv-preview .rich-content i,
        #cv-preview .rich-content em { font-style: italic; }
        #cv-preview .rich-content u { text-decoration: underline; }
        #cv-preview .rich-content p { margin: 0.15rem 0; }
      `}</style>

      {/* ── Header ── */}
      <div className="mb-[8mm]">
        <h1 className="text-[24pt] font-extrabold tracking-[0.01em] text-slate-950 m-0 mb-[1.5mm]">
          {personal.fullName || "Your Full Name"}
        </h1>

        {personal.jobTitle && (
          <p className="text-[11.5pt] font-semibold text-indigo-600 m-0 mb-[3mm]">
            {personal.jobTitle}
          </p>
        )}

        {hasContact && (
          <div className="flex flex-wrap gap-x-3.5 gap-y-0 text-[8.5pt] text-slate-500 pt-[3mm] border-t-2 border-indigo-600">
            {personal.email && <span>✉ {personal.email}</span>}
            {personal.phone && <span>☎ {personal.phone}</span>}
            {personal.location && <span>📍 {personal.location}</span>}
            {personal.linkedin && <span>in {personal.linkedin}</span>}
            {personal.github && <span>⌨ {personal.github}</span>}
            {personal.website && <span>🌐 {personal.website}</span>}
          </div>
        )}
      </div>

      {/* ── Summary ── */}
      {!isEmptySummary && (
        <CVSection title="Professional Summary">
          <div
            dangerouslySetInnerHTML={{ __html: summary }}
            className="text-[9.5pt] text-gray-700 rich-content"
          />
        </CVSection>
      )}

      {/* ── Experience ── */}
      {experience.length > 0 && (
        <CVSection title="Work Experience">
          {experience.map((exp, i) => {
            const emptyDesc =
              !exp.description ||
              exp.description === "<br>" ||
              exp.description === "<div><br></div>";
            return (
              <div key={exp.id} className={i < experience.length - 1 ? "mb-[5mm]" : ""}>
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-bold text-[10.5pt] text-slate-950 m-0">
                      {exp.position || "Position Title"}
                    </p>
                    <p className="text-slate-600 text-[9.5pt] mt-px m-0">
                      {exp.company || "Company"}
                      {exp.location ? ` · ${exp.location}` : ""}
                    </p>
                  </div>
                  <p className="text-[8.5pt] text-slate-400 whitespace-nowrap ml-2 mt-0.5">
                    {exp.startDate || "Start"} – {exp.current ? "Present" : exp.endDate || "End"}
                  </p>
                </div>
                {!emptyDesc && (
                  <div
                    dangerouslySetInnerHTML={{ __html: exp.description }}
                    className="mt-[2mm] text-[9.5pt] text-gray-700 rich-content"
                  />
                )}
              </div>
            );
          })}
        </CVSection>
      )}

      {/* ── Education ── */}
      {education.length > 0 && (
        <CVSection title="Education">
          {education.map((edu, i) => (
            <div key={edu.id} className={i < education.length - 1 ? "mb-[4mm]" : ""}>
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-bold text-[10.5pt] text-slate-950 m-0">
                    {edu.degree || "Degree"}
                    {edu.field ? ` in ${edu.field}` : ""}
                  </p>
                  <p className="text-slate-600 text-[9.5pt] mt-px m-0">
                    {edu.institution || "Institution"}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-[8.5pt] text-slate-400 whitespace-nowrap m-0">
                    {edu.startDate || "Start"} – {edu.current ? "Present" : edu.endDate || "End"}
                  </p>
                  {edu.gpa && (
                    <p className="text-[8.5pt] text-slate-400 mt-px m-0">
                      GPA: {edu.gpa}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </CVSection>
      )}

      {/* ── Skills ── */}
      {skills.length > 0 && (
        <CVSection title="Skills">
          <div className="flex flex-wrap gap-1">
            {skills.map((skill) => (
              <span
                key={skill.id}
                className="inline-flex items-center bg-blue-50 border border-blue-200 rounded text-[8.5pt] leading-none text-blue-800 px-2 py-0.75"
              >
                {skill.name}
              </span>
            ))}
          </div>
        </CVSection>
      )}

      {/* ── Projects ── */}
      {projects.length > 0 && (
        <CVSection title="Projects">
          {projects.map((proj, i) => (
            <div key={proj.id} className={i < projects.length - 1 ? "mb-[4mm]" : ""}>
              <div className="flex justify-between items-baseline">
                <p className="font-bold text-[10.5pt] text-slate-950 m-0">
                  {proj.name || "Project Name"}
                </p>
                {proj.link && (
                  <span className="text-[8.5pt] text-indigo-600">{proj.link}</span>
                )}
              </div>
              {proj.technologies && (
                <p className="text-[8.5pt] text-indigo-500 italic mt-px m-0">
                  {proj.technologies}
                </p>
              )}
              {proj.description && (
                <div
                  dangerouslySetInnerHTML={{ __html: proj.description }}
                  className="text-[9.5pt] text-gray-700 mt-[1.5mm] rich-content"
                />
              )}
            </div>
          ))}
        </CVSection>
      )}

      {/* ── Certifications ── */}
      {certifications.length > 0 && (
        <CVSection title="Certifications">
          {certifications.map((cert) => (
            <div key={cert.id} className="flex justify-between items-baseline mb-[2mm]">
              <div>
                <span className="font-semibold text-[10pt] text-slate-950">
                  {cert.name || "Certification"}
                </span>
                {cert.issuer && (
                  <span className="text-slate-600 text-[9.5pt]"> — {cert.issuer}</span>
                )}
              </div>
              {cert.date && (
                <span className="text-[8.5pt] text-slate-400 whitespace-nowrap">
                  {cert.date}
                </span>
              )}
            </div>
          ))}
        </CVSection>
      )}
    </div>
  );
}

function CVSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-[7mm]">
      <div className="flex items-center gap-1.5 mb-[3.5mm]">
        <div className="w-0.75 h-3.5 bg-indigo-600 rounded-xs shrink-0" />
        <h2 className="text-[8pt] font-bold uppercase tracking-[0.12em] text-slate-600 m-0 flex-1 pb-0.5 border-b border-slate-200">
          {title}
        </h2>
      </div>
      {children}
    </div>
  );
}
