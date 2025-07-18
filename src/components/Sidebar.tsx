
import { Button } from "@/components/ui/button";
import { 
  MessageCircle, 
  BarChart3, 
  Settings, 
  Crown,
  BookOpen,
  Target,
  Award,
  X
} from "lucide-react";
import { ActiveView } from "@/pages/Index";
import { cn } from "@/lib/utils";

interface SidebarProps {
  activeView: ActiveView;
  setActiveView: (view: ActiveView) => void;
  isPremium: boolean;
  onUpgrade: () => void;
  isOpen: boolean;
  onToggle: () => void;
}

export const Sidebar = ({ 
  activeView, 
  setActiveView, 
  isPremium, 
  onUpgrade,
  isOpen,
  onToggle
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
    <>
      <div className={cn(
        "fixed lg:relative inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 flex flex-col transform transition-transform duration-200 ease-in-out lg:translate-x-0",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex items-center justify-between p-4 lg:hidden">
          <h2 className="font-semibold text-gray-900">Menu</h2>
          <Button variant="ghost" size="sm" onClick={onToggle}>
            <X className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="p-6 flex-1">
          <div className="space-y-1">
            {menuItems.map((item) => (
              <Button
                key={item.id}
                variant={activeView === item.id ? "default" : "ghost"}
                className={cn(
                  "w-full justify-start",
                  activeView === item.id && "bg-indigo-600 text-white"
                )}
                onClick={() => {
                  setActiveView(item.id);
                  if (window.innerWidth < 1024) {
                    onToggle();
                  }
                }}
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
              <span className="text-sm">Upgrade to Premium</span>
            </Button>
          )}
        </div>
      </div>
    </>
  );
};
