"use client"
import { useState } from 'react';
import { Mail, Lock } from 'lucide-react';
import Link from 'next/link';

const WEHIndiaSignup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: any) => {
    e.preventDefault();
    console.log('Form submitted:', { email, password });
  };

  return (
    <div className="w-full min-h-screen flex items-center justify-center bg-white bg-white p-4">
      <div className="w-full max-w-6xl flex flex-col md:flex-row items-center justify-center gap-12 py-12">
        {/* Left Side - Signup Form */}
        <div className="w-full md:w-1/2 max-w-md bg-gray-50 bg-gray-50 rounded-xl shadow-xl p-8 transition-all duration-300">
          <div className="flex items-center justify-center gap-3 mb-8">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center transform transition-transform hover:scale-105">
              <div className="w-5 h-1.5 bg-white rounded-full"></div>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Join the Marketplace
            </h2>
          </div>

          <h2 className="text-3xl font-bold text-center mb-3 text-gray-900">
            Already on the platform?
          </h2>
          <p className="text-gray-600 text-gray-600 text-center mb-8">
            Join our community and start your journey
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold mb-2 text-gray-900">
                Email
              </label>
              <div className="relative group">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your work email"
                  className="w-full p-3 border border-gray-200 rounded-lg pl-4 pr-10 
                    shadow-blue-100 border-gray-200 text-gray-900 placeholder-gray-400
                    focus:ring-2 focus:ring-blue-500 focus:border-transparent
                    transition-all duration-300"
                />
                <Mail className="absolute right-3 top-3 text-gray-400 group-hover:text-blue-500 transition-colors" size={20} />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2 text-gray-900">
                Password
              </label>
              <div className="relative group">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••••"
                  className="w-full p-3 border border-gray-200 rounded-lg pl-4 pr-10 
                    shadow-blue-100 border-gray-200 text-gray-900 placeholder-gray-400
                    focus:ring-2 focus:ring-blue-500 focus:border-transparent
                    transition-all duration-300"
                />
                <Lock className="absolute right-3 top-3 text-gray-400 group-hover:text-blue-500 transition-colors" size={20} />
              </div>
            </div>
            <Link href={'/signup'}>
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg
                transform transition-all duration-300 hover:scale-[1.02] hover:shadow-lg"
            >
              Create Account
            </button>
            </Link>
          </form>
        </div>

        {/* Right Side - Steps */}
        <div className="w-full md:w-1/2 max-w-md">
          <h2 className="text-3xl font-bold text-center mb-8 text-gray-900">
            How does WEHIndia work?
          </h2>
          
          <div className="space-y-4">
            {[
              {
                number: 1,
                title: "Create a free account",
                description: "Get started with your journey in minutes"
              },
              {
                number: 2,
                title: "Choose between Vendor or Customer",
                description: "Select your role and customize your experience"
              },
              {
                number: 3,
                title: "Start selling or shopping",
                description: "Create your account and start selling as a vendor, or shop from stores near you as a customer."
              }
            ].map((step) => (
              <div 
                key={step.number} 
                className="bg-gray-50 bg-gray-50 p-6 rounded-xl shadow-md 
                  transform transition-all duration-300 hover:scale-[1.02] hover:shadow-lg"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/50 rounded-xl flex items-center justify-center
                    transform transition-transform">
                    <span className="text-blue-600 dark:text-blue-300 font-bold text-lg">
                      {step.number}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg text-gray-900 mb-1">
                      {step.title}
                    </h3>
                    <p className="text-gray-600 text-gray-600">
                      {step.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WEHIndiaSignup;