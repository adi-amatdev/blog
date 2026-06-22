import Link from 'next/link';
import { ThemeToggle } from './ThemeToggle';
import { SocialIcons } from './SocialIcons';
import { SITE_NAME } from '@/lib/constants';

export function Header() {
  return (
    <header className="border-b border-border">
      <div className="mx-auto max-w-4xl px-6">
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
          </div>
        </div>
      </div>
    </header>
  );
}
