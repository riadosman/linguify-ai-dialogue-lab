import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Crown, Globe, TrendingUp, Menu } from "lucide-react";
import { Language, SkillLevel } from "@/pages/Index";
import { useLanguage } from "@/store/useLanguage";

interface HeaderProps {
  selectedLanguage: Language;
  onLanguageChange: (language: Language) => void;
  skillLevel: SkillLevel;
  onSkillLevelChange: (level: SkillLevel) => void;
  isPremium: boolean;
  onMenuToggle: () => void;
}

export const Header = ({
  selectedLanguage,
  isPremium,
  onMenuToggle,
}: HeaderProps) => {
  const { level } = useLanguage();
  return (
    <header className="border-b bg-white/80 backdrop-blur-sm px-4 lg:px-6 py-4">
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center gap-2 lg:gap-4">
          <Button
            variant="ghost"
            size="sm"
            className="lg:hidden"
            onClick={onMenuToggle}
          >
            <Menu className="h-5 w-5" />
          </Button>

          <div className="flex items-center gap-4">
            <img
              src="/logo.png"
              alt="logo"
              className="h-8 w-22 lg:h-12 lg:w-32"
            />
            <h1 className="text-lg lg:text-xl font-bold text-gray-900 hidden sm:block">
              AION Language Chatbot
            </h1>
          </div>

          <div className="hidden sm:flex items-center gap-2">
            <span className="text-xl lg:text-2xl">{selectedLanguage.flag}</span>
            <span className="font-medium text-gray-700 text-sm lg:text-base">
              {selectedLanguage.name}
            </span>
            <Badge variant="outline" className="capitalize text-xs lg:text-sm">
              {level}
            </Badge>
          </div>
        </div>

        <div className="flex items-center gap-2 lg:gap-3">
          {isPremium && (
            <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white border-0 text-xs lg:text-sm">
              <Crown className="h-3 w-3 mr-1" />
              <span className="hidden sm:inline">Premium</span>
            </Badge>
          )}
        </div>
      </div>

      {/* Mobile language info */}
      <div className="sm:hidden mt-2 flex items-center gap-2">
        <span className="text-xl">{selectedLanguage.flag}</span>
        <span className="font-medium text-gray-700 text-sm">
          {selectedLanguage.name}
        </span>
        <Badge variant="outline" className="capitalize text-xs">
          {level}
        </Badge>
      </div>
    </header>
  );
};
