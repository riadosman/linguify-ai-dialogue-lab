
import { Button } from "@/components/ui/button";
import { 
  MessageCircle, 
  BarChart3, 
  Settings, 
  Crown,
  BookOpen,
  Target,
  Award
} from "lucide-react";
import { ActiveView } from "@/pages/Index";
import { cn } from "@/lib/utils";

interface SidebarProps {
  activeView: ActiveView;
  setActiveView: (view: ActiveView) => void;
  isPremium: boolean;
  onUpgrade: () => void;
}

export const Sidebar = ({ 
  activeView, 
  setActiveView, 
  isPremium, 
  onUpgrade 
}: SidebarProps) => {
  const menuItems = [
    {
      id: "chat" as ActiveView,
      icon: MessageCircle,
      label: "Practice Chat",
      premium: false
    },
    {
      id: "dashboard" as ActiveView,
      icon: BarChart3,
      label: "Dashboard",
      premium: false
    },
    {
      id: "settings" as ActiveView,
      icon: Settings,
      label: "Settings",
      premium: false
    }
  ];

  return (
    <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
      <div className="p-6">
        <div className="space-y-1">
          {menuItems.map((item) => (
            <Button
              key={item.id}
              variant={activeView === item.id ? "default" : "ghost"}
              className={cn(
                "w-full justify-start",
                activeView === item.id && "bg-indigo-600 text-white"
              )}
              onClick={() => setActiveView(item.id)}
            >
              <item.icon className="h-4 w-4 mr-3" />
              {item.label}
            </Button>
          ))}
        </div>
      </div>

      <div className="mt-auto p-6 border-t">
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <BookOpen className="h-4 w-4" />
            <span>5 lessons completed</span>
          </div>
          
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Target className="h-4 w-4" />
            <span>3-day streak</span>
          </div>
          
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Award className="h-4 w-4" />
            <span>120 words learned</span>
          </div>
        </div>

        {!isPremium && (
          <Button 
            onClick={onUpgrade}
            className="w-full mt-4 bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white border-0"
          >
            <Crown className="h-4 w-4 mr-2" />
            Upgrade to Premium
          </Button>
        )}
      </div>
    </div>
  );
};
