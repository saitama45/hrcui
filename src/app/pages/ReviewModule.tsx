import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Progress } from '../components/ui/progress';
import { Badge } from '../components/ui/badge';
import { ArrowLeft, Clock, CheckCircle2, XCircle, ChevronRight } from 'lucide-react';
import { mockQuestions, modules } from '../utils/mockData';

export function ReviewModule() {
  const navigate = useNavigate();
  const { moduleId } = useParams();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [sessionStartTime] = useState(Date.now());
  const [elapsedTime, setElapsedTime] = useState(0);

  const module = modules.find(m => m.id === moduleId);
  const currentQuestion = mockQuestions[currentQuestionIndex % mockQuestions.length];

  // Timer for session
  useEffect(() => {
    const interval = setInterval(() => {
      setElapsedTime(Math.floor((Date.now() - sessionStartTime) / 1000));
    }, 1000);
    return () => clearInterval(interval);
  }, [sessionStartTime]);

  const handleAnswerSelect = (answerIndex: number) => {
    if (showResult) return;
    setSelectedAnswer(answerIndex);
  };

  const handleSubmit = () => {
    if (selectedAnswer === null) return;
    
    const isCorrect = selectedAnswer === currentQuestion.correctAnswer;
    if (isCorrect) {
      const points = currentQuestion.cognitiveLevel === 'higher' ? 9 : 3;
      setScore(score + points);
    }
    setShowResult(true);
  };

  const handleNext = () => {
    if (currentQuestionIndex < mockQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(null);
      setShowResult(false);
    } else {
      // Session complete
      navigate('/dashboard');
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = ((currentQuestionIndex + 1) / mockQuestions.length) * 100;

  if (!module) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <Button onClick={() => navigate('/dashboard')} variant="outline">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Button>
        <p className="mt-4">Module not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-900 to-blue-700 text-white p-4">
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-2 hover:bg-blue-800 px-3 py-2 rounded transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back</span>
          </button>
          <div className="flex items-center gap-2 bg-white/20 px-3 py-1 rounded-full">
            <Clock className="w-4 h-4" />
            <span className="font-mono">{formatTime(elapsedTime)}</span>
          </div>
        </div>

        <h1 className="font-bold mb-1">{module.title}</h1>
        <p className="text-blue-100 text-sm mb-3">{module.domain}</p>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Question {currentQuestionIndex + 1} of {mockQuestions.length}</span>
            <span>Score: {score}</span>
          </div>
          <Progress value={progress} className="h-2 bg-blue-800" />
        </div>
      </div>

      {/* Question Content */}
      <div className="p-4 space-y-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-start gap-2 mb-4">
              <Badge className={currentQuestion.cognitiveLevel === 'higher' ? 'bg-green-600' : 'bg-blue-600'}>
                {currentQuestion.cognitiveLevel === 'higher' ? '9 pts' : '3 pts'}
              </Badge>
              <Badge variant="outline">{currentQuestion.domain}</Badge>
            </div>

            <h2 className="text-lg font-semibold mb-6 leading-relaxed">
              {currentQuestion.text}
            </h2>

            <div className="space-y-3">
              {currentQuestion.options.map((option, index) => {
                const isSelected = selectedAnswer === index;
                const isCorrect = index === currentQuestion.correctAnswer;
                const showCorrectAnswer = showResult && isCorrect;
                const showIncorrectAnswer = showResult && isSelected && !isCorrect;

                let className = "p-4 border-2 rounded-lg text-left transition-all ";
                
                if (showCorrectAnswer) {
                  className += "border-green-500 bg-green-50";
                } else if (showIncorrectAnswer) {
                  className += "border-red-500 bg-red-50";
                } else if (isSelected) {
                  className += "border-blue-500 bg-blue-50";
                } else {
                  className += "border-gray-200 hover:border-blue-300 hover:bg-blue-50";
                }

                return (
                  <button
                    key={index}
                    onClick={() => handleAnswerSelect(index)}
                    disabled={showResult}
                    className={className}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                        isSelected ? 'border-blue-500 bg-blue-500' : 'border-gray-300'
                      }`}>
                        {isSelected && <div className="w-3 h-3 bg-white rounded-full" />}
                      </div>
                      <span className="flex-1 text-sm">{option}</span>
                      {showCorrectAnswer && (
                        <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
                      )}
                      {showIncorrectAnswer && (
                        <XCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>

            {showResult && (
              <div className={`mt-6 p-4 rounded-lg ${
                selectedAnswer === currentQuestion.correctAnswer
                  ? 'bg-green-50 border border-green-200'
                  : 'bg-red-50 border border-red-200'
              }`}>
                <div className="flex items-center gap-2 mb-2">
                  {selectedAnswer === currentQuestion.correctAnswer ? (
                    <>
                      <CheckCircle2 className="w-5 h-5 text-green-600" />
                      <span className="font-semibold text-green-900">Correct!</span>
                    </>
                  ) : (
                    <>
                      <XCircle className="w-5 h-5 text-red-600" />
                      <span className="font-semibold text-red-900">Incorrect</span>
                    </>
                  )}
                </div>
                <p className="text-sm text-gray-700">
                  {selectedAnswer === currentQuestion.correctAnswer
                    ? `You earned ${currentQuestion.cognitiveLevel === 'higher' ? 9 : 3} points!`
                    : `The correct answer was: ${currentQuestion.options[currentQuestion.correctAnswer]}`
                  }
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Fixed Bottom Action */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4">
        {!showResult ? (
          <Button
            onClick={handleSubmit}
            disabled={selectedAnswer === null}
            className="w-full"
            size="lg"
          >
            Submit Answer
          </Button>
        ) : (
          <Button
            onClick={handleNext}
            className="w-full"
            size="lg"
          >
            {currentQuestionIndex < mockQuestions.length - 1 ? (
              <>
                Next Question
                <ChevronRight className="w-5 h-5 ml-2" />
              </>
            ) : (
              'Finish Session'
            )}
          </Button>
        )}
      </div>
    </div>
  );
}
