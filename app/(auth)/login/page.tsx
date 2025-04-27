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
      if (role === 'vendor') {
        router.push('/dashboard/vendor');
      } else {
        router.push('/dashboard/customer');
      }
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
  <div className="flex items-center justify-center gap-4 mb-4">
    <label className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Sign in as:</label>
    <button
      type="button"
      onClick={() => setRole('customer')}
      className={`px-4 py-1 rounded-lg border text-sm font-semibold transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500
        ${role === 'customer'
          ? 'bg-blue-600 text-white border-blue-700'
          : darkMode
            ? 'bg-gray-700 text-gray-200 border-gray-600 hover:bg-gray-600'
            : 'bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200'}
      `}
    >
      Customer
    </button>
    <button
      type="button"
      onClick={() => setRole('vendor')}
      className={`px-4 py-1 rounded-lg border text-sm font-semibold transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500
        ${role === 'vendor'
          ? 'bg-blue-600 text-white border-blue-700'
          : darkMode
            ? 'bg-gray-700 text-gray-200 border-gray-600 hover:bg-gray-600'
            : 'bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200'}
      `}
    >
      Vendor
    </button>
  </div>
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