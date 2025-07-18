
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Send, 
  Volume2, 
  Lightbulb, 
  BookOpen,
  Sparkles,
  Bot,
  User,
  Crown
} from "lucide-react";
import { Language, SkillLevel } from "@/pages/Index";
import { VocabularyHint } from "@/components/VocabularyHint";

interface Message {
  id: string;
  type: "user" | "ai";
  content: string;
  translation?: string;
  vocabulary?: Array<{
    word: string;
    definition: string;
    pronunciation: string;
  }>;
  timestamp: Date;
}

interface ChatProps {
  selectedLanguage: Language;
  skillLevel: SkillLevel;
  isPremium: boolean;
}

export const Chat = ({ selectedLanguage, skillLevel, isPremium }: ChatProps) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      type: "ai",
      content: skillLevel === "beginner" 
        ? "¡Hola! Me llamo Sofia. ¿Cómo te llamas?" 
        : "¡Hola! Soy tu profesora virtual de español. ¿De qué te gustaría hablar hoy?",
      translation: skillLevel === "beginner" 
        ? "Hello! My name is Sofia. What's your name?" 
        : "Hello! I'm your virtual Spanish teacher. What would you like to talk about today?",
      vocabulary: [
        {
          word: "llamo",
          definition: "to be called/named",
          pronunciation: "YAH-mo"
        }
      ],
      timestamp: new Date()
    }
  ]);
  
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [showHints, setShowHints] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const generateAIResponse = (userMessage: string): Message => {
    const responses = {
      beginner: [
        {
          content: "¡Muy bien! ¿Cuántos años tienes?",
          translation: "Very good! How old are you?",
          vocabulary: [
            { word: "años", definition: "years", pronunciation: "AH-nyos" },
            { word: "tienes", definition: "you have", pronunciation: "tee-EH-nes" }
          ]
        },
        {
          content: "Perfecto. ¿Te gusta la música?",
          translation: "Perfect. Do you like music?",
          vocabulary: [
            { word: "gusta", definition: "like", pronunciation: "GOOS-tah" },
            { word: "música", definition: "music", pronunciation: "MOO-see-kah" }
          ]
        }
      ],
      intermediate: [
        {
          content: "Interesante. ¿Podrías contarme más sobre tus aficiones?",
          translation: "Interesting. Could you tell me more about your hobbies?",
          vocabulary: [
            { word: "aficiones", definition: "hobbies", pronunciation: "ah-fee-see-OH-nes" }
          ]
        }
      ],
      advanced: [
        {
          content: "Excelente expresión. Me gustaría profundizar en ese tema. ¿Qué opinas sobre...?",
          translation: "Excellent expression. I'd like to delve deeper into that topic. What do you think about...?",
          vocabulary: []
        }
      ]
    };

    const levelResponses = responses[skillLevel];
    const randomResponse = levelResponses[Math.floor(Math.random() * levelResponses.length)];
    
    return {
      id: Date.now().toString(),
      type: "ai",
      content: randomResponse.content,
      translation: randomResponse.translation,
      vocabulary: randomResponse.vocabulary,
      timestamp: new Date()
    };
  };

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: inputValue,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue("");
    setIsTyping(true);

    // Simulate AI response delay
    setTimeout(() => {
      const aiResponse = generateAIResponse(inputValue);
      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1500);
  };

  const speakText = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = selectedLanguage.code === 'es' ? 'es-ES' : 'en-US';
      speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="flex h-full">
      <div className="flex-1 flex flex-col">
        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}
            >
              <div className={`max-w-xs lg:max-w-md xl:max-w-lg ${
                message.type === "user" ? "order-2" : "order-1"
              }`}>
                <div className={`flex items-start gap-2 ${
                  message.type === "user" ? "flex-row-reverse" : "flex-row"
                }`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    message.type === "user" 
                      ? "bg-indigo-600 text-white" 
                      : "bg-emerald-500 text-white"
                  }`}>
                    {message.type === "user" ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                  </div>
                  
                  <Card className={`p-4 ${
                    message.type === "user"
                      ? "bg-indigo-600 text-white"
                      : "bg-white"
                  }`}>
                    <div className="space-y-2">
                      <p className="text-sm">{message.content}</p>
                      
                      {message.translation && showHints && (
                        <p className="text-xs opacity-70 italic">
                          {message.translation}
                        </p>
                      )}
                      
                      {message.vocabulary && message.vocabulary.length > 0 && isPremium && (
                        <div className="flex flex-wrap gap-1">
                          {message.vocabulary.map((vocab, index) => (
                            <VocabularyHint key={index} vocabulary={vocab} />
                          ))}
                        </div>
                      )}
                      
                      {message.type === "ai" && (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => speakText(message.content)}
                          className="p-1 h-6 text-gray-500 hover:text-gray-700"
                        >
                          <Volume2 className="h-3 w-3" />
                        </Button>
                      )}
                    </div>
                  </Card>
                </div>
              </div>
            </div>
          ))}
          
          {isTyping && (
            <div className="flex justify-start">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center">
                  <Bot className="h-4 w-4" />
                </div>
                <Card className="p-4 bg-white">
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:0.1s]"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                  </div>
                </Card>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="border-t bg-white p-4">
          <div className="flex items-center gap-2">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder={`Type your message in ${selectedLanguage.name}...`}
              onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
              className="flex-1"
            />
            <Button 
              onClick={handleSendMessage}
              disabled={!inputValue.trim()}
              className="bg-indigo-600 hover:bg-indigo-700"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Sidebar with hints */}
      <div className="w-72 border-l bg-gray-50 p-4">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-gray-900">Learning Tools</h3>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setShowHints(!showHints)}
            >
              <Lightbulb className="h-4 w-4" />
            </Button>
          </div>

          <Card className="p-4">
            <h4 className="font-medium mb-2 flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-yellow-500" />
              Quick Tips
            </h4>
            <div className="space-y-2 text-sm text-gray-600">
              <p>• Use present tense for current actions</p>
              <p>• Remember: "Me gusta" = "I like"</p>
              <p>• Practice pronunciation with audio</p>
            </div>
          </Card>

          <Card className="p-4">
            <h4 className="font-medium mb-2 flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-blue-500" />
              Today's Goal
            </h4>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Messages sent</span>
                <span className="font-medium">3/10</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-indigo-600 h-2 rounded-full w-[30%]"></div>
              </div>
            </div>
          </Card>

          {!isPremium && (
            <Card className="p-4 bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-200">
              <div className="text-center space-y-2">
                <Crown className="h-8 w-8 text-yellow-600 mx-auto" />
                <h4 className="font-medium text-yellow-800">Premium Features</h4>
                <p className="text-xs text-yellow-700">
                  Unlock vocabulary hints, pronunciation guides, and unlimited conversations!
                </p>
                <Button size="sm" className="w-full bg-yellow-600 hover:bg-yellow-700">
                  Upgrade Now
                </Button>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};
