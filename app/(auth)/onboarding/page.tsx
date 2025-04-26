'use client';

import { useState, useEffect } from 'react';
import { createClient } from "../../utils/supabase/clients";
import { ArrowLeft, ArrowRight, User, Briefcase, Globe, Send, CheckCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';

const questions = [
  {
    id: 'name',
    title: "What's your name?",
    subtitle: "We'd love to know what to call you",
    type: 'text',
    placeholder: 'John Doe',
    icon: User
  },
  {
    id: 'occupation',
    title: 'What do you do?',
    subtitle: 'Tell us about your profession',
    type: 'text',
    placeholder: 'Software Engineer',
    icon: Briefcase
  },
  {
    id: 'location',
    title: 'Where are you based?',
    subtitle: 'Help us provide location-relevant content',
    type: 'text',
    placeholder: 'New York, USA',
    icon: Globe
  },
  {
    id: 'role',
    title: 'What best describes you?',
    subtitle: 'Please choose your role to get started.',
    type: 'select',
    options: ['Event Organizer', 'Vendor', 'User'],
    icon: Briefcase
  }
];

interface Answers {
  [key: string]: string; // This allows any string key with a string value
}

export default function OnboardingFlow() {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const [loading, setLoading] = useState(false);
  const supabase = createClient();
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push('/login');
      }
    };
    checkAuth();
  }, []);

  const handleNext = () => {
    if (currentStep < questions.length - 1) {
      setCurrentStep(current => current + 1);
    } else {
      handleSubmit();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(current => current - 1);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      console.log("User ID:", user?.id); // Debugging
  
      if (!user) {
        console.error("No authenticated user found");
        return;
      }
  
      const { error } = await supabase
        .from('user_profile')
        .upsert({
          user_id: user.id,
          ...answers,
          completed_onboarding: true
        });
  
      if (error) throw error;
      router.push('/dashboard');
    } catch (error) {
      console.error('Error saving profile:', error);
    } finally {
      setLoading(false);
    }
  };
  

  const handleInputChange = (questionId: string, value: string) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: value
    }));
  };

  const currentQuestion = questions[currentStep];

  return (
    <div className="flex justify-center items-center h-screen bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600">
      <div className="w-full max-w-md p-6 bg-white rounded-xl shadow-xl space-y-6">
        <div className="text-center text-gray-700">
          <currentQuestion.icon className="mx-auto text-4xl text-indigo-600 mb-4" />
          <h2 className="text-2xl font-semibold text-gray-800">{currentQuestion.title}</h2>
          <p className="text-gray-500">{currentQuestion.subtitle}</p>
        </div>
        
        {currentQuestion.type === 'select' && currentQuestion.options ? (
          <select
            value={answers[currentQuestion.id] || ''}
            onChange={(e) => handleInputChange(currentQuestion.id, e.target.value)}
            className="w-full p-4 mt-4 bg-gray-50 text-gray-900 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
          >
            <option value="" disabled>Select your role</option>
            {currentQuestion.options.map((option, idx) => (
              <option key={idx} value={option}>{option}</option>
            ))}
          </select>
        ) : (
          <input
            type={currentQuestion.type}
            placeholder={currentQuestion.placeholder}
            value={answers[currentQuestion.id] || ''}
            onChange={(e) => handleInputChange(currentQuestion.id, e.target.value)}
            className="w-full p-4 mt-4 bg-gray-50 text-gray-900 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
          />
        )}

        <div className="flex justify-between items-center mt-6">
          {currentStep > 0 && (
            <button
              className="flex items-center text-indigo-600 hover:text-indigo-800"
              onClick={handlePrevious}
            >
              <ArrowLeft className="mr-2" />
              Previous
            </button>
          )}
          <button
            className={`flex items-center py-2 px-6 bg-indigo-600 text-white font-semibold rounded-lg transition-all duration-300 hover:bg-indigo-700 focus:outline-none ${loading || !answers[currentQuestion.id] ? 'opacity-50 cursor-not-allowed' : ''}`}
            onClick={handleNext}
            disabled={loading || !answers[currentQuestion.id]}
          >
            {loading ? <Send className="animate-spin mr-2" /> : currentStep < questions.length - 1 ? 'Next' : 'Submit'}
            <ArrowRight className="ml-2" />
          </button>
        </div>

        {currentStep === questions.length - 1 && !loading && (
          <div className="text-center mt-4">
            <CheckCircle className="mx-auto text-4xl text-green-500 mb-2" />
            <h3 className="text-lg font-medium text-gray-800">You're all set!</h3>
            <p className="text-gray-500">We've saved your profile. You can now proceed to your dashboard.</p>
          </div>
        )}
      </div>
    </div>
  );
}
