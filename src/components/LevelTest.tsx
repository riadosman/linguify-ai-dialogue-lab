import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  CheckCircle,
  Circle,
  ArrowRight,
  ArrowLeft,
  Globe,
  BookOpen,
  Star,
  Trophy,
  Clock,
} from "lucide-react";
import { useLanguage } from "./../store/useLanguage";
import { useAuth } from "./../store/useAuth";
interface Language {
  code: string;
  name: string;
  flag: string;
}

interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  level: "beginner" | "intermediate" | "advanced";
  category: "grammar" | "vocabulary" | "comprehension";
}

const languages: Language[] = [
  { code: "es", name: "Spanish", flag: "🇪🇸" },
  { code: "fr", name: "French", flag: "🇫🇷" },
  { code: "de", name: "German", flag: "🇩🇪" },
  { code: "it", name: "Italian", flag: "🇮🇹" },
  { code: "pt", name: "Portuguese", flag: "🇵🇹" },
  { code: "ja", name: "Japanese", flag: "🇯🇵" },
];

const spanishQuestions: Question[] = [
  // Beginner level
  {
    id: 1,
    question: "How do you say 'Hello' in Spanish?",
    options: ["Adiós", "Hola", "Gracias", "Por favor"],
    correctAnswer: 1,
    level: "beginner",
    category: "vocabulary",
  },
  {
    id: 2,
    question: "Complete: 'Me _____ María'",
    options: ["soy", "llamo", "tengo", "estoy"],
    correctAnswer: 1,
    level: "beginner",
    category: "grammar",
  },
  {
    id: 3,
    question: "What does 'casa' mean?",
    options: ["car", "house", "book", "table"],
    correctAnswer: 1,
    level: "beginner",
    category: "vocabulary",
  },
  {
    id: 4,
    question: "Choose the correct form: 'Yo _____ estudiante'",
    options: ["es", "eres", "soy", "son"],
    correctAnswer: 2,
    level: "beginner",
    category: "grammar",
  },
  // Intermediate level
  {
    id: 5,
    question: "Complete with the correct past tense: 'Ayer _____ al cine'",
    options: ["voy", "fui", "iré", "vaya"],
    correctAnswer: 1,
    level: "intermediate",
    category: "grammar",
  },
  {
    id: 6,
    question: "What's the meaning of 'estrenar'?",
    options: [
      "to return",
      "to premiere/wear for first time",
      "to remember",
      "to explain",
    ],
    correctAnswer: 1,
    level: "intermediate",
    category: "vocabulary",
  },
  {
    id: 7,
    question: "Choose the correct subjunctive: 'Espero que _____ bien'",
    options: ["estás", "estés", "estar", "estarás"],
    correctAnswer: 1,
    level: "intermediate",
    category: "grammar",
  },
  {
    id: 8,
    question: "Read: 'Aunque llueva, saldremos.' This means:",
    options: [
      "Because it's raining, we'll go out",
      "If it rains, we won't go out",
      "Even if it rains, we'll go out",
      "It's not raining, so we'll go out",
    ],
    correctAnswer: 2,
    level: "intermediate",
    category: "comprehension",
  },
  // Advanced level
  {
    id: 9,
    question: "Complete: 'Si hubiera sabido, no _____ venido'",
    options: ["habría", "había", "he", "haya"],
    correctAnswer: 0,
    level: "advanced",
    category: "grammar",
  },
  {
    id: 10,
    question: "What does 'desentrañar' mean?",
    options: ["to entangle", "to unravel/decipher", "to enter", "to train"],
    correctAnswer: 1,
    level: "advanced",
    category: "vocabulary",
  },
  {
    id: 11,
    question: "The phrase 'estar en las nubes' means:",
    options: [
      "to be in the clouds literally",
      "to be daydreaming",
      "to be angry",
      "to be confused",
    ],
    correctAnswer: 1,
    level: "advanced",
    category: "comprehension",
  },
  {
    id: 12,
    question:
      "Choose the most appropriate register: Formal way to say 'I need help':",
    options: [
      "Necesito ayuda",
      "Me hace falta una mano",
      "Requiero asistencia",
      "Échame un cable",
    ],
    correctAnswer: 2,
    level: "advanced",
    category: "grammar",
  },
];
const questionsByLanguage: Record<string, Question[]> = {
  es: [...spanishQuestions],
  fr: [
    {
      id: 1,
      question: "Complete: 'Je _____ français.'",
      options: ["es", "suis", "sommes", "êtes"],
      correctAnswer: 1,
      level: "beginner",
      category: "grammar",
    },
    {
      id: 2,
      question: "Complete: 'Tu _____ un livre.'",
      options: ["as", "ai", "a", "avons"],
      correctAnswer: 0,
      level: "beginner",
      category: "grammar",
    },
    {
      id: 3,
      question: "Choose the correct article: '_____ fille est gentille.'",
      options: ["Le", "La", "Les", "L’"],
      correctAnswer: 1,
      level: "beginner",
      category: "grammar",
    },
    {
      id: 4,
      question: "Complete: 'Nous _____ à la maison.'",
      options: ["allez", "va", "allons", "vais"],
      correctAnswer: 2,
      level: "beginner",
      category: "grammar",
    },
    {
      id: 5,
      question:
        "Complete: 'Quand j'étais petit, je _____ au parc tous les jours.'",
      options: ["vais", "suis allé", "allais", "irais"],
      correctAnswer: 2,
      level: "intermediate",
      category: "grammar",
    },
    {
      id: 6,
      question:
        "Choose the correct past participle: 'Elle a _____ une robe rouge.'",
      options: ["mis", "mise", "mettre", "mises"],
      correctAnswer: 0,
      level: "intermediate",
      category: "grammar",
    },
    {
      id: 7,
      question: "Complete: 'Si j'avais de l'argent, je _____ une voiture.'",
      options: ["achète", "achetais", "achèterais", "acheté"],
      correctAnswer: 2,
      level: "intermediate",
      category: "grammar",
    },
    {
      id: 8,
      question:
        "Choose the correct relative pronoun: 'L'homme _____ parle est mon oncle.'",
      options: ["que", "qui", "dont", "où"],
      correctAnswer: 1,
      level: "intermediate",
      category: "grammar",
    },
    {
      id: 9,
      question: "Choose the correct form: 'Il faut que tu _____ attention.'",
      options: ["fais", "faisais", "fasses", "feras"],
      correctAnswer: 2,
      level: "advanced",
      category: "grammar",
    },
    {
      id: 10,
      question: "Complete: 'Bien qu’il _____ tard, il continue à travailler.'",
      options: ["est", "soit", "sera", "était"],
      correctAnswer: 1,
      level: "advanced",
      category: "grammar",
    },
    {
      id: 11,
      question: "Complete: 'Il aurait fallu que nous _____ plus tôt.'",
      options: ["partons", "partions", "partirons", "parti"],
      correctAnswer: 1,
      level: "advanced",
      category: "grammar",
    },
    {
      id: 12,
      question: "Dès qu’il sera arrivé, nous _____.",
      options: ["mangerons", "mangeons", "mangions", "avons mangé"],
      correctAnswer: 0,
      level: "advanced",
      category: "grammar",
    },
  ],
  de: [
    {
      id: 1,
      question: "Complete: 'Ich _____ müde.'",
      options: ["bin", "bist", "ist", "seid"],
      correctAnswer: 0,
      level: "beginner",
      category: "grammar",
    },
    {
      id: 2,
      question: "Complete: 'Du _____ ein Buch.'",
      options: ["hat", "hast", "haben", "habt"],
      correctAnswer: 1,
      level: "beginner",
      category: "grammar",
    },
    {
      id: 3,
      question: "Wähle den richtigen Artikel: '_____ Mann liest eine Zeitung.'",
      options: ["Der", "Die", "Das", "Den"],
      correctAnswer: 0,
      level: "beginner",
      category: "grammar",
    },
    {
      id: 4,
      question: "Complete: 'Wir _____ in Berlin.'",
      options: ["wohne", "wohnst", "wohnt", "wohnen"],
      correctAnswer: 3,
      level: "beginner",
      category: "grammar",
    },
    {
      id: 5,
      question:
        "Wähle die richtige Zeitform: 'Als Kind _____ ich gern Fußball.'",
      options: ["spielte", "spiele", "gespielt", "spielten"],
      correctAnswer: 0,
      level: "intermediate",
      category: "grammar",
    },
    {
      id: 6,
      question: "Complete: 'Er sagt, dass er nicht _____ kann.'",
      options: ["kommt", "kommen", "kam", "gekommen"],
      correctAnswer: 1,
      level: "intermediate",
      category: "grammar",
    },
    {
      id: 7,
      question:
        "Wähle das richtige Reflexivpronomen: 'Ich freue mich _____ das Wochenende.'",
      options: ["auf", "über", "mit", "für"],
      correctAnswer: 0,
      level: "intermediate",
      category: "grammar",
    },
    {
      id: 8,
      question: "Complete: 'Wir wissen nicht, ob sie _____.'",
      options: ["kommt", "gekommen", "kommen", "kam"],
      correctAnswer: 0,
      level: "intermediate",
      category: "grammar",
    },
    {
      id: 9,
      question: "Complete: 'Obwohl es regnet, _____ wir spazieren.'",
      options: ["gehen", "gingen", "gegangen", "geht"],
      correctAnswer: 0,
      level: "advanced",
      category: "grammar",
    },
    {
      id: 10,
      question:
        "Wähle die korrekte Form: 'Wenn ich Zeit _____, würde ich mehr lesen.'",
      options: ["hätte", "habe", "hatte", "hat"],
      correctAnswer: 0,
      level: "advanced",
      category: "grammar",
    },
    {
      id: 11,
      question:
        "Complete: 'Hätte ich das gewusst, _____ ich es anders gemacht.'",
      options: ["würde", "habe", "hätte", "wäre"],
      correctAnswer: 2,
      level: "advanced",
      category: "grammar",
    },
    {
      id: 12,
      question:
        "Wähle die richtige Wortstellung: 'Er hat gesagt, dass er morgen _____.'",
      options: ["kommt", "kommt morgen", "morgen kommt", "wird kommen"],
      correctAnswer: 2,
      level: "advanced",
      category: "grammar",
    },
  ],
  it: [
    {
      id: 1,
      question: "Complete: 'Io _____ italiano.'",
      options: ["sei", "è", "sono", "siamo"],
      correctAnswer: 2,
      level: "beginner",
      category: "grammar",
    },
    {
      id: 2,
      question: "Complete: 'Tu _____ una ragazza.'",
      options: ["sei", "è", "sono", "siete"],
      correctAnswer: 0,
      level: "beginner",
      category: "grammar",
    },
    {
      id: 3,
      question: "Choose the correct article: '_____ mela è rossa.'",
      options: ["Il", "Lo", "La", "L’"],
      correctAnswer: 3,
      level: "beginner",
      category: "grammar",
    },
    {
      id: 4,
      question: "Complete: 'Noi _____ amici.'",
      options: ["siete", "siamo", "sono", "sono"],
      correctAnswer: 1,
      level: "beginner",
      category: "grammar",
    },
    {
      id: 5,
      question: "Complete: 'Quando ero piccolo, _____ sempre al parco.'",
      options: ["giocavo", "gioco", "giocherò", "ho giocato"],
      correctAnswer: 0,
      level: "intermediate",
      category: "grammar",
    },
    {
      id: 6,
      question: "Choose the correct tense: 'Ieri noi _____ al cinema.'",
      options: ["andiamo", "andavamo", "siamo andati", "andremo"],
      correctAnswer: 2,
      level: "intermediate",
      category: "grammar",
    },
    {
      id: 7,
      question: "Complete: 'Se avessi tempo, _____ più.'",
      options: ["studio", "studierò", "studiai", "studerei"],
      correctAnswer: 3,
      level: "intermediate",
      category: "grammar",
    },
    {
      id: 8,
      question:
        "Choose the correct relative pronoun: 'La ragazza _____ parla è mia sorella.'",
      options: ["che", "cui", "dove", "quale"],
      correctAnswer: 0,
      level: "intermediate",
      category: "grammar",
    },
    {
      id: 9,
      question: "Complete: 'Benché _____ stanco, ha continuato a lavorare.'",
      options: ["è", "sia", "era", "sarà"],
      correctAnswer: 1,
      level: "advanced",
      category: "grammar",
    },
    {
      id: 10,
      question: "Choose the correct form: 'Penso che lui _____ arrivato.'",
      options: ["è", "sia", "sarà", "sarebbe"],
      correctAnswer: 1,
      level: "advanced",
      category: "grammar",
    },
    {
      id: 11,
      question: "Complete: 'Avrei voluto che tu _____ con noi.'",
      options: ["vieni", "verresti", "fossi venuto", "venga"],
      correctAnswer: 2,
      level: "advanced",
      category: "grammar",
    },
    {
      id: 12,
      question:
        "Choose the correct construction: 'Nonostante _____, è uscito.'",
      options: ["piove", "piovesse", "piovuto", "piovrà"],
      correctAnswer: 1,
      level: "advanced",
      category: "grammar",
    },
  ],
  pt: [
    {
      id: 1,
      question: "Complete: 'Eu _____ estudante.'",
      options: ["sou", "é", "está", "são"],
      correctAnswer: 0,
      level: "beginner",
      category: "grammar",
    },
    {
      id: 2,
      question: "Complete: 'Tu _____ brasileiro?'",
      options: ["sou", "és", "é", "são"],
      correctAnswer: 1,
      level: "beginner",
      category: "grammar",
    },
    {
      id: 3,
      question: "Complete: 'Ele _____ muito alto.'",
      options: ["sou", "é", "está", "são"],
      correctAnswer: 1,
      level: "beginner",
      category: "grammar",
    },
    {
      id: 4,
      question: "Complete: 'Nós _____ felizes.'",
      options: ["sou", "são", "estamos", "está"],
      correctAnswer: 2,
      level: "beginner",
      category: "grammar",
    },
    {
      id: 5,
      question: "Complete: 'Vocês _____ prontos?'",
      options: ["estão", "estamos", "sou", "é"],
      correctAnswer: 0,
      level: "intermediate",
      category: "grammar",
    },
    {
      id: 6,
      question: "Complete: 'Eu _____ uma maçã.'",
      options: ["como", "come", "comes", "comem"],
      correctAnswer: 0,
      level: "intermediate",
      category: "grammar",
    },
    {
      id: 7,
      question: "Complete: 'Tu _____ café de manhã?'",
      options: ["bebe", "bebes", "bebem", "bebemos"],
      correctAnswer: 1,
      level: "intermediate",
      category: "grammar",
    },
    {
      id: 8,
      question: "Complete: 'Ela _____ um carro vermelho.'",
      options: ["tem", "tenho", "têm", "tens"],
      correctAnswer: 0,
      level: "intermediate",
      category: "grammar",
    },
    {
      id: 9,
      question: "Complete: 'Nós _____ português.'",
      options: ["falam", "fala", "falamos", "falas"],
      correctAnswer: 2,
      level: "advanced",
      category: "grammar",
    },
    {
      id: 10,
      question: "Complete: 'Eles _____ estudar hoje.'",
      options: ["vai", "vão", "vamos", "vou"],
      correctAnswer: 1,
      level: "advanced",
      category: "grammar",
    },
    {
      id: 11,
      question: "Complete: 'Eu não _____ tarde.'",
      options: ["chego", "chega", "chegam", "chegas"],
      correctAnswer: 0,
      level: "advanced",
      category: "grammar",
    },
    {
      id: 12,
      question:
        "Choose the correct form: 'Se eu _____ dinheiro, viajaria mais.'",
      options: ["tenho", "tivesse", "tive", "terei"],
      correctAnswer: 1,
      level: "advanced",
      category: "grammar",
    },
  ],
  ja: [
    {
      id: 1,
      question: "Complete: 『私は学生_____。』",
      options: ["です", "ます", "だ", "で"],
      correctAnswer: 0,
      level: "beginner",
      category: "grammar",
    },
    {
      id: 2,
      question: "Complete: 『これはペン_____。』",
      options: ["です", "だ", "に", "を"],
      correctAnswer: 0,
      level: "beginner",
      category: "grammar",
    },
    {
      id: 3,
      question: "Complete: 『猫_____好きです。』",
      options: ["が", "は", "を", "に"],
      correctAnswer: 0,
      level: "beginner",
      category: "grammar",
    },
    {
      id: 4,
      question: "Complete: 『学校_____行きます。』",
      options: ["に", "で", "へ", "と"],
      correctAnswer: 0,
      level: "beginner",
      category: "grammar",
    },
    {
      id: 5,
      question: "Choose the correct form: 『昨日、映画を_____。』",
      options: ["見ました", "見ます", "見る", "見て"],
      correctAnswer: 0,
      level: "intermediate",
      category: "grammar",
    },
    {
      id: 6,
      question: "Complete: 『もし時間があったら、もっと_____。』",
      options: ["勉強します", "勉強した", "勉強する", "勉強したい"],
      correctAnswer: 2,
      level: "intermediate",
      category: "grammar",
    },
    {
      id: 7,
      question: "Complete: 『彼は医者_____なりたいです。』",
      options: ["に", "が", "を", "と"],
      correctAnswer: 0,
      level: "intermediate",
      category: "grammar",
    },
    {
      id: 8,
      question: "Complete: 『電車が_____から、遅れました。』",
      options: ["遅れた", "遅れて", "遅い", "遅そう"],
      correctAnswer: 1,
      level: "intermediate",
      category: "grammar",
    },
    {
      id: 9,
      question: "Choose the correct form: 『勉強し_____ば、合格できます。』",
      options: ["たら", "れば", "なければ", "ば"],
      correctAnswer: 1,
      level: "advanced",
      category: "grammar",
    },
    {
      id: 10,
      question: "Complete: 『彼は忙しい_____、来られませんでした。』",
      options: ["ので", "から", "が", "けれども"],
      correctAnswer: 3,
      level: "advanced",
      category: "grammar",
    },
    {
      id: 11,
      question:
        "Choose the correct form: 『もし雨が降っていたら、外に_____。』",
      options: ["行かなかった", "行きません", "行きます", "行った"],
      correctAnswer: 0,
      level: "advanced",
      category: "grammar",
    },
    {
      id: 12,
      question: "Complete: 『先生は学生に勉強するように_____。』",
      options: ["言いました", "言いません", "言って", "言う"],
      correctAnswer: 0,
      level: "advanced",
      category: "grammar",
    },
  ],
};

