import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Globe, CheckCircle } from "lucide-react";
import { Language, SkillLevel } from "@/pages/Index";
import { useLanguage } from "./../store/useLanguage";

interface LanguageSelectorProps {
  selectedLanguage: Language;
  onLanguageChange: (language: Language) => void;
  skillLevel: SkillLevel;
  onSkillLevelChange: (level: SkillLevel) => void;
}

const languages: Language[] = [
  { code: "es", name: "Spanish", flag: "🇪🇸" },
  { code: "fr", name: "French", flag: "🇫🇷" },
  { code: "de", name: "German", flag: "🇩🇪" },
  { code: "it", name: "Italian", flag: "🇮🇹" },
  { code: "pt", name: "Portuguese", flag: "🇵🇹" },
  { code: "ja", name: "Japanese", flag: "🇯🇵" },
  { code: "ko", name: "Korean", flag: "🇰🇷" },
  { code: "zh", name: "Mandarin", flag: "🇨🇳" },
  { code: "tr", name: "Turkish", flag: "🇹🇷" },
  { code: "ar", name: "Arabic", flag: "🇦🇪" },
  { code: "en", name: "English", flag: "🇬🇧" },
];

const skillLevels = [
  {
    level: "beginner" as SkillLevel,
    title: "Beginner",
    description: "Just starting out with basic vocabulary and phrases",
    features: [
      "Basic greetings",
      "Simple conversations",
      "Essential vocabulary",
    ],
  },
  {
    level: "intermediate" as SkillLevel,
    title: "Intermediate",
    description: "Can have simple conversations and understand common topics",
    features: ["Daily conversations", "Grammar practice", "Cultural context"],
  },
  {
    level: "advanced" as SkillLevel,
    title: "Advanced",
    description: "Comfortable with complex conversations and nuanced language",
    features: ["Complex topics", "Idiomatic expressions", "Business language"],
  },
];

export const LanguageSelector = ({
  selectedLanguage,
  onLanguageChange,
  skillLevel,
  onSkillLevelChange,
}: LanguageSelectorProps) => {
  const [tempSkillLevel, setTempSkillLevel] = useState(skillLevel);
  const {
    targetLanguage,
    setTargetLanguage,
    sourceLanguage,
    setSourceLanguage,
    level,
    setLevel,
  } = useLanguage();
  const token = localStorage.getItem("token");

  const handleSave = () => {
    onLanguageChange(tempLanguage);
    onSkillLevelChange(tempSkillLevel);
  };
  const handleSaveSettings = () => {
    const res = fetch("http://localhost:3000/api/settings", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
      body: JSON.stringify({ targetLanguage, sourceLanguage, level }),
    });
  };
  return (
    <>
      <div className="p-6 space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Globe className="h-6 w-6 text-indigo-600" />
            Language & Level Settings
          </h1>
          <p className="text-gray-600">
            Choose your target language and skill level
          </p>
        </div>

        {/* Source Language */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">Source Language</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
            {languages.map((language) => (
              <Card
                key={language.code}
                className={`p-4 cursor-pointer transition-all hover:shadow-md ${
                  sourceLanguage.code === language.code
                    ? "ring-2 ring-indigo-500 bg-indigo-50"
                    : "hover:bg-gray-50"
                }`}
                onClick={() => {
                  setSourceLanguage(language);
                  console.log(`Source language set to: ${language.name}`);
                  console.log(language);
                }}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{language.flag}</span>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{language.name}</p>
                  </div>
                  {sourceLanguage.code === language.code && (
                    <CheckCircle className="h-5 w-5 text-indigo-600" />
                  )}
                </div>
              </Card>
            ))}
          </div>
        </Card>
        {/* Target Language */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">Target Language</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
            {languages.map((language) => (
              <Card
                key={language.code}
                className={`p-4 cursor-pointer transition-all hover:shadow-md ${
                  targetLanguage.code === language.code
                    ? "ring-2 ring-indigo-500 bg-indigo-50"
                    : "hover:bg-gray-50"
                }`}
                onClick={() => setTargetLanguage(language)}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{language.flag}</span>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{language.name}</p>
                  </div>
                  {targetLanguage.code === language.code && (
                    <CheckCircle className="h-5 w-5 text-indigo-600" />
                  )}
                </div>
              </Card>
            ))}
          </div>
        </Card>

        {/* Skill Level Selection */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">Skill Level</h2>
          <RadioGroup
            value={level}
            onValueChange={(value) => setLevel(value as SkillLevel)}
          >
            <div className="space-y-4">
              {skillLevels.map((level) => (
                <div key={level.level} className="flex items-start space-x-3">
                  <RadioGroupItem
                    value={level.level}
                    id={level.level}
                    className="mt-1"
                  />
                  <div className="flex-1">
                    <Label htmlFor={level.level} className="cursor-pointer">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-gray-900">
                            {level.title}
                          </span>
                          <Badge variant="outline" className="capitalize">
                            {level.level}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600">
                          {level.description}
                        </p>
                        <div className="flex flex-wrap gap-1">
                          {level.features.map((feature, index) => (
                            <Badge
                              key={index}
                              variant="secondary"
                              className="text-xs"
                            >
                              {feature}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </Label>
                  </div>
                </div>
              ))}
            </div>
          </RadioGroup>
        </Card>
        <Button className="w-full" onClick={handleSaveSettings}>
          Save Settings
        </Button>
      </div>
    </>
  );
};
