import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Anchor, Lock, Mail, WifiOff } from 'lucide-react';
import { canLoginOffline, saveOfflineUser, isOnline } from '../utils/offlineStorage';

export function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const online = isOnline();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Check if online
    if (online) {
      // Online login - would authenticate with backend
      // For demo, we save user for offline access
      saveOfflineUser({
        email,
        fullName: 'Juan Dela Cruz',
        phone: '+63 912 345 6789',
        userId: 'user-' + Date.now(),
        lastSync: new Date().toISOString()
      });
      localStorage.setItem('harborAuth', 'true');
      navigate('/guide');
    } else {
      // Offline login - check against cached credentials
      if (canLoginOffline(email, password)) {
        localStorage.setItem('harborAuth', 'true');
        navigate('/guide');
      } else {
        setError('Cannot login offline. Please connect to the internet for first-time login.');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-900 to-blue-700 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white rounded-full mb-4">
            <Anchor className="w-12 h-12 text-blue-900" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Harbor Review Center</h1>
          <p className="text-blue-100">Professional Maritime Examination Preparation</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Welcome Back</CardTitle>
            <CardDescription>Sign in to continue your review journey</CardDescription>
            {!online && (
              <div className="flex items-center gap-2 mt-2 text-yellow-600 bg-yellow-50 p-2 rounded">
                <WifiOff className="w-4 h-4" />
                <span className="text-xs">Offline Mode - Using cached credentials</span>
              </div>
            )}
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded text-sm">
                  {error}
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="mariner@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
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
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
                Sign In {!online && '(Offline)'}
              </Button>

              <div className="text-center text-sm">
                <span className="text-gray-600">Don't have an account? </span>
                <button
                  type="button"
                  onClick={() => navigate('/register')}
                  className="text-blue-600 hover:underline font-medium"
                  disabled={!online}
                >
                  Register now
                </button>
                {!online && <p className="text-xs text-gray-500 mt-1">Registration requires internet connection</p>}
              </div>
            </form>
          </CardContent>
        </Card>

        <div className="mt-6 text-center text-sm text-blue-100">
          <p>Secure • Offline Capable • Anti-Piracy Protected</p>
        </div>
      </div>
    </div>
  );
}