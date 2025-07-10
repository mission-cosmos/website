
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Brain, Star, Target, Zap } from 'lucide-react';

interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  explanation: string;
}

const questions: Question[] = [
  {
    id: 1,
    question: "What is the closest planet to the Sun?",
    options: ["Venus", "Mercury", "Earth", "Mars"],
    correctAnswer: 1,
    difficulty: "Easy",
    explanation: "Mercury is the closest planet to the Sun, at an average distance of about 58 million kilometers."
  },
  {
    id: 2,
    question: "How many moons does Jupiter have?",
    options: ["12", "27", "95", "146"],
    correctAnswer: 2,
    difficulty: "Medium",
    explanation: "Jupiter has 95 confirmed moons, including the four largest known as the Galilean moons: Io, Europa, Ganymede, and Callisto."
  },
  {
    id: 3,
    question: "What is the name of the galaxy that contains our Solar System?",
    options: ["Andromeda", "Milky Way", "Whirlpool", "Sombrero"],
    correctAnswer: 1,
    difficulty: "Easy",
    explanation: "Our Solar System is located in the Milky Way galaxy, which contains over 100 billion stars."
  },
  {
    id: 4,
    question: "What is the temperature of the Sun's core approximately?",
    options: ["1 million°C", "5,778°C", "15 million°C", "100,000°C"],
    correctAnswer: 2,
    difficulty: "Hard",
    explanation: "The Sun's core temperature is approximately 15 million degrees Celsius, hot enough to sustain nuclear fusion."
  },
  {
    id: 5,
    question: "Which planet is known as the 'Red Planet'?",
    options: ["Venus", "Mercury", "Mars", "Jupiter"],
    correctAnswer: 2,
    difficulty: "Easy",
    explanation: "Mars is called the 'Red Planet' because of iron oxide (rust) on its surface, giving it a reddish appearance."
  },
  {
    id: 6,
    question: "What is the largest moon in our Solar System?",
    options: ["Europa", "Titan", "Ganymede", "Callisto"],
    correctAnswer: 2,
    difficulty: "Medium",
    explanation: "Ganymede, one of Jupiter's moons, is the largest moon in our Solar System and is even larger than the planet Mercury."
  },
  {
    id: 7,
    question: "How long does it take light from the Sun to reach Earth?",
    options: ["8 minutes", "1 hour", "1 day", "1 second"],
    correctAnswer: 0,
    difficulty: "Medium",
    explanation: "Light from the Sun takes approximately 8 minutes and 20 seconds to travel the 150 million kilometers to Earth."
  },
  {
    id: 8,
    question: "What is the name of the boundary around a black hole beyond which nothing can escape?",
    options: ["Event Horizon", "Photon Sphere", "Ergosphere", "Singularity"],
    correctAnswer: 0,
    difficulty: "Hard",
    explanation: "The Event Horizon is the boundary around a black hole beyond which the gravitational pull is so strong that nothing, not even light, can escape."
  },
  {
    id: 9,
    question: "Which planet has the most extreme temperature variations?",
    options: ["Venus", "Mercury", "Mars", "Pluto"],
    correctAnswer: 1,
    difficulty: "Medium",
    explanation: "Mercury has the most extreme temperature variations, ranging from 427°C during the day to -173°C at night due to its lack of atmosphere."
  },
  {
    id: 10,
    question: "What percentage of the universe is made up of dark matter?",
    options: ["5%", "15%", "27%", "68%"],
    correctAnswer: 2,
    difficulty: "Hard",
    explanation: "Dark matter makes up approximately 27% of the universe, while dark energy accounts for 68%, and normal matter only 5%."
  },
  {
    id: 11,
    question: "How many Earth days is one day on Venus?",
    options: ["24 hours", "59 days", "243 days", "365 days"],
    correctAnswer: 2,
    difficulty: "Medium",
    explanation: "One day on Venus lasts 243 Earth days, making it longer than a Venusian year (225 Earth days)."
  },
  {
    id: 12,
    question: "What is the Great Red Spot on Jupiter?",
    options: ["A volcano", "A storm system", "A moon", "A crater"],
    correctAnswer: 1,
    difficulty: "Easy",
    explanation: "The Great Red Spot is a massive storm system on Jupiter that has been raging for centuries and is larger than Earth."
  },
  {
    id: 13,
    question: "Which planet was discovered using mathematical predictions before being observed?",
    options: ["Uranus", "Neptune", "Pluto", "Saturn"],
    correctAnswer: 1,
    difficulty: "Hard",
    explanation: "Neptune was discovered in 1846 through mathematical predictions by Urbain Le Verrier and John Couch Adams based on perturbations in Uranus's orbit."
  },
  {
    id: 14,
    question: "What is the asteroid belt?",
    options: ["A ring around Saturn", "A region between Mars and Jupiter", "Debris around Earth", "Ice chunks beyond Neptune"],
    correctAnswer: 1,
    difficulty: "Easy",
    explanation: "The asteroid belt is a region between Mars and Jupiter containing millions of rocky objects, including the dwarf planet Ceres."
  },
  {
    id: 15,
    question: "Which moon in our solar system has active geysers?",
    options: ["Europa", "Enceladus", "Titan", "Io"],
    correctAnswer: 1,
    difficulty: "Medium",
    explanation: "Enceladus, one of Saturn's moons, has active ice geysers that shoot water vapor into space from its south polar region."
  },
  {
    id: 16,
    question: "What causes the seasons on Earth?",
    options: ["Distance from the Sun", "Axial tilt", "Solar flares", "Moon's gravity"],
    correctAnswer: 1,
    difficulty: "Medium",
    explanation: "Earth's seasons are caused by its 23.5-degree axial tilt, which changes how directly sunlight hits different parts of Earth throughout the year."
  },
  {
    id: 17,
    question: "How fast does the International Space Station orbit Earth?",
    options: ["17,500 mph", "25,000 mph", "11,000 mph", "30,000 mph"],
    correctAnswer: 0,
    difficulty: "Hard",
    explanation: "The ISS orbits Earth at approximately 17,500 mph (28,000 km/h), completing one orbit every 90 minutes."
  },
  {
    id: 18,
    question: "What is the Kuiper Belt?",
    options: ["A region of comets beyond Neptune", "An asteroid belt", "Saturn's rings", "A galaxy cluster"],
    correctAnswer: 0,
    difficulty: "Hard",
    explanation: "The Kuiper Belt is a region beyond Neptune containing icy objects and dwarf planets like Pluto, Eris, and Makemake."
  },
  {
    id: 19,
    question: "Which planet has the strongest magnetic field?",
    options: ["Earth", "Jupiter", "Saturn", "Uranus"],
    correctAnswer: 1,
    difficulty: "Medium",
    explanation: "Jupiter has the strongest magnetic field in our solar system, about 20,000 times stronger than Earth's."
  },
  {
    id: 20,
    question: "What type of star will our Sun become at the end of its life?",
    options: ["Black hole", "Neutron star", "White dwarf", "Red supergiant"],
    correctAnswer: 2,
    difficulty: "Medium",
    explanation: "Our Sun will eventually become a white dwarf star after going through its red giant phase in about 5 billion years."
  },
  {
    id: 21,
    question: "How many astronauts have walked on the Moon?",
    options: ["6", "12", "8", "16"],
    correctAnswer: 1,
    difficulty: "Easy",
    explanation: "Twelve astronauts have walked on the Moon during the Apollo missions between 1969 and 1972."
  },
  {
    id: 22,
    question: "What is the coldest planet in our solar system?",
    options: ["Neptune", "Uranus", "Pluto", "Saturn"],
    correctAnswer: 1,
    difficulty: "Medium",
    explanation: "Uranus is the coldest planet with temperatures dropping to -224°C (-371°F), even colder than Neptune despite being closer to the Sun."
  },
  {
    id: 23,
    question: "Which spacecraft was the first to leave our solar system?",
    options: ["Voyager 1", "Voyager 2", "Pioneer 10", "New Horizons"],
    correctAnswer: 0,
    difficulty: "Hard",
    explanation: "Voyager 1 became the first human-made object to enter interstellar space in 2012, after traveling for 35 years."
  },
  {
    id: 24,
    question: "What is the largest volcano in our solar system?",
    options: ["Mount Everest", "Olympus Mons", "Mauna Kea", "Vesuvius"],
    correctAnswer: 1,
    difficulty: "Easy",
    explanation: "Olympus Mons on Mars is the largest volcano in our solar system, standing about 69,000 feet (21 km) high."
  },
  {
    id: 25,
    question: "How long is a light-year?",
    options: ["9.46 trillion km", "1 million km", "150 million km", "1 billion km"],
    correctAnswer: 0,
    difficulty: "Hard",
    explanation: "A light-year is the distance light travels in one year, approximately 9.46 trillion kilometers (5.88 trillion miles)."
  }
];

