
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  TrendingUp, 
  Calendar, 
  Target, 
  BookOpen,
  Clock,
  Award,
  Flame,
  Star
} from "lucide-react";
import { Language, SkillLevel } from "@/pages/Index";

interface DashboardProps {
  selectedLanguage: Language;
  skillLevel: SkillLevel;
}

export const Dashboard = ({ selectedLanguage, skillLevel }: DashboardProps) => {
  const stats = [
    {
      label: "Conversations",
      value: "23",
      icon: BookOpen,
      color: "text-blue-600",
      bgColor: "bg-blue-50"
    },
    {
      label: "Words Learned",
      value: "156",
      icon: Star,
      color: "text-yellow-600",
      bgColor: "bg-yellow-50"
    },
    {
      label: "Streak Days",
      value: "7",
      icon: Flame,
      color: "text-orange-600",
      bgColor: "bg-orange-50"
    },
    {
      label: "Study Time",
      value: "12h",
      icon: Clock,
      color: "text-green-600",
      bgColor: "bg-green-50"
    }
  ];

  const recentAchievements = [
    { name: "First Conversation", date: "Today", icon: "🎯" },
    { name: "5 Day Streak", date: "Yesterday", icon: "🔥" },
    { name: "50 Words Learned", date: "2 days ago", icon: "⭐" }
  ];

  const weeklyProgress = [
    { day: "Mon", conversations: 3, words: 12 },
    { day: "Tue", conversations: 2, words: 8 },
    { day: "Wed", conversations: 4, words: 15 },
    { day: "Thu", conversations: 5, words: 20 },
    { day: "Fri", conversations: 3, words: 11 },
    { day: "Sat", conversations: 2, words: 7 },
    { day: "Sun", conversations: 4, words: 16 }
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Your Progress</h1>
          <p className="text-gray-600">
            Learning {selectedLanguage.name} • {skillLevel} level
          </p>
        </div>
        <Badge className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white">
          Level 3
        </Badge>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <Card key={index} className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
              <div className={`p-3 rounded-full ${stat.bgColor}`}>
                <stat.icon className={`h-6 w-6 ${stat.color}`} />
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly Progress */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-indigo-600" />
            Weekly Progress
          </h3>
          <div className="space-y-4">
            {weeklyProgress.map((day, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-600 w-12">{day.day}</span>
                <div className="flex-1 mx-4">
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-indigo-600 h-2 rounded-full" 
                        style={{ width: `${(day.conversations / 5) * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-xs text-gray-500 w-8">{day.conversations}</span>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-xs text-gray-500">
                  <Star className="h-3 w-3" />
                  {day.words}
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Recent Achievements */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Award className="h-5 w-5 text-yellow-600" />
            Recent Achievements
          </h3>
          <div className="space-y-3">
            {recentAchievements.map((achievement, index) => (
              <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <span className="text-2xl">{achievement.icon}</span>
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{achievement.name}</p>
                  <p className="text-sm text-gray-500">{achievement.date}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Study Plan */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Target className="h-5 w-5 text-green-600" />
            Today's Goals
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Practice conversation</span>
              <Badge variant="outline" className="text-green-600 border-green-600">
                ✓ Complete
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Learn 10 new words</span>
              <Badge variant="outline">7/10</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">15 minutes practice</span>
              <Badge variant="outline">12/15 min</Badge>
            </div>
          </div>
          <Button className="w-full mt-4 bg-green-600 hover:bg-green-700">
            Continue Learning
          </Button>
        </Card>

        {/* Quick Actions */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Calendar className="h-5 w-5 text-purple-600" />
            Quick Actions
          </h3>
          <div className="space-y-3">
            <Button variant="outline" className="w-full justify-start">
              <BookOpen className="h-4 w-4 mr-2" />
              Start New Conversation
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <Award className="h-4 w-4 mr-2" />
              Review Vocabulary
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <TrendingUp className="h-4 w-4 mr-2" />
              Take Skill Assessment
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};
