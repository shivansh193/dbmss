'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Mail, Lock, User, ArrowRight } from 'lucide-react';
import { useRouter } from "next/navigation";

export default function SignUp() {
  // Shared fields
  const [role, setRole] = useState<'customer' | 'vendor'>('customer');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Customer fields
  const [name, setName] = useState('');
  const [contactInfo, setContactInfo] = useState('');

  // Vendor fields
  const [businessName, setBusinessName] = useState('');
  const [vendorContactInfo, setVendorContactInfo] = useState('');
  const [storeProfile, setStoreProfile] = useState('');

  useEffect(() => {
    // Check if the user is already logged in
    const checkUserSession = async () => {
      // const { data: { session } } = await supabase.auth.getSession();
  
      // if (session) {
      //   // If user is logged in, redirect to dashboard
      //   router.push("/onboarding"); // Redirect after signup
      // }
    };
  
    checkUserSession();
  }, []);

  const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    let body: any = { email, password, role };
    if (role === 'customer') {
      body = { ...body, name, contactInfo: contactInfo || undefined };
    } else if (role === 'vendor') {
      body = { ...body, businessName, contactInfo: vendorContactInfo || undefined, storeProfile: storeProfile || undefined };
    }
    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        const msg = await res.text();
        setError(msg || 'Signup failed');
        return;
      }
      router.push('/dashboard');
    } catch (err) {
      setError('Signup failed');
    }
  };

  const handleGoogleLogin = async () => {
    // const { error } = await supabase.auth.signInWithOAuth({ provider: "google" });
    // if (error) setError(error.message);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900">Create your account</h2>
          <p className="mt-2 text-gray-800">Start your event planning journey</p>
        </div>

        <form onSubmit={handleSignUp} className="mt-8 space-y-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-1">Role</label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2">
                  <input type="radio" name="role" value="customer" checked={role === 'customer'} onChange={() => setRole('customer')} />
                  Customer
                </label>
                <label className="flex items-center gap-2">
                  <input type="radio" name="role" value="vendor" checked={role === 'vendor'} onChange={() => setRole('vendor')} />
                  Vendor
                </label>
              </div>
            </div>

            {/* Customer Fields */}
            {role === 'customer' && (
              <>
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-900">
                    Full Name
                  </label>
                  <div className="mt-1 relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      required={role === 'customer'}
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="pl-10 pr-3 py-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900"
                      placeholder="Your full name"
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="contactInfo" className="block text-sm font-medium text-gray-900">
                    Contact Info (optional)
                  </label>
                  <input
                    id="contactInfo"
                    name="contactInfo"
                    type="text"
                    value={contactInfo}
                    onChange={(e) => setContactInfo(e.target.value)}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900"
                    placeholder="Phone or alternate email"
                  />
                </div>
              </>
            )}

            {/* Vendor Fields */}
            {role === 'vendor' && (
              <>
                <div>
                  <label htmlFor="businessName" className="block text-sm font-medium text-gray-900">
                    Business Name
                  </label>
                  <input
                    id="businessName"
                    name="businessName"
                    type="text"
                    required={role === 'vendor'}
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900"
                    placeholder="Business Name"
                  />
                </div>
                <div>
                  <label htmlFor="vendorContactInfo" className="block text-sm font-medium text-gray-900">
                    Contact Info (optional)
                  </label>
                  <input
                    id="vendorContactInfo"
                    name="vendorContactInfo"
                    type="text"
                    value={vendorContactInfo}
                    onChange={(e) => setVendorContactInfo(e.target.value)}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900"
                    placeholder="Phone or alternate email"
                  />
                </div>
                <div>
                  <label htmlFor="storeProfile" className="block text-sm font-medium text-gray-900">
                    Store Profile (optional)
                  </label>
                  <textarea
                    id="storeProfile"
                    name="storeProfile"
                    value={storeProfile}
                    onChange={(e) => setStoreProfile(e.target.value)}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900"
                    placeholder="Describe your store"
                  />
                </div>
              </>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-900">
                Email address
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-900">
                Password
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  placeholder="••••••••"
                />
              </div>
              <p className="mt-1 text-sm text-gray-800">
                Must be at least 8 characters long
              </p>
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="w-full flex justify-center items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-white bg-[#1D4ED8] hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Create Account <ArrowRight className="ml-2 h-5 w-5" />
            </button>
          </div>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Or continue with</span>
              </div>
            </div>

            <div className="mt-6">
              <button
                type="button"
                className="w-full flex justify-center items-center px-4 py-2 border border-gray-300 rounded-lg shadow-sm bg-white text-gray-700 hover:bg-gray-50"
                onClick={handleGoogleLogin}
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

        <p className="mt-8 text-center text-sm text-gray-900">
          Already have an account?{' '}
          <Link href="/login" className="font-medium text-blue-600 hover:text-blue-500">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}