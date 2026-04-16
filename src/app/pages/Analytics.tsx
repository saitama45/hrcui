import { useNavigate } from 'react-router';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Progress } from '../components/ui/progress';
import { Badge } from '../components/ui/badge';
import { ArrowLeft, TrendingUp, TrendingDown, AlertCircle, CheckCircle2 } from 'lucide-react';

export function Analytics() {
  const navigate = useNavigate();

  // Mock analytics data
  const examAttempts = [
    {
      attemptNumber: 1,
      date: '2026-04-10',
      score: 65,
      passed: false,
      domainScores: {
        'Navigation Rules': 50,
        'Vessel Stability': 40,
        'Ship Systems': 75,
        'Safety Procedures': 70,
        'Maritime Law': 60,
        'Cargo Operations': 55
      }
    }
  ];

  const studyTime = {
    total: 45.5,
    byDomain: {
      'Navigation Rules': 8.5,
      'Vessel Stability': 6.2,
      'Ship Systems': 12.3,
      'Safety Procedures': 9.1,
      'Maritime Law': 4.8,
      'Cargo Operations': 4.6
    }
  };

  const weakestDomains = Object.entries(
    examAttempts[0]?.domainScores || {}
  )
    .sort(([, a], [, b]) => a - b)
    .slice(0, 3);

  const strongestDomains = Object.entries(
    examAttempts[0]?.domainScores || {}
  )
    .sort(([, a], [, b]) => b - a)
    .slice(0, 3);

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-900 to-blue-700 text-white p-6">
        <Button
          onClick={() => navigate('/dashboard')}
          variant="ghost"
          className="text-white hover:bg-blue-800 mb-4 -ml-2"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Button>
        <h1 className="text-2xl font-bold mb-2">Performance Analytics</h1>
        <p className="text-blue-100">Detailed analysis of your progress</p>
      </div>

      {/* Content */}
      <div className="p-4 space-y-4">
        {/* Study Time Overview */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Study Time Distribution</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center bg-blue-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">Total Study Time</p>
              <p className="text-4xl font-bold text-blue-900">{studyTime.total}</p>
              <p className="text-sm text-gray-600">hours</p>
            </div>

            <div className="space-y-3">
              <p className="font-semibold text-sm">Time by Domain</p>
              {Object.entries(studyTime.byDomain).map(([domain, hours]) => (
                <div key={domain}>
                  <div className="flex justify-between text-sm mb-1">
                    <span>{domain}</span>
                    <span className="font-medium">{hours}h</span>
                  </div>
                  <Progress value={(hours / studyTime.total) * 100} className="h-2" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Exam Attempts */}
        {examAttempts.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Exam Attempt History</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {examAttempts.map((attempt, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h3 className="font-semibold">Attempt #{attempt.attemptNumber}</h3>
                      <p className="text-sm text-gray-500">{attempt.date}</p>
                    </div>
                    <div className="text-right">
                      <p className={`text-3xl font-bold ${attempt.passed ? 'text-green-600' : 'text-red-600'}`}>
                        {attempt.score}%
                      </p>
                      <Badge variant={attempt.passed ? 'default' : 'destructive'}>
                        {attempt.passed ? 'Passed' : 'Failed'}
                      </Badge>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <p className="text-sm font-semibold">Domain Performance:</p>
                    {Object.entries(attempt.domainScores).map(([domain, score]) => (
                      <div key={domain}>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-gray-600">{domain}</span>
                          <span className="font-medium">{score}%</span>
                        </div>
                        <Progress 
                          value={score} 
                          className={`h-2 ${score >= 70 ? '' : ''}`}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Weakest Areas */}
        {weakestDomains.length > 0 && (
          <Card className="border-red-200 bg-red-50">
            <CardHeader>
              <div className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-red-600" />
                <CardTitle className="text-lg text-red-900">Areas Needing Improvement</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {weakestDomains.map(([domain, score]) => (
                <div key={domain} className="flex items-center justify-between bg-white p-3 rounded border border-red-200">
                  <div className="flex items-center gap-2">
                    <TrendingDown className="w-4 h-4 text-red-600" />
                    <span className="font-medium text-sm">{domain}</span>
                  </div>
                  <span className="text-lg font-bold text-red-700">{score}%</span>
                </div>
              ))}
              <div className="mt-4 text-sm text-red-800 bg-white p-3 rounded border border-red-200">
                <p className="font-semibold mb-1">Recommendation:</p>
                <p>Focus additional study time on these domains to improve your overall score. 
                Consider reviewing higher-level questions in these areas.</p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Strongest Areas */}
        {strongestDomains.length > 0 && (
          <Card className="border-green-200 bg-green-50">
            <CardHeader>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-600" />
                <CardTitle className="text-lg text-green-900">Strong Performance Areas</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {strongestDomains.map(([domain, score]) => (
                <div key={domain} className="flex items-center justify-between bg-white p-3 rounded border border-green-200">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-green-600" />
                    <span className="font-medium text-sm">{domain}</span>
                  </div>
                  <span className="text-lg font-bold text-green-700">{score}%</span>
                </div>
              ))}
              <div className="mt-4 text-sm text-green-800 bg-white p-3 rounded border border-green-200">
                <p className="font-semibold mb-1">Well Done!</p>
                <p>You have strong understanding in these areas. Maintain this performance while 
                focusing on improving weaker domains.</p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Strategic Insights */}
        <Card className="bg-blue-50 border-blue-200">
          <CardHeader>
            <CardTitle className="text-lg text-blue-900">Strategic Insights</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex items-start gap-2">
              <div className="w-2 h-2 bg-blue-600 rounded-full mt-1.5 flex-shrink-0" />
              <p>
                Your weakest domain (Vessel Stability at 40%) requires significant improvement. 
                Allocate at least 10 more hours to this domain.
              </p>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-2 h-2 bg-blue-600 rounded-full mt-1.5 flex-shrink-0" />
              <p>
                Focus on higher-level cognitive questions (9 points) in weak domains to maximize 
                your score improvement potential.
              </p>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-2 h-2 bg-blue-600 rounded-full mt-1.5 flex-shrink-0" />
              <p>
                To reach 70% passing score, you need approximately 18 more percentage points. 
                This equals roughly 6-8 more correct higher-level questions.
              </p>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-2 h-2 bg-blue-600 rounded-full mt-1.5 flex-shrink-0" />
              <p>
                Continue maintaining strong performance in Ship Systems (75%) and Safety Procedures (70%) 
                while improving other areas.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
