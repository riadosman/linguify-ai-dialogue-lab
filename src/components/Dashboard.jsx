import { useState, useEffect } from "react";
import { Globe, CheckCircle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useAuth } from "./../store/useAuth";

export default function Dashboard() {
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      const res = await fetch("http://localhost:3000/api/user", {
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
      });
      const result = await res.json();
      setData(result);
    };

    fetchUser();
  }, []);

  if (!data) return <p className="p-6">Loading...</p>;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <Globe className="h-6 w-6 text-indigo-600" />
          Your Learning Dashboard
        </h1>
        <p className="text-gray-600">
          Here's a snapshot of your current learning setup.
        </p>
      </div>

      {/* Source Language */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold mb-4">Source Language</h2>
        <div className="flex items-center gap-3">
          <span className="text-3xl">{data.user.sourceLanguage.flag}</span>
          <div>
            <p className="font-medium text-gray-900">
              {data.user.sourceLanguage.name}
            </p>
            <p className="text-sm text-gray-500 uppercase">
              {data.user.sourceLanguage.code}
            </p>
          </div>
        </div>
      </Card>

      {/* Target Language */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold mb-4">Target Language</h2>
        <div className="flex items-center gap-3">
          <span className="text-3xl">{data.user.targetLanguage.flag}</span>
          <div>
            <p className="font-medium text-gray-900">
              {data.user.targetLanguage.name}
            </p>
            <p className="text-sm text-gray-500 uppercase">
              {data.user.targetLanguage.code}
            </p>
          </div>
        </div>
      </Card>

      {/* Skill Level */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold mb-4">Skill Level</h2>
        <div className="flex items-center justify-between">
          <p className="text-xl font-semibold capitalize text-indigo-600">
            {data.user.level}
          </p>
          <Badge variant="outline" className="capitalize">
            {data.user.level}
          </Badge>
        </div>
      </Card>

      {/* Test Results */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold mb-4">Test Result Summary</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm text-gray-700">
          <div>
            <p className="font-medium">Total Questions</p>
            <p>{data.user.testResult.totalQuestions}</p>
          </div>
          <div>
            <p className="font-medium">Correct Answers</p>
            <p>{data.user.testResult.totalCorrect}</p>
          </div>
          <div>
            <p className="font-medium">Percentage</p>
            <p>{data.user.testResult.percentage}%</p>
          </div>
          <div>
            <p className="font-medium">Recommended Level</p>
            <p className="capitalize">
              {data.user.testResult.recommendedLevel}
            </p>
          </div>
          <div className="col-span-full">
            <p className="font-medium mb-1">Level Description</p>
            <p className="text-gray-600">
              {data.user.testResult.levelDescription}
            </p>
          </div>
        </div>
      </Card>

      {/* Learned Words */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold mb-4">Learned Words</h2>
        {data.user.learnedWords.length ? (
          <div className="flex flex-wrap gap-2">
            {data.user.learnedWords.map((word, idx) => (
              <Badge key={idx} variant="secondary" className="text-sm">
                {word}
              </Badge>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No words learned yet.</p>
        )}
      </Card>
    </div>
  );
}
