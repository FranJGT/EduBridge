"use client";

import { useState, useEffect } from "react";
import { useStudentStore } from "@/stores/student-store";

export function useOffline() {
  const [isOnline, setIsOnline] = useState(true);
  const setStoreOnline = useStudentStore((s) => s.setOnline);

  useEffect(() => {
    const update = () => {
      const online = navigator.onLine;
      setIsOnline(online);
      setStoreOnline(online);
    };

    update();
    window.addEventListener("online", update);
    window.addEventListener("offline", update);

    return () => {
      window.removeEventListener("online", update);
      window.removeEventListener("offline", update);
    };
  }, [setStoreOnline]);

  return isOnline;
}
