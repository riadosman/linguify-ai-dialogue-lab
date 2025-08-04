"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Sparkles, CheckCircle } from "lucide-react";
import { useLanguage } from "@/store/useLanguage";
import { useUserProgress } from "@/store/useUserData";

interface VocabularyCard {
  word: string;
  type: string;
  definition: string;
  example: string;
  learned?: boolean;
}

export const VocabularyPage = () => {
  const { targetLanguage, sourceLanguage, level } = useLanguage();
  const { setProgress, setLearnedVocab, learnedVocab } = useUserProgress();
  const [vocabulary, setVocabulary] = useState<VocabularyCard[]>([]);
  const [reGenerate, setReGenerate] = useState(false);
  const token = localStorage.getItem("token") || "";
  useEffect(() => {
    const fetchVocabulary = async () => {
      if (!sourceLanguage || !targetLanguage || !level) return;
      setVocabulary([]);
      try {
        const fresponse = await fetch(
          "http://localhost:3000/api/learnedVocab",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: token,
            },
          }
        );
        const fdata = await fresponse.json();
        const response = await fetch(
          "https://n8n.180d.tr/webhook/generatewords",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              sourcelanguage: sourceLanguage.name,
              targetlanguage: targetLanguage.name,
              level: level,
              learnedVocab: fdata.learnedVocab,
            }),
          }
        );
        const data = await response.json();
        setVocabulary(data);
      } catch (error) {
        console.error("Error fetching vocabulary:", error);
      }
    };
    const sendLearnedVocab = async () => {
      if (!token) return;
      const response = await fetch("http://localhost:3000/api/learnedVocab", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify({ learnedVocab }),
      });
      const data = await response.json();
      console.log(data);
    };
    fetchVocabulary();
    sendLearnedVocab();
  }, [reGenerate]);

  return (
    <div className="p-4 lg:p-6 space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-xl lg:text-2xl font-bold text-gray-900">
            Vocabulary Cards
          </h1>
          <p className="text-gray-600 text-sm lg:text-base">
            Learn new {targetLanguage.name} words and see them in action
          </p>
        </div>
        <button
          className="bg-indigo-500 hover:bg-indigo-600 text-white py-2 px-4 rounded mt-4 flex items-center gap-2"
          onClick={() => {
            setReGenerate(!reGenerate);
          }}
        >
          <Sparkles className="h-6 w-6 text-white" />
          Re Generate Cards
        </button>
      </div>

      {vocabulary.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {vocabulary.map((item, index) => (
            <Card key={index} className="p-5 flex flex-col justify-between">
              <div className="mb-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-gray-900">
                    {item.word}
                  </h2>
                  <Badge className="text-xs capitalize">{item.type}</Badge>
                </div>
                <p className="text-gray-700 mt-2 text-sm">{item.definition}</p>
              </div>
              <div className="mt-auto space-y-2">
                <div className="bg-gray-50 p-3 rounded text-sm text-gray-600 italic">
                  “{item.example}”
                </div>
                <Button
                  variant={
                    learnedVocab.includes(item.word) ? "default" : "outline"
                  }
                  onClick={() => {
                    setLearnedVocab(item.word);
                    const today = new Date();
                    const todayKey = today.toLocaleDateString("en-US", {
                      weekday: "short",
                    });

                    setProgress((prev) => ({
                      ...prev,
                      weeklyProgress: {
                        ...prev.weeklyProgress,
                        [todayKey]: {
                          ...prev.weeklyProgress[todayKey],
                          words: prev.weeklyProgress[todayKey].words + 1,
                        },
                      },
                    }));
                  }}
                  className="w-full text-sm flex items-center justify-center gap-2"
                >
                  <CheckCircle className="h-4 w-4" />
                  Mark as Learned
                </Button>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(12)].map((_, i) => (
            <Card key={i} className="p-5 space-y-4 animate-pulse">
              <div className="h-6 bg-gray-300 rounded w-1/2"></div>
              <div className="h-4 bg-gray-200 rounded w-full"></div>
              <div className="h-3 bg-gray-200 rounded w-5/6"></div>
              <div className="h-3 bg-gray-200 rounded w-2/3"></div>
              <div className="h-10 bg-gray-300 rounded w-full mt-4"></div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
