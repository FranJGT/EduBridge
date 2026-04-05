"use client";

import { useOffline } from "@/hooks/useOffline";
import { useStudentStore } from "@/stores/student-store";
import { t } from "@/lib/i18n";

export function OfflineIndicator() {
  const isOnline = useOffline();
  const aiProvider = useStudentStore((s) => s.aiProvider);
  const language = useStudentStore((s) => s.language);

  return (
    <div className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 py-1.5 text-xs font-medium bg-card border-b border-border">
      <div className="flex items-center gap-2">
        <span
          className={`w-2 h-2 rounded-full ${isOnline ? "bg-success" : "bg-secondary"}`}
        />
        <span className="text-muted">
          {isOnline ? t("status.online", language) : t("status.offline", language)}
        </span>
      </div>
      <div className="text-muted">{aiProvider}</div>
    </div>
  );
}
