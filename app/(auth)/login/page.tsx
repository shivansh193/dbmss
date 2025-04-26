'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Mail, Lock, ArrowRight, Moon, Sun } from 'lucide-react';
import { useRouter } from "next/navigation";

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'customer' | 'vendor'>('customer');
  const [darkMode, setDarkMode] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    // Check system preference for dark mode
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setDarkMode(true);
    }
  }, []);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, role }),
      });
      if (!res.ok) {
        const msg = await res.text();
        setError(msg || 'Login failed');
        return;
      }
      router.push('/dashboard');
    } catch (err) {
      setError('Login failed');
    }
  };

  return (
    <div className={`min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-200 
      ${darkMode ? 
        'bg-gradient-to-br from-gray-900 to-gray-800' : 
        'bg-gradient-to-br from-blue-50 to-blue-100'}`}>
      <button
        onClick={() => setDarkMode(!darkMode)}
        className={`fixed top-4 right-4 p-2 rounded-full 
          ${darkMode ? 
            'bg-gray-700 text-yellow-400 hover:bg-gray-600' : 
            'bg-white text-gray-700 hover:bg-gray-100'} 
          shadow-lg transition-all duration-200`}
      >
        {darkMode ? <Sun className="h-6 w-6" /> : <Moon className="h-6 w-6" />}
      </button>

      <div className={`max-w-md w-full rounded-2xl shadow-2xl p-8 transition-colors duration-200
        ${darkMode ? 
          'bg-gray-800 shadow-gray-900/50' : 
          'bg-white shadow-gray-200/50'}`}>
        <div className="text-center">
          <h2 className={`text-3xl font-bold mb-2 
            ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Welcome back
          </h2>
          <p className={`text-sm 
            ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Sign in to your account
          </p>
        </div>

        {error && (
          <div className="mt-4 p-3 rounded-lg bg-red-100 border border-red-200 text-red-600">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="mt-8 space-y-6">
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className={`block text-sm font-medium 
                ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Email address
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className={`h-5 w-5 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`} />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`block w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-offset-2 transition-colors duration-200
                    ${darkMode ? 
                      'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500 focus:ring-offset-gray-800' : 
                      'bg-white border-gray-300 focus:ring-blue-500 focus:border-blue-500'}`}
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className={`block text-sm font-medium 
                ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Password
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className={`h-5 w-5 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`} />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`block w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-offset-2 transition-colors duration-200
                    ${darkMode ? 
                      'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500 focus:ring-offset-gray-800' : 
                      'bg-white border-gray-300 focus:ring-blue-500 focus:border-blue-500'}`}
                  placeholder="••••••••"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="remember-me" className={`ml-2 block text-sm
                ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Remember me
              </label>
            </div>

            <Link
              href="/forgot-password"
              className={`text-sm font-medium hover:underline
                ${darkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-500'}`}
            >
              Forgot password?
            </Link>
          </div>

          <div>
            <button
              type="submit"
              className={`w-full flex justify-center items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-white transition-colors duration-200
                ${darkMode ? 
                  'bg-blue-600 hover:bg-blue-700' : 
                  'bg-blue-600 hover:bg-blue-700'}`}
            >
              Sign in <ArrowRight className="ml-2 h-5 w-5" />
            </button>
          </div>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className={`w-full border-t 
                  ${darkMode ? 'border-gray-600' : 'border-gray-300'}`} />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className={`px-2 
                  ${darkMode ? 'bg-gray-800 text-gray-400' : 'bg-white text-gray-500'}`}>
                  Or continue with
                </span>
              </div>
            </div>

            <div className="mt-6">
              <button
                type="button"
                onClick={handleGoogleLogin}
                className={`w-full flex justify-center items-center px-4 py-2 border rounded-lg shadow-sm transition-colors duration-200
                  ${darkMode ? 
                    'bg-gray-700 border-gray-600 text-white hover:bg-gray-600' : 
                    'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'}`}
              >
                <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24">
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                </svg>
                Continue with Google
              </button>
            </div>
          </div>
        </form>

        <p className={`mt-8 text-center text-sm
          ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          Don't have an account?{' '}
          <Link 
            href="/signup" 
            className={`font-medium hover:underline
              ${darkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-500'}`}>
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}