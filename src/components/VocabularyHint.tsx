
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Volume2 } from "lucide-react";

interface VocabularyProps {
  vocabulary: {
    word: string;
    definition: string;
    pronunciation: string;
  };
}

export const VocabularyHint = ({ vocabulary }: VocabularyProps) => {
  const [showDefinition, setShowDefinition] = useState(false);

  const speakWord = () => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(vocabulary.word);
      utterance.lang = 'es-ES';
      speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="relative inline-block">
      <Button
        size="sm"
        variant="outline"
        className="text-xs h-6 px-2 bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100"
        onMouseEnter={() => setShowDefinition(true)}
        onMouseLeave={() => setShowDefinition(false)}
        onClick={speakWord}
      >
        {vocabulary.word}
        <Volume2 className="h-3 w-3 ml-1" />
      </Button>
      
      {showDefinition && (
        <Card className="absolute bottom-full left-0 mb-2 p-2 z-10 w-48 bg-white border shadow-lg">
          <div className="text-xs space-y-1">
            <p className="font-medium">{vocabulary.word}</p>
            <p className="text-gray-600">{vocabulary.definition}</p>
            <p className="text-blue-600 italic">/{vocabulary.pronunciation}/</p>
          </div>
        </Card>
      )}
    </div>
  );
};
