import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Anchor, User, Mail, Lock, Phone, ArrowLeft } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { saveOfflineUser, saveAccessPermissions, saveOfflineProgress } from '../utils/offlineStorage';

export function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });

  // Access permissions configuration
  const [permissions, setPermissions] = useState({
    subscriptionType: '3-months' as '3-months' | '6-months' | 'unlimited',
    reviewHours: '300' as '300' | '600' | 'unlimited',
    mockExamAttempts: '3' as '3' | '6' | 'unlimited'
  });

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    // Save user for offline access
    saveOfflineUser({
      email: formData.email,
      fullName: formData.fullName,
      phone: formData.phone,
      userId: 'user-' + Date.now(),
      lastSync: new Date().toISOString()
    });

    // Configure access permissions based on selected package
    const startDate = new Date();
    let endDate: Date | undefined;
    let reviewHoursTotal: number | undefined;
    let mockExamTotal: number | undefined;

    // Subscription duration
    if (permissions.subscriptionType === '3-months') {
      endDate = new Date(startDate);
      endDate.setMonth(endDate.getMonth() + 3);
    } else if (permissions.subscriptionType === '6-months') {
      endDate = new Date(startDate);
      endDate.setMonth(endDate.getMonth() + 6);
    }

    // Review hours
    if (permissions.reviewHours === '300') {
      reviewHoursTotal = 300;
    } else if (permissions.reviewHours === '600') {
      reviewHoursTotal = 600;
    }

    // Mock exam attempts
    if (permissions.mockExamAttempts === '3') {
      mockExamTotal = 3;
    } else if (permissions.mockExamAttempts === '6') {
      mockExamTotal = 6;
    }

    saveAccessPermissions({
      subscriptionType: permissions.subscriptionType === 'unlimited' ? 'unlimited' : 'months',
      subscriptionMonths: permissions.subscriptionType === '3-months' ? 3 : permissions.subscriptionType === '6-months' ? 6 : undefined,
      subscriptionStartDate: startDate.toISOString(),
      subscriptionEndDate: endDate?.toISOString(),
      reviewHoursType: permissions.reviewHours === 'unlimited' ? 'unlimited' : 'limited',
      reviewHoursTotal,
      reviewHoursPrice: 2500, // ₱2,500 per 300 hours
      mockExamType: permissions.mockExamAttempts === 'unlimited' ? 'unlimited' : 'limited',
      mockExamTotal,
      mockExamPrice: 1500 // ₱1,500 per 3 attempts
    });

    // Initialize progress tracking
    saveOfflineProgress({
      reviewHoursUsed: 0,
      mockExamAttempts: 0,
      lastUpdated: new Date().toISOString(),
      needsSync: true,
      sessionLogs: []
    });

    localStorage.setItem('harborAuth', 'true');
    
    // In production, this would trigger an email to admin
    console.log('Admin notification: New user registered', formData.email);
    
    navigate('/guide');
  };

  const updateField = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Calculate total price
  const calculatePrice = () => {
    let total = 0;
    
    // Base subscription price
    if (permissions.subscriptionType === '3-months') total += 3000;
    else if (permissions.subscriptionType === '6-months') total += 5500;
    else if (permissions.subscriptionType === 'unlimited') total += 15000;

    // Review hours (if beyond base 300)
    if (permissions.reviewHours === '600') total += 2500;
    else if (permissions.reviewHours === 'unlimited') total += 10000;

    // Mock exam attempts (if beyond base 3)
    if (permissions.mockExamAttempts === '6') total += 1500;
    else if (permissions.mockExamAttempts === 'unlimited') total += 5000;

    return total;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-900 to-blue-700 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="mb-4">
          <Button
            variant="ghost"
            onClick={() => navigate('/')}
            className="text-white hover:bg-blue-800"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Login
          </Button>
        </div>

        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-full mb-3">
            <Anchor className="w-10 h-10 text-blue-900" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-1">Create Your Account</h1>
          <p className="text-blue-100 text-sm">Begin your maritime exam preparation</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Registration</CardTitle>
            <CardDescription>Fill in your details to get started</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleRegister} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    id="fullName"
                    type="text"
                    placeholder="Juan Dela Cruz"
                    value={formData.fullName}
                    onChange={(e) => updateField('fullName', e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="mariner@example.com"
                    value={formData.email}
                    onChange={(e) => updateField('email', e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+63 XXX XXX XXXX"
                    value={formData.phone}
                    onChange={(e) => updateField('phone', e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="Create a strong password"
                    value={formData.password}
                    onChange={(e) => updateField('password', e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="Re-enter your password"
                    value={formData.confirmPassword}
                    onChange={(e) => updateField('confirmPassword', e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              {/* Access Configuration */}
              <div className="border-t pt-4 space-y-3">
                <h3 className="font-semibold text-sm">Select Your Package</h3>
                
                <div className="space-y-2">
                  <Label htmlFor="subscription">Subscription Duration</Label>
                  <Select
                    value={permissions.subscriptionType}
                    onValueChange={(value: any) => setPermissions({...permissions, subscriptionType: value})}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="3-months">3 Months - ₱3,000</SelectItem>
                      <SelectItem value="6-months">6 Months - ₱5,500</SelectItem>
                      <SelectItem value="unlimited">Unlimited - ₱15,000</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="reviewHours">Review Hours</Label>
                  <Select
                    value={permissions.reviewHours}
                    onValueChange={(value: any) => setPermissions({...permissions, reviewHours: value})}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="300">300 Hours (Included)</SelectItem>
                      <SelectItem value="600">600 Hours - +₱2,500</SelectItem>
                      <SelectItem value="unlimited">Unlimited - +₱10,000</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="mockExams">Mock Exam Attempts</Label>
                  <Select
                    value={permissions.mockExamAttempts}
                    onValueChange={(value: any) => setPermissions({...permissions, mockExamAttempts: value})}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="3">3 Attempts (Included)</SelectItem>
                      <SelectItem value="6">6 Attempts - +₱1,500</SelectItem>
                      <SelectItem value="unlimited">Unlimited - +₱5,000</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="bg-blue-50 p-3 rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold">Total Price:</span>
                    <span className="text-2xl font-bold text-blue-900">₱{calculatePrice().toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
                Create Account & Pay
              </Button>

              <p className="text-xs text-gray-500 text-center mt-4">
                By registering, you agree to our Terms of Service and Privacy Policy. 
                An admin will be notified of your registration.
              </p>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}