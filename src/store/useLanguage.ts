// src/store/useCounter.ts
import { create } from "zustand";

type LanguageState = {
  targetLanguage: string;
  setTargetLanguage: (language: string) => void;
  sourceLanguage: string;
  setSourceLanguage: (language: string) => void;
  level: "beginner" | "intermediate" | "advanced";
  setLevel: (level: "beginner" | "intermediate" | "advanced") => void;
};

export const useLanguage = create<LanguageState>((set) => ({
  targetLanguage: {
    code: "es",
    name: "Spanish",
    flag: "🇪🇸",
  },
  setTargetLanguage: (language) => set({ targetLanguage: language }),
  sourceLanguage: {
    code: "en",
    name: "English",
    flag: "en",
  },
  setSourceLanguage: (language) => set({ sourceLanguage: language }),
  level: "beginner",
  setLevel: (level) => set({ level }),
}));
