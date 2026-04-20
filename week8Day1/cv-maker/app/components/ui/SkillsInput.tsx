"use client";

import { useRef } from "react";
import { SkillEntry } from "../../types/cv";

const genId = () => `${Date.now()}-${Math.random().toString(36).slice(2)}`;

interface Props {
  skills: SkillEntry[];
  onChange: (skills: SkillEntry[]) => void;
}

export default function SkillsInput({ skills, onChange }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);

  const addSkill = (name: string) => {
    const trimmed = name.trim();
    if (!trimmed) return;
    if (skills.some((s) => s.name.toLowerCase() === trimmed.toLowerCase())) return;
    onChange([...skills, { id: genId(), name: trimmed }]);
    if (inputRef.current) inputRef.current.value = "";
  };

  const removeSkill = (id: string) => onChange(skills.filter((s) => s.id !== id));

  return (
    <div>
      <div className="flex gap-2 mb-3">
        <input
          ref={inputRef}
          type="text"
          placeholder="Type a skill and press Enter or click Add"
          className="flex-1 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm
            bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500
            focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              addSkill((e.target as HTMLInputElement).value);
            }
          }}
        />
        <button
          type="button"
          onClick={() => inputRef.current && addSkill(inputRef.current.value)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
        >
          Add
        </button>
      </div>

      {skills.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {skills.map((skill) => (
            <span
              key={skill.id}
              className="flex items-center gap-1.5 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-700 px-3 py-1 rounded-full text-sm"
            >
              {skill.name}
              <button
                type="button"
                onClick={() => removeSkill(skill.id)}
                className="text-indigo-400 hover:text-red-500 font-bold leading-none transition-colors"
                title="Remove skill"
              >
                ×
              </button>
            </span>
          ))}
        </div>
      ) : (
        <p className="text-sm text-gray-400 dark:text-gray-600 text-center py-4 border border-dashed border-gray-200 dark:border-gray-700 rounded-lg">
          No skills added yet — type above and press Enter
        </p>
      )}
    </div>
  );
}