export default function QuizCenter() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [quizStarted, setQuizStarted] = useState(false);
  const [difficulty, setDifficulty] = useState<'All' | 'Easy' | 'Medium' | 'Hard'>('All');
  const [filteredQuestions, setFilteredQuestions] = useState<Question[]>([]);
  const [showExplanation, setShowExplanation] = useState(false);

  useEffect(() => {
    const filtered = difficulty === 'All' 
      ? questions 
      : questions.filter(q => q.difficulty === difficulty);
    setFilteredQuestions(filtered.sort(() => Math.random() - 0.5));
  }, [difficulty]);

  const startQuiz = () => {
    setQuizStarted(true);
    setCurrentQuestion(0);
    setScore(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setShowExplanation(false);
  };

  const handleAnswerSelect = (answerIndex: number) => {
    if (selectedAnswer !== null) return;
    setSelectedAnswer(answerIndex);
    setShowExplanation(true);
    
    if (answerIndex === filteredQuestions[currentQuestion].correctAnswer) {
      setScore(score + 1);
    }
  };

  const nextQuestion = () => {
    if (currentQuestion + 1 < filteredQuestions.length) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
    } else {
      setShowResult(true);
    }
  };

  const resetQuiz = () => {
    setQuizStarted(false);
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setScore(0);
    setShowExplanation(false);
  };

  const getDifficultyColor = (diff: string) => {
    switch (diff) {
      case 'Easy': return 'text-green-400 border-green-400';
      case 'Medium': return 'text-yellow-400 border-yellow-400';
      case 'Hard': return 'text-red-400 border-red-400';
      default: return 'text-white border-white';
    }
  };

  const getScoreMessage = () => {
    const percentage = (score / filteredQuestions.length) * 100;
    if (percentage >= 90) return "🌟 Cosmic Master! Outstanding!";
    if (percentage >= 70) return "🚀 Space Explorer! Great job!";
    if (percentage >= 50) return "🌙 Lunar Learner! Keep going!";
    return "⭐ Future Astronaut! Practice makes perfect!";
  };

  if (!quizStarted) {
    return (
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 space-text">Cosmic Quiz Center</h2>
          <p className="text-xl text-gray-200 space-text">Test your knowledge of the universe!</p>
        </div>

        <div className="max-w-2xl mx-auto">
          <Card className="space-card border-white/20">
            <CardHeader className="text-center">
              <CardTitle className="text-white space-text flex items-center justify-center gap-2">
                <Brain className="h-8 w-8 text-purple-400" />
                Choose Your Challenge Level
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {(['All', 'Easy', 'Medium', 'Hard'] as const).map((level) => (
                  <Button
                    key={level}
                    onClick={() => setDifficulty(level)}
                    variant={difficulty === level ? "default" : "outline"}
                    className={`${difficulty === level ? 'bg-purple-500 text-white border-purple-500' : 'border-white/20 text-white hover:bg-white/10 bg-black/20'}`}
                  >
                    {level}
                  </Button>
                ))}
              </div>

              <div className="text-center space-y-4">
                <p className="text-gray-300 space-text">
                  Questions available: {filteredQuestions.length}
                </p>
                <div className="flex justify-center gap-4">
                  <Badge variant="outline" className="border-green-400 text-green-400">
                    Easy: Fun basics
                  </Badge>
                  <Badge variant="outline" className="border-yellow-400 text-yellow-400">
                    Medium: Challenge yourself
                  </Badge>
                  <Badge variant="outline" className="border-red-400 text-red-400">
                    Hard: Expert level
                  </Badge>
                </div>
              </div>

              <Button
                onClick={startQuiz}
                className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white font-bold py-3"
                disabled={filteredQuestions.length === 0}
              >
                <Zap className="h-5 w-5 mr-2" />
                Start Cosmic Quiz
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (showResult) {
    return (
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 space-text">Quiz Complete!</h2>
        </div>

        <div className="max-w-2xl mx-auto">
          <Card className="space-card border-white/20">
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <Target className="h-16 w-16 text-yellow-400" />
              </div>
              <CardTitle className="text-white space-text text-2xl">
                {getScoreMessage()}
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-6">
              <div className="text-4xl font-bold text-white space-text">
                {score} / {filteredQuestions.length}
              </div>
              <div className="text-xl text-gray-300 space-text">
                {Math.round((score / filteredQuestions.length) * 100)}% Correct
              </div>
              
              <div className="flex justify-center gap-4">
                <Button
                  onClick={resetQuiz}
                  className="bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white"
                >
                  Try Again
                </Button>
                <Button
                  onClick={() => {
                    setDifficulty('All');
                    resetQuiz();
                  }}
                  variant="outline"
                  className="border-white/20 text-white hover:bg-white/10 bg-black/20"
                >
                  Change Difficulty
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const question = filteredQuestions[currentQuestion];

  return (
    <div className="container mx-auto px-4">
      <div className="text-center mb-8">
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 space-text">Cosmic Quiz Center</h2>
        <div className="flex justify-center gap-4 items-center">
          <Badge variant="outline" className={`${getDifficultyColor(question.difficulty)}`}>
            {question.difficulty}
          </Badge>
          <Badge variant="outline" className="border-white/20 text-white">
            Question {currentQuestion + 1} of {filteredQuestions.length}
          </Badge>
          <Badge variant="outline" className="border-white/20 text-white">
            Score: {score}
          </Badge>
        </div>
      </div>

      <div className="max-w-3xl mx-auto">
        <Card className="space-card border-white/20">
          <CardHeader>
            <CardTitle className="text-white space-text text-xl leading-relaxed">
              {question.question}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-3">
              {question.options.map((option, index) => {
                let buttonClass = "w-full p-4 text-left border-white/20 text-white hover:bg-white/10 transition-all bg-black/20";
                
                if (selectedAnswer !== null) {
                  if (index === question.correctAnswer) {
                    buttonClass += " bg-green-500/20 border-green-500 text-green-400";
                  } else if (index === selectedAnswer && index !== question.correctAnswer) {
                    buttonClass += " bg-red-500/20 border-red-500 text-red-400";
                  }
                } else {
                  buttonClass += " hover:bg-white/20";
                }

                return (
                  <Button
                    key={index}
                    onClick={() => handleAnswerSelect(index)}
                    variant="outline"
                    className={buttonClass}
                    disabled={selectedAnswer !== null}
                  >
                    <span className="font-semibold mr-3">{String.fromCharCode(65 + index)}.</span>
                    {option}
                  </Button>
                );
              })}
            </div>

            {showExplanation && (
              <Card className="bg-blue-500/10 border-blue-500/30">
                <CardContent className="p-4">
                  <div className="flex items-start gap-2">
                    <Star className="h-5 w-5 text-blue-400 mt-0.5 flex-shrink-0" />
                    <p className="text-blue-100 space-text">{question.explanation}</p>
                  </div>
                </CardContent>
              </Card>
            )}

            {selectedAnswer !== null && (
              <div className="flex justify-center">
                <Button
                  onClick={nextQuestion}
                  className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white font-bold px-8"
                >
                  {currentQuestion + 1 < filteredQuestions.length ? 'Next Question' : 'See Results'}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
