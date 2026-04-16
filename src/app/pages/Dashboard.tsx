import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Progress } from '../components/ui/progress';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { SyncIndicator } from '../components/SyncIndicator';
import { 
  Clock, 
  Target, 
  Calendar, 
  Lock, 
  Unlock,
  Anchor,
  User,
  BookOpen,
  TrendingUp,
  Compass,
  Ship,
  Settings,
  AlertTriangle,
  Scale,
  Package,
  Cloud,
  Map
} from 'lucide-react';
import { modules } from '../utils/mockData';
import { getOfflineProgress, getAccessPermissions, isSubscriptionValid } from '../utils/offlineStorage';

const iconMap: Record<string, any> = {
  Compass,
  Ship,
  Settings,
  AlertTriangle,
  Scale,
  Package,
  Cloud,
  Map
};

export function Dashboard() {
  const navigate = useNavigate();
  const [userProgress, setUserProgress] = useState({
    reviewHoursUsed: 0,
    reviewHoursTotal: 300,
    mockExamAttempts: 0,
    mockExamAttemptsTotal: 3,
    subscriptionEndDate: '2026-09-30',
    hasPassedMockExam: false
  });

  useEffect(() => {
    // Load progress from offline storage
    const progress = getOfflineProgress();
    const permissions = getAccessPermissions();

    if (progress && permissions) {
      setUserProgress({
        reviewHoursUsed: Math.round(progress.reviewHoursUsed * 10) / 10,
        reviewHoursTotal: permissions.reviewHoursType === 'unlimited' ? 999999 : (permissions.reviewHoursTotal || 300),
        mockExamAttempts: progress.mockExamAttempts,
        mockExamAttemptsTotal: permissions.mockExamType === 'unlimited' ? 999999 : (permissions.mockExamTotal || 3),
        subscriptionEndDate: permissions.subscriptionEndDate || '2026-09-30',
        hasPassedMockExam: false
      });
    }
  }, []);

  const reviewProgress = (userProgress.reviewHoursUsed / userProgress.reviewHoursTotal) * 100;
  const canAccessMockExam = userProgress.reviewHoursUsed >= userProgress.reviewHoursTotal;
  const hasSubscription = isSubscriptionValid();
  
  const daysRemaining = Math.ceil(
    (new Date(userProgress.subscriptionEndDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
  );

  const higherLevelModules = modules.filter(m => m.cognitiveLevel === 'higher');
  const lowerLevelModules = modules.filter(m => m.cognitiveLevel === 'lower');

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-900 to-blue-700 text-white p-6 pb-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
              <Anchor className="w-6 h-6 text-blue-900" />
            </div>
            <div>
              <h1 className="text-xl font-bold">Dashboard</h1>
              <p className="text-blue-100 text-sm">Welcome back, Mariner</p>
            </div>
          </div>
          <button
            onClick={() => navigate('/profile')}
            className="p-2 hover:bg-blue-800 rounded-full transition-colors"
          >
            <User className="w-6 h-6" />
          </button>
        </div>

        {/* Sync Indicator */}
        <div className="mb-4">
          <SyncIndicator />
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-3">
          <Card className="bg-white/10 backdrop-blur border-white/20">
            <CardContent className="p-3 text-center">
              <Clock className="w-5 h-5 text-white mx-auto mb-1" />
              <p className="text-2xl font-bold text-white">{userProgress.reviewHoursUsed}</p>
              <p className="text-xs text-blue-100">Hours Used</p>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur border-white/20">
            <CardContent className="p-3 text-center">
              <Target className="w-5 h-5 text-white mx-auto mb-1" />
              <p className="text-2xl font-bold text-white">{userProgress.mockExamAttempts}</p>
              <p className="text-xs text-blue-100">Exam Attempts</p>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur border-white/20">
            <CardContent className="p-3 text-center">
              <Calendar className="w-5 h-5 text-white mx-auto mb-1" />
              <p className="text-2xl font-bold text-white">{daysRemaining}</p>
              <p className="text-xs text-blue-100">Days Left</p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-4 -mt-4">
        {!hasSubscription && (
          <Card className="border-red-200 bg-red-50">
            <CardContent className="p-4">
              <p className="text-red-900 font-semibold mb-2">Subscription Expired</p>
              <p className="text-sm text-red-800 mb-3">Your subscription has expired. Renew to continue accessing lessons.</p>
              <Button onClick={() => navigate('/profile')} size="sm" className="w-full">
                Renew Subscription
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Progress Card */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Review Progress</CardTitle>
            <CardDescription>
              {userProgress.reviewHoursTotal === 999999 
                ? 'Unlimited hours available' 
                : `${Math.max(0, userProgress.reviewHoursTotal - userProgress.reviewHoursUsed).toFixed(1)} hours remaining to unlock Mock Exam`
              }
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-600">Hours Completed</span>
                <span className="font-semibold">
                  {userProgress.reviewHoursUsed} / {userProgress.reviewHoursTotal === 999999 ? '∞' : userProgress.reviewHoursTotal}
                </span>
              </div>
              <Progress value={Math.min(reviewProgress, 100)} className="h-3" />
            </div>

            <Button
              onClick={() => navigate('/mock-exam')}
              disabled={!canAccessMockExam || userProgress.mockExamAttempts >= userProgress.mockExamAttemptsTotal}
              className="w-full"
              variant={canAccessMockExam ? 'default' : 'secondary'}
            >
              {canAccessMockExam ? (
                userProgress.mockExamAttempts >= userProgress.mockExamAttemptsTotal ? (
                  <>
                    <Lock className="w-4 h-4 mr-2" />
                    No Attempts Remaining
                  </>
                ) : (
                  <>
                    <Unlock className="w-4 h-4 mr-2" />
                    Take Mock Exam ({userProgress.mockExamAttemptsTotal - userProgress.mockExamAttempts} left)
                  </>
                )
              ) : (
                <>
                  <Lock className="w-4 h-4 mr-2" />
                  Mock Exam Locked
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Strategic Recommendation */}
        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardHeader>
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-green-600" />
              <CardTitle className="text-green-900">Strategic Recommendation</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-green-800 mb-3">
              <strong>Prioritize Higher Level modules first!</strong> Each question is worth 9 points 
              compared to 3 points for lower level questions. Start with lessons, then practice questions.
            </p>
            <Button
              onClick={() => navigate('/guide')}
              variant="outline"
              size="sm"
              className="border-green-600 text-green-700 hover:bg-green-100"
            >
              <BookOpen className="w-4 h-4 mr-2" />
              Review Strategy Guide
            </Button>
          </CardContent>
        </Card>

        {/* Higher Level Modules */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-bold text-lg">Higher Level Modules (9 pts)</h2>
            <Badge className="bg-green-600">Priority</Badge>
          </div>
          <div className="space-y-3">
            {higherLevelModules.map((module) => {
              const IconComponent = iconMap[module.icon] || BookOpen;
              return (
                <Card
                  key={module.id}
                  className="hover:shadow-md transition-shadow border-l-4 border-l-green-500"
                >
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3 mb-3">
                      <div className="p-2 bg-green-100 rounded-lg flex-shrink-0">
                        <IconComponent className="w-5 h-5 text-green-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold mb-1">{module.title}</h3>
                        <p className="text-sm text-gray-600 mb-2">{module.domain}</p>
                        <div className="flex flex-wrap gap-2 text-xs">
                          <span className="bg-gray-100 px-2 py-1 rounded">
                            {module.questionCount} questions
                          </span>
                          <span className="bg-gray-100 px-2 py-1 rounded">
                            ~{module.estimatedTime} min
                          </span>
                          <Badge variant="outline" className="border-green-600 text-green-700">
                            9 pts/question
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <Button
                        onClick={() => navigate(`/lesson/${module.id}`)}
                        variant="outline"
                        size="sm"
                        className="w-full"
                      >
                        <BookOpen className="w-4 h-4 mr-1" />
                        Start Lesson
                      </Button>
                      <Button
                        onClick={() => navigate(`/review/${module.id}`)}
                        size="sm"
                        className="w-full bg-green-600 hover:bg-green-700"
                      >
                        Practice Questions
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Lower Level Modules */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-bold text-lg">Lower Level Modules (3 pts)</h2>
            <Badge variant="secondary">Foundation</Badge>
          </div>
          <div className="space-y-3">
            {lowerLevelModules.map((module) => {
              const IconComponent = iconMap[module.icon] || BookOpen;
              return (
                <Card
                  key={module.id}
                  className="hover:shadow-md transition-shadow border-l-4 border-l-blue-500"
                >
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3 mb-3">
                      <div className="p-2 bg-blue-100 rounded-lg flex-shrink-0">
                        <IconComponent className="w-5 h-5 text-blue-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold mb-1">{module.title}</h3>
                        <p className="text-sm text-gray-600 mb-2">{module.domain}</p>
                        <div className="flex flex-wrap gap-2 text-xs">
                          <span className="bg-gray-100 px-2 py-1 rounded">
                            {module.questionCount} questions
                          </span>
                          <span className="bg-gray-100 px-2 py-1 rounded">
                            ~{module.estimatedTime} min
                          </span>
                          <Badge variant="outline" className="border-blue-600 text-blue-700">
                            3 pts/question
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <Button
                        onClick={() => navigate(`/lesson/${module.id}`)}
                        variant="outline"
                        size="sm"
                        className="w-full"
                      >
                        <BookOpen className="w-4 h-4 mr-1" />
                        Start Lesson
                      </Button>
                      <Button
                        onClick={() => navigate(`/review/${module.id}`)}
                        size="sm"
                        className="w-full bg-blue-600 hover:bg-blue-700"
                      >
                        Practice Questions
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}