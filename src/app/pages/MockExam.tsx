import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Progress } from '../components/ui/progress';
import { Badge } from '../components/ui/badge';
import { 
  ArrowLeft, 
  Clock, 
  AlertTriangle,
  CheckCircle2,
  XCircle,
  TrendingUp
} from 'lucide-react';
import { mockQuestions } from '../utils/mockData';
import { getOfflineProgress, getAccessPermissions, saveOfflineProgress } from '../utils/offlineStorage';

export function MockExam() {
  const navigate = useNavigate();
  const [examStarted, setExamStarted] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [answers, setAnswers] = useState<(number | null)[]>([]);
  const [timeRemaining, setTimeRemaining] = useState(600); // 600 seconds = 10 minutes for demo (real would be 600 minutes)
  const [examComplete, setExamComplete] = useState(false);
  const [examResults, setExamResults] = useState<any>(null);

  const progress = getOfflineProgress();
  const permissions = getAccessPermissions();
  
  const canAccessExam = (progress?.reviewHoursUsed || 0) >= (permissions?.reviewHoursTotal || 300);
  const attemptsUsed = progress?.mockExamAttempts || 0;
  const attemptsTotal = permissions?.mockExamType === 'unlimited' ? 999999 : (permissions?.mockExamTotal || 3);
  const attemptsRemaining = attemptsTotal - attemptsUsed;

  // Timer
  useEffect(() => {
    if (!examStarted || examComplete) return;
    
    const interval = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          handleSubmitExam();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [examStarted, examComplete]);

  const handleStartExam = () => {
    setExamStarted(true);
    setAnswers(new Array(mockQuestions.length).fill(null));
  };

  const handleAnswerSelect = (answerIndex: number) => {
    setSelectedAnswer(answerIndex);
    const newAnswers = [...answers];
    newAnswers[currentQuestionIndex] = answerIndex;
    setAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentQuestionIndex < mockQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(answers[currentQuestionIndex + 1]);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      setSelectedAnswer(answers[currentQuestionIndex - 1]);
    }
  };

  const handleSubmitExam = () => {
    // Calculate results
    let totalScore = 0;
    let maxScore = 0;
    const domainScores: Record<string, { earned: number; total: number }> = {};

    mockQuestions.forEach((question, index) => {
      const points = question.cognitiveLevel === 'higher' ? 9 : 3;
      maxScore += points;

      if (!domainScores[question.domain]) {
        domainScores[question.domain] = { earned: 0, total: 0 };
      }
      domainScores[question.domain].total += points;

      if (answers[index] === question.correctAnswer) {
        totalScore += points;
        domainScores[question.domain].earned += points;
      }
    });

    const percentage = Math.round((totalScore / maxScore) * 100);
    const passed = percentage >= 70;

    setExamResults({
      totalScore,
      maxScore,
      percentage,
      passed,
      domainScores,
      correctAnswers: answers.filter((ans, idx) => ans === mockQuestions[idx].correctAnswer).length,
      totalQuestions: mockQuestions.length
    });

    // Update offline progress - increment attempts
    if (progress) {
      saveOfflineProgress({
        ...progress,
        mockExamAttempts: progress.mockExamAttempts + 1,
        needsSync: true,
        lastUpdated: new Date().toISOString()
      });
    }

    setExamComplete(true);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Pre-exam screen - no access due to hours
  if (!canAccessExam) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <Button onClick={() => navigate('/dashboard')} variant="outline" className="mb-4">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Button>

        <Card className="border-yellow-200 bg-yellow-50">
          <CardContent className="p-6">
            <div className="flex items-start gap-3 mb-4">
              <AlertTriangle className="w-8 h-8 text-yellow-600 flex-shrink-0" />
              <div>
                <h2 className="font-bold text-xl text-yellow-900 mb-2">Mock Exam Locked</h2>
                <p className="text-yellow-800 mb-4">
                  You need to complete {permissions?.reviewHoursTotal || 300} hours of review lessons before you can access the Mock Exam.
                </p>
                <div className="bg-white p-3 rounded border border-yellow-200">
                  <p className="text-sm font-semibold mb-1">Current Progress:</p>
                  <p className="text-2xl font-bold text-yellow-900">
                    {progress?.reviewHoursUsed || 0} / {permissions?.reviewHoursTotal || 300} hours
                  </p>
                  <Progress 
                    value={((progress?.reviewHoursUsed || 0) / (permissions?.reviewHoursTotal || 300)) * 100} 
                    className="mt-2"
                  />
                </div>
              </div>
            </div>
            <Button onClick={() => navigate('/dashboard')} className="w-full">
              Continue Reviewing Lessons
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Pre-exam screen - no attempts remaining
  if (attemptsRemaining <= 0 && !examStarted) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <Button onClick={() => navigate('/dashboard')} variant="outline" className="mb-4">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Button>

        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-6">
            <div className="flex items-start gap-3 mb-4">
              <AlertTriangle className="w-8 h-8 text-red-600 flex-shrink-0" />
              <div>
                <h2 className="font-bold text-xl text-red-900 mb-2">No Attempts Remaining</h2>
                <p className="text-red-800 mb-4">
                  You have used all {attemptsTotal} mock exam attempts. Purchase additional attempts to continue.
                </p>
                <div className="bg-white p-3 rounded border border-red-200">
                  <p className="text-sm font-semibold mb-1">Attempts Used:</p>
                  <p className="text-2xl font-bold text-red-900">
                    {attemptsUsed} / {attemptsTotal}
                  </p>
                </div>
              </div>
            </div>
            <Button onClick={() => navigate('/profile')} className="w-full">
              Purchase More Attempts
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Results screen
  if (examComplete && examResults) {
    return (
      <div className="min-h-screen bg-gray-50 pb-20">
        <div className={`${examResults.passed ? 'bg-gradient-to-r from-green-900 to-green-700' : 'bg-gradient-to-r from-red-900 to-red-700'} text-white p-6`}>
          <h1 className="text-2xl font-bold mb-2">Exam Results</h1>
          <p className="text-sm opacity-90">Mock Examination Complete</p>
        </div>

        <div className="p-4 space-y-4">
          {/* Overall Score */}
          <Card className={examResults.passed ? 'border-green-500 bg-green-50' : 'border-red-500 bg-red-50'}>
            <CardContent className="p-6 text-center">
              {examResults.passed ? (
                <CheckCircle2 className="w-16 h-16 text-green-600 mx-auto mb-3" />
              ) : (
                <XCircle className="w-16 h-16 text-red-600 mx-auto mb-3" />
              )}
              <h2 className={`text-3xl font-bold mb-2 ${examResults.passed ? 'text-green-900' : 'text-red-900'}`}>
                {examResults.passed ? 'Congratulations!' : 'Not Passed'}
              </h2>
              <p className={`text-5xl font-bold mb-2 ${examResults.passed ? 'text-green-700' : 'text-red-700'}`}>
                {examResults.percentage}%
              </p>
              <p className="text-sm text-gray-700">
                {examResults.totalScore} / {examResults.maxScore} points
              </p>
              <p className="text-sm text-gray-600 mt-2">
                {examResults.correctAnswers} correct out of {examResults.totalQuestions} questions
              </p>
              {examResults.passed && (
                <Badge className="mt-4 bg-green-600">Passing Score: 70%</Badge>
              )}
              {!examResults.passed && (
                <div className="mt-4">
                  <Badge variant="destructive">Required: 70%</Badge>
                  <p className="text-sm text-red-800 mt-2">
                    Attempts Remaining: {attemptsRemaining - 1}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Domain Analysis */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="w-5 h-5 text-blue-600" />
                <h3 className="font-bold text-lg">Performance by Domain</h3>
              </div>
              <div className="space-y-4">
                {Object.entries(examResults.domainScores).map(([domain, scores]: [string, any]) => {
                  const percentage = Math.round((scores.earned / scores.total) * 100);
                  return (
                    <div key={domain}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="font-medium">{domain}</span>
                        <span className="text-gray-600">{percentage}%</span>
                      </div>
                      <Progress value={percentage} className="h-2" />
                      <p className="text-xs text-gray-500 mt-1">
                        {scores.earned} / {scores.total} points
                      </p>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Recommendations */}
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="p-6">
              <h3 className="font-bold mb-3">Recommendations</h3>
              <ul className="space-y-2 text-sm">
                {!examResults.passed && (
                  <>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600">•</span>
                      <span>Review domains where you scored below 50%</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600">•</span>
                      <span>Focus on higher-level cognitive questions (9 pts each)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600">•</span>
                      <span>Practice time management - 1 minute per question</span>
                    </li>
                  </>
                )}
                {examResults.passed && (
                  <li className="flex items-start gap-2">
                    <span className="text-green-600">✓</span>
                    <span>You have successfully passed the mock examination! You are ready for the actual test.</span>
                  </li>
                )}
              </ul>
            </CardContent>
          </Card>
        </div>

        <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4 space-y-2">
          <Button onClick={() => navigate('/analytics')} variant="outline" className="w-full">
            View Detailed Analytics
          </Button>
          <Button onClick={() => navigate('/dashboard')} className="w-full">
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  // Exam start screen
  if (!examStarted) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <Button onClick={() => navigate('/dashboard')} variant="outline" className="mb-4">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Button>

        <Card>
          <CardContent className="p-6">
            <h1 className="text-2xl font-bold mb-4">Mock Examination</h1>
            
            <div className="space-y-4 mb-6">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-semibold mb-2">Exam Details</h3>
                <ul className="space-y-2 text-sm">
                  <li className="flex justify-between">
                    <span>Total Questions:</span>
                    <span className="font-semibold">~600 (Demo: {mockQuestions.length})</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Time Limit:</span>
                    <span className="font-semibold">600 minutes (Demo: 10 min)</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Passing Score:</span>
                    <span className="font-semibold">70%</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Attempts Remaining:</span>
                    <span className="font-semibold">{attemptsRemaining}</span>
                  </li>
                </ul>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                  <div className="text-sm">
                    <p className="font-semibold text-yellow-900 mb-1">Important Notes:</p>
                    <ul className="space-y-1 text-yellow-800">
                      <li>• The timer starts immediately when you begin</li>
                      <li>• You cannot pause or restart the exam</li>
                      <li>• Answer all questions before time runs out</li>
                      <li>• Each question is worth 3 or 9 points based on cognitive level</li>
                      <li>• If you fail all attempts, you must renew your subscription</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <Button onClick={handleStartExam} className="w-full" size="lg">
              Start Mock Exam
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Exam in progress
  const currentQuestion = mockQuestions[currentQuestionIndex];
  const examProgress = ((currentQuestionIndex + 1) / mockQuestions.length) * 100;
  const answeredCount = answers.filter(a => a !== null).length;

  return (
    <div className="min-h-screen bg-gray-50 pb-32">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-900 to-blue-700 text-white p-4 sticky top-0 z-10">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h1 className="font-bold">Mock Examination</h1>
            <p className="text-sm text-blue-100">Question {currentQuestionIndex + 1} of {mockQuestions.length}</p>
          </div>
          <div className="flex items-center gap-2 bg-red-600 px-3 py-2 rounded-lg">
            <Clock className="w-5 h-5" />
            <span className="font-mono font-bold">{formatTime(timeRemaining)}</span>
          </div>
        </div>
        <Progress value={examProgress} className="h-2 bg-blue-800" />
        <p className="text-xs text-blue-100 mt-2">{answeredCount} answered • {mockQuestions.length - answeredCount} remaining</p>
      </div>

      {/* Question */}
      <div className="p-4">
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

                return (
                  <button
                    key={index}
                    onClick={() => handleAnswerSelect(index)}
                    className={`p-4 border-2 rounded-lg text-left transition-all w-full ${
                      isSelected
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                        isSelected ? 'border-blue-500 bg-blue-500' : 'border-gray-300'
                      }`}>
                        {isSelected && <div className="w-3 h-3 bg-white rounded-full" />}
                      </div>
                      <span className="flex-1 text-sm">{option}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Fixed Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4 space-y-2">
        <div className="flex gap-2">
          <Button
            onClick={handlePrevious}
            disabled={currentQuestionIndex === 0}
            variant="outline"
            className="flex-1"
          >
            Previous
          </Button>
          {currentQuestionIndex < mockQuestions.length - 1 ? (
            <Button
              onClick={handleNext}
              className="flex-1"
            >
              Next
            </Button>
          ) : (
            <Button
              onClick={handleSubmitExam}
              className="flex-1 bg-green-600 hover:bg-green-700"
            >
              Submit Exam
            </Button>
          )}
        </div>
        <p className="text-xs text-center text-gray-500">
          You can navigate between questions before submitting
        </p>
      </div>
    </div>
  );
}