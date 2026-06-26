'use client';

import Link from 'next/link';
import { useState } from 'react';
import { ThemeToggle } from './ThemeToggle';
import { SocialIcons } from './SocialIcons';
import { SITE_NAME } from '@/lib/constants';
import { Menu, X } from 'lucide-react';

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="border-b border-border">
      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="text-lg font-bold tracking-tight hover:text-accent transition-colors">
            {SITE_NAME}
          </Link>
          <nav className="hidden sm:flex items-center gap-6 text-sm font-medium">
            <Link href="/" className="hover:text-accent transition-colors">Home</Link>
            <Link href="/categories" className="hover:text-accent transition-colors">Categories</Link>
            <Link href="/about" className="hover:text-accent transition-colors">About</Link>
          </nav>
          <div className="flex items-center gap-1">
            <SocialIcons />
            <ThemeToggle />
            <button
              className="sm:hidden p-2 rounded-lg hover:bg-stone-200 dark:hover:bg-stone-800 transition-colors"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle menu"
            >
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>
      {menuOpen && (
        <div className="sm:hidden border-t border-border">
          <nav className="flex flex-col px-4 py-3 gap-2 text-sm font-medium">
            <Link
              href="/"
              className="px-3 py-2 rounded-lg hover:bg-stone-200 dark:hover:bg-stone-800 transition-colors"
              onClick={() => setMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              href="/categories"
              className="px-3 py-2 rounded-lg hover:bg-stone-200 dark:hover:bg-stone-800 transition-colors"
              onClick={() => setMenuOpen(false)}
            >
              Categories
            </Link>
            <Link
              href="/about"
              className="px-3 py-2 rounded-lg hover:bg-stone-200 dark:hover:bg-stone-800 transition-colors"
              onClick={() => setMenuOpen(false)}
            >
              About
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
