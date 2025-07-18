
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Crown, Globe, TrendingUp } from "lucide-react";
import { Language, SkillLevel } from "@/pages/Index";

interface HeaderProps {
  selectedLanguage: Language;
  onLanguageChange: (language: Language) => void;
  skillLevel: SkillLevel;
  onSkillLevelChange: (level: SkillLevel) => void;
  isPremium: boolean;
}

export const Header = ({ 
  selectedLanguage, 
  skillLevel, 
  isPremium 
}: HeaderProps) => {
  return (
    <header className="border-b bg-white/80 backdrop-blur-sm px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Globe className="h-6 w-6 text-indigo-600" />
            <h1 className="text-xl font-bold text-gray-900">LinguaChat</h1>
          </div>
          
          <div className="flex items-center gap-2">
            <span className="text-2xl">{selectedLanguage.flag}</span>
            <span className="font-medium text-gray-700">{selectedLanguage.name}</span>
            <Badge variant="outline" className="capitalize">
              {skillLevel}
            </Badge>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {isPremium && (
            <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white border-0">
              <Crown className="h-3 w-3 mr-1" />
              Premium
            </Badge>
          )}
          
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <TrendingUp className="h-4 w-4" />
            <span>Progress: 67%</span>
          </div>
        </div>
      </div>
    </header>
  );
};
