import { create } from "zustand";
import { persist } from "zustand/middleware";
import { useUserProgress } from "@/store/useUserData";
import { updateStreak } from "@/lib/updateStreak";

type AuthState = {
  token: string | null;
  setToken: (token: string) => void;
  user: string | null;
  setUser: (user: string) => void;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  handleLogout: () => Promise<void>;
};

export const useAuth = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      setToken: (token) => set({ token }),
      user: null,
      setUser: (user) => set({ user }),

      login: async (email, password) => {
        const { progress, setProgress } = useUserProgress.getState();
        setInterval(() => {
          setProgress({
            studyTimeMinutes: progress.studyTimeMinutes + 1,
          });
        }, 600);
        const today = new Date();
        const dayShort = today.toLocaleDateString("en-US", {
          weekday: "short",
        });
        setProgress({
          weeklyProgress: {
            ...progress.weeklyProgress,
            [dayShort]: {
              conversations:
                progress.weeklyProgress[dayShort].conversations + 1,
              words: progress.weeklyProgress[dayShort].words,
            },
          },
        });
        setProgress({ streakDays: updateStreak(progress.streakDays) });

        // Save token to state (will persist via zustand)
        set({ token: "mock-token", user: email });
      },

      signup: async (name, email, password) => {
        console.log(`Signing up with email: ${email}`);
        console.log(`Password: ${password}`);
        console.log(`Name: ${name}`);
        set({ token: "mock-token", user: email });
      },

      handleLogout: async () => {
        console.log("Handle Logout");
        set({ token: null, user: null });
      },
    }),
    {
      name: "auth-storage", // localStorage key
      partialize: (state) => ({
        token: state.token,
        user: state.user,
      }),
    }
  )
);
