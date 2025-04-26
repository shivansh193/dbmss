'use client';
import React from 'react';
import Link from 'next/link';
import { Button } from '../ui/button';
import { motion } from 'framer-motion';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { Input } from '../ui/input';
import { Label } from '../ui/label';

function AuthModalTrigger() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button
        size="lg"
        className="text-xl px-8 py-6 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0"
        onClick={() => setOpen(true)}
      >
        Get started
      </Button>
      {open && <AuthModal onClose={() => setOpen(false)} />}
    </>
  );
}

function AuthModal({ onClose }: { onClose: () => void }) {
  const [tab, setTab] = useState<'signup' | 'login'>('signup');
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const form = useForm<{ name?: string; email: string; password: string; role: string }>({ defaultValues: { name: '', email: '', password: '', role: 'customer' } });

  const handleSubmit = async (data: { name?: string; email: string; password: string; role: string }) => {
    setLoading(true); setError('');
    try {
      const url = tab === 'signup' ? '/api/auth/signup' : '/api/auth/login';
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, role: 'customer' }) // always send role: customer
      });
      if (!res.ok) throw new Error(await res.text());
      onClose();
      router.push('/dashboard/customer');
    } catch (err: any) {
      setError(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-8 relative">
        <button className="absolute top-4 right-4 text-gray-500" onClick={onClose}>✕</button>
        <div className="flex justify-center mb-6">
          <button className={`px-6 py-2 font-bold rounded-l-xl ${tab==='signup' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'}`} onClick={()=>setTab('signup')}>Sign Up</button>
          <button className={`px-6 py-2 font-bold rounded-r-xl ${tab==='login' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'}`} onClick={()=>setTab('login')}>Sign In</button>
        </div>
        <FormProvider {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="flex flex-col gap-4">
            {tab==='signup' && (
              <div>
                <Label htmlFor="name" className="text-blue-900">Name</Label>
                <Input id="name" type="text" {...form.register('name', { required: true })} placeholder="Name" autoComplete="name" className="mt-1" />
              </div>
            )}
            <div>
              <Label htmlFor="email" className="text-blue-900">Email</Label>
              <Input id="email" type="email" {...form.register('email', { required: true })} placeholder="Email" autoComplete="email" className="mt-1" />
            </div>
            <div>
              <Label htmlFor="password" className="text-blue-900">Password</Label>
              <Input id="password" type="password" {...form.register('password', { required: true })} placeholder="Password" autoComplete="current-password" className="mt-1" />
            </div>
            {error && <div className="text-red-500 text-sm text-center">{error}</div>}
            <Button type="submit" disabled={loading} className="w-full bg-blue-600 text-white py-2 rounded font-bold hover:bg-blue-700 transition">
              {loading ? 'Loading...' : (tab==='signup' ? 'Sign Up' : 'Sign In')}
            </Button>
          </form>
        </FormProvider>
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <div className="min-h-screen bg-whiteground flex items-center justify-center bg-gradient-to-b from-background to-secondary/10">
      <main className="container px-4 md:px-8 py-16 relative">
        {/* Gradient background blur effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-100/30 to-purple-500/20 blur-3xl opacity-30" />
        
        <div className="flex flex-col items-center text-center gap-12 max-w-5xl mx-auto relative">
          <motion.h1 
            className="text-5xl md:text-7xl font-bold leading-tight tracking-tighter"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="inline-block bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 bg-[200%_auto] animate-gradient bg-clip-text text-transparent">
              Empowering Local Commerce,
            </span>
            <br />
            <span className="inline-block bg-gradient-to-r from-purple-600 via-blue-600 to-purple-600 bg-[200%_auto] animate-gradient bg-clip-text text-transparent">
              Connecting Vendors
            </span>
            <br />
            <span className="inline-block bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 bg-[200%_auto] animate-gradient bg-clip-text text-transparent">
              Directly to You
            </span>
          </motion.h1>
          
          <motion.p 
            className="text-2xl md:text-3xl bg-gradient-to-r from-white to-gray-400 text-gray-900 text-gray-600 bg-clip-text text-transparent max-w-3xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            The platform where vendors grow with powerful analytics, and consumers discover products from nearby stores with ease. Enjoy seamless buying, selling, and location-based shopping.
          </motion.p>
          
          <motion.div 
            className="flex flex-col sm:flex-row gap-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <AuthModalTrigger />
            <Button 
              size="lg" 
              variant="outline" 
              className="text-xl px-8 py-6 rounded-full border-2 transition-all duration-300 hover:scale-105 bg-gradient-to-r hover:from-blue-600/10 hover:to-purple-600/10 border-blue-600/20 hover:border-purple-600/30 text-foreground"
              asChild
            >
              <Link href="/signup">
                Learn more
              </Link>
            </Button>
          </motion.div>
        </div>
      </main>
    </div>
  );
}

