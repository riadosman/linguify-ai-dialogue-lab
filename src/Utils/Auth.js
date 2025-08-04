import { jwtDecode } from "jwt-decode";

export const login = async (email, password) => {
  const res = await fetch("http://localhost:3000/api/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });
  const data = await res.json();
  localStorage.setItem("token", data.token);

  const decoded = jwtDecode(data.token);
  return {
    userId: decoded.userId,
    name: data.user.name,
    token: data.token,
    message: data.message,
  };
};
export const register = async (name, email, password) => {
  // Create User
  const res = await fetch("http://localhost:3000/api/auth/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name, email, password }),
  });
  const data = await res.json();
  if (!data.token) {
    console.log(data);
    return data;
  }
  localStorage.setItem("token", data.token);
  const decoded = jwtDecode(data.token);

  // Create Progress inital data in DB
  const resd = await fetch("http://localhost:3000/api/progress/create", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      userId: decoded.userId,
      conversationsCount: 0,
      wordsLearned: 0,
      streakDays: [],
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
      lastUpdated: "",
      learnedVocab: [],
    }),
  });

  return {
    userId: decoded.userId,
    token: data.token,
    message: data.message,
  };
};
