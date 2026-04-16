import { useNavigate } from 'react-router';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { BookOpen, Brain, Target, TrendingUp, ArrowRight } from 'lucide-react';

export function EducationalGuide() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-900 to-blue-700 text-white p-6">
        <h1 className="text-2xl font-bold mb-2">Welcome to Harbor Review Center</h1>
        <p className="text-blue-100">Strategic Guide to Exam Success</p>
      </div>

      {/* Content */}
      <div className="p-4 space-y-4 pb-24">
        {/* Introduction */}
        <Card>
          <CardHeader>
            <div className="flex items-start gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <BookOpen className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <CardTitle>Your Path to Success</CardTitle>
                <CardDescription>
                  Understanding the scoring system is key to passing your maritime examination
                </CardDescription>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Cognitive Domains */}
        <Card>
          <CardHeader>
            <div className="flex items-start gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Brain className="w-6 h-6 text-purple-600" />
              </div>
              <div className="flex-1">
                <CardTitle>Understanding Cognitive Domains</CardTitle>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-blue-900">Lower Level (Definitions)</h3>
                <span className="text-2xl font-bold text-blue-600">3 pts</span>
              </div>
              <p className="text-sm text-blue-800">
                Knowledge and comprehension questions. These test your understanding of basic concepts, 
                definitions, and factual information.
              </p>
              <p className="text-xs text-blue-600 mt-2">Example: "Define freeboard in maritime terminology"</p>
            </div>

            <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-green-900">Higher Level (Applied)</h3>
                <span className="text-2xl font-bold text-green-600">9 pts</span>
              </div>
              <p className="text-sm text-green-800">
                Application, analysis, and evaluation questions. These test your ability to apply knowledge 
                in real-world scenarios and make critical decisions.
              </p>
              <p className="text-xs text-green-600 mt-2">
                Example: "During heavy weather with port list, what actions ensure vessel stability?"
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Strategy */}
        <Card>
          <CardHeader>
            <div className="flex items-start gap-3">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Target className="w-6 h-6 text-orange-600" />
              </div>
              <div className="flex-1">
                <CardTitle>Strategic Review Approach</CardTitle>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                1
              </div>
              <div>
                <h4 className="font-semibold mb-1">Prioritize Higher Level Modules</h4>
                <p className="text-sm text-gray-600">
                  Focus on applied questions (9 points each) to maximize your score potential. 
                  A single higher-level question equals three lower-level questions.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                2
              </div>
              <div>
                <h4 className="font-semibold mb-1">Complete 300 Review Hours</h4>
                <p className="text-sm text-gray-600">
                  Consistent, focused study time is required before you can attempt the Mock Exam. 
                  Quality review time builds retention and confidence.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                3
              </div>
              <div>
                <h4 className="font-semibold mb-1">Aim for 70% Passing Score</h4>
                <p className="text-sm text-gray-600">
                  The benchmark is 70% overall score. Strategic focus on higher-level questions 
                  significantly increases your probability of passing.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                4
              </div>
              <div>
                <h4 className="font-semibold mb-1">1 Minute Per Question</h4>
                <p className="text-sm text-gray-600">
                  Time management is critical. Practice answering questions quickly and accurately 
                  to prepare for the timed Mock Exam environment.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Analytics */}
        <Card>
          <CardHeader>
            <div className="flex items-start gap-3">
              <div className="p-2 bg-indigo-100 rounded-lg">
                <TrendingUp className="w-6 h-6 text-indigo-600" />
              </div>
              <div className="flex-1">
                <CardTitle>Post-Exam Analytics</CardTitle>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 mb-3">
              After each Mock Exam attempt, you'll receive detailed distribution analysis showing 
              your performance across different domains. This helps identify weak points and guides 
              your review focus.
            </p>
            <div className="bg-gray-100 p-3 rounded text-sm">
              <p className="font-medium mb-1">Example Analysis:</p>
              <ul className="space-y-1 text-gray-700">
                <li>• Navigation Rules: 50%</li>
                <li>• Vessel Stability: 30% (needs improvement)</li>
                <li>• Safety Procedures: 75%</li>
                <li>• Maritime Law: 65%</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Requirements Summary */}
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardHeader>
            <CardTitle className="text-blue-900">Requirements Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-blue-800">Minimum Review Hours:</span>
              <span className="font-bold text-blue-900">300 hours</span>
            </div>
            <div className="flex justify-between">
              <span className="text-blue-800">Mock Exam Attempts:</span>
              <span className="font-bold text-blue-900">3 attempts</span>
            </div>
            <div className="flex justify-between">
              <span className="text-blue-800">Passing Score:</span>
              <span className="font-bold text-blue-900">70%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-blue-800">Question Timer:</span>
              <span className="font-bold text-blue-900">1 min/question</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Fixed Bottom Button */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4">
        <Button
          onClick={() => navigate('/dashboard')}
          className="w-full bg-blue-600 hover:bg-blue-700"
          size="lg"
        >
          Start Your Review Journey
          <ArrowRight className="w-5 h-5 ml-2" />
        </Button>
      </div>
    </div>
  );
}
