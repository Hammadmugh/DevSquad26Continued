/**
 * CVDocument — @react-pdf/renderer version of the CV.
 * This component is only used for PDF generation (never rendered in the browser UI).
 * It mirrors the visual design of CVPreview.tsx using react-pdf primitives.
 */
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
} from "@react-pdf/renderer";
import { CVData } from "../types/cv";

// ── Colours (same palette as CVPreview) ───────────────────────────────────────
const C = {
  slate950: "#020617",
  slate800: "#1e293b",
  slate600: "#475569",
  slate500: "#64748b",
  slate400: "#94a3b8",
  slate200: "#e2e8f0",
  indigo600: "#4f46e5",
  indigo500: "#6366f1",
  gray700: "#374151",
  blue50: "#eff6ff",
  blue200: "#bfdbfe",
  blue800: "#1e40af",
  white: "#ffffff",
};

// ── Styles ────────────────────────────────────────────────────────────────────
const s = StyleSheet.create({
  page: {
    fontFamily: "Helvetica",
    fontSize: 9.5,
    color: C.slate800,
    backgroundColor: C.white,
    paddingTop: "14mm",
    paddingBottom: "14mm",
    paddingLeft: "18mm",
    paddingRight: "18mm",
    lineHeight: 1.55,
  },

  // Header
  headerName: {
    fontSize: 24,
    fontFamily: "Helvetica-Bold",
    color: C.slate950,
    marginBottom: 2,
    letterSpacing: 0.3,
  },
  headerTitle: {
    fontSize: 11.5,
    fontFamily: "Helvetica-Bold",
    color: C.indigo600,
    marginBottom: 4,
  },
  contactRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    fontSize: 8.5,
    color: C.slate500,
    borderTopWidth: 2,
    borderTopColor: C.indigo600,
    paddingTop: 4,
    gap: 10,
    marginBottom: "8mm",
  },
  contactItem: { marginRight: 8 },

  // Section
  section: { marginBottom: "7mm" },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: "3.5mm",
  },
  sectionBar: {
    width: 3,
    height: 14,
    backgroundColor: C.indigo600,
    borderRadius: 2,
    marginRight: 6,
  },
  sectionTitle: {
    fontSize: 8,
    fontFamily: "Helvetica-Bold",
    color: C.slate600,
    textTransform: "uppercase",
    letterSpacing: 1.2,
    flex: 1,
    borderBottomWidth: 1,
    borderBottomColor: C.slate200,
    paddingBottom: 2,
  },

  // Entry row shared
  entryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  entryLeft: { flex: 1 },
  entryRight: { alignItems: "flex-end" },

  // Experience / Education
  entryTitle: {
    fontSize: 10.5,
    fontFamily: "Helvetica-Bold",
    color: C.slate950,
  },
  entrySub: { fontSize: 9.5, color: C.slate600, marginTop: 1 },
  entryDate: { fontSize: 8.5, color: C.slate400, marginTop: 2 },
  entryDesc: { fontSize: 9.5, color: C.gray700, marginTop: 3 },

  // Skills badges
  skillsWrap: { flexDirection: "row", flexWrap: "wrap", gap: 4 },
  skillBadge: {
    backgroundColor: C.blue50,
    borderWidth: 1,
    borderColor: C.blue200,
    borderRadius: 3,
    paddingHorizontal: 6,
    paddingVertical: 2,
    fontSize: 8.5,
    color: C.blue800,
  },

  // Projects
  projRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "baseline",
  },
  projName: {
    fontSize: 10.5,
    fontFamily: "Helvetica-Bold",
    color: C.slate950,
  },
  projLink: { fontSize: 8.5, color: C.indigo600 },
  projTech: { fontSize: 8.5, color: C.indigo500, fontFamily: "Helvetica-Oblique", marginTop: 1 },

  // Certifications
  certRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "baseline",
    marginBottom: 4,
  },
  certName: { fontSize: 10, fontFamily: "Helvetica-Bold", color: C.slate950 },
  certIssuer: { fontSize: 9.5, color: C.slate600 },
  certDate: { fontSize: 8.5, color: C.slate400 },

  mb5: { marginBottom: "5mm" },
  mb4: { marginBottom: "4mm" },
  mb2: { marginBottom: "2mm" },
});

// ── Helpers ───────────────────────────────────────────────────────────────────

/** Strip HTML tags and decode basic entities for plain-text rendering in PDF */
function stripHtml(html: string): string {
  return html
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/p>/gi, "\n")
    .replace(/<\/div>/gi, "\n")
    .replace(/<\/li>/gi, "\n")
    .replace(/<li[^>]*>/gi, "• ")
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function isEmpty(html: string) {
  return !html || html === "<br>" || html === "<div><br></div>";
}

function SectionHeader({ title }: { title: string }) {
  return (
    <View style={s.sectionHeader}>
      <View style={s.sectionBar} />
      <Text style={s.sectionTitle}>{title}</Text>
    </View>
  );
}

