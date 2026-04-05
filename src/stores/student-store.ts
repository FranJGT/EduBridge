import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface StudentState {
  studentId: string | null;
  studentName: string;
  language: string;
  age: number;
  diagnosticLevel: number;
  totalStars: number;
  streak: number;
  currentTopic: string;
  currentSessionId: number | null;
  isOnline: boolean;
  aiProvider: string;
  worldProgress: Record<string, number>;

  setStudent: (id: string, name: string) => void;
  setLanguage: (lang: string) => void;
  setAge: (age: number) => void;
  setDiagnosticLevel: (level: number) => void;
  addStars: (amount: number) => void;
  setStreak: (count: number) => void;
  setCurrentTopic: (topic: string) => void;
  setSessionId: (id: number | null) => void;
  setOnline: (online: boolean) => void;
  setAIProvider: (provider: string) => void;
  updateWorldProgress: (topic: string, value: number) => void;
  reset: () => void;
}

const initialState = {
  studentId: null as string | null,
  studentName: "",
  language: "en",
  age: 8,
  diagnosticLevel: 1,
  totalStars: 0,
  streak: 0,
  currentTopic: "addition",
  currentSessionId: null as number | null,
  isOnline: true,
  aiProvider: "detecting...",
  worldProgress: {} as Record<string, number>,
};

export const useStudentStore = create<StudentState>()(
  persist(
    (set) => ({
      ...initialState,

      setStudent: (id, name) => set({ studentId: id, studentName: name }),
      setLanguage: (lang) => set({ language: lang }),
      setAge: (age) => set({ age }),
      setDiagnosticLevel: (level) => set({ diagnosticLevel: level }),
      addStars: (amount) =>
        set((s) => ({ totalStars: s.totalStars + amount })),
      setStreak: (count) => set({ streak: count }),
      setCurrentTopic: (topic) => set({ currentTopic: topic }),
      setSessionId: (id) => set({ currentSessionId: id }),
      setOnline: (online) => set({ isOnline: online }),
      setAIProvider: (provider) => set({ aiProvider: provider }),
      updateWorldProgress: (topic, value) =>
        set((s) => ({
          worldProgress: { ...s.worldProgress, [topic]: value },
        })),
      reset: () => set(initialState),
    }),
    {
      name: "edubridge-student",
      storage: createJSONStorage(() =>
        typeof window !== "undefined"
          ? localStorage
          : {
              getItem: () => null,
              setItem: () => {},
              removeItem: () => {},
            }
      ),
    }
  )
);
