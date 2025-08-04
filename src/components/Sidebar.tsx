import { Button } from "@/components/ui/button";
import { MessageCircle, BarChart3, Settings, BookOpen, X } from "lucide-react";
import { ActiveView } from "@/pages/Index";
import { cn } from "@/lib/utils";
import { useAuth } from "@/store/useAuth";
import { LogOut } from "lucide-react";
import { useUserProgress } from "@/store/useUserData";

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
  onToggle,
}: SidebarProps) => {
  const { token, handleLogout, setToken, user } = useAuth();
  const { setProgress, progress } = useUserProgress.getState();
  const menuItems = [
    {
      id: "chat" as ActiveView,
      icon: MessageCircle,
      label: "Practice Chat",
      premium: false,
    },
    {
      id: "dashboard" as ActiveView,
      icon: BarChart3,
      label: "Dashboard",
      premium: false,
    },
    {
      id: "settings" as ActiveView,
      icon: Settings,
      label: "Settings",
      premium: false,
    },
    {
      id: "test" as ActiveView,
      icon: BookOpen,
      label: "Level Test",
      premium: false,
    },
    {
      id: "Vocabulary" as ActiveView,
      icon: BookOpen,
      label: "Vocabulary",
      premium: false,
    },
  ];

  return (
    <>
      <div
        className={cn(
          "fixed lg:relative inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 flex flex-col transform transition-transform duration-200 ease-in-out lg:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex items-center justify-between p-4 lg:hidden">
          <h2 className="font-semibold text-gray-900">Menu</h2>
          <Button variant="ghost" size="sm" onClick={onToggle}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="p-6 flex-1 flex flex-col justify-between">
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
                  if (item.id === "chat") {
                    setProgress({
                      ...progress,
                      conversationsCount: progress.conversationsCount + 1,
                    });
                  }
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

          {token ? (
            <Button
              variant="outline"
              className="w-full flex justify-between items-center"
              onClick={() => {
                handleLogout();
              }}
            >
              <span className="text-gray-800 font-medium">{user}</span>
              <LogOut className="h-4 w-4 text-red-500 cursor-pointer" />
            </Button>
          ) : (
            <div className="mt-6 space-y-2">
              <Button
                variant="outline"
                className="w-full"
                onClick={() => {
                  setActiveView("login");
                }}
              >
                Login
              </Button>
              <Button
                variant="default"
                className="bg-indigo-600 text-white w-full"
                onClick={() => {
                  setActiveView("signup");
                }}
              >
                Signup
              </Button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};
