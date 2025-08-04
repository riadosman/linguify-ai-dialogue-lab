import { useState } from "react";
import { Chat } from "@/components/Chat";
import { Sidebar } from "@/components/Sidebar";
import { Header } from "@/components/Header";
import Dashboard from "@/components/Dashboard";
import { LanguageSelector } from "@/components/LanguageSelector";
import { SubscriptionModal } from "@/components/SubscriptionModal";
import { useLanguage } from "@/store/useLanguage";
import { useAuth } from "@/store/useAuth";
import LevelTestPage from "./../components/LevelTest";
import { Login } from "@/components/Login";
import { Signup } from "@/components/Signup";
import { VocabularyPage } from "@/components/Vocabulary";
export type Language = {
  code: string;
  name: string;
  flag: string;
};

export type SkillLevel = "beginner" | "intermediate" | "advanced";

export type ActiveView = "chat" | "dashboard" | "settings";

const Index = () => {
  const [selectedLanguage, setSelectedLanguage] = useState<Language>({
    code: "es",
    name: "Spanish",
    flag: "🇪🇸",
  });
  const [skillLevel, setSkillLevel] = useState<SkillLevel>("beginner");
  const [activeView, setActiveView] = useState<ActiveView>("chat");
  const [showSubscription, setShowSubscription] = useState(false);
  const [isPremium, setIsPremium] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const {
    targetLanguage,
    setTargetLanguage,
    sourceLanguage,
    setSourceLanguage,
  } = useLanguage();
  const { login, signup } = useAuth();
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="flex">
        <Sidebar
          activeView={activeView}
          setActiveView={setActiveView}
          isPremium={isPremium}
          onUpgrade={() => setShowSubscription(true)}
          isOpen={sidebarOpen}
          onToggle={() => setSidebarOpen(!sidebarOpen)}
        />

        <div className="flex-1 flex flex-col">
          <Header
            selectedLanguage={targetLanguage}
            onLanguageChange={setSelectedLanguage}
            skillLevel={skillLevel}
            onSkillLevelChange={setSkillLevel}
            isPremium={isPremium}
            onMenuToggle={() => setSidebarOpen(!sidebarOpen)}
          />
          <main className="flex-1 overflow-hidden">
            {activeView === "chat" && (
              <Chat
                selectedLanguage={selectedLanguage}
                skillLevel={skillLevel}
                isPremium={isPremium}
              />
            )}
            {activeView === "dashboard" && (
              <Dashboard
                selectedLanguage={selectedLanguage}
                skillLevel={skillLevel}
                isPremium={isPremium}
              />
            )}
            {activeView === "settings" && (
              <LanguageSelector
                selectedLanguage={selectedLanguage}
                onLanguageChange={setSelectedLanguage}
                skillLevel={skillLevel}
                onSkillLevelChange={setSkillLevel}
              />
            )}
            {activeView === "test" && (
              <LevelTestPage
                selectedLanguage={selectedLanguage}
                setActiveView={setActiveView}
                onLanguageChange={setSelectedLanguage}
                skillLevel={skillLevel}
                onSkillLevelChange={setSkillLevel}
              />
            )}
            {activeView === "Vocabulary" && (
              <VocabularyPage
                selectedLanguage={selectedLanguage}
                setActiveView={setActiveView}
                onLanguageChange={setSelectedLanguage}
                skillLevel={skillLevel}
                onSkillLevelChange={setSkillLevel}
              />
            )}
            {activeView === "login" && <Login setActiveView={setActiveView} />}
            {activeView === "signup" && (
              <Signup setActiveView={setActiveView} />
            )}
          </main>
        </div>
      </div>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* <SubscriptionModal 
        isOpen={showSubscription}
        onClose={() => setShowSubscription(false)}
        onSubscribe={() => {
          setIsPremium(true);
          setShowSubscription(false);
        }}
      /> */}
    </div>
  );
};

export default Index;
