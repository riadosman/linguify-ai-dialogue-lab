import { create } from "zustand";

export interface Achievement {
  name: string;
  date: string;
  icon: string;
}

export interface WeeklyProgressDay {
  conversations: number;
  words: number;
}

export interface Goals {
  conversationComplete: boolean;
  wordsLearnedToday: number;
  studyMinutesToday: number;
}

export interface UserProgress {
  userId: string;
  conversationsCount: number;
  wordsLearned: number;
  streakDays: number;
  studyTimeMinutes: number;
  weeklyProgress: Record<string, WeeklyProgressDay>; // Mon–Sun
  achievements: Achievement[];
  goals: Goals;
  language: string;
  skillLevel: string;
  lastUpdated: string;
}

interface UserProgressState {
  progress: UserProgress;
  setProgress: (data: Partial<UserProgress>) => void;
  resetProgress: () => void;
  learnedVocab: string[];
  setLearnedVocab: (data: string[]) => void;
}
export const useUserProgress = create<UserProgressState>((set) => ({
  progress: {
    userId: "64f2b1c8b6e3d9f8a1234567",
    conversationsCount: 27,
    streakDays: ["7/27/2025", "7/28/2025", "7/29/2025", "7/30/2025"],
    studyTimeMinutes: 720,
    weeklyProgress: {
      Mon: { conversations: 3, words: 12 },
      Tue: { conversations: 2, words: 8 },
      Wed: { conversations: 4, words: 15 },
      Thu: { conversations: 2, words: 20 },
      Fri: { conversations: 3, words: 11 },
      Sat: { conversations: 2, words: 7 },
      Sun: { conversations: 4, words: 16 },
    },
    achievements: [
      { name: "First Conversation", date: "Today", icon: "🎯" },
      { name: "5 Day Streak", date: "Yesterday", icon: "🔥" },
      { name: "50 Words Learned", date: "2 days ago", icon: "⭐" },
    ],
    goals: {
      conversationComplete: true,
      wordsLearnedToday: 7,
      studyMinutesToday: 12,
    },
    language: "French",
    skillLevel: "Beginner",
    lastUpdated: new Date().toISOString(),
  },

  setProgress: (data) =>
    set((state) => ({
      progress: {
        ...state.progress,
        ...data,
        lastUpdated: new Date().toISOString(),
      },
    })),

  resetProgress: () =>
    set(() => ({
      progress: {
        userId: "",
        conversationsCount: 0,
        wordsLearned: 0,
        streakDays: 0,
        studyTimeMinutes: 0,
        weeklyProgress: {
          Mon: { conversations: 0, words: 0 },
          Tue: { conversations: 0, words: 0 },
          Wed: { conversations: 0, words: 0 },
          Thu: { conversations: 0, words: 0 },
          Fri: { conversations: 0, words: 0 },
          Sat: { conversations: 0, words: 0 },
          Sun: { conversations: 0, words: 0 },
        },
        achievements: [],
        goals: {
          conversationComplete: false,
          wordsLearnedToday: 0,
          studyMinutesToday: 0,
        },
        language: "",
        skillLevel: "",
        lastUpdated: new Date().toISOString(),
      },
    })),
  learnedVocab: [],
  setLearnedVocab: (data) =>
    set((state) => ({
      learnedVocab: [...state.learnedVocab, data],
    })),
}));
