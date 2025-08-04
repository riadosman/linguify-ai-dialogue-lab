import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Mic, MicOff, Volume2, ChevronDown } from "lucide-react";

const CustomDropdown = ({
  targetLanguage,
  setTargetLanguage,
  translateLanguages,
  placeholder = "Select Language",
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const selectedLanguage = translateLanguages.find(
    (lang) => lang.code === targetLanguage
  );

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-3 border border-gray-300 rounded-lg bg-white text-left flex items-center justify-between hover:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <span className={selectedLanguage ? "text-gray-900" : "text-gray-500"}>
          {selectedLanguage ? selectedLanguage.name : placeholder}
        </span>
        <ChevronDown
          className={`w-4 h-4 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
          {translateLanguages.map((language) => (
            <button
              key={language.code}
              onClick={() => {
                setTargetLanguage(language.code);
                setIsOpen(false);
              }}
              className="w-full p-3 text-left hover:bg-blue-50 focus:outline-none focus:bg-blue-50"
            >
              {language.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

const SpeechRecognition = () => {
  const [isListening, setIsListening] = useState(false);
  const [spokenText, setSpokenText] = useState("");
  const [translatedText, setTranslatedText] = useState("");
  const [sourceLanguage, setSourceLanguage] = useState("en-US");
  const [targetLanguage, setTargetLanguage] = useState("es");
  const recognitionRef = useRef(null);

  const languages = [
    { code: "en-US", name: "English (US)" },
    { code: "tr-TR", name: "Turkish" },
    { code: "es-ES", name: "Spanish" },
    { code: "fr-FR", name: "French" },
    { code: "de-DE", name: "German" },
    { code: "it-IT", name: "Italian" },
    { code: "pt-PT", name: "Portuguese" },
    { code: "zh-CN", name: "Chinese (Mandarin)" },
    { code: "ja-JP", name: "Japanese" },
    { code: "ko-KR", name: "Korean" },
    { code: "ar-SA", name: "Arabic" },
  ];

  const translateLanguages = [
    { code: "es", name: "Spanish" },
    { code: "fr", name: "French" },
    { code: "de", name: "German" },
    { code: "it", name: "Italian" },
    { code: "pt", name: "Portuguese" },
    { code: "tr", name: "Turkish" },
    { code: "zh", name: "Chinese" },
    { code: "ja", name: "Japanese" },
    { code: "ko", name: "Korean" },
    { code: "ar", name: "Arabic" },
    { code: "en", name: "English" },
  ];

  // Source language dropdown data (using speech recognition language codes)
  const sourceLanguages = languages;

  useEffect(() => {
    // Initialize speech recognition
    if ("webkitSpeechRecognition" in window || "SpeechRecognition" in window) {
      const SpeechRecognition =
        window.webkitSpeechRecognition || window.SpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = sourceLanguage;

      recognitionRef.current.onresult = (event) => {
        let finalTranscript = "";
        for (let i = event.resultIndex; i < event.results.length; i++) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          }
        }
        if (finalTranscript) {
          setSpokenText(finalTranscript);
          // Only translate if target language is selected
          if (targetLanguage) {
            translateText(finalTranscript);
          }
        }
      };

      recognitionRef.current.onerror = (event) => {
        console.error("Speech recognition error:", event.error);
        setIsListening(false);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }

    return () => {
      // Cleanup
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [sourceLanguage, targetLanguage]);

  const translateText = async (text) => {
    if (!targetLanguage || !text.trim()) return;

    try {
      // For demo purposes, we'll simulate translation
      // In a real app, you would use your actual API key and endpoint
      const mockTranslations = {
        es: `[Spanish] ${text}`,
        fr: `[French] ${text}`,
        de: `[German] ${text}`,
        it: `[Italian] ${text}`,
        pt: `[Portuguese] ${text}`,
        tr: `[Turkish] ${text}`,
        zh: `[Chinese] ${text}`,
        ja: `[Japanese] ${text}`,
        ko: `[Korean] ${text}`,
        ar: `[Arabic] ${text}`,
        en: `[English] ${text}`,
      };

      const response = await fetch(
        "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-goog-api-key": import.meta.env.VITE_GOOGLE_API_KEY,
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text: `You are a skilled translator. Your goal is to translate the following text from ${getLanguageName(
                      sourceLanguage
                    )} to ${getLanguageName(
                      targetLanguage
                    )} while preserving the intended meaning and adapting it naturally to the target language. Do not translate literally. Text: "${text}" Only return the final translation. No explanations, no formatting, no quotes.`,
                  },
                ],
              },
            ],
          }),
        }
      );
      const data = await response.json();
      setTranslatedText(data.candidates[0].content.parts[0].text);
    } catch (error) {
      console.error("Translation error:", error);
      setTranslatedText("Translation error occurred");
    }
  };

  const getLanguageName = (code) => {
    const lang = [...languages, ...translateLanguages].find(
      (l) => l.code === code
    );
    return lang ? lang.name : code;
  };

  const startListening = () => {
    if (!targetLanguage) {
      alert("Please select a target language first");
      return;
    }

    if (recognitionRef.current) {
      setSpokenText("");
      setTranslatedText("");
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  };

  const speakText = (text) => {
    if ("speechSynthesis" in window && text) {
      const utterance = new SpeechSynthesisUtterance(text);

      // Map language codes to speech synthesis language codes
      const langMap = {
        es: "es-ES",
        fr: "fr-FR",
        de: "de-DE",
        it: "it-IT",
        pt: "pt-PT",
        tr: "tr-TR",
        zh: "zh-CN",
        ja: "ja-JP",
        ko: "ko-KR",
        ar: "ar-SA",
        en: "en-US",
      };

      utterance.lang = langMap[targetLanguage] || "en-US";
      speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6 bg-gradient-to-br from-blue-50 to-indigo-100 min-h-screen">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Real-time Speech Translator
        </h1>
        <p className="text-gray-600">
          Speak in one language, hear it in another
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Source Language (What you speak)
          </label>
          <CustomDropdown
            targetLanguage={sourceLanguage}
            setTargetLanguage={setSourceLanguage}
            translateLanguages={sourceLanguages}
            placeholder="Select source language"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Target Language (Translation)
          </label>
          <CustomDropdown
            targetLanguage={targetLanguage}
            setTargetLanguage={setTargetLanguage}
            translateLanguages={translateLanguages}
            placeholder="Select target language"
          />
        </div>
      </div>

      <div className="flex justify-center space-x-4 mb-8">
        <Button
          onClick={startListening}
          disabled={isListening || !targetLanguage}
          size="lg"
          className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-full border-0 disabled:opacity-50"
        >
          <Mic className="w-5 h-5 mr-2" />
          Start Listening
        </Button>

        <Button
          onClick={stopListening}
          disabled={!isListening}
          variant="outline"
          size="lg"
          className="border-red-500 text-red-500 hover:bg-red-50 px-8 py-4 rounded-full disabled:opacity-50"
        >
          <MicOff className="w-5 h-5 mr-2" />
          Stop Listening
        </Button>
      </div>

      {isListening && (
        <div className="text-center">
          <div className="inline-flex items-center space-x-2 text-blue-600 animate-pulse">
            <Mic className="w-5 h-5" />
            <span className="font-medium">Listening...</span>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">
              Original Text ({getLanguageName(sourceLanguage)})
            </h3>
            <div
              className={`w-3 h-3 rounded-full ${
                spokenText ? "bg-green-500" : "bg-gray-300"
              }`}
            ></div>
          </div>
          <div className="min-h-[120px] p-4 bg-gray-50 rounded-lg border">
            <p className="text-gray-800">
              {spokenText || "Your speech will appear here..."}
            </p>
          </div>
        </Card>

        <Card className="p-6 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">
              Translated Text{" "}
              {targetLanguage && `(${getLanguageName(targetLanguage)})`}
            </h3>
            {translatedText && (
              <Button
                onClick={() => speakText(translatedText)}
                variant="ghost"
                size="sm"
                className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
              >
                <Volume2 className="w-4 h-4" />
              </Button>
            )}
          </div>
          <div className="min-h-[120px] p-4 bg-blue-50 rounded-lg border">
            <p className="text-gray-800">
              {translatedText ||
                (targetLanguage
                  ? "Translation will appear here..."
                  : "Please select a target language first")}
            </p>
          </div>
        </Card>
      </div>

      {!targetLanguage && (
        <div className="text-center p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-yellow-800">
            Please select a target language to start translating
          </p>
        </div>
      )}
    </div>
  );
};

export default SpeechRecognition;
