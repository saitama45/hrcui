import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Progress } from '../components/ui/progress';
import { 
  ArrowLeft, 
  User, 
  Mail, 
  Phone, 
  Calendar,
  Clock,
  Target,
  Shield,
  CreditCard,
  Settings,
  LogOut
} from 'lucide-react';
import { mockUserProgress } from '../utils/mockData';

export function Profile() {
  const navigate = useNavigate();
  const [userProgress] = useState(mockUserProgress);

  const handleLogout = () => {
    localStorage.removeItem('harborAuth');
    navigate('/');
  };

  const daysRemaining = Math.ceil(
    (new Date(userProgress.subscriptionEndDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
  );

  const subscriptionProgress = 100 - (daysRemaining / 90) * 100; // Assuming 90 days total

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

        <div className="flex items-center gap-4 mb-6">
          <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center">
            <User className="w-12 h-12 text-blue-900" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Juan Dela Cruz</h1>
            <p className="text-blue-100">Mariner ID: #MRN-2026-0512</p>
            <Badge className="bg-green-600 mt-2">Active Subscription</Badge>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-4">
        {/* Contact Information */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Contact Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <Mail className="w-5 h-5 text-gray-600" />
              <div>
                <p className="text-xs text-gray-500">Email</p>
                <p className="font-medium">juan.delacruz@example.com</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <Phone className="w-5 h-5 text-gray-600" />
              <div>
                <p className="text-xs text-gray-500">Phone</p>
                <p className="font-medium">+63 912 345 6789</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Subscription Details */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Subscription Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
              <Calendar className="w-5 h-5 text-blue-600" />
              <div className="flex-1">
                <p className="text-xs text-gray-500">Valid Until</p>
                <p className="font-semibold text-blue-900">
                  {new Date(userProgress.subscriptionEndDate).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
                <p className="text-sm text-blue-700 mt-1">{daysRemaining} days remaining</p>
              </div>
            </div>

            <div>
              <p className="text-sm text-gray-600 mb-2">Subscription Duration</p>
              <Progress value={subscriptionProgress} className="h-2" />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-gray-50 rounded-lg text-center">
                <Clock className="w-5 h-5 text-gray-600 mx-auto mb-1" />
                <p className="text-2xl font-bold">{userProgress.reviewHoursTotal}</p>
                <p className="text-xs text-gray-600">Total Review Hours</p>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg text-center">
                <Target className="w-5 h-5 text-gray-600 mx-auto mb-1" />
                <p className="text-2xl font-bold">{userProgress.mockExamAttemptsTotal}</p>
                <p className="text-xs text-gray-600">Mock Exam Attempts</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Usage Statistics */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Usage Statistics</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-600">Review Hours Used</span>
                <span className="font-semibold">
                  {userProgress.reviewHoursUsed} / {userProgress.reviewHoursTotal} hrs
                </span>
              </div>
              <Progress value={(userProgress.reviewHoursUsed / userProgress.reviewHoursTotal) * 100} className="h-2" />
            </div>

            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-600">Mock Exam Attempts Used</span>
                <span className="font-semibold">
                  {userProgress.mockExamAttempts} / {userProgress.mockExamAttemptsTotal}
                </span>
              </div>
              <Progress 
                value={(userProgress.mockExamAttempts / userProgress.mockExamAttemptsTotal) * 100} 
                className="h-2" 
              />
            </div>

            {userProgress.hasPassedMockExam && (
              <div className="bg-green-50 border border-green-200 p-3 rounded-lg text-center">
                <p className="text-sm font-semibold text-green-900">✓ Mock Exam Passed</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Purchase Add-ons */}
        <Card className="border-orange-200 bg-orange-50">
          <CardHeader>
            <div className="flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-orange-600" />
              <CardTitle className="text-lg text-orange-900">Purchase Add-ons</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-orange-800 mb-3">
              Need more time or attempts? Purchase additional resources below:
            </p>
            
            <div className="bg-white p-3 rounded-lg border border-orange-200">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-semibold">+300 Review Hours</p>
                  <p className="text-sm text-gray-600">Extend your study time</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-orange-900">₱2,500</p>
                  <Button size="sm" variant="outline" className="mt-1 border-orange-600 text-orange-700">
                    Purchase
                  </Button>
                </div>
              </div>
            </div>

            <div className="bg-white p-3 rounded-lg border border-orange-200">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-semibold">+3 Mock Exam Attempts</p>
                  <p className="text-sm text-gray-600">Additional practice attempts</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-orange-900">₱1,500</p>
                  <Button size="sm" variant="outline" className="mt-1 border-orange-600 text-orange-700">
                    Purchase
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Security & Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Security & Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <button className="w-full flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors">
              <div className="flex items-center gap-3">
                <Shield className="w-5 h-5 text-gray-600" />
                <div className="text-left">
                  <p className="font-medium">Anti-Piracy Protection</p>
                  <p className="text-sm text-gray-500">Screenshots and downloads disabled</p>
                </div>
              </div>
              <Badge className="bg-green-600">Active</Badge>
            </button>

            <button className="w-full flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors">
              <Settings className="w-5 h-5 text-gray-600" />
              <div className="text-left">
                <p className="font-medium">Account Settings</p>
                <p className="text-sm text-gray-500">Update your preferences</p>
              </div>
            </button>
          </CardContent>
        </Card>

        {/* Logout */}
        <Button
          onClick={handleLogout}
          variant="outline"
          className="w-full border-red-200 text-red-600 hover:bg-red-50"
        >
          <LogOut className="w-4 h-4 mr-2" />
          Sign Out
        </Button>

        <div className="text-center text-sm text-gray-500 py-4">
          <p>Harbor Review Center v1.0</p>
          <p className="text-xs mt-1">Secure • Offline Capable • Anti-Piracy Protected</p>
        </div>
      </div>
    </div>
  );
}