// ── Main document ─────────────────────────────────────────────────────────────
export default function CVDocument({ data }: { data: CVData }) {
  const { personal, summary, experience, education, skills, projects, certifications } = data;

  const hasContact =
    personal.email || personal.phone || personal.location ||
    personal.linkedin || personal.github || personal.website;

  return (
    <Document>
      <Page size="A4" style={s.page}>

        {/* ── Header ── */}
        <Text style={s.headerName}>{personal.fullName || "Your Full Name"}</Text>
        {personal.jobTitle && <Text style={s.headerTitle}>{personal.jobTitle}</Text>}
        {hasContact && (
          <View style={s.contactRow}>
            {personal.email    && <Text style={s.contactItem}>✉ {personal.email}</Text>}
            {personal.phone    && <Text style={s.contactItem}>☎ {personal.phone}</Text>}
            {personal.location && <Text style={s.contactItem}>📍 {personal.location}</Text>}
            {personal.linkedin && <Text style={s.contactItem}>in {personal.linkedin}</Text>}
            {personal.github   && <Text style={s.contactItem}>⌨ {personal.github}</Text>}
            {personal.website  && <Text style={s.contactItem}>🌐 {personal.website}</Text>}
          </View>
        )}

        {/* ── Summary ── */}
        {!isEmpty(summary) && (
          <View style={s.section}>
            <SectionHeader title="Professional Summary" />
            <Text style={s.entryDesc}>{stripHtml(summary)}</Text>
          </View>
        )}

        {/* ── Experience ── */}
        {experience.length > 0 && (
          <View style={s.section}>
            <SectionHeader title="Work Experience" />
            {experience.map((exp, i) => (
              <View key={exp.id} style={i < experience.length - 1 ? s.mb5 : undefined}>
                <View style={s.entryRow}>
                  <View style={s.entryLeft}>
                    <Text style={s.entryTitle}>{exp.position || "Position Title"}</Text>
                    <Text style={s.entrySub}>
                      {exp.company || "Company"}{exp.location ? ` · ${exp.location}` : ""}
                    </Text>
                  </View>
                  <Text style={s.entryDate}>
                    {exp.startDate || "Start"} – {exp.current ? "Present" : exp.endDate || "End"}
                  </Text>
                </View>
                {!isEmpty(exp.description) && (
                  <Text style={s.entryDesc}>{stripHtml(exp.description)}</Text>
                )}
              </View>
            ))}
          </View>
        )}

        {/* ── Education ── */}
        {education.length > 0 && (
          <View style={s.section}>
            <SectionHeader title="Education" />
            {education.map((edu, i) => (
              <View key={edu.id} style={i < education.length - 1 ? s.mb4 : undefined}>
                <View style={s.entryRow}>
                  <View style={s.entryLeft}>
                    <Text style={s.entryTitle}>
                      {edu.degree || "Degree"}{edu.field ? ` in ${edu.field}` : ""}
                    </Text>
                    <Text style={s.entrySub}>{edu.institution || "Institution"}</Text>
                  </View>
                  <View style={s.entryRight}>
                    <Text style={s.entryDate}>
                      {edu.startDate || "Start"} – {edu.current ? "Present" : edu.endDate || "End"}
                    </Text>
                    {edu.gpa ? <Text style={s.entryDate}>GPA: {edu.gpa}</Text> : null}
                  </View>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* ── Skills ── */}
        {skills.length > 0 && (
          <View style={s.section}>
            <SectionHeader title="Skills" />
            <View style={s.skillsWrap}>
              {skills.map((skill) => (
                <View key={skill.id} style={s.skillBadge}>
                  <Text>{skill.name}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* ── Projects ── */}
        {projects.length > 0 && (
          <View style={s.section}>
            <SectionHeader title="Projects" />
            {projects.map((proj, i) => (
              <View key={proj.id} style={i < projects.length - 1 ? s.mb4 : undefined}>
                <View style={s.projRow}>
                  <Text style={s.projName}>{proj.name || "Project Name"}</Text>
                  {proj.link ? <Text style={s.projLink}>{proj.link}</Text> : null}
                </View>
                {proj.technologies ? <Text style={s.projTech}>{proj.technologies}</Text> : null}
                {!isEmpty(proj.description) && (
                  <Text style={s.entryDesc}>{stripHtml(proj.description)}</Text>
                )}
              </View>
            ))}
          </View>
        )}

        {/* ── Certifications ── */}
        {certifications.length > 0 && (
          <View style={s.section}>
            <SectionHeader title="Certifications" />
            {certifications.map((cert) => (
              <View key={cert.id} style={s.certRow}>
                <View>
                  <Text>
                    <Text style={s.certName}>{cert.name || "Certification"}</Text>
                    {cert.issuer ? <Text style={s.certIssuer}> — {cert.issuer}</Text> : null}
                  </Text>
                </View>
                {cert.date ? <Text style={s.certDate}>{cert.date}</Text> : null}
              </View>
            ))}
          </View>
        )}

      </Page>
    </Document>
  );
}