type TestStage = "language-selection" | "testing" | "results";

export default function LevelTestPage({ setActiveView }) {
  const [stage, setStage] = useState<TestStage>("language-selection");
  const [selectedLanguage, setSelectedLanguage] = useState<Language | null>(
    null
  );
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes
  const [testStarted, setTestStarted] = useState(false);
  const { setLevel } = useLanguage();
  const token = useAuth.getState().token;
  // Timer effect
  useEffect(() => {
    if (testStarted && timeLeft > 0 && stage === "testing") {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && stage === "testing") {
      completeTest();
    }
  }, [timeLeft, testStarted, stage]);

  const startTest = () => {
    setStage("testing");
    setTestStarted(true);
    setTimeLeft(300);
  };

  const handleAnswerSelect = (answerIndex: number) => {
    setSelectedAnswer(answerIndex);
  };

  const nextQuestion = () => {
    if (selectedAnswer !== null) {
      const newAnswers = [...answers];
      newAnswers[currentQuestion] = selectedAnswer;
      setAnswers(newAnswers);
      setSelectedAnswer(null);

      if (
        currentQuestion <
        questionsByLanguage[selectedLanguage?.code || "es"].length - 1
      ) {
        setCurrentQuestion(currentQuestion + 1);
      } else {
        completeTest();
      }
    }
  };

  const previousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
      setSelectedAnswer(answers[currentQuestion - 1] ?? null);
    }
  };

  const completeTest = () => {
    setStage("results");
  };

  const calculateResults = () => {
    let beginnerCorrect = 0;
    let intermediateCorrect = 0;
    let advancedCorrect = 0;
    let totalCorrect = 0;
    const currentQuestions =
      questionsByLanguage[selectedLanguage?.code || "es"];

    answers.forEach((answer, index) => {
      if (answer === currentQuestions[index]?.correctAnswer) {
        totalCorrect++;
        const level = currentQuestions[index].level;
        if (level === "beginner") beginnerCorrect++;
        else if (level === "intermediate") intermediateCorrect++;
        else if (level === "advanced") advancedCorrect++;
      }
    });

    // Determine level based on performance
    let recommendedLevel: "beginner" | "intermediate" | "advanced";
    let levelDescription: string;
    let levelColor: string;

    if (beginnerCorrect <= 2) {
      recommendedLevel = "beginner";
      levelDescription =
        "You're just starting your language journey. Focus on basic vocabulary and simple sentence structures.";
      levelColor = "text-green-600";
    } else if (intermediateCorrect >= 3 && advancedCorrect >= 2) {
      recommendedLevel = "advanced";
      levelDescription =
        "You have a strong grasp of the language. Ready for complex conversations and nuanced expressions.";
      levelColor = "text-purple-600";
    } else {
      recommendedLevel = "intermediate";
      levelDescription =
        "You have a good foundation. Ready to explore more complex grammar and expand your vocabulary.";
      levelColor = "text-blue-600";
    }
    const res = fetch("http://localhost:3000/api/results", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `${token}`,
      },
      body: JSON.stringify({
        totalCorrect,
        totalQuestions:
          questionsByLanguage[selectedLanguage?.code || "es"].length,

        percentage: Math.round((totalCorrect / spanishQuestions.length) * 100),
        recommendedLevel,
        levelDescription,
        levelColor,
        beginnerCorrect,
        intermediateCorrect,
        advancedCorrect,
      }),
    });

    return {
      totalCorrect,
      totalQuestions:
        questionsByLanguage[selectedLanguage?.code || "es"].length,

      percentage: Math.round((totalCorrect / spanishQuestions.length) * 100),
      recommendedLevel,
      levelDescription,
      levelColor,
      beginnerCorrect,
      intermediateCorrect,
      advancedCorrect,
    };
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const restartTest = () => {
    setStage("language-selection");
    setCurrentQuestion(0);
    setAnswers([]);
    setSelectedAnswer(null);
    setTimeLeft(300);
    setTestStarted(false);
    setSelectedLanguage(null);
  };

  if (stage === "language-selection") {
    return (
      <div className="min-h-[calc(100vh-64px)] bg-gradient-to-br from-indigo-50 via-white to-emerald-50">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-600 text-white rounded-full mb-4">
                <Globe className="h-8 w-8" />
              </div>
              <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                Language Level Assessment
              </h1>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Discover your proficiency level and get personalized learning
                recommendations. This comprehensive test takes about 5 minutes
                to complete.
              </p>
            </div>

            <Card className="p-6 lg:p-8 mb-8">
              <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-indigo-600" />
                Choose Your Target Language
              </h2>

              <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                {languages.map((language) => (
                  <div
                    key={language.code}
                    onClick={() => setSelectedLanguage(language)}
                    className={`p-4 rounded-lg border-2 cursor-pointer transition-all hover:shadow-md ${
                      selectedLanguage?.code === language.code
                        ? "border-indigo-600 bg-indigo-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div className="text-center">
                      <div className="text-3xl mb-2">{language.flag}</div>
                      <div className="font-medium text-gray-900">
                        {language.name}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {selectedLanguage && (
              <Card className="p-6 lg:p-8">
                <div className="flex items-start gap-4 mb-6">
                  <div className="text-4xl">{selectedLanguage.flag}</div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">
                      {selectedLanguage.name} Level Test
                    </h3>
                    <p className="text-gray-600 mt-1">
                      Ready to assess your {selectedLanguage.name} proficiency?
                    </p>
                  </div>
                </div>

                <div className="grid md:grid-cols-3 gap-4 mb-6">
                  <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                    <Clock className="h-5 w-5 text-blue-600" />
                    <div>
                      <div className="font-medium text-blue-900">5 Minutes</div>
                      <div className="text-sm text-blue-700">Time limit</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                    <BookOpen className="h-5 w-5 text-green-600" />
                    <div>
                      <div className="font-medium text-green-900">
                        12 Questions
                      </div>
                      <div className="text-sm text-green-700">
                        Mixed difficulty
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
                    <Star className="h-5 w-5 text-purple-600" />
                    <div>
                      <div className="font-medium text-purple-900">
                        Personalized
                      </div>
                      <div className="text-sm text-purple-700">Results</div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-center">
                  <Button
                    onClick={startTest}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3"
                  >
                    Start Test
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (stage === "testing") {
    const currentQuestions =
      questionsByLanguage[selectedLanguage?.code || "es"];
    const progress = ((currentQuestion + 1) / currentQuestions.length) * 100;
    const question = currentQuestions[currentQuestion];

    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-emerald-50">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-3xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="text-2xl">{selectedLanguage?.flag}</div>
                <div>
                  <h1 className="text-xl font-semibold text-gray-900">
                    {selectedLanguage?.name} Level Test
                  </h1>
                  <p className="text-sm text-gray-600">
                    Question {currentQuestion + 1} of {spanishQuestions.length}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 text-sm">
                <Clock className="h-4 w-4 text-gray-600" />
                <span
                  className={`font-mono ${
                    timeLeft < 60 ? "text-red-600" : "text-gray-600"
                  }`}
                >
                  {formatTime(timeLeft)}
                </span>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mb-8">
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>Progress</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            {/* Question */}
            <Card className="p-6 lg:p-8 mb-6">
              <div className="flex items-start gap-3 mb-6">
                <Badge variant="outline" className="capitalize">
                  {question.level}
                </Badge>
                <Badge variant="outline" className="capitalize">
                  {question.category}
                </Badge>
              </div>

              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                {question.question}
              </h2>

              <div className="space-y-3">
                {question.options.map((option, index) => (
                  <div
                    key={index}
                    onClick={() => handleAnswerSelect(index)}
                    className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                      selectedAnswer === index
                        ? "border-indigo-600 bg-indigo-50"
                        : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {selectedAnswer === index ? (
                        <CheckCircle className="h-5 w-5 text-indigo-600" />
                      ) : (
                        <Circle className="h-5 w-5 text-gray-400" />
                      )}
                      <span className="text-gray-900">{option}</span>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Navigation */}
            <div className="flex justify-between">
              <Button
                variant="outline"
                onClick={previousQuestion}
                disabled={currentQuestion === 0}
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Previous
              </Button>

              <Button
                onClick={nextQuestion}
                disabled={selectedAnswer === null}
                className="bg-indigo-600 hover:bg-indigo-700"
              >
                {currentQuestion === spanishQuestions.length - 1
                  ? "Finish Test"
                  : "Next"}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Results stage
  const results = calculateResults();

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-emerald-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-600 text-white rounded-full mb-6">
              <Trophy className="h-8 w-8" />
            </div>
            <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Test Complete!
            </h1>
            <p className="text-lg text-gray-600">
              Here are your personalized results for {selectedLanguage?.name}
            </p>
          </div>

          {/* Overall Score */}
          <Card className="p-6 lg:p-8 mb-8 text-center">
            <div className="text-6xl font-bold text-indigo-600 mb-2">
              {results.percentage}%
            </div>
            <p className="text-gray-600 mb-4">
              You got {results.totalCorrect} out of {results.totalQuestions}{" "}
              questions correct
            </p>

            <div
              className={`text-2xl font-semibold mb-2 capitalize ${results.levelColor}`}
            >
              {results.recommendedLevel} Level
            </div>
            <p className="text-gray-700 max-w-2xl mx-auto">
              {results.levelDescription}
            </p>
          </Card>

          {/* Detailed Breakdown */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <Card className="p-6 text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">
                {results.beginnerCorrect}/4
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Beginner</h3>
              <p className="text-sm text-gray-600">
                Basic vocabulary and grammar
              </p>
            </Card>

            <Card className="p-6 text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">
                {results.intermediateCorrect}/4
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Intermediate</h3>
              <p className="text-sm text-gray-600">
                Complex structures and tenses
              </p>
            </Card>

            <Card className="p-6 text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">
                {results.advancedCorrect}/4
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Advanced</h3>
              <p className="text-sm text-gray-600">
                Nuanced expressions and idioms
              </p>
            </Card>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={restartTest}
              variant="outline"
              className="px-8 py-3"
            >
              Take Test Again
            </Button>
            <Button
              onClick={() => {
                setLevel(results.recommendedLevel);
                setActiveView("chat");
              }}
              className="bg-indigo-600 hover:bg-indigo-700 px-8 py-3"
            >
              Start Learning at {results.recommendedLevel} Level
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
