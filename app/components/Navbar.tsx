"use client";

import Link from 'next/link';
import { useTheme } from 'next-themes';
import { User } from 'lucide-react';
import { Button } from './ui/button';
import Image from 'next/image';

import { useRouter } from 'next/navigation';
import { useState, useRef, useEffect } from 'react';
import { ShoppingCart } from 'lucide-react';
import { useCart } from './CartContext';
import CartModal from './CartModal';

function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function Navbar() {
  const { theme } = useTheme();
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [suggestions, setSuggestions] = useState<{ suggestion: string, type: string }[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const { items } = useCart();
  const [cartOpen, setCartOpen] = useState(false);

  useEffect(() => {
    if (!search) {
      setSuggestions([]);
      return;
    }
    const controller = new AbortController();
    fetch(`/api/search?q=${encodeURIComponent(search)}&suggest=1`, { signal: controller.signal })
      .then((res) => res.ok ? res.json() : { suggestions: [] })
      .then((data) => setSuggestions(data.suggestions || []))
      .catch(() => {});
    return () => controller.abort();
  }, [search]);

  const handleSearch = (e?: React.FormEvent, suggestion?: string) => {
    if (e) e.preventDefault();
    if (search.trim() || suggestion) {
      router.push(`/dashboard/customer?search=${encodeURIComponent(suggestion || search)}`);
      setShowSuggestions(false);
    }
  };

  const [user, setUser] = useState<{ id: number, name: string, email: string } | null>(null);
  useEffect(() => {
    fetch('/api/auth/me').then(res => res.ok ? res.json() : null).then(setUser).catch(() => setUser(null));
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      {cartOpen && <CartModal open={cartOpen} onClose={() => setCartOpen(false)} />}
      <div className="container flex h-20 items-center justify-between px-8">
        <div className="flex items-center gap-6">
          {/* Cart Icon */}
          <button
            className="relative mr-3 hidden md:inline-block"
            aria-label="View cart"
            onClick={() => setCartOpen(true)}
          >
            <ShoppingCart className="w-7 h-7 text-blue-800" />
            {items.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full px-2 py-0.5 text-xs font-bold">
                {items.reduce((sum, i) => sum + i.quantity, 0)}
              </span>
            )}
          </button>
          <Link href="/" className="flex items-center gap-2">
            <div className="relative h-12 w-12">
              <Image
                src="/logo.svg"
                alt=" Logo"
                width={48}
                height={48}
                priority
              />
            </div>
            <span className="text-xl font-semibold">mv</span>
          </Link>
          {/* Search Bar */}
          <form onSubmit={handleSearch} className="relative hidden md:block">
            <input
              ref={inputRef}
              type="text"
              className="px-4 py-2 rounded-full border border-blue-300 w-80 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white shadow"
              placeholder="Search for products..."
              value={search}
              onChange={e => { setSearch(e.target.value); setShowSuggestions(true); }}
              onFocus={() => setShowSuggestions(true)}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
              autoComplete="off"
            />
            <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 px-3 py-1 bg-blue-600 text-white rounded-full hover:bg-blue-700">Search</button>
            {showSuggestions && suggestions.length > 0 && (
              <div className="absolute left-0 mt-2 w-full bg-white border rounded shadow-lg z-50 max-h-60 overflow-y-auto">
                <ul>
                  {suggestions.map((s, i) => (
                    <li
                      key={s.suggestion + s.type + i}
                      className="px-4 py-2 cursor-pointer hover:bg-blue-100 text-gray-800"
                      onMouseDown={() => { setSearch(s.suggestion); setShowSuggestions(false); handleSearch(undefined, s.suggestion); }}
                    >
                      {s.suggestion} <span className="text-xs text-gray-500">({capitalize(s.type)})</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </form>
          <nav className="hidden md:flex items-center gap-6">
            <Link 
              href="/" 
              className="text-sm font-medium transition-colors hover:text-primary"
            >
              Home
            </Link>
            <Link 
              href="/signup" 
              className="text-sm font-medium transition-colors hover:text-primary"
            >
              About
            </Link>
            <Link 
              href="/signup" 
              className="text-sm font-medium transition-colors hover:text-primary"
            >
              Services
            </Link>
            <Link 
              href="/signup" 
              className="text-sm font-medium transition-colors hover:text-primary"
            >
              Contact us
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-4">
          
          <Button asChild>
            <Link href="/signup">
              Get started
            </Link>
          </Button>
        </div>
        {/* User Info */}
        <div className="flex items-center gap-4">
          {user ? (
            <div className="flex items-center gap-2 bg-blue-50 px-3 py-1 rounded-full shadow-sm">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 text-white flex items-center justify-center font-bold text-lg">
                {user.name ? user.name[0].toUpperCase() : user.email[0].toUpperCase()}
              </div>
              <span className="font-medium text-blue-900 text-sm truncate max-w-[120px]">{user.name || user.email}</span>
            </div>
          ) : (
            <div className="w-8 h-8 rounded-full bg-gray-200 animate-pulse" />
          )}
        </div>
      </div>
    </header>
  );
}