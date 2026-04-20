"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { CVData, defaultCVData } from "./types/cv";
import CVForm from "./components/CVForm";
import CVPreview from "./components/CVPreview";
import { useTheme } from "./components/ThemeProvider";

const STORAGE_KEY = "cv-maker-data";

const NAV_SECTIONS = [
  { id: "personal", label: "Personal Info" },
  { id: "summary", label: "Summary" },
  { id: "experience", label: "Experience" },
  { id: "education", label: "Education" },
  { id: "skills", label: "Skills" },
  { id: "projects", label: "Projects" },
  { id: "certifications", label: "Certifications" },
];

export default function Home() {
  const [cvData, setCvData] = useState<CVData>(defaultCVData);
  const [saved, setSaved] = useState(false);
  const { theme, toggle } = useTheme();

  /* Load from localStorage on mount */
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) setCvData(JSON.parse(stored));
    } catch {
      /* ignore */
    }
  }, []);

  /* Persist to localStorage on every change */
  const updateCVData = useCallback((data: CVData) => {
    setCvData(data);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      setSaved(true);
      setTimeout(() => setSaved(false), 1500);
    } catch {
      /* ignore */
    }
  }, []);

  /* PDF export — clones #cv-preview into a top-level container so the
     PreviewScaler transform doesn't interfere with the print layout,
     then calls window.print(). The @media print CSS shows only #print-clone. */
  const handleDownloadPDF = () => {
    const source = document.getElementById("cv-preview");
    if (!source) return;

    const container = document.createElement("div");
    container.id = "print-clone";

    // Wrap in a padding div — box-decoration-break:clone repeats the
    // padding on every printed page so spacing is consistent throughout
    const wrapper = document.createElement("div");
    wrapper.id = "print-wrapper";
    wrapper.innerHTML = source.outerHTML;
    container.appendChild(wrapper);
    document.body.appendChild(container);

    const cleanup = () => {
      document.body.removeChild(container);
      window.removeEventListener("afterprint", cleanup);
    };
    window.addEventListener("afterprint", cleanup);

    window.print();
  };

  const scrollTo = (id: string) =>
    document.getElementById(`form-${id}`)?.scrollIntoView({ behavior: "smooth", block: "start" });

  const clearData = () => {
    if (confirm("Clear all CV data? This cannot be undone.")) {
      setCvData(defaultCVData);
      localStorage.removeItem(STORAGE_KEY);
    }
  };

  return (
    <div className="h-screen flex flex-col bg-gray-50 dark:bg-gray-950">
      {/* ── Header ── */}
      <header className="flex-none h-14 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between px-5 z-10 shadow-sm">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white text-xs font-black tracking-tight">
            CV
          </div>
          <span className="font-bold text-gray-900 dark:text-white text-lg">CV Maker</span>
          {saved && (
            <span className="text-xs text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/30 px-2 py-0.5 rounded-full border border-green-200 dark:border-green-800 animate-pulse">
              ✓ Saved
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={clearData}
            className="text-gray-400 dark:text-gray-500 hover:text-red-500 dark:hover:text-red-400 text-sm px-3 py-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
          >
            Clear
          </button>
          <button
            onClick={toggle}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-base"
            title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
          >
            {theme === "dark" ? "☀️" : "🌙"}
          </button>
          <button
            onClick={handleDownloadPDF}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700
              text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm"
          >
            ⬇ Download PDF
          </button>
        </div>
      </header>

      {/* ── Body ── */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar nav */}
        <nav className="flex-none w-44 bg-white dark:bg-gray-900 border-r border-gray-100 dark:border-gray-700 py-5 px-3 overflow-y-auto hidden md:block">
          <p className="text-[10px] font-bold text-gray-400 dark:text-gray-600 uppercase tracking-widest px-3 mb-3">
            Sections
          </p>
          {NAV_SECTIONS.map((s) => (
            <button
              key={s.id}
              onClick={() => scrollTo(s.id)}
              className="w-full text-left text-sm text-gray-600 dark:text-gray-400 hover:text-indigo-700 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/30
                px-3 py-2 rounded-lg transition-colors mb-0.5"
            >
              {s.label}
            </button>
          ))}
        </nav>

        {/* Form panel */}
        <main className="flex-1 overflow-y-auto px-4 py-6 lg:px-6 bg-gray-50 dark:bg-gray-950">
          <CVForm data={cvData} onChange={updateCVData} />
        </main>

        {/* Live preview panel */}
        <aside className="flex-none w-[46%] overflow-y-auto bg-slate-200 dark:bg-gray-800 px-6 py-6 hidden xl:block">
          <p className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-4">
            Live Preview
          </p>
          {/* Scale the 210mm (≈794px) preview to fit the panel width */}
          <PreviewScaler>
            <CVPreview data={cvData} />
          </PreviewScaler>
          <p className="text-xs text-gray-400 dark:text-gray-500 text-center mt-4">
            A4 · 210 × 297 mm
          </p>
        </aside>
      </div>
    </div>
  );
}

// ── Scales the 210mm-wide CVPreview to fill its container ────────────────────
function PreviewScaler({ children }: { children: React.ReactNode }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const A4_PX = 794; // 210mm at 96dpi

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const update = () => setScale(el.clientWidth / A4_PX);
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return (
    <div ref={containerRef} className="w-full">
      <div
        style={{
          width: A4_PX,
          transformOrigin: "top left",
          transform: `scale(${scale})`,
          height: Math.round(A4_PX * 1.4142 * scale), // A4 aspect ratio collapsed
        }}
        className="shadow-2xl ring-1 ring-black/5"
      >
        {children}
      </div>
      {/* Spacer so the container height matches the scaled content */}
      <div style={{ height: Math.round(A4_PX * 1.4142 * scale) }} />
    </div>
  );
}


