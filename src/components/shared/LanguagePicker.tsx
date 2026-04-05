"use client";

import { SUPPORTED_LANGUAGES } from "@/lib/i18n";
import { useStudentStore } from "@/stores/student-store";

export function LanguagePicker() {
  const language = useStudentStore((s) => s.language);
  const setLanguage = useStudentStore((s) => s.setLanguage);

  return (
    <div className="flex flex-wrap gap-2">
      {SUPPORTED_LANGUAGES.map((lang) => (
        <button
          key={lang.code}
          onClick={() => setLanguage(lang.code)}
          className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-sm font-medium transition-colors ${
            language === lang.code
              ? "bg-primary text-white border-primary"
              : "bg-card border-border text-foreground hover:border-primary"
          }`}
        >
          <span>{lang.flag}</span>
          <span>{lang.name}</span>
        </button>
      ))}
    </div>
  );
}
