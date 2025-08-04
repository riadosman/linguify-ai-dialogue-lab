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
  Crown,
  Clock,
  Quote,
  Headphones,
  Mic,
  AlertTriangle,
} from "lucide-react";
import { Language, SkillLevel } from "@/pages/Index";
import { VocabularyHint } from "@/components/VocabularyHint";
import { useLanguage } from "./../store/useLanguage";

interface ChatProps {
  isPremium: boolean;
}

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

export const Chat = ({ isPremium }: ChatProps) => {
  const {
    targetLanguage,
    setTargetLanguage,
    sourceLanguage,
    setSourceLanguage,
    level,
    setLevel,
  } = useLanguage();

  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      type: "ai",
      content:
        level === "beginner"
          ? "¡Hola! Me llamo Sofia. ¿Cómo te llamas?"
          : "¡Hola! Soy tu profesora virtual de español. ¿De qué te gustaría hablar hoy?",
      translation:
        level === "beginner"
          ? "Hello! My name is Sofia. What's your name?"
          : "Hello! I'm your virtual Spanish teacher. What would you like to talk about today?",
      vocabulary: [
        {
          word: "llamo",
          definition: "to be called/named",
          pronunciation: "YAH-mo",
        },
      ],
      timestamp: new Date(),
    },
  ]);

  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [recording, setRecording] = useState(false);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const speakText = (text: string) => {
    if ("speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = targetLanguage?.code;
      utterance.rate = 0.8;
      utterance.pitch = 1;
      speechSynthesis.speak(utterance);
    }
  };

  const getSkillLevelGuidance = (level: SkillLevel): string => {
    switch (level) {
      case "beginner":
        return "Use present tense, basic vocabulary, short sentences. Focus on greetings, introductions, and everyday topics.";
      case "intermediate":
        return "Use past and future tenses, more complex vocabulary, longer sentences. Discuss hobbies, experiences, and opinions.";
      case "advanced":
        return "Use all tenses, idiomatic expressions, complex grammar. Engage in debates, abstract topics, and cultural discussions.";
      default:
        return "Use simple present tense and basic vocabulary.";
    }
  };

  const generateTranslation = async (text: string): Promise<string> => {
    try {
      const response = await fetch(
        "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-goog-api-key": import.meta.env.VITE_APP_GEMINI_API_KEY,
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text: `Translate this ${targetLanguage?.name} text to ${sourceLanguage?.name}. Only provide the translation, no explanations: "${text}"`,
                  },
                ],
              },
            ],
            generationConfig: {
              temperature: 0.3,
              maxOutputTokens: 100,
            },
          }),
        }
      );

      const data = await response.json();
      return data.candidates[0].content.parts[0].text.trim();
    } catch (error) {
      console.error("Translation error:", error);
      return "Translation unavailable";
    }
  };

  const extractVocabulary = async (
    text: string,
    targetLang: any
  ): Promise<
    Array<{ word: string; definition: string; pronunciation: string }>
  > => {
    if (!isPremium) return [];

    try {
      const response = await fetch(
        "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-goog-api-key": import.meta.env.VITE_APP_GEMINI_API_KEY,
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text: `Extract 2-3 important vocabulary words from this ${targetLang?.name} text for language learners. For each word, provide: word, English definition, and pronunciation guide. Format as JSON array: [{"word": "palabra", "definition": "word", "pronunciation": "pah-LAH-brah"}]. Text: "${text}"`,
                  },
                ],
              },
            ],
            generationConfig: {
              temperature: 0.3,
              maxOutputTokens: 200,
            },
          }),
        }
      );

      const data = await response.json();
      const vocabText = data.candidates[0].content.parts[0].text.trim();

      try {
        const vocabArray = JSON.parse(vocabText);
        return Array.isArray(vocabArray) ? vocabArray.slice(0, 3) : [];
      } catch (parseError) {
        console.error("Vocabulary parsing error:", parseError);
        return [];
      }
    } catch (error) {
      console.error("Vocabulary extraction error:", error);
      return [];
    }
  };

  const generateAIResponse = async (userMessage: string): Promise<Message> => {
    const conversationContext = messages
      .slice(-6)
      .map(
        (msg) =>
          `${msg.type === "user" ? "Student" : "Teacher"}: ${msg.content}`
      )
      .join("\n");

    const prompt = `You are Sofia, a friendly and encouraging ${
      targetLanguage?.name
    } teacher. You're having a conversation with a ${level} level student.

        IMPORTANT GUIDELINES:
        - Always respond in ${targetLanguage?.name} only
        - Match the ${level} level: ${getSkillLevelGuidance(level)}
        - Keep responses conversational and engaging (2-3 sentences max)
        - Use simple, clear language appropriate for ${level} learners
        - Be encouraging and supportive
        - Ask follow-up questions to keep the conversation flowing
        - Correct mistakes gently by modeling the correct usage
        - Include common everyday vocabulary

        CONVERSATION CONTEXT:
        ${conversationContext}

        STUDENT'S LATEST MESSAGE: ${userMessage}

        Respond as Sofia would - warm, encouraging, and focused on helping the student practice. Keep it natural and conversational.`;

    try {
      console.log(
        `Fetching the response from AI with ${targetLanguage?.name} target language and ${level} level and this text ${userMessage}`
      );

      const response = await fetch(
        "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-goog-api-key": import.meta.env.VITE_APP_GEMINI_API_KEY,
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text: prompt,
                  },
                ],
              },
            ],
            generationConfig: {
              temperature: 0.8,
              maxOutputTokens: 150,
              topP: 0.8,
              topK: 40,
            },
          }),
        }
      );

      const data = await response.json();
      const aiContent = data.candidates[0].content.parts[0].text.trim();

      const translation =
        level === "beginner" ? await generateTranslation(aiContent) : undefined;

      const vocabulary = isPremium
        ? await extractVocabulary(aiContent, targetLanguage)
        : [];

      return {
        id: Date.now().toString(),
        type: "ai",
        content: aiContent,
        translation: translation,
        vocabulary: vocabulary,
        timestamp: new Date(),
      };
    } catch (error) {
      console.error("Error generating AI response:", error);

      const fallbackResponses = {
        beginner: {
          content: "¡Perdón! No entendí bien. ¿Puedes repetir?",
          translation: "Sorry! I didn't understand well. Can you repeat?",
        },
        intermediate: {
          content: "Disculpa, tuve un problema técnico. ¿Podemos continuar?",
          translation: "Sorry, I had a technical problem. Can we continue?",
        },
        advanced: {
          content:
            "Ha ocurrido un error. ¿Te gustaría intentar con otra pregunta?",
          translation: undefined,
        },
      };

      const fallback = fallbackResponses[level];

      return {
        id: Date.now().toString(),
        type: "ai",
        content: fallback.content,
        translation: fallback.translation,
        vocabulary: [],
        timestamp: new Date(),
      };
    }
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: inputValue,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsTyping(true);

    try {
      const aiResponse = await generateAIResponse(inputValue);
      setMessages((prev) => [...prev, aiResponse]);
    } catch (error) {
      console.error("Error in handleSendMessage:", error);
      const errorMessage: Message = {
        id: Date.now().toString(),
        type: "ai",
        content:
          "Lo siento, tengo problemas técnicos. ¿Podemos intentar de nuevo?",
        translation: "Sorry, I'm having technical problems. Can we try again?",
        vocabulary: [],
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  const handleRecording = () => {
    if (!SpeechRecognition) {
      alert("متصفحك لا يدعم Web Speech API 😢 جرّب Google Chrome");
    } else {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.lang = targetLanguage?.code || "es-ES";
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = false;

      recognitionRef.current.onresult = (event) => {
        const transcript = event.results[event.resultIndex][0].transcript;
        setInputValue(transcript);
      };

      recognitionRef.current.start();
      setRecording(true);
    }
  };
  const handleStopRecording = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setRecording(false);
    }
  };
  return (
    <div className="flex flex-col lg:flex-row h-[calc(100vh-64px)] lg:h-[calc(100vh-80px)]">
      <div className="flex-1 flex flex-col min-h-0">
        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 lg:p-6 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.type === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[85%] sm:max-w-xs lg:max-w-md xl:max-w-lg ${
                  message.type === "user" ? "order-2" : "order-1"
                }`}
              >
                <div
                  className={`flex items-start gap-3 ${
                    message.type === "user" ? "flex-row-reverse" : "flex-row"
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                      message.type === "user"
                        ? "bg-indigo-600 text-white"
                        : "bg-emerald-500 text-white"
                    }`}
                  >
                    {message.type === "user" ? (
                      <User className="h-4 w-4" />
                    ) : (
                      <Bot className="h-4 w-4" />
                    )}
                  </div>

                  <Card
                    className={`p-4 shadow-sm ${
                      message.type === "user"
                        ? "bg-indigo-600 text-white"
                        : "bg-white border"
                    }`}
                  >
                    <div className="space-y-3">
                      <p className="text-sm leading-relaxed">
                        {message.content}
                      </p>

                      {message.translation && (
                        <p className="text-xs opacity-75 italic border-t border-opacity-20 pt-2">
                          {message.translation}
                        </p>
                      )}

                      {message.vocabulary &&
                        message.vocabulary.length > 0 &&
                        isPremium && (
                          <div className="flex flex-wrap gap-2 pt-2 border-t border-opacity-20">
                            {message.vocabulary.map((vocab, index) => (
                              <VocabularyHint key={index} vocabulary={vocab} />
                            ))}
                          </div>
                        )}

                      {message.type === "ai" && (
                        <div className="flex items-center gap-2 pt-2">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => speakText(message.content)}
                            className="p-2 h-8 text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                          >
                            <Volume2 className="h-3 w-3" />
                          </Button>
                          <span className="text-xs text-gray-400">
                            Click to hear pronunciation
                          </span>
                        </div>
                      )}
                    </div>
                  </Card>
                </div>
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex justify-start">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center">
                  <Bot className="h-4 w-4" />
                </div>
                <Card className="p-4 bg-white border shadow-sm">
                  <div className="flex items-center gap-2">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:0.1s]"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                    </div>
                    <span className="text-sm text-gray-500">
                      Sofia is typing...
                    </span>
                  </div>
                </Card>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="border-t bg-white p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder={`Type your message in ${targetLanguage?.name || "target language"}...`}
              onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
              className="flex-1 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />

            <Button
              onClick={handleSendMessage}
              disabled={!inputValue.trim()}
              className="bg-indigo-600 hover:bg-indigo-700 transition-colors px-6"
            >
              <Send className="h-4 w-4 mr-2" />
              Send
            </Button>
            {!recording ? (
              <Button
                onClick={handleRecording}
                className="bg-indigo-600 hover:bg-indigo-700 transition-colors px-6"
              >
                <Mic className="h-4 w-4 mr-2" />
                Record
              </Button>
            ) : (
              <Button
                onClick={handleStopRecording}
                className="bg-red-600 hover:bg-indigo-700 transition-colors px-6"
              >
                <Mic className="h-4 w-4 mr-2" />
                Send
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Enhanced Sidebar */}
      <Card className="p-6 hidden lg:block w-80 border-l shadow-sm">
        <div className="space-y-6">
          <div>
            <h4 className="font-semibold mb-3 flex items-center gap-2 text-gray-800">
              <Sparkles className="h-5 w-5 text-yellow-500" />
              Learning Tips
            </h4>
            <div className="space-y-3 text-sm text-gray-600">
              <div className="flex items-start gap-3 p-2 rounded-lg hover:bg-gray-50">
                <Clock className="h-4 w-4 text-gray-500 mt-0.5 flex-shrink-0" />
                <p>Practice consistently - even 10 minutes daily helps</p>
              </div>
              <div className="flex items-start gap-3 p-2 rounded-lg hover:bg-gray-50">
                <Volume2 className="h-4 w-4 text-gray-500 mt-0.5 flex-shrink-0" />
                <p>Use the pronunciation feature to improve your accent</p>
              </div>
              <div className="flex items-start gap-3 p-2 rounded-lg hover:bg-gray-50">
                <Quote className="h-4 w-4 text-gray-500 mt-0.5 flex-shrink-0" />
                <p>Learn phrases in context, not just individual words</p>
              </div>
              <div className="flex items-start gap-3 p-2 rounded-lg hover:bg-gray-50">
                <Headphones className="h-4 w-4 text-gray-500 mt-0.5 flex-shrink-0" />
                <p>Listen to native speakers to improve comprehension</p>
              </div>
              <div className="flex items-start gap-3 p-2 rounded-lg hover:bg-gray-50">
                <Bot className="h-4 w-4 text-gray-500 mt-0.5 flex-shrink-0" />
                <p>Don't fear mistakes - they're part of learning!</p>
              </div>
            </div>
          </div>

          <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
            <div className="flex items-center gap-2 mb-2">
              <BookOpen className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-800">
                Study Tips
              </span>
            </div>
            <p className="text-xs text-blue-600">
              Try to use new vocabulary in your responses to practice and
              reinforce learning
            </p>
          </div>

          {isPremium && (
            <div className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-200">
              <div className="flex items-center gap-2 mb-2">
                <Crown className="h-4 w-4 text-purple-600" />
                <span className="text-sm font-medium text-purple-800">
                  Premium Features
                </span>
              </div>
              <p className="text-xs text-purple-600">
                Vocabulary hints and translations are active for enhanced
                learning
              </p>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};
